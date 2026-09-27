export interface ContestEntry {
  id: string;
  postId: string;
  title: string;
  description: string;
  creator: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  beforeImage: string;
  afterImage: string;
  materialType: string;
  likes: number;
  commentsCount: number;
  views: number;
  weekNumber: number;
  submissionDate: string;
  rank?: number;
}
