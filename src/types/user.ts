import { ProjectSource } from './project';

export interface ImplementedWorkItem {
  id: string;
  originalReferenceTitle: string;
  originalReferenceSource: ProjectSource;
  originalReferenceId: string;
  implementedCraftTitle: string;
  uploadedResultPhoto: string;
  date: string;
  feedbackNote?: string;
  creatorName?: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  icon: string;
  description: string;
  unlockedAt: string;
}

export interface ContestMilestone {
  week: number;
  achievement: string;
  badge: string;
}

export interface EnvironmentalImpact {
  materialsReusedKg: number;
  wastePreventedItems: number;
  carbonSavedKg: number;
  treesEquivalent: number;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  city?: string;
  wasteTypes: string[];
  mainGoal: string;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
  stats: {
    totalLikes: number;
    totalImplementations: number;
    totalViews: number;
    totalPosts: number;
  };
  environmentalImpact: EnvironmentalImpact;
  implementedWork: ImplementedWorkItem[];
  achievements: AchievementBadge[];
  weeklyContestMilestones: ContestMilestone[];
  materialsIHave: string[];
}
