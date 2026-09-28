# WASTEtoWONDER — Setup Guide

Everything you need to do to make the app fully functional.
Total time: ~45 minutes.

---

## Step 1 — Create a Supabase Project (5 min)

1. Go to **https://supabase.com** and sign in (free, no credit card).
2. Click **New Project**.
3. Choose a name (e.g. `wastetowonder`), set a database password, and pick the region closest to you.
4. Wait ~2 minutes for the project to provision.

---

## Step 2 — Run the Database Schema (3 min)

1. In your Supabase project, click **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Open the file `supabase/migrations/001_initial_schema.sql` from this repo.
4. Copy the entire contents and paste into the SQL Editor.
5. Click **Run** (or press `Ctrl+Enter`).

You should see "Success. No rows returned." — all 8 tables, triggers, and RPC functions are now created.

---

## Step 3 — Create Storage Buckets (2 min)

1. In Supabase, click **Storage** in the left sidebar.
2. Click **New bucket** and create a bucket named exactly: `uploads`
3. Set it to **Public** (toggle on).
4. Click **Save**.

> The `uploads` bucket stores all user-uploaded images (before/after, process photos, result photos).

---

## Step 4 — Get Your Supabase Keys (2 min)

1. In Supabase, go to **Project Settings → API**.
2. Copy:
   - **Project URL** (looks like `https://xxxxxxxxxxxx.supabase.co`)
   - **anon / public key** (the long JWT string under "Project API keys")

---

## Step 5 — Get a Gemini API Key (2 min)

1. Go to **https://aistudio.google.com/app/apikey**
2. Click **Create API Key**.
3. Copy the key (starts with `AIza...`).

> The free tier gives you 1,500 requests/day and 15 requests/minute — plenty for development and early users.

---

## Step 6 — Get a YouTube Data API Key (3 min)

1. Go to **https://console.developers.google.com**
2. Create a new project (or use an existing one).
3. Click **Enable APIs and Services** → search for **YouTube Data API v3** → Enable it.
4. Click **Credentials → Create Credentials → API Key**.
5. Copy the key.
6. **Restrict it**: click on the key → Application restrictions → HTTP referrers → add `localhost:5173/*` and your Vercel domain (e.g. `your-app.vercel.app/*`).

> This keeps the key from being abused if someone finds it in the browser's network tab.

---

## Step 7 — Create Your .env.local File (1 min)

In the root of this project, create a file called `.env.local` (it's already in `.gitignore` so it won't be committed):

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
VITE_YOUTUBE_API_KEY=YOUR_YOUTUBE_KEY
```

Replace the values with the keys you copied in Steps 4 and 6.

---

## Step 8 — Deploy the Edge Function (10 min)

The Edge Function runs Gemini AI on the server side so your Gemini API key stays secret.

### Install Supabase CLI

```bash
npm install -g supabase
```

### Log in and link your project

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_ID
```

> Your project ID is the part of your Supabase URL between `https://` and `.supabase.co`.

### Set the Gemini API key as a secret

```bash
supabase secrets set GEMINI_API_KEY=YOUR_GEMINI_KEY
```

### Deploy the function

```bash
supabase functions deploy analyze-waste
```

You should see: `Deployed Edge Function analyze-waste` with a URL like:
`https://YOUR_PROJECT_ID.supabase.co/functions/v1/analyze-waste`

---

## Step 9 — Enable the pg_cron Extension (for Contest Fair-Exposure)

1. In Supabase, go to **Database → Extensions**.
2. Search for `pg_cron` and toggle it **on**.
3. Go back to **SQL Editor** and run:

```sql
select cron.schedule('nightly-contest-shuffle', '0 0 * * *', $$
  update public.contest_entries ce
  set display_order = sub.new_order
  from (
    select id,
           row_number() over (
             partition by week_number
             order by
               case when views_count < avg_views then 0 else 1 end,
               random()
           ) as new_order
    from public.contest_entries, lateral (
      select avg(views_count) as avg_views
      from public.contest_entries ce2
      where ce2.week_number = contest_entries.week_number
    ) avg_sub
    where week_number = (select max(week_number) from public.contest_entries)
  ) sub
  where ce.id = sub.id;
$$);
```

This shuffles contest entries every night at midnight, giving low-view entries priority placement.

---

## Step 10 — Enable Supabase Auth Email Confirmation (optional)

By default, Supabase requires email confirmation on signup. During development you may want to disable this:

1. Go to **Authentication → Providers → Email**.
2. Toggle off **Confirm email**.

Re-enable it before going to production.

---

## Step 11 — Run the App

```bash
npm run dev
```

Open `http://localhost:5173`. You should now have a fully functional app with:
- Real authentication (sign up / log in)
- Posts, likes, and comments saved to Supabase
- AI image identification via Gemini
- YouTube reference search
- Real image uploads to Supabase Storage
- Automatic step generation from process photos

---

## Step 12 — Deploy to Vercel (2 min)

1. Push your code to GitHub.
2. Go to **https://vercel.com** → **New Project** → Import your repo.
3. In the **Environment Variables** section, add the same three variables from your `.env.local`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_YOUTUBE_API_KEY`
4. Click **Deploy**.

---

## Summary of All Keys You Need

| Key | Where to get it | Used for |
|-----|----------------|----------|
| `VITE_SUPABASE_URL` | Supabase → Project Settings → API | Database, Auth, Storage |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Project Settings → API | Database, Auth, Storage |
| `VITE_YOUTUBE_API_KEY` | Google Cloud Console | YouTube reference search |
| `GEMINI_API_KEY` | Google AI Studio | AI image identification (set as Supabase secret, not in .env) |

---

## Troubleshooting

**"Missing Supabase env vars" error on startup**
→ Make sure `.env.local` exists in the project root and contains both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

**Image upload fails with "Bucket not found"**
→ You didn't create the `uploads` bucket in Step 3, or it's not set to Public.

**AI identification returns an error**
→ The Edge Function isn't deployed, or the `GEMINI_API_KEY` secret wasn't set. Re-run Step 8.

**YouTube search returns no results**
→ Either `VITE_YOUTUBE_API_KEY` is missing from `.env.local`, or the key isn't enabled for YouTube Data API v3 in Google Console.

**"User not found" after signup**
→ The `handle_new_user` trigger didn't fire. Re-run the SQL migration from Step 2.

**Contest entries are all showing in submission order**
→ pg_cron hasn't run yet (runs at midnight). To test immediately, manually run the shuffle SQL from Step 9 in the SQL Editor.
