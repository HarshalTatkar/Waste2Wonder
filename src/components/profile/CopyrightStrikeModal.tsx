import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Post } from '../../types/post';
import { postService } from '../../services/postService';
import { Scale, CheckCircle2 } from 'lucide-react';
import { useUser } from '../../context/UserContext';

interface CopyrightStrikeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CopyrightStrikeModal: React.FC<CopyrightStrikeModalProps> = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [otherPosts, setOtherPosts] = useState<Post[]>([]);
  
  const [selectedMyPost, setSelectedMyPost] = useState<string>('');
  const [selectedOtherPost, setSelectedOtherPost] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setLoading(true);
      postService.getPosts().then(allPosts => {
        const mine = allPosts.filter(p => p.author.id === user.id || p.author.username === user.username);
        const others = allPosts.filter(p => p.author.id !== user.id && p.author.username !== user.username);
        setMyPosts(mine);
        setOtherPosts(others);
        setLoading(false);
      });
    } else {
      setSelectedMyPost('');
      setSelectedOtherPost('');
      setIsSubmitted(false);
    }
  }, [isOpen, user]);

  const handleSubmit = () => {
    if (!selectedMyPost || !selectedOtherPost) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="File Copyright Strike" maxWidth="md">
      <div className="text-left space-y-6">
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#98EECC]" />
            <h3 className="text-lg font-black text-black">Strike Filed Successfully</h3>
            <p className="text-sm font-bold text-black/60">Our legal team will review the claim and take appropriate action against the offending post within 48 hours.</p>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-3 p-4 bg-[#FFD93D]/20 rounded-xl border-[2px] border-[#FFD93D]">
              <Scale className="w-6 h-6 text-[#FFD93D] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-black text-black">Copyright Infringement Claim</p>
                <p className="text-xs font-bold text-black/70 mt-1">
                  Use this tool to claim that another maker has copied your original work without permission. (Note: This is a dummy implementation).
                </p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8 font-black animate-pulse">Loading posts...</div>
            ) : (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-black text-black">1. Select YOUR original post</label>
                  <select
                    value={selectedMyPost}
                    onChange={(e) => setSelectedMyPost(e.target.value)}
                    className="w-full p-3 bg-white rounded-xl border-[2px] border-black shadow-[2px_2px_0px_#000] font-bold text-sm text-black focus:outline-none"
                  >
                    <option value="">-- Choose one of your posts --</option>
                    {myPosts.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-black">2. Select the OFFENDING post</label>
                  <select
                    value={selectedOtherPost}
                    onChange={(e) => setSelectedOtherPost(e.target.value)}
                    className="w-full p-3 bg-white rounded-xl border-[2px] border-black shadow-[2px_2px_0px_#000] font-bold text-sm text-black focus:outline-none"
                  >
                    <option value="">-- Choose the copied post --</option>
                    {otherPosts.map(p => (
                      <option key={p.id} value={p.id}>{p.title} (by {p.author.name})</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedMyPost || !selectedOtherPost}
                    className="w-full py-3 rounded-xl border-[2.5px] border-black bg-black text-white font-black shadow-[3px_3px_0px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    <Scale className="w-4 h-4" />
                    Submit Formal Strike
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};
