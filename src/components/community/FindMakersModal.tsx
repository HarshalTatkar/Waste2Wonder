import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { User } from '../../types/user';
import { profileService } from '../../services/profileService';
import { Search, UserPlus, UserCheck, Loader2 } from 'lucide-react';

interface FindMakersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToProfile: (userId: string) => void;
}

export const FindMakersModal: React.FC<FindMakersModalProps> = ({ isOpen, onClose, onNavigateToProfile }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const search = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const users = await profileService.searchUsers(query);
        setResults(users);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };
    const timeoutId = setTimeout(search, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleFollowToggle = async (user: User) => {
    try {
      const { isFollowing } = await profileService.toggleFollowUser(user.id);
      setResults(prev => prev.map(u => u.id === user.id ? { ...u, isFollowing } : u));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Find Makers" maxWidth="md">
      <div className="space-y-4 text-left">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or username..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border-[2px] border-black shadow-[2px_2px_0px_#000] font-bold text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
          />
          <Search className="w-5 h-5 text-black/40 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="min-h-[200px] max-h-[400px] overflow-y-auto space-y-3">
          {loading ? (
            <div className="flex items-center justify-center h-full pt-10">
              <Loader2 className="w-6 h-6 animate-spin text-black/50" />
            </div>
          ) : results.length > 0 ? (
            results.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-3 rounded-xl border-[2px] border-black bg-[#FFFDF9] shadow-[2px_2px_0px_#000]">
                <div 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => {
                    onClose();
                    onNavigateToProfile(u.id);
                  }}
                >
                  <img src={u.avatar || 'https://via.placeholder.com/150'} alt={u.name} className="w-10 h-10 rounded-lg object-cover border-[1.5px] border-black" />
                  <div>
                    <p className="text-sm font-black text-black leading-tight">{u.name}</p>
                    <p className="text-xs font-bold text-black/60">@{u.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleFollowToggle(u)}
                  className={`px-3 py-1.5 rounded-lg border-[1.5px] border-black font-black text-xs shadow-[1.5px_1.5px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-all ${
                    u.isFollowing ? 'bg-white text-black' : 'bg-[#98EECC] text-black'
                  }`}
                >
                  {u.isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            ))
          ) : query.trim() ? (
            <p className="text-center text-sm font-bold text-black/50 pt-10">No makers found for "{query}".</p>
          ) : (
            <p className="text-center text-sm font-bold text-black/50 pt-10">Type a name to search for makers.</p>
          )}
        </div>
      </div>
    </Modal>
  );
};
