import { User, ImplementedWorkItem } from '../types/user';
import mockUserData from '../data/mockUser.json';

let currentUserState: User = { ...(mockUserData as unknown as User) };

// Other mock users for public viewing
const otherUsersState: Record<string, User> = {
  'user-2': {
    id: 'user-2',
    name: 'Maya Lin',
    username: 'upcycle_maya',
    email: 'maya.lin@craft.dev',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bio: 'Textile artisan giving old denim, discarded canvas, and thrift clothing a second life.',
    city: 'Portland, OR',
    wasteTypes: ['Fabric', 'Leather', 'Canvas'],
    mainGoal: 'Reduce waste',
    followersCount: 890,
    followingCount: 310,
    isFollowing: false,
    stats: {
      totalLikes: 3420,
      totalImplementations: 420,
      totalViews: 18200,
      totalPosts: 14,
    },
    environmentalImpact: {
      materialsReusedKg: 120.4,
      wastePreventedItems: 430,
      carbonSavedKg: 210.8,
      treesEquivalent: 10.5,
    },
    implementedWork: [
      {
        id: 'imp-m1',
        originalReferenceTitle: 'Stained Glass Style Sun-catcher from Waste Plastic Bottles',
        originalReferenceSource: 'in_app',
        originalReferenceId: 'post-2',
        implementedCraftTitle: 'Dual Cascade Prism Pendant',
        uploadedResultPhoto: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
        date: '2026-09-18',
        creatorName: 'Kavita Reddy',
        feedbackNote: 'Loved this technique! Used amber iced tea bottles.',
      },
    ],
    achievements: [
      {
        id: 'ach-m1',
        title: 'Fabric Alchemist',
        icon: '🧵',
        description: 'Repurposed over 50 pairs of worn jeans',
        unlockedAt: 'July 2026',
      },
    ],
    weeklyContestMilestones: [
      {
        week: 36,
        achievement: '1st Place — Denim Reimagined Challenge',
        badge: '🥇 Golden Shears',
      },
    ],
    materialsIHave: ['Fabric', 'Metal'],
  },
};

export const profileService = {
  getCurrentUser: async (): Promise<User> => {
    await new Promise((res) => setTimeout(res, 150));
    return { ...currentUserState };
  },

  getUserById: async (id: string): Promise<User> => {
    await new Promise((res) => setTimeout(res, 150));
    if (id === currentUserState.id || id === 'current-user') {
      return { ...currentUserState };
    }
    const user = otherUsersState[id];
    if (user) {
      return { ...user };
    }
    // Default fallback
    return {
      ...currentUserState,
      id,
      name: 'Community Creator',
      username: 'creator_' + id,
      isFollowing: false,
    };
  },

  updateUserProfile: async (data: Partial<User>): Promise<User> => {
    await new Promise((res) => setTimeout(res, 200));
    currentUserState = { ...currentUserState, ...data };
    return { ...currentUserState };
  },

  addImplementedCraft: async (
    item: Omit<ImplementedWorkItem, 'id' | 'date'>
  ): Promise<ImplementedWorkItem> => {
    await new Promise((res) => setTimeout(res, 300));
    const newItem: ImplementedWorkItem = {
      ...item,
      id: `imp-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };

    // Increment environmental impact
    currentUserState.environmentalImpact.materialsReusedKg += 0.8;
    currentUserState.environmentalImpact.wastePreventedItems += 1;
    currentUserState.environmentalImpact.carbonSavedKg += 1.2;
    currentUserState.environmentalImpact.treesEquivalent = +(
      currentUserState.environmentalImpact.carbonSavedKg / 20
    ).toFixed(1);

    currentUserState.implementedWork = [newItem, ...currentUserState.implementedWork];
    return newItem;
  },

  toggleFollowUser: async (
    userId: string
  ): Promise<{ isFollowing: boolean; followersCount: number }> => {
    const target = otherUsersState[userId];
    if (target) {
      target.isFollowing = !target.isFollowing;
      target.followersCount += target.isFollowing ? 1 : -1;
      return {
        isFollowing: target.isFollowing,
        followersCount: target.followersCount,
      };
    }
    return { isFollowing: true, followersCount: 1 };
  },

  updateMaterialsIHave: async (materials: string[]): Promise<string[]> => {
    currentUserState.materialsIHave = materials;
    return materials;
  },
};
