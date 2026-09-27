import React, { useState, useEffect } from 'react';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { ImpactPanel } from '../components/profile/ImpactPanel';
import { MyProjectsGrid } from '../components/profile/MyProjectsGrid';
import { AchievementsBadges } from '../components/profile/AchievementsBadges';
import { MaterialsIHaveWidget } from '../components/profile/MaterialsIHaveWidget';
import { AccountSettings } from '../components/profile/AccountSettings';
import { useUser } from '../context/UserContext';
import { profileService } from '../services/profileService';
import { postService } from '../services/postService';
import { User } from '../types/user';
import { Post } from '../types/post';

interface ProfilePageProps {
  onNavigate: (page: string, params?: any) => void;
  userId?: string; // If specified, views another user
}

export const Profile: React.FC<ProfilePageProps> = ({ onNavigate, userId }) => {
  const { user: currentUser, updateProfile, setMaterialsIHave } = useUser();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = !userId || userId === currentUser?.id || userId === 'current-user';

  useEffect(() => {
    loadProfile();
  }, [userId, currentUser]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      if (isOwnProfile && currentUser) {
        setProfileUser(currentUser);
      } else if (userId) {
        const other = await profileService.getUserById(userId);
        setProfileUser(other);
      }

      // Load posts by this user
      const allPosts = await postService.getPosts();
      const currentId = userId || currentUser?.id || 'current-user';
      const mine = allPosts.filter(
        (p) => p.author.id === currentId || p.author.username === profileUser?.username
      );
      setUserPosts(mine.length > 0 ? mine : allPosts.slice(0, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!profileUser) return;
    const res = await profileService.toggleFollowUser(profileUser.id);
    setProfileUser({
      ...profileUser,
      isFollowing: res.isFollowing,
      followersCount: res.followersCount,
    });
  };

  const handleToggleStashMaterial = (mat: string) => {
    if (!currentUser) return;
    const current = currentUser.materialsIHave || [];
    const updated = current.includes(mat)
      ? current.filter((m) => m !== mat)
      : [...current, mat];
    setMaterialsIHave(updated);
  };

  const handleSaveSettings = async (data: {
    email: string;
    city: string;
    notifications: boolean;
  }) => {
    await updateProfile({ email: data.email, city: data.city });
  };

  if (!profileUser) {
    return <div className="p-12 text-center font-bold">Loading maker profile...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      {/* Profile Header (Instagram-like structure, NO chat/messaging) */}
      <ProfileHeader
        user={profileUser}
        isOwnProfile={isOwnProfile}
        onFollowToggle={handleFollowToggle}
        onCreatePostClick={() => onNavigate('create-post')}
      />

      {/* Environmental Impact Panel */}
      <ImpactPanel impact={profileUser.environmentalImpact} />

      {/* Implemented Work & Created Posts Section */}
      <MyProjectsGrid
        implementedWork={profileUser.implementedWork}
        createdPosts={userPosts}
        onSelectOriginalReference={(refId) => onNavigate('craft-detail', { projectId: refId })}
        onSelectPost={(post) => onNavigate('community')}
      />

      {/* Materials I Have Quick-Access Shortcut Widget */}
      {isOwnProfile && (
        <MaterialsIHaveWidget
          materials={currentUser?.materialsIHave || []}
          onToggleMaterial={handleToggleStashMaterial}
          onFindIdeas={() => onNavigate('materials')}
        />
      )}

      {/* Achievements & Badges + Weekly Contest Milestones */}
      <AchievementsBadges
        achievements={profileUser.achievements}
        milestones={profileUser.weeklyContestMilestones}
      />

      {/* Account Settings (Sits lower on the page, less prominent) */}
      {isOwnProfile && (
        <div className="mt-14 pt-8 border-t-[2px] border-[var(--color-text-accent-dark)]/20">
          <AccountSettings
            initialEmail={profileUser.email}
            initialCity={profileUser.city}
            onSave={handleSaveSettings}
          />
        </div>
      )}
    </div>
  );
};
