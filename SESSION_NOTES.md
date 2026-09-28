# WASTEtoWONDER — Session Reference Notes

> Full record of all bugs found, fixes applied, and current architecture decisions made during this development session.

---

## Project Overview

**WASTEtoWONDER** is a React + Vite + TypeScript upcycling community app.

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| Backend / DB | Supabase (Postgres, Auth, Storage, Edge Functions) |
| AI | Google Gemini API (via Supabase Edge Function) |
| YouTube search | YouTube Data API v3 |
| Deployment | Vercel (frontend) + Supabase (backend) |

---

## Environment Setup

### `.env.local` (project root — never committed)
```
VITE_SUPABASE_URL=https://wxulpfzbdibuwqugpyij.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
VITE_YOUTUBE_API_KEY=<youtube key>
```

### Supabase secrets (server-side only)
```bash
supabase secrets set GEMINI_API_KEY=AIza...
```

### Edge Function deployment
```bash
supabase functions deploy analyze-waste --no-verify-jwt
```
> `--no-verify-jwt` is required — the function is public (no user auth needed to call it). The Gemini API key is the only secret protecting it.

---

## Supabase Project

- **Project ID:** `wxulpfzbdibuwqugpyij`
- **URL:** `https://wxulpfzbdibuwqugpyij.supabase.co`
- **Storage bucket:** `uploads` (public) — stores before/after images and process photos

### Storage RLS policy on `uploads` bucket
```sql
bucket_id = 'uploads'
```
Operation: `INSERT`, Role: `authenticated`

---

## Edge Function: `analyze-waste`

**File:** [`supabase/functions/analyze-waste/index.ts`](supabase/functions/analyze-waste/index.ts)

### Tasks supported

| Task | Model | Input | Output |
|---|---|---|---|
| `identify` | `gemini-3.8-flash` (vision) | `imageBase64` + `mimeType` | `{ label, materialCategory, confidence, condition, suggestedTags }` |
| `generateSteps` (URL array) | `gemini-3.8-flash` (vision) | `imageUrlArray` + `material` | `{ difficulty, precautions, steps[] }` |
| `generateSteps` (base64, legacy) | `gemini-3.8-flash` (vision) | `imageBase64Array` | `{ difficulty, precautions, steps[] }` |
| `generateSteps` (YouTube) | `gemini-2.0-flash-lite` (text) | `youtubeUrl` | `{ title, description, difficulty, steps[], … }` |
| `generateCraft` | `gemini-2.0-flash-lite` (text) | `material` | `{ title, description, difficulty, steps[], tags, wasteSaved, … }` |

> **Note:** `generateImages` was removed to save Gemini quota (was 3 calls per trigger).

### Key helpers in the edge function

- **`extractJson(text)`** — strips markdown fences, finds first `{` to last `}`, parses JSON. Handles Gemini's tendency to wrap output in prose or markdown.
- **`geminiPost(url, body)`** — wraps `fetch` with 3-retry exponential backoff (1s → 2s → 4s) on 503 / "high demand" / "overloaded" errors.

---

## Model Strategy

| Use case | Model | Reason |
|---|---|---|
| Image identification | `gemini-3.8-flash` | Needs multimodal vision |
| Process image analysis | `gemini-3.8-flash` | Needs multimodal vision |
| YouTube steps / craft gen | `gemini-2.0-flash-lite` | Text only — 2× quota (30 req/min vs 15) |

---

## Database Schema Summary

**Migration file:** [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql)

| Table | Key columns | Notes |
|---|---|---|
| `public.users` | `id` (FK → `auth.users`), `name`, `username`, `avatar_url`, env stats | Auto-created on signup via `handle_new_user` trigger |
| `public.posts` | `author_id`, `title`, `before_image`, `after_image`, `process_images`, `steps` (jsonb), `fts` (tsvector) | `fts` maintained by `posts_fts_trigger` (NOT generated column — `array_to_string` is volatile) |
| `public.comments` | `post_id`, `author_id`, `text` | |
| `public.likes` | `(user_id, post_id)` PK | Trigger keeps `posts.likes_count` in sync |
| `public.user_implementations` | `user_id`, `original_post_id`, `craft_title`, `result_photo_url` | Trigger increments env impact stats |
| `public.achievements` | `user_id`, `title`, `icon` | |
| `public.follows` | `(follower_id, following_id)` PK | Trigger keeps follower/following counts in sync |
| `public.contest_entries` | `post_id`, `week_number`, `display_order` | Max 100/week enforced by trigger (not CHECK — subqueries not allowed in CHECK) |

### Key SQL fixes applied during session
1. `fts` column changed from `GENERATED ALWAYS AS` to plain `tsvector` + `BEFORE INSERT OR UPDATE` trigger — `array_to_string()` is volatile, can't be used in generated columns.
2. `contest_entries` max-100-per-week `CHECK` constraint removed and replaced with a `BEFORE INSERT` trigger — subqueries not allowed in CHECK constraints.

---

## Known Supabase Query Patterns

### Ambiguous relationship fix
All `posts ↔ users` joins must use explicit FK hints:
```ts
.select('*, users!posts_author_id_fkey(id, name, username, avatar_url)')
```
```ts
.select('*, posts!contest_entries_post_id_fkey(..., users!posts_author_id_fkey(...))')
```
Without this: **"could not embed because more than one relationship was found"** error.

---

## Frontend Architecture

### Key services
| File | Responsibility |
|---|---|
| [`src/services/aiService.ts`](src/services/aiService.ts) | Calls edge function, YouTube API, post search |
| [`src/services/postService.ts`](src/services/postService.ts) | CRUD for posts, likes, comments |
| [`src/services/contestService.ts`](src/services/contestService.ts) | Contest entries, voting |
| [`src/services/profileService.ts`](src/services/profileService.ts) | User profile, implementations, achievements |

### Key contexts
| File | Responsibility |
|---|---|
| [`src/context/AuthContext.tsx`](src/context/AuthContext.tsx) | Supabase auth session, login/signup/logout |
| [`src/context/UserContext.tsx`](src/context/UserContext.tsx) | Current user profile, implementations |

### Auth notes
- Sessions are persisted in `localStorage` automatically by Supabase JS client
- `onAuthStateChange` listener keeps app in sync with login/logout/token refresh
- `getSession()` on mount restores existing session

---

## Bugs Fixed During Session

### Edge Function / AI

| Bug | Fix |
|---|---|
| TS2307: cannot find module `deno.land/std` | Added `deno.json` in function folder + `.vscode/settings.json` with `deno.enablePaths` |
| `upstream connect error` / timeout | Parallelised `generateImages` calls with `Promise.all`; removed `generateImages` entirely later |
| `gemini-1.5-flash not found for v1beta` | Changed API base URL to `v1` |
| `gemini-2.0-flash no longer available` | Upgraded to `gemini-3.8-flash` |
| `gemini-3.8-flash high demand` | Added `geminiPost()` with 3-retry exponential backoff |
| JSON parse error from Gemini response | Added `extractJson()` helper — finds first `{`…last `}` |
| Response truncated (NaN%, empty fields) | Bumped `maxOutputTokens` from 512 → 1024 for identify task |
| Function not logging (silent 401) | Added `--no-verify-jwt` to deploy command + `supabase/config.toml` |
| Empty result with no error shown | Added `callEdgeFunction` null-check; added `analysisError` state in `UploadScan` |

### Frontend / UI

| Bug | Fix |
|---|---|
| Black screen crash on analyze | Guarded `suggestedTags`, `matchedProjects`, `youtubeResults` array fields with `Array.isArray()` fallback |
| Login with wrong credentials silently succeeds | `handleSubmit` now checks `login()` return value; shows error banner |
| Pre-filled demo data on login/signup/create-post forms | Cleared all hardcoded placeholder values |
| `could not embed` on all queries | Added explicit FK hints to all Supabase joins |
| Post images not showing (empty `src`) | Guarded all `<img>` with conditional rendering, emoji placeholder fallback |
| Likes count inconsistent across users | `PostCard` now does optimistic update then syncs authoritative count from DB |
| Comments not visible when switching users | Comments modal now re-fetches post fresh from DB via `getPostById` |
| Auto-generate tutorial crashes app | Wrapped in try/catch; shows error banner instead of crashing |
| Process images uploader no real upload | Replaced sample-only buttons with real `<input type="file">` → Supabase Storage |
| "Bucket not found" on upload | Added `createBucket('uploads')` call with `.catch()` guard |
| YouTube results unrelated to upcycling | Changed query to use `materialCategory` + `videoCategoryId=26` (Howto & Style) |
| YouTube steps dropdown hangs forever | Added 20s client timeout + `geminiPost` retry |

---

## Deployment Checklist

- [ ] `VITE_SUPABASE_URL` set in `.env.local` and Vercel
- [ ] `VITE_SUPABASE_ANON_KEY` set in `.env.local` and Vercel
- [ ] `VITE_YOUTUBE_API_KEY` set in `.env.local` and Vercel
- [ ] `GEMINI_API_KEY` set as Supabase secret (`supabase secrets set ...`)
- [ ] SQL migration run in Supabase SQL Editor
- [ ] `uploads` storage bucket created (public)
- [ ] Storage INSERT policy set (`bucket_id = 'uploads'`, role: authenticated)
- [ ] Edge function deployed (`supabase functions deploy analyze-waste --no-verify-jwt`)
- [ ] `pg_cron` extension enabled (for nightly contest shuffle — optional)

---

## File Reference

```
WASTEtoWONDER/
├── .env.local                          # Local env vars (gitignored)
├── .env.example                        # Placeholder template (committed)
├── .vscode/settings.json               # deno.enablePaths for Edge Function TS
├── supabase/
│   ├── config.toml                     # verify_jwt = false for analyze-waste
│   ├── functions/analyze-waste/
│   │   ├── index.ts                    # Edge function (Gemini AI tasks)
│   │   └── deno.json                   # Deno project config
│   └── migrations/001_initial_schema.sql
├── src/
│   ├── context/
│   │   ├── AuthContext.tsx             # Supabase auth session
│   │   └── UserContext.tsx             # User profile state
│   ├── services/
│   │   ├── aiService.ts                # Edge function + YouTube calls
│   │   ├── postService.ts              # Posts CRUD
│   │   ├── contestService.ts           # Contest entries
│   │   └── profileService.ts           # User profile
│   ├── pages/
│   │   ├── UploadScan.tsx              # AI waste scanner
│   │   ├── Community.tsx               # Post feed + comments
│   │   ├── CreatePost.tsx              # Post creation wizard
│   │   ├── WeeklyContest.tsx           # Contest page
│   │   └── Profile.tsx                 # User profile
│   └── components/
│       ├── community/PostCard.tsx      # Post card with likes/comments
│       ├── community/CommentSection.tsx
│       ├── create-post/ProcessImagesUploader.tsx  # File upload + AI steps
│       └── common/Navbar.tsx           # Nav with logout button
```
