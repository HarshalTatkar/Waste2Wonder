import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Post } from '../../types/post';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ReportPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
}

export const ReportPostModal: React.FC<ReportPostModalProps> = ({ isOpen, onClose, post }) => {
  const [reason, setReason] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const reasons = [
    'Spam or misleading',
    'Dangerous or harmful upcycling practices',
    'Inappropriate content',
    'Copyright infringement',
    'Other'
  ];

  const handleSubmit = () => {
    if (!reason) return;
    // Dummy implementation: just show success
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setReason('');
      onClose();
    }, 2000);
  };

  if (!post) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report Post" maxWidth="sm">
      <div className="text-left space-y-5">
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#98EECC]" />
            <h3 className="text-lg font-black text-black">Report Submitted</h3>
            <p className="text-sm font-bold text-black/60">Thank you for keeping our community safe. Our team will review this post shortly.</p>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-3 p-3 bg-[#FF6B6B]/10 rounded-xl border-[1.5px] border-[#FF6B6B]">
              <AlertTriangle className="w-5 h-5 text-[#FF6B6B] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black text-[#FF6B6B] uppercase tracking-wide">Reporting</p>
                <p className="text-sm font-bold text-black truncate">{post.title}</p>
                <p className="text-xs font-bold text-black/60">By {post.author.name}</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-black text-black">Why are you reporting this post?</p>
              <div className="space-y-2">
                {reasons.map((r) => (
                  <label key={r} className="flex items-center gap-3 p-3 rounded-xl border-[2px] border-black hover:bg-black/5 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="reportReason"
                      value={r}
                      checked={reason === r}
                      onChange={() => setReason(r)}
                      className="w-4 h-4 text-black border-black focus:ring-black accent-black"
                    />
                    <span className="text-sm font-bold text-black">{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSubmit}
                disabled={!reason}
                className="w-full py-3 rounded-xl border-[2.5px] border-black bg-[#FF6B6B] text-white font-black shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:shadow-[3px_3px_0px_#000] disabled:translate-y-0 disabled:cursor-not-allowed transition-all"
              >
                Submit Report
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
