import React, { useState } from 'react';
import { Comment } from '../../types/post';
import { Send } from 'lucide-react';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => Promise<void> | void;
  currentUserAvatar?: string;
  currentUserName?: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  onAddComment,
  currentUserAvatar = '',
  currentUserName = 'You',
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
    } catch (err) {
      console.error('Error posting comment', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="comments-section" className="mt-8 pt-6 border-t-[2.5px] border-black">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-black text-xl text-black">
          Comments & Community Tips ({comments.length})
        </h4>
        <span className="text-xs font-bold text-black/60">Be nice & helpful</span>
      </div>

      {/* Input box */}
      <form onSubmit={handleSubmit} className="flex items-center gap-3 mb-6">
        {currentUserAvatar ? (
          <img src={currentUserAvatar} alt={currentUserName}
            className="w-10 h-10 rounded-full object-cover border-[2px] border-black shadow-[2px_2px_0px_#000] shrink-0" />
        ) : (
          <div className="w-10 h-10 rounded-full border-[2px] border-black shadow-[2px_2px_0px_#000] shrink-0 bg-[var(--color-background)] flex items-center justify-center text-xl select-none">
            🧑‍🎨
          </div>
        )}
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share tips, questions, or modifications for this craft..."
            className="flex-1 px-4 py-2.5 bg-white rounded-full border-[2px] border-black shadow-[2px_2px_0px_#000] text-xs sm:text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="submit"
            disabled={!commentText.trim() || submitting}
            className={`px-5 py-2.5 rounded-full border-[2px] border-black font-black text-xs text-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 transition-all cursor-pointer ${
              !commentText.trim() || submitting
                ? 'bg-gray-200 opacity-60 cursor-not-allowed shadow-none'
                : 'bg-[#98EECC] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#000] active:translate-y-0.5'
            }`}
          >
            <Send className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Post</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <div className="bg-white/80 border-[2px] border-black rounded-2xl p-6 text-center shadow-[3px_3px_0px_#000]">
            <p className="text-sm font-bold text-black/70">
              No comments yet. Start the conversation with your tips or questions!
            </p>
          </div>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-2xl bg-white border-[2px] border-black shadow-[3px_3px_0px_#000] flex items-start gap-3"
            >
              {c.avatar ? (
                <img src={c.avatar} alt={c.author}
                  className="w-9 h-9 rounded-full object-cover border-[1.5px] border-black shrink-0" />
              ) : (
                <div className="w-9 h-9 rounded-full border-[1.5px] border-black shrink-0 bg-[var(--color-background)] flex items-center justify-center text-lg select-none">
                  🧑‍🎨
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-black">
                    {c.author}
                  </span>
                  <span className="text-[11px] font-bold text-black/50">
                    {c.date}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-black/85 mt-1 leading-relaxed">
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
