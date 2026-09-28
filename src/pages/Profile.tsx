import React, { useState, useEffect } from 'react';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { ImpactPanel } from '../components/profile/ImpactPanel';
import { MyProjectsGrid } from '../components/profile/MyProjectsGrid';
import { AchievementsBadges } from '../components/profile/AchievementsBadges';
import { MaterialsIHaveWidget } from '../components/profile/MaterialsIHaveWidget';
import { CredentialsSection } from '../components/profile/CredentialsSection';
import { useUser } from '../context/UserContext';
import { profileService } from '../services/profileService';
import { postService } from '../services/postService';
import { User } from '../types/user';
import { Post } from '../types/post';
import { Sparkles, KeyRound, Leaf, Trophy, Layers } from 'lucide-react';

interface ProfilePageProps {
  onNavigate: (page: string, params?: any) => void;
  userId?: string;
}

export const Profile: React.FC<ProfilePageProps> = ({ onNavigate, userId }) => {
  const { user: currentUser, updateProfile, setMaterialsIHave } = useUser();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Accessible tab navigation within Profile
  const [activeProfileTab, setActiveProfileTab] = useState<
    'projects' | 'credentials' | 'impact' | 'badges' | 'stash'
  >('projects');

  const isOwnProfile = !userId || userId === currentUser?.id || userId === 'current-user';

  useEffect(() => {
    loadProfile();
  }, [userId, currentUser]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      // Determine the target user
      let targetUser: User | null = null;
      if (isOwnProfile && currentUser) {
        targetUser = currentUser;
      } else if (userId) {
        targetUser = await profileService.getUserById(userId);
      }
      setProfileUser(targetUser);

      // Load posts by this user — use targetUser directly to avoid stale closure
      if (targetUser) {
        const allPosts = await postService.getPosts();
        const mine = allPosts.filter(
          (p) => p.author.id === targetUser!.id || p.author.username === targetUser!.username
        );
        setUserPosts(mine);
      }
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

  const handleSaveCredentials = async (data: {
    name?: string;
    username?: string;
    email: string;
    city: string;
    notifications: boolean;
  }) => {
    await updateProfile({
      name: data.name,
      username: data.username,
      email: data.email,
      city: data.city,
    });
  };

  const handleDeletePost = async (post: Post) => {
    if (!window.confirm(`Are you sure you want to delete "${post.title}"?`)) return;
    try {
      if (currentUser) {
        await postService.deletePost(post.id, currentUser.id);
        setUserPosts(prev => prev.filter(p => p.id !== post.id));
      }
    } catch (err) {
      alert((err as Error).message);
    }
  };

  if (!profileUser) {
    return <div className="p-12 text-center font-black">Loading maker profile...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      {/* Profile Header with quick shortcut to Your Credentials */}
      <ProfileHeader
        user={profileUser}
        isOwnProfile={isOwnProfile}
        onFollowToggle={handleFollowToggle}
        onCreatePostClick={() => onNavigate('create-post')}
        onOpenCredentials={() => setActiveProfileTab('credentials')}
      />

      {/* Accessible Sub-navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8 p-1.5 bg-white/70 border-[2px] border-black rounded-2xl shadow-[3px_3px_0px_#000]">
        <button
          type="button"
          onClick={() => setActiveProfileTab('projects')}
          className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeProfileTab === 'projects'
              ? 'bg-[#98EECC] text-black border-[2px] border-black shadow-[2px_2px_0px_#000]'
              : 'text-black/80 hover:bg-black/5 border-[2px] border-transparent'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>My Projects ({profileUser.implementedWork.length + userPosts.length})</span>
        </button>

        {isOwnProfile && (
          <button
            type="button"
            onClick={() => setActiveProfileTab('credentials')}
            className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeProfileTab === 'credentials'
                ? 'bg-[#FDA4AF] text-black border-[2px] border-black shadow-[2px_2px_0px_#000]'
                : 'text-black/80 hover:bg-black/5 border-[2px] border-transparent'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Credentials & Password</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveProfileTab('impact')}
          className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeProfileTab === 'impact'
              ? 'bg-[#FEF08A] text-black border-[2px] border-black shadow-[2px_2px_0px_#000]'
              : 'text-black/80 hover:bg-black/5 border-[2px] border-transparent'
          }`}
        >
          <Leaf className="w-4 h-4" />
          <span>Eco Impact</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveProfileTab('badges')}
          className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeProfileTab === 'badges'
              ? 'bg-[#DDD6FE] text-black border-[2px] border-black shadow-[2px_2px_0px_#000]'
              : 'text-black/80 hover:bg-black/5 border-[2px] border-transparent'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Badges & Milestones</span>
        </button>

        {isOwnProfile && (
          <button
            type="button"
            onClick={() => setActiveProfileTab('stash')}
            className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeProfileTab === 'stash'
                ? 'bg-white text-black border-[2px] border-black shadow-[2px_2px_0px_#000]'
                : 'text-black/80 hover:bg-black/5 border-[2px] border-transparent'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>My Stash ({currentUser?.materialsIHave?.length || 0})</span>
          </button>
        )}
      </div>

      {/* Tab 1: My Projects & Implemented Work */}
      {activeProfileTab === 'projects' && (
        <div className="animate-in fade-in duration-200">
          <MyProjectsGrid
            implementedWork={profileUser.implementedWork}
            createdPosts={userPosts}
            onSelectOriginalReference={(refId) => onNavigate('craft-detail', { projectId: refId })}
            onSelectPost={() => onNavigate('community')}
            onDeletePost={isOwnProfile ? handleDeletePost : undefined}
          />
        </div>
      )}

      {/* Tab 2: Dedicated Credentials & Password Section - Instant 1-Click Access */}
      {activeProfileTab === 'credentials' && isOwnProfile && (
        <div className="animate-in fade-in duration-200">
          <CredentialsSection
            initialName={profileUser.name}
            initialUsername={profileUser.username}
            initialEmail={profileUser.email}
            initialCity={profileUser.city}
            onSave={handleSaveCredentials}
          />
        </div>
      )}

      {/* Tab 3: Environmental Impact Panel */}
      {activeProfileTab === 'impact' && (
        <div className="animate-in fade-in duration-200">
          <ImpactPanel impact={profileUser.environmentalImpact} />
        </div>
      )}

      {/* Tab 4: Badges & Weekly Contest Milestones */}
      {activeProfileTab === 'badges' && (
        <div className="animate-in fade-in duration-200">
          <AchievementsBadges
            achievements={profileUser.achievements}
            milestones={profileUser.weeklyContestMilestones}
          />
        </div>
      )}

      {/* Tab 5: My Materials Stash */}
      {activeProfileTab === 'stash' && isOwnProfile && (
        <div className="animate-in fade-in duration-200">
          <MaterialsIHaveWidget
            materials={currentUser?.materialsIHave || []}
            onToggleMaterial={handleToggleStashMaterial}
            onFindIdeas={() => onNavigate('materials')}
          />
        </div>
      )}
    </div>
  );
};
