-- ============================================================
-- WASTEtoWONDER — Initial Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ── 1. USERS (extends auth.users) ───────────────────────────
create table if not exists public.users (
  id            uuid primary key references auth.users(id) on delete cascade,
  name          text not null default '',
  username      text unique not null default '',
  avatar_url    text default '',
  bio           text default '',
  city          text default '',
  waste_types   text[] default '{}',
  main_goal     text default '',
  materials_i_have text[] default '{}',
  followers_count  int not null default 0,
  following_count  int not null default 0,
  total_likes      int not null default 0,
  total_implementations int not null default 0,
  total_views      int not null default 0,
  total_posts      int not null default 0,
  env_materials_reused_kg  numeric(8,2) not null default 0,
  env_waste_prevented_items int not null default 0,
  env_carbon_saved_kg      numeric(8,2) not null default 0,
  env_trees_equivalent     numeric(6,2) not null default 0,
  created_at    timestamptz not null default now()
);

alter table public.users enable row level security;
create policy "Users can read all profiles"  on public.users for select using (true);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.users for insert with check (auth.uid() = id);

-- ── 2. POSTS ─────────────────────────────────────────────────
create table if not exists public.posts (
  id                    text primary key default 'post-' || gen_random_uuid()::text,
  author_id             uuid not null references public.users(id) on delete cascade,
  title                 text not null,
  description           text not null default '',
  before_image          text not null default '',
  after_image           text not null default '',
  process_images        text[] default '{}',
  materials             text[] default '{}',
  steps                 jsonb not null default '[]',
  difficulty            text not null default 'Easy' check (difficulty in ('Easy','Medium','Hard')),
  cost                  text not null default '$0',
  time_taken            text not null default '',
  precautions           text[] default '{}',
  likes_count           int not null default 0,
  views_count           int not null default 0,
  implementations_count int not null default 0,
  is_contest_entry      boolean not null default false,
  tags                  text[] default '{}',
  source                text not null default 'in_app' check (source in ('in_app','youtube','ai_generated')),
  youtube_url           text,
  youtube_video_id      text,
  cover_image           text default '',
  materials_needed      text[] default '{}',
  waste_saved           text default '',
  card_bg_color         text default '',
  in_progress_images    text[] default '{}',
  final_output_image    text default '',
  fts                   tsvector,
  created_at            timestamptz not null default now()
);

alter table public.posts enable row level security;
create policy "Anyone can read posts"        on public.posts for select using (true);
create policy "Authors can insert own posts" on public.posts for insert with check (auth.uid() = author_id);
create policy "Authors can update own posts" on public.posts for update using (auth.uid() = author_id);
create policy "Authors can delete own posts" on public.posts for delete using (auth.uid() = author_id);

create index if not exists posts_fts_idx    on public.posts using gin(fts);
create index if not exists posts_tags_idx   on public.posts using gin(tags);
create index if not exists posts_author_idx on public.posts(author_id);

-- Trigger to keep fts column up to date (generated columns cannot use
-- volatile functions like array_to_string, so we maintain it manually)
create or replace function public.posts_fts_update()
returns trigger language plpgsql as $$
begin
  NEW.fts := to_tsvector('english',
    coalesce(NEW.title, '') || ' ' ||
    coalesce(NEW.description, '') || ' ' ||
    coalesce(array_to_string(NEW.tags, ' '), ''));
  return NEW;
end;
$$;

create trigger posts_fts_trigger
before insert or update of title, description, tags on public.posts
for each row execute function public.posts_fts_update();

-- ── 3. COMMENTS ──────────────────────────────────────────────
create table if not exists public.comments (
  id         text primary key default 'comment-' || gen_random_uuid()::text,
  post_id    text not null references public.posts(id) on delete cascade,
  author_id  uuid not null references public.users(id) on delete cascade,
  text       text not null,
  likes_count int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.comments enable row level security;
create policy "Anyone can read comments"     on public.comments for select using (true);
create policy "Auth users can add comments"  on public.comments for insert with check (auth.uid() = author_id);
create policy "Authors can delete comments"  on public.comments for delete using (auth.uid() = author_id);

create index if not exists comments_post_idx on public.comments(post_id);

-- ── 4. LIKES (dedup via composite PK) ────────────────────────
create table if not exists public.likes (
  user_id uuid not null references public.users(id) on delete cascade,
  post_id text not null references public.posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

alter table public.likes enable row level security;
create policy "Anyone can read likes"        on public.likes for select using (true);
create policy "Auth users can like"          on public.likes for insert with check (auth.uid() = user_id);
create policy "Auth users can unlike"        on public.likes for delete using (auth.uid() = user_id);

-- Trigger to keep likes_count in sync
create or replace function public.update_post_likes_count()
returns trigger language plpgsql security definer as $$
begin
  if (TG_OP = 'INSERT') then
    update public.posts set likes_count = likes_count + 1 where id = NEW.post_id;
  elsif (TG_OP = 'DELETE') then
    update public.posts set likes_count = greatest(0, likes_count - 1) where id = OLD.post_id;
  end if;
  return null;
end;
$$;

create trigger likes_count_trigger
after insert or delete on public.likes
for each row execute function public.update_post_likes_count();

-- ── 5. USER_IMPLEMENTATIONS ──────────────────────────────────
create table if not exists public.user_implementations (
  id                    text primary key default 'imp-' || gen_random_uuid()::text,
  user_id               uuid not null references public.users(id) on delete cascade,
  original_post_id      text references public.posts(id) on delete set null,
  original_source       text not null check (original_source in ('in_app','youtube','ai_generated')),
  original_title        text not null,
  craft_title           text not null,
  result_photo_url      text not null default '',
  feedback_note         text default '',
  creator_name          text default '',
  created_at            timestamptz not null default now()
);

alter table public.user_implementations enable row level security;
create policy "Users can read own implementations" on public.user_implementations for select using (auth.uid() = user_id);
create policy "Users can insert own implementations" on public.user_implementations for insert with check (auth.uid() = user_id);

create index if not exists impls_user_idx on public.user_implementations(user_id);

-- Trigger: on new implementation → increment post's implementations_count + update env impact
create or replace function public.handle_new_implementation()
returns trigger language plpgsql security definer as $$
begin
  -- Increment source post count
  if NEW.original_source = 'in_app' and NEW.original_post_id is not null then
    update public.posts set implementations_count = implementations_count + 1
    where id = NEW.original_post_id;
  end if;
  -- Increment user env impact
  update public.users set
    total_implementations       = total_implementations + 1,
    env_materials_reused_kg     = env_materials_reused_kg + 0.8,
    env_waste_prevented_items   = env_waste_prevented_items + 1,
    env_carbon_saved_kg         = env_carbon_saved_kg + 1.2,
    env_trees_equivalent        = round((env_carbon_saved_kg + 1.2) / 20, 2)
  where id = NEW.user_id;
  return NEW;
end;
$$;

create trigger implementation_trigger
after insert on public.user_implementations
for each row execute function public.handle_new_implementation();

-- ── 6. ACHIEVEMENTS ──────────────────────────────────────────
create table if not exists public.achievements (
  id          text primary key default 'ach-' || gen_random_uuid()::text,
  user_id     uuid not null references public.users(id) on delete cascade,
  title       text not null,
  icon        text not null default '🏆',
  description text not null default '',
  unlocked_at text not null default to_char(now(), 'Mon YYYY')
);

alter table public.achievements enable row level security;
create policy "Anyone can read achievements" on public.achievements for select using (true);
create policy "System can insert achievements" on public.achievements for insert with check (auth.uid() = user_id);

-- ── 7. FOLLOWS ───────────────────────────────────────────────
create table if not exists public.follows (
  follower_id  uuid not null references public.users(id) on delete cascade,
  following_id uuid not null references public.users(id) on delete cascade,
  created_at   timestamptz not null default now(),
  primary key (follower_id, following_id)
);

alter table public.follows enable row level security;
create policy "Anyone can read follows"     on public.follows for select using (true);
create policy "Auth users can follow"       on public.follows for insert with check (auth.uid() = follower_id);
create policy "Auth users can unfollow"     on public.follows for delete using (auth.uid() = follower_id);

-- Trigger: keep followers_count / following_count in sync
create or replace function public.update_follow_counts()
returns trigger language plpgsql security definer as $$
begin
  if (TG_OP = 'INSERT') then
    update public.users set following_count = following_count + 1 where id = NEW.follower_id;
    update public.users set followers_count = followers_count + 1 where id = NEW.following_id;
  elsif (TG_OP = 'DELETE') then
    update public.users set following_count = greatest(0, following_count - 1) where id = OLD.follower_id;
    update public.users set followers_count = greatest(0, followers_count - 1) where id = OLD.following_id;
  end if;
  return null;
end;
$$;

create trigger follows_count_trigger
after insert or delete on public.follows
for each row execute function public.update_follow_counts();

-- ── 8. CONTEST_ENTRIES ───────────────────────────────────────
create table if not exists public.contest_entries (
  id               text primary key default 'contest-' || gen_random_uuid()::text,
  post_id          text not null references public.posts(id) on delete cascade,
  week_number      int not null,
  display_order    int not null default 0,
  likes_count      int not null default 0,
  views_count      int not null default 0,
  comments_count   int not null default 0,
  submitted_at     timestamptz not null default now()
);

alter table public.contest_entries enable row level security;
create policy "Anyone can read contest entries" on public.contest_entries for select using (true);
create policy "Auth users can submit entries"   on public.contest_entries for insert with check (auth.uid() is not null);

create index if not exists contest_week_idx on public.contest_entries(week_number, display_order);

-- Enforce max 100 entries per week via trigger (CHECK constraints cannot use subqueries)
create or replace function public.check_contest_week_limit()
returns trigger language plpgsql as $$
begin
  if (select count(*) from public.contest_entries where week_number = NEW.week_number) >= 100 then
    raise exception 'Contest week % already has 100 entries', NEW.week_number;
  end if;
  return NEW;
end;
$$;

create trigger contest_week_limit_trigger
before insert on public.contest_entries
for each row execute function public.check_contest_week_limit();

-- ── 9. WEEKLY CONTEST FAIR-EXPOSURE SHUFFLE (pg_cron) ────────
-- Enable pg_cron extension first in Supabase Dashboard → Database → Extensions
-- Then uncomment this:
-- select cron.schedule('nightly-contest-shuffle', '0 0 * * *', $$
--   update public.contest_entries ce
--   set display_order = sub.new_order
--   from (
--     select id,
--            row_number() over (
--              partition by week_number
--              order by
--                case when views_count < avg_views then 0 else 1 end,
--                random()
--            ) as new_order
--     from public.contest_entries, lateral (
--       select avg(views_count) as avg_views
--       from public.contest_entries ce2
--       where ce2.week_number = contest_entries.week_number
--     ) avg_sub
--     where week_number = (select max(week_number) from public.contest_entries)
--   ) sub
--   where ce.id = sub.id;
-- $$);

-- ── 10. AUTO-CREATE USER PROFILE ON SIGNUP ───────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, name, username, avatar_url)
  values (
    NEW.id,
    coalesce(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    lower(replace(coalesce(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)), ' ', '_'))
      || '_' || substr(NEW.id::text, 1, 4),
    coalesce(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  on conflict (id) do nothing;
  return NEW;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── 11. HELPER RPCs ───────────────────────────────────────────

-- Atomic post view increment (avoids read-modify-write races)
create or replace function public.increment_post_views(post_id text)
returns void language sql security definer as $$
  update public.posts set views_count = views_count + 1 where id = post_id;
$$;

-- Atomic contest view increment
create or replace function public.increment_contest_views(entry_id text)
returns void language sql security definer as $$
  update public.contest_entries set views_count = views_count + 1 where id = entry_id;
$$;

-- Generic user stat increment (for total_posts, total_likes, etc.)
create or replace function public.increment_user_stat(uid uuid, stat_col text)
returns void language plpgsql security definer as $$
begin
  -- Strict whitelist to prevent SQL injection since %I can still be abused to modify arbitrary columns
  if stat_col not in ('followers_count', 'following_count', 'total_likes', 'total_implementations', 'total_views', 'total_posts') then
    raise exception 'Invalid stat column %', stat_col;
  end if;
  
  execute format('update public.users set %I = %I + 1 where id = $1', stat_col, stat_col) using uid;
end;
$$;
