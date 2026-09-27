import React, { useState } from 'react';
import { Heart, MessageCircle, Eye, CheckCircle2, Share2, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { formatCount } from '../../utils/formatters';
import confetti from 'canvas-confetti';

interface EngagementBarProps {
  initialLikes: number;
  commentsCount: number;
  views: number;
  implementationsCount: number;
  onTryIt: () => void;
  onCommentClick?: () => void;
}

export const EngagementBar: React.FC<EngagementBarProps> = ({
  initialLikes,
  commentsCount,
  views,
  implementationsCount,
  onTryIt,
  onCommentClick,
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.8 },
      });
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  return (
    <div className="neu-card bg-white border-[2.5px] border-[var(--color-text-accent-dark)] shadow-[4px_4px_0px_var(--color-text-accent-dark)] rounded-2xl p-4 sm:p-5 my-6 flex flex-wrap items-center justify-between gap-4">
      {/* Metrics Row */}
      <div className="flex items-center gap-4 sm:gap-6 text-sm font-black text-[var(--color-text-accent-dark)]">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-[2px] transition-all cursor-pointer select-none ${
            hasLiked
              ? 'bg-[#FF6B6B] text-white border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)]'
              : 'bg-[var(--color-background)] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] hover:-translate-y-0.5'
          }`}
          aria-label="Like this craft"
        >
          <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
          <span>{formatCount(likes)}</span>
        </button>

        <button
          onClick={onCommentClick}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border-[2px] border-[var(--color-text-accent-dark)] bg-[var(--color-background)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] hover:-translate-y-0.5 cursor-pointer select-none"
        >
          <MessageCircle className="w-4 h-4 text-[var(--color-primary)]" />
          <span>{formatCount(commentsCount)}</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-accent-dark)]/70">
          <Eye className="w-4 h-4" />
          <span>{formatCount(views)} views</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs bg-[var(--color-background)] px-2.5 py-1 rounded-lg border border-[var(--color-text-accent-dark)] font-bold text-[var(--color-primary)]">
          <CheckCircle2 className="w-4 h-4" />
          <span>{implementationsCount} Built</span>
        </div>
      </div>

      {/* Action: Try It Button */}
      <div className="flex items-center gap-3">
        <Button
          variant="primary"
          size="md"
          onClick={onTryIt}
          icon={<Sparkles className="w-4 h-4 text-[#FFD166]" />}
        >
          Try It & Upload Result
        </Button>
      </div>
    </div>
  );
};
