import { Post, Comment } from '../types/post';
import mockPostsData from '../data/mockPosts.json';

// In-memory state for session mutations so changes reflect immediately
let postsState: Post[] = [...(mockPostsData as unknown as Post[])];

export const postService = {
  getPosts: async (): Promise<Post[]> => {
    await new Promise((res) => setTimeout(res, 200));
    return [...postsState];
  },

  getPostById: async (id: string): Promise<Post | undefined> => {
    await new Promise((res) => setTimeout(res, 150));
    return postsState.find((p) => p.id === id);
  },

  createPost: async (
    newPost: Omit<Post, 'id' | 'createdAt' | 'likes' | 'views' | 'implementationsCount' | 'comments'>
  ): Promise<Post> => {
    await new Promise((res) => setTimeout(res, 400));
    const created: Post = {
      ...newPost,
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: 0,
      views: 1,
      implementationsCount: 0,
      comments: [],
    };
    postsState = [created, ...postsState];
    return created;
  },

  likePost: async (id: string): Promise<{ likes: number }> => {
    const post = postsState.find((p) => p.id === id);
    if (post) {
      post.likes += 1;
      return { likes: post.likes };
    }
    return { likes: 0 };
  },

  addComment: async (
    postId: string,
    text: string,
    author: { name: string; username: string; avatar: string }
  ): Promise<Comment> => {
    await new Promise((res) => setTimeout(res, 200));
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: author.name,
      username: author.username,
      avatar: author.avatar,
      text,
      date: 'Just now',
    };
    const post = postsState.find((p) => p.id === postId);
    if (post) {
      post.comments = [newComment, ...post.comments];
    }
    return newComment;
  },

  incrementImplementationCount: async (postId: string): Promise<number> => {
    const post = postsState.find((p) => p.id === postId);
    if (post) {
      post.implementationsCount += 1;
      return post.implementationsCount;
    }
    return 1;
  },
};
