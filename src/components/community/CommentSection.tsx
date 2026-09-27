import React, { useState } from 'react';
import { Comment } from '../../types/post';
import { Send, User } from 'lucide-react';
import { Button } from '../common/Button';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => Promise<void>;
  currentUserAvatar?: string;
  currentUserName?: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  onAddComment,
  currentUserAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
  currentUserName = 'Alex Rivera',
}) => {
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || submitting) return;

    setSubmitting(true);
    try {
      await onAddComment(commentText);
      setCommentText('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6 pt-6 border-t-[2px] border-[var(--color-text-accent-dark)]/20">
      <h4 className="font-black text-lg text-[var(--color-text-accent-dark)] mb-4">
        Community Discussion ({comments.length})
      </h4>

      {/* Input box */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <img
          src={currentUserAvatar}
          alt={currentUserName}
          className="w-10 h-10 rounded-xl object-cover border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] shrink-0"
        />
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share tips, questions, or praise for this build..."
            className="flex-1 px-4 py-2 bg-[var(--color-background)] rounded-xl border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] text-xs sm:text-sm font-bold focus:outline-none focus:bg-white"
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!commentText.trim() || submitting}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3.5">
        {comments.length === 0 ? (
          <p className="text-xs font-bold text-[var(--color-text-accent-dark)]/60 text-center py-4">
            No comments yet. Be the first to start the upcycling conversation!
          </p>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className="p-3.5 rounded-xl bg-[var(--color-background)] border-[1.5px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] flex items-start gap-3"
            >
              <img
                src={c.avatar}
                alt={c.author}
                className="w-8 h-8 rounded-lg object-cover border border-[var(--color-text-accent-dark)] shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-[var(--color-text-accent-dark)]">
                    {c.author}
                  </span>
                  <span className="text-[10px] font-bold text-[var(--color-text-accent-dark)]/60">
                    {c.date}
                  </span>
                </div>
                <p className="text-xs font-bold text-[var(--color-text-accent-dark)]/85 mt-1 leading-relaxed">
                  {c.text}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
