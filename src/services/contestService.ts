import { supabase } from '../lib/supabase';
import { ContestEntry } from '../types/contestEntry';

function rowToEntry(row: Record<string, unknown>): ContestEntry {
  const post = row.posts as Record<string, unknown> | null;
  const creator = post?.users as Record<string, unknown> | null;
  return {
    id: row.id as string,
    postId: row.post_id as string,
    title: (post?.title as string) || '',
    description: (post?.description as string) || '',
    creator: {
      id: (creator?.id as string) || '',
      name: (creator?.name as string) || 'Unknown',
      username: (creator?.username as string) || '',
      avatar: (creator?.avatar_url as string) || '',
    },
    beforeImage: (post?.before_image as string) || '',
    afterImage: (post?.after_image as string) || '',
    materialType: ((post?.materials as string[]) || [''])[0] || '',
    likes: (row.likes_count as number) || 0,
    commentsCount: (row.comments_count as number) || 0,
    views: (row.views_count as number) || 0,
    weekNumber: row.week_number as number,
    submissionDate: row.submitted_at as string,
    rank: (row.rank as number) || undefined,
  };
}

// Returns current ISO week number
function getCurrentWeekNumber(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  return Math.ceil((((now.getTime() - start.getTime()) / 86400000) + start.getDay() + 1) / 7);
}

export const contestService = {
  getContestEntries: async (): Promise<ContestEntry[]> => {
    const week = getCurrentWeekNumber();
    const { data, error } = await supabase
      .from('contest_entries')
      .select('*, posts(id, title, description, before_image, after_image, materials, users(id, name, username, avatar_url))')
      .eq('week_number', week)
      .order('display_order', { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []).map(rowToEntry);
  },

  /** Fair-exposure order — entries with fewer views appear first */
  getShuffledEntries: async (): Promise<ContestEntry[]> => {
    const week = getCurrentWeekNumber();
    const { data, error } = await supabase
      .from('contest_entries')
      .select('*, posts(id, title, description, before_image, after_image, materials, users(id, name, username, avatar_url))')
      .eq('week_number', week)
      .order('display_order', { ascending: true });   // display_order is rotated nightly by pg_cron

    if (error) throw new Error(error.message);
    return (data ?? []).map(rowToEntry);
  },

  submitContestEntry: async (
    postId: string
  ): Promise<ContestEntry> => {
    const week = getCurrentWeekNumber();

    // Enforce 100 entry cap
    const { count } = await supabase
      .from('contest_entries')
      .select('*', { count: 'exact', head: true })
      .eq('week_number', week);

    if ((count ?? 0) >= 100) {
      throw new Error('Weekly contest cap of 100 entries has been reached for this round.');
    }

    // display_order = current count + 1 so new entries go to end (pg_cron shuffles nightly)
    const { data, error } = await supabase
      .from('contest_entries')
      .insert({
        post_id: postId,
        week_number: week,
        display_order: (count ?? 0) + 1,
      })
      .select('*, posts(id, title, description, before_image, after_image, materials, users(id, name, username, avatar_url))')
      .single();

    if (error || !data) throw new Error(error?.message ?? 'Failed to submit contest entry');
    return rowToEntry(data as Record<string, unknown>);
  },

  voteContestEntry: async (
    entryId: string,
    userId: string
  ): Promise<{ likes: number }> => {
    // Reuse post likes — contest entry voting maps to the underlying post
    const { data: entry } = await supabase
      .from('contest_entries')
      .select('post_id, likes_count')
      .eq('id', entryId)
      .single();

    if (!entry) return { likes: 0 };

    // Toggle like on the post
    const { data: existingLike } = await supabase
      .from('likes')
      .select('user_id')
      .eq('user_id', userId)
      .eq('post_id', entry.post_id as string)
      .maybeSingle();

    if (existingLike) {
      await supabase.from('likes').delete()
        .eq('user_id', userId)
        .eq('post_id', entry.post_id as string);
    } else {
      await supabase.from('likes').insert({ user_id: userId, post_id: entry.post_id });
    }

    // Sync likes_count on contest_entries from the post
    const { data: post } = await supabase
      .from('posts')
      .select('likes_count')
      .eq('id', entry.post_id as string)
      .single();

    const newLikes = (post?.likes_count as number) ?? 0;
    await supabase.from('contest_entries').update({ likes_count: newLikes }).eq('id', entryId);

    return { likes: newLikes };
  },

  incrementContestViews: async (entryId: string): Promise<void> => {
    await supabase.from('contest_entries')
      .update({ views_count: supabase.rpc('_noop') as unknown as number }) // use raw increment below
      .eq('id', entryId);
    // Use a direct RPC for atomic increment
    await supabase.rpc('increment_contest_views', { entry_id: entryId });
  },
};
