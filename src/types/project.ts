export type ProjectSource = 'in_app' | 'youtube' | 'ai_generated';

export interface CraftStep {
  stepNumber: number;
  title: string;
  instructions: string;
  image?: string;
  tip?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  source: ProjectSource;
  material: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeRequired: string;
  estimatedCost: string;
  wasteSaved?: string;
  cardBgColor?: string;
  materialsNeeded: string[];
  precautions: string[];
  steps: CraftStep[];
  coverImage: string;
  youtubeUrl?: string;
  youtubeVideoId?: string;
  author?: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  likes: number;
  commentsCount: number;
  views: number;
  implementationsCount: number;
  createdAt: string;
  inProgressImages?: string[];
  finalOutputImage?: string;
  tags: string[];
}
