import { supabase } from '../lib/supabase';
import { User, ImplementedWorkItem } from '../types/user';

// ── Shape helper ──────────────────────────────────────────────
function rowToUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    name: (row.name as string) || '',
    username: (row.username as string) || '',
    email: '',  // not stored in public.users for privacy
    avatar: (row.avatar_url as string) || '',
    bio: (row.bio as string) || '',
    city: (row.city as string) || '',
    wasteTypes: (row.waste_types as string[]) || [],
    mainGoal: (row.main_goal as string) || '',
    followersCount: (row.followers_count as number) || 0,
    followingCount: (row.following_count as number) || 0,
    isFollowing: (row.is_following as boolean) || false,
    stats: {
      totalLikes: (row.total_likes as number) || 0,
      totalImplementations: (row.total_implementations as number) || 0,
      totalViews: (row.total_views as number) || 0,
      totalPosts: (row.total_posts as number) || 0,
    },
    environmentalImpact: {
      materialsReusedKg: (row.env_materials_reused_kg as number) || 0,
      wastePreventedItems: (row.env_waste_prevented_items as number) || 0,
      carbonSavedKg: (row.env_carbon_saved_kg as number) || 0,
      treesEquivalent: (row.env_trees_equivalent as number) || 0,
    },
    implementedWork: [],   // loaded separately
    achievements: [],      // loaded separately
    weeklyContestMilestones: [],
    materialsIHave: (row.materials_i_have as string[]) || [],
  };
}

function rowToImplementation(row: Record<string, unknown>): ImplementedWorkItem {
  return {
    id: row.id as string,
    originalReferenceTitle: row.original_title as string,
    originalReferenceSource: row.original_source as ImplementedWorkItem['originalReferenceSource'],
    originalReferenceId: (row.original_post_id as string) || '',
    implementedCraftTitle: row.craft_title as string,
    uploadedResultPhoto: row.result_photo_url as string,
    date: (row.created_at as string).split('T')[0],
    feedbackNote: (row.feedback_note as string) || '',
    creatorName: (row.creator_name as string) || '',
  };
}

export const profileService = {
  getCurrentUser: async (): Promise<User> => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) throw new Error('Not authenticated');
    return profileService.getUserById(authUser.id);
  },

  getUserById: async (id: string): Promise<User> => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const currentUserId = authUser?.id;

    const { data: row, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !row) throw new Error(error?.message ?? 'User not found');

    const user = rowToUser(row as Record<string, unknown>);

    // Check if the current user follows this user
    if (currentUserId && currentUserId !== id) {
      const { data: followRow } = await supabase
        .from('follows')
        .select('follower_id')
        .eq('follower_id', currentUserId)
        .eq('following_id', id)
        .maybeSingle();
      user.isFollowing = !!followRow;
    }

    // Load implementations
    const { data: implRows } = await supabase
      .from('user_implementations')
      .select('*')
      .eq('user_id', id)
      .order('created_at', { ascending: false });
    user.implementedWork = (implRows ?? []).map((r) => rowToImplementation(r as Record<string, unknown>));

    // Load achievements
    const { data: achRows } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', id)
      .order('unlocked_at', { ascending: false });
    user.achievements = (achRows ?? []).map((r) => ({
      id: r.id as string,
      title: r.title as string,
      icon: r.icon as string,
      description: r.description as string,
      unlockedAt: r.unlocked_at as string,
    }));

    return user;
  },

  updateUserProfile: async (data: Partial<User>): Promise<User> => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) throw new Error('Not authenticated');

    const updates: Record<string, unknown> = {};
    if (data.name !== undefined)         updates.name = data.name;
    if (data.bio !== undefined)          updates.bio = data.bio;
    if (data.city !== undefined)         updates.city = data.city;
    if (data.wasteTypes !== undefined)   updates.waste_types = data.wasteTypes;
    if (data.mainGoal !== undefined)     updates.main_goal = data.mainGoal;
    if (data.avatar !== undefined)       updates.avatar_url = data.avatar;

    await supabase.from('users').update(updates).eq('id', authUser.id);
    return profileService.getUserById(authUser.id);
  },

  addImplementedCraft: async (
    item: Omit<ImplementedWorkItem, 'id' | 'date'>
  ): Promise<ImplementedWorkItem> => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('user_implementations')
      .insert({
        user_id: authUser.id,
        original_post_id: item.originalReferenceId || null,
        original_source: item.originalReferenceSource,
        original_title: item.originalReferenceTitle,
        craft_title: item.implementedCraftTitle,
        result_photo_url: item.uploadedResultPhoto,
        feedback_note: item.feedbackNote ?? '',
        creator_name: item.creatorName ?? '',
      })
      .select('*')
      .single();

    if (error || !data) throw new Error(error?.message ?? 'Failed to save implementation');

    // Check and award achievements based on new total
    await profileService._checkAndAwardAchievements(authUser.id);

    return rowToImplementation(data as Record<string, unknown>);
  },

  toggleFollowUser: async (
    userId: string
  ): Promise<{ isFollowing: boolean; followersCount: number }> => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) throw new Error('Not authenticated');

    const { data: existingFollow } = await supabase
      .from('follows')
      .select('follower_id')
      .eq('follower_id', authUser.id)
      .eq('following_id', userId)
      .maybeSingle();

    if (existingFollow) {
      await supabase.from('follows').delete()
        .eq('follower_id', authUser.id)
        .eq('following_id', userId);
    } else {
      await supabase.from('follows').insert({
        follower_id: authUser.id,
        following_id: userId,
      });
    }

    const { data: targetUser } = await supabase
      .from('users')
      .select('followers_count')
      .eq('id', userId)
      .single();

    return {
      isFollowing: !existingFollow,
      followersCount: (targetUser?.followers_count as number) ?? 0,
    };
  },

  updateMaterialsIHave: async (materials: string[]): Promise<string[]> => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) throw new Error('Not authenticated');

    await supabase.from('users').update({ materials_i_have: materials }).eq('id', authUser.id);
    return materials;
  },

  // ── Internal: award achievements based on milestones ──────
  _checkAndAwardAchievements: async (userId: string): Promise<void> => {
    const { data: userRow } = await supabase
      .from('users')
      .select('total_implementations, env_materials_reused_kg, total_posts')
      .eq('id', userId)
      .single();

    if (!userRow) return;

    const impls = (userRow.total_implementations as number) || 0;
    const kg    = (userRow.env_materials_reused_kg as number) || 0;

    const milestones = [
      { condition: impls >= 5,   id: 'ach-pioneer',    title: 'Zero Waste Pioneer',   icon: '🌱', description: 'Completed first 5 verified upcycling builds' },
      { condition: impls >= 50,  id: 'ach-master',     title: 'Master Re-purposer',   icon: '⚡', description: 'Inspired 50+ community implementations' },
      { condition: kg >= 35,     id: 'ach-eco-hero',   title: 'Eco Impact Hero',       icon: '🌍', description: 'Diverted over 35kg of solid landfill waste' },
    ];

    for (const m of milestones) {
      if (!m.condition) continue;
      // Only insert if not already awarded
      await supabase.from('achievements').upsert(
        { id: `${m.id}-${userId}`, user_id: userId, title: m.title, icon: m.icon, description: m.description },
        { onConflict: 'id', ignoreDuplicates: true }
      );
    }
  },
};
