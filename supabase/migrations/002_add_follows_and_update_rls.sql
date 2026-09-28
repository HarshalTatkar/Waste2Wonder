-- ============================================================
-- WASTEtoWONDER — Migration 002
-- 1) Create follows table for user following
-- 2) Update RLS for user_implementations so they are public
-- ============================================================

-- 1. Create follows table
create table if not exists public.follows (
  follower_id uuid not null references public.users(id) on delete cascade,
  following_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id)
);

alter table public.follows enable row level security;
drop policy if exists "Anyone can read follows" on public.follows;
create policy "Anyone can read follows" on public.follows for select using (true);

drop policy if exists "Auth users can follow" on public.follows;
create policy "Auth users can follow" on public.follows for insert with check (auth.uid() = follower_id);

drop policy if exists "Auth users can unfollow" on public.follows;
create policy "Auth users can unfollow" on public.follows for delete using (auth.uid() = follower_id);

-- Trigger to keep follower/following counts in sync
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

drop trigger if exists follows_count_trigger on public.follows;
create trigger follows_count_trigger
after insert or delete on public.follows
for each row execute function public.update_follow_counts();


-- 2. Update RLS for user_implementations
-- Drop the restrictive policy
drop policy if exists "Users can read own implementations" on public.user_implementations;

-- Create the public policy
create policy "Anyone can read implementations" on public.user_implementations for select using (true);
