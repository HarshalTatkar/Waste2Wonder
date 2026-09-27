export interface Comment {
  id: string;
  author: string;
  username?: string;
  avatar: string;
  text: string;
  date: string;
  likes?: number;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  processImages: string[];
  materials: string[];
  cost: string;
  timeTaken: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  precautions: string[];
  steps: {
    stepNumber: number;
    title: string;
    instructions: string;
  }[];
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    role?: string;
  };
  likes: number;
  comments: Comment[];
  views: number;
  implementationsCount: number;
  createdAt: string;
  isContestEntry?: boolean;
}
