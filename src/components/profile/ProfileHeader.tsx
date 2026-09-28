import React, { useRef } from 'react';
import { User } from '../../types/user';
import { MapPin, PlusCircle, UserPlus, UserCheck, KeyRound, Camera } from 'lucide-react';
import { formatCount } from '../../utils/formatters';

interface ProfileHeaderProps {
  user: User;
  isOwnProfile?: boolean;
  onFollowToggle?: () => void;
  onCreatePostClick?: () => void;
  onOpenCredentials?: () => void;
  onAvatarChange?: (file: File) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isOwnProfile = true,
  onFollowToggle,
  onCreatePostClick,
  onOpenCredentials,
  onAvatarChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onAvatarChange) {
      onAvatarChange(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white border-[3px] border-black shadow-[6px_6px_0px_#000] rounded-3xl p-6 sm:p-8 mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* User identity & Avatar */}
        <div className="flex items-start sm:items-center gap-5">
          <div className="relative group">
            <img
              src={user.avatar}
              alt={user.name}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-[3px] border-black shadow-[4px_4px_0px_#000] ${isOwnProfile ? 'group-hover:brightness-75 transition-all' : ''}`}
            />
            {isOwnProfile && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <div className="bg-black/60 p-2 rounded-full text-white">
                  <Camera className="w-6 h-6" />
                </div>
              </button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <span className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-[#98EECC] text-black text-[10px] font-black rounded-lg border-[1.5px] border-black shadow-[1px_1px_0px_#000]">
              MAKER
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-black">
                {user.name}
              </h2>
              <span className="text-xs font-bold text-black/60">
                @{user.username}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-black/80 max-w-lg mt-1.5 leading-relaxed">
              {user.bio}
            </p>

            {user.city && (
              <div className="flex items-center gap-1 text-xs font-black text-black/70 mt-2">
                <MapPin className="w-3.5 h-3.5 text-[#E11D48]" />
                <span>{user.city}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons: Your Credentials & Create Post */}
        <div className="flex flex-wrap items-center gap-2.5 self-end md:self-center">
          {isOwnProfile ? (
            <>
              {onOpenCredentials && (
                <button
                  type="button"
                  onClick={onOpenCredentials}
                  className="px-4 py-2 rounded-full border-[2px] border-black bg-white text-black font-black text-xs shadow-[2.5px_2.5px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Your Credentials</span>
                </button>
              )}
              <button
                type="button"
                onClick={onCreatePostClick}
                className="px-4 py-2 rounded-full border-[2px] border-black bg-[#FDA4AF] text-black font-black text-xs shadow-[2.5px_2.5px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Create Post</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onFollowToggle}
              className={`px-5 py-2 rounded-full border-[2px] border-black font-black text-xs shadow-[2.5px_2.5px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 flex items-center gap-1.5 cursor-pointer transition-all ${
                user.isFollowing ? 'bg-white text-black' : 'bg-[#98EECC] text-black'
              }`}
            >
              {user.isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              <span>{user.isFollowing ? 'Following' : 'Follow Maker'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="mt-8 pt-6 border-t-[2px] border-black/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="p-3 bg-white rounded-xl border-[2px] border-black shadow-[2px_2px_0px_#000]">
          <p className="text-xl sm:text-2xl font-black text-black">
            {formatCount(user.followersCount)}
          </p>
          <span className="text-[11px] font-black uppercase text-black/60">
            Followers
          </span>
        </div>

        <div className="p-3 bg-white rounded-xl border-[2px] border-black shadow-[2px_2px_0px_#000]">
          <p className="text-xl sm:text-2xl font-black text-black">
            {formatCount(user.stats.totalImplementations)}
          </p>
          <span className="text-[11px] font-black uppercase text-black">
            Implementations
          </span>
        </div>

        <div className="p-3 bg-white rounded-xl border-[2px] border-black shadow-[2px_2px_0px_#000]">
          <p className="text-xl sm:text-2xl font-black text-black">
            {formatCount(user.stats.totalLikes)}
          </p>
          <span className="text-[11px] font-black uppercase text-black">
            Total Likes
          </span>
        </div>

        <div className="p-3 bg-white rounded-xl border-[2px] border-black shadow-[2px_2px_0px_#000]">
          <p className="text-xl sm:text-2xl font-black text-black">
            {user.implementedWork.length}
          </p>
          <span className="text-[11px] font-black uppercase text-black/60">
            Completed Crafts
          </span>
        </div>
      </div>
    </div>
  );
};
