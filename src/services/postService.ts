import { supabase } from '../lib/supabase';
import { Post, Comment } from '../types/post';

// ── Shape helpers ─────────────────────────────────────────────
// Supabase returns snake_case; our types use camelCase.
function rowToPost(row: Record<string, unknown>): Post {
  const author = row.users as Record<string, unknown> | null;
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    beforeImage: row.before_image as string,
    afterImage: row.after_image as string,
    processImages: (row.process_images as string[]) ?? [],
    materials: (row.materials as string[]) ?? [],
    cost: row.cost as string,
    timeTaken: row.time_taken as string,
    difficulty: row.difficulty as Post['difficulty'],
    precautions: (row.precautions as string[]) ?? [],
    steps: (row.steps as Post['steps']) ?? [],
    author: {
      id: (author?.id as string) ?? '',
      name: (author?.name as string) ?? 'Unknown',
      username: (author?.username as string) ?? '',
      avatar: (author?.avatar_url as string) ?? '',
      role: undefined,
    },
    likes: (row.likes_count as number) ?? 0,
    views: (row.views_count as number) ?? 0,
    implementationsCount: (row.implementations_count as number) ?? 0,
    comments: [],
    isContestEntry: (row.is_contest_entry as boolean) ?? false,
    createdAt: row.created_at as string,
  };
}

function rowToComment(row: Record<string, unknown>): Comment {
  const author = row.users as Record<string, unknown> | null;
  return {
    id: row.id as string,
    author: (author?.name as string) ?? 'Unknown',
    username: (author?.username as string) ?? '',
    avatar: (author?.avatar_url as string) ?? '',
    text: row.text as string,
    date: row.created_at as string,
    likes: (row.likes_count as number) ?? 0,
  };
}

export const postService = {
  getPosts: async (): Promise<Post[]> => {
    const { data, error } = await supabase
      .from('posts')
      .select('*, users(id, name, username, avatar_url)')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map(rowToPost);
  },

  getPostById: async (id: string): Promise<Post | undefined> => {
    const { data, error } = await supabase
      .from('posts')
      .select('*, users(id, name, username, avatar_url)')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;

    const post = rowToPost(data as Record<string, unknown>);

    // Fetch comments separately
    const { data: commentRows } = await supabase
      .from('comments')
      .select('*, users(id, name, username, avatar_url)')
      .eq('post_id', id)
      .order('created_at', { ascending: false });

    post.comments = (commentRows ?? []).map((c) => rowToComment(c as Record<string, unknown>));
    return post;
  },

  createPost: async (
    newPost: Omit<Post, 'id' | 'createdAt' | 'likes' | 'views' | 'implementationsCount' | 'comments'> & { authorId: string }
  ): Promise<Post> => {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        author_id: newPost.authorId,
        title: newPost.title,
        description: newPost.description,
        before_image: newPost.beforeImage,
        after_image: newPost.afterImage,
        process_images: newPost.processImages,
        materials: newPost.materials,
        steps: newPost.steps,
        difficulty: newPost.difficulty,
        cost: newPost.cost,
        time_taken: newPost.timeTaken,
        precautions: newPost.precautions,
        is_contest_entry: newPost.isContestEntry ?? false,
        source: 'in_app',
      })
      .select('*, users(id, name, username, avatar_url)')
      .single();

    if (error || !data) throw new Error(error?.message ?? 'Failed to create post');

    // Increment user's total_posts counter
    await supabase.rpc('increment_user_stat', { uid: newPost.authorId, stat_col: 'total_posts' });

    return rowToPost(data as Record<string, unknown>);
  },

  likePost: async (postId: string, userId: string): Promise<{ likes: number; liked: boolean }> => {
    // Check if already liked
    const { data: existing } = await supabase
      .from('likes')
      .select('user_id')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .maybeSingle();

    if (existing) {
      // Unlike
      await supabase.from('likes').delete().eq('user_id', userId).eq('post_id', postId);
      const { data: post } = await supabase.from('posts').select('likes_count').eq('id', postId).single();
      return { likes: (post?.likes_count as number) ?? 0, liked: false };
    } else {
      // Like
      await supabase.from('likes').insert({ user_id: userId, post_id: postId });
      const { data: post } = await supabase.from('posts').select('likes_count').eq('id', postId).single();
      return { likes: (post?.likes_count as number) ?? 0, liked: true };
    }
  },

  checkIfLiked: async (postId: string, userId: string): Promise<boolean> => {
    const { data } = await supabase
      .from('likes')
      .select('user_id')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .maybeSingle();
    return !!data;
  },

  addComment: async (
    postId: string,
    text: string,
    authorId: string
  ): Promise<Comment> => {
    const { data, error } = await supabase
      .from('comments')
      .insert({ post_id: postId, author_id: authorId, text })
      .select('*, users(id, name, username, avatar_url)')
      .single();

    if (error || !data) throw new Error(error?.message ?? 'Failed to add comment');
    return rowToComment(data as Record<string, unknown>);
  },

  incrementImplementationCount: async (postId: string): Promise<number> => {
    // This is also handled by the DB trigger in handle_new_implementation()
    // but we expose it for direct calls from UserContext
    const { data } = await supabase
      .from('posts')
      .select('implementations_count')
      .eq('id', postId)
      .single();
    return (data?.implementations_count as number) ?? 0;
  },

  incrementViewCount: async (postId: string): Promise<void> => {
    await supabase.rpc('increment_post_views', { post_id: postId });
  },

  /** Full-text + tag search for reference matching (Requirement 1B) */
  searchPosts: async (query: string): Promise<Post[]> => {
    const { data, error } = await supabase
      .from('posts')
      .select('*, users(id, name, username, avatar_url)')
      .textSearch('fts', query, { type: 'websearch' })
      .limit(6);

    if (error) return [];
    return (data ?? []).map(rowToPost);
  },

  subscribeToPostLikes: (
    postId: string,
    callback: (likes: number) => void
  ) => {
    return supabase
      .channel(`post-likes-${postId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'likes',
        filter: `post_id=eq.${postId}`,
      }, async () => {
        const { data } = await supabase.from('posts').select('likes_count').eq('id', postId).single();
        if (data) callback(data.likes_count as number);
      })
      .subscribe();
  },
};
