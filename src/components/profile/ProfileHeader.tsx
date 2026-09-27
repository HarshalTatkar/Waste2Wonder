import React from 'react';
import { User } from '../../types/user';
import { MapPin, Users, Heart, Eye, CheckCircle2, PlusCircle, UserPlus, UserCheck } from 'lucide-react';
import { Button } from '../common/Button';
import { formatCount } from '../../utils/formatters';

interface ProfileHeaderProps {
  user: User;
  isOwnProfile?: boolean;
  onFollowToggle?: () => void;
  onCreatePostClick?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isOwnProfile = true,
  onFollowToggle,
  onCreatePostClick,
}) => {
  return (
    <div className="neu-card bg-white border-[3px] border-[var(--color-text-accent-dark)] shadow-[6px_6px_0px_var(--color-text-accent-dark)] rounded-3xl p-6 sm:p-8 mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* User identity & Avatar */}
        <div className="flex items-start sm:items-center gap-5">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-[3px] border-[var(--color-text-accent-dark)] shadow-[4px_4px_0px_var(--color-text-accent-dark)]"
            />
            <span className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-[var(--color-primary)] text-white text-[10px] font-black rounded-lg border border-[var(--color-text-accent-dark)]">
              CREATOR
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-[var(--color-text-accent-dark)]">
                {user.name}
              </h2>
              <span className="text-xs font-bold text-[var(--color-text-accent-dark)]/70">
                @{user.username}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-[var(--color-text-accent-dark)]/85 max-w-lg mt-1.5 leading-relaxed">
              {user.bio}
            </p>

            {user.city && (
              <div className="flex items-center gap-1 text-xs font-black text-[var(--color-secondary)] mt-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>{user.city}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button: Create Post (for own) OR Follow (for other user) */}
        <div className="self-end md:self-center">
          {isOwnProfile ? (
            <Button
              variant="secondary"
              size="md"
              onClick={onCreatePostClick}
              icon={<PlusCircle className="w-4 h-4" />}
            >
              + Create Upcycle Post
            </Button>
          ) : (
            <Button
              variant={user.isFollowing ? 'outline' : 'primary'}
              size="md"
              onClick={onFollowToggle}
              icon={user.isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            >
              {user.isFollowing ? 'Following' : 'Follow Creator'}
            </Button>
          )}
        </div>
      </div>

      {/* Stats Counter Bar (Instagram-like structure, strictly NO messaging/chat) */}
      <div className="mt-8 pt-6 border-t-[2px] border-[var(--color-text-accent-dark)]/20 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="p-3 bg-[var(--color-background)] rounded-xl border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)]">
          <p className="text-xl sm:text-2xl font-black text-[var(--color-text-accent-dark)]">
            {formatCount(user.followersCount)}
          </p>
          <span className="text-[11px] font-black uppercase text-[var(--color-text-accent-dark)]/70">
            Followers
          </span>
        </div>

        <div className="p-3 bg-[var(--color-background)] rounded-xl border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)]">
          <p className="text-xl sm:text-2xl font-black text-[var(--color-text-accent-dark)]">
            {formatCount(user.stats.totalImplementations)}
          </p>
          <span className="text-[11px] font-black uppercase text-[var(--color-primary)]">
            Implementations
          </span>
        </div>

        <div className="p-3 bg-[var(--color-background)] rounded-xl border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)]">
          <p className="text-xl sm:text-2xl font-black text-[var(--color-text-accent-dark)]">
            {formatCount(user.stats.totalLikes)}
          </p>
          <span className="text-[11px] font-black uppercase text-[var(--color-secondary)]">
            Total Likes
          </span>
        </div>

        <div className="p-3 bg-[var(--color-background)] rounded-xl border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)]">
          <p className="text-xl sm:text-2xl font-black text-[var(--color-text-accent-dark)]">
            {user.implementedWork.length}
          </p>
          <span className="text-[11px] font-black uppercase text-[var(--color-text-accent-dark)]/70">
            Completed Crafts
          </span>
        </div>
      </div>
    </div>
  );
};
