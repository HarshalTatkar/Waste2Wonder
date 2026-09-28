import { supabase } from '../lib/supabase';
import { Post, Comment } from '../types/post';
import { Project } from '../types/project';

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
      .select('*, users!posts_author_id_fkey(id, name, username, avatar_url)')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map(rowToPost);
  },

  getPostById: async (id: string): Promise<Post | undefined> => {
    const { data, error } = await supabase
      .from('posts')
      .select('*, users!posts_author_id_fkey(id, name, username, avatar_url)')
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
      .select('*, users!posts_author_id_fkey(id, name, username, avatar_url)')
      .single();

    if (error || !data) throw new Error(error?.message ?? 'Failed to create post');

    // Increment user's total_posts counter
    await supabase.rpc('increment_user_stat', { uid: newPost.authorId, stat_col: 'total_posts' });

    return rowToPost(data as Record<string, unknown>);
  },

  deletePost: async (postId: string, authorId: string): Promise<void> => {
    // Delete the post. Cascade deletes (if set in DB) will handle likes/comments/etc.
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
      .eq('author_id', authorId);

    if (error) throw new Error(error.message || 'Failed to delete post');
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
    // The DB trigger handle_new_implementation() is the authoritative source
    // for incrementing this count when a user_implementation row is inserted.
    // This method just returns the current count for UI synchronisation.
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
      .select('*, users!posts_author_id_fkey(id, name, username, avatar_url)')
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

// ── Post → Project shape mapper (shared) ─────────────────────
export function postToProject(post: Post): Project {
  return {
    id: post.id,
    title: post.title,
    description: post.description,
    source: 'in_app',
    material: post.materials[0] || '',
    difficulty: post.difficulty,
    timeRequired: post.timeTaken,
    estimatedCost: post.cost,
    materialsNeeded: post.materials,
    precautions: post.precautions,
    steps: post.steps.map((s) => ({
      stepNumber: s.stepNumber,
      title: s.title,
      instructions: s.instructions,
    })),
    coverImage: post.afterImage,
    likes: post.likes,
    commentsCount: post.comments.length,
    views: post.views,
    implementationsCount: post.implementationsCount,
    createdAt: post.createdAt,
    tags: post.materials,
  };
}

export const storageService = {
  uploadImage: async (urlOrBlob: string, pathPrefix: string): Promise<string> => {
    // If it's already an external URL (e.g. Unsplash sample), just return it
    if (urlOrBlob.startsWith('http') && !urlOrBlob.startsWith('blob:')) {
      return urlOrBlob;
    }

    try {
      const response = await fetch(urlOrBlob);
      const blob = await response.blob();
      const fileExt = blob.type.split('/')[1] || 'jpg';
      const fileName = `${pathPrefix}_${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage.from('post-images').upload(fileName, blob, {
        contentType: blob.type,
      });

      if (error) throw error;

      const { data } = supabase.storage.from('post-images').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (e) {
      console.error('Failed to upload image', e);
      return urlOrBlob; // Fallback to whatever it was
    }
  }
};
