import React, { useState } from 'react';
import { ContestEntry } from '../../types/contestEntry';
import { Heart, MessageCircle, Eye, CheckCircle2, Trophy, Sparkles } from 'lucide-react';
import { formatCount } from '../../utils/formatters';
import { Button } from '../common/Button';
import confetti from 'canvas-confetti';

interface ContestEntryCardProps {
  entry: ContestEntry;
  onVote: (entryId: string) => void;
  onTryIt: (entry: ContestEntry) => void;
}

export const ContestEntryCard: React.FC<ContestEntryCardProps> = ({
  entry,
  onVote,
  onTryIt,
}) => {
  const [likes, setLikes] = useState(entry.likes);
  const [hasVoted, setHasVoted] = useState(false);
  const [showBefore, setShowBefore] = useState(false);

  const handleVote = () => {
    if (!hasVoted) {
      setLikes((prev) => prev + 1);
      setHasVoted(true);
      onVote(entry.id);
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.8 },
      });
    } else {
      setLikes((prev) => prev - 1);
      setHasVoted(false);
    }
  };

  return (
    <div className="neu-card bg-white border-[2.5px] border-[var(--color-text-accent-dark)] shadow-[4px_4px_0px_var(--color-text-accent-dark)] rounded-2xl overflow-hidden flex flex-col justify-between transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_var(--color-text-accent-dark)]">
      {/* Media Preview with Before/After toggle */}
      <div className="relative aspect-video w-full overflow-hidden border-b-[2.5px] border-[var(--color-text-accent-dark)] bg-gray-100">
        <img
          src={showBefore ? entry.beforeImage : entry.afterImage}
          alt={entry.title}
          className="w-full h-full object-cover transition-all"
        />

        {/* Toggle between before and after */}
        <button
          onClick={() => setShowBefore(!showBefore)}
          className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-white/95 rounded-lg border-[1.5px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] text-[10px] font-black cursor-pointer hover:bg-[var(--color-background)] transition-colors"
        >
          {showBefore ? '🗑️ Showing: Before' : '✨ Showing: After'}
        </button>

        {entry.rank && entry.rank <= 3 && (
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-[#FFD166] text-[#3A3A3A] border-[1.5px] border-[#3A3A3A] shadow-[2px_2px_0px_#3A3A3A] rounded-lg text-[10px] font-black flex items-center gap-1">
            <Trophy className="w-3 h-3 text-[#C97C5D]" />
            <span>Rank #{entry.rank}</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Creator row */}
          <div className="flex items-center gap-2 mb-2">
            <img
              src={entry.creator.avatar}
              alt={entry.creator.name}
              className="w-6 h-6 rounded-md object-cover border border-[var(--color-text-accent-dark)]"
            />
            <span className="text-xs font-black text-[var(--color-text-accent-dark)] truncate">
              {entry.creator.name}
            </span>
            <span className="text-[10px] font-bold text-[var(--color-text-accent-dark)]/60">
              • {entry.materialType}
            </span>
          </div>

          <h3 className="font-black text-lg text-[var(--color-text-accent-dark)] line-clamp-2 leading-tight mb-2">
            {entry.title}
          </h3>

          <p className="text-xs font-bold text-[var(--color-text-accent-dark)]/75 line-clamp-2 leading-relaxed">
            {entry.description}
          </p>
        </div>

        {/* Engagement row and Try It button */}
        <div className="mt-5 pt-3 border-t-[2px] border-[var(--color-text-accent-dark)]/15 flex items-center justify-between gap-2">
          {/* Metrics */}
          <div className="flex items-center gap-2 text-xs font-black">
            <button
              onClick={handleVote}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border-[1.5px] transition-all cursor-pointer ${
                hasVoted
                  ? 'bg-[#FF6B6B] text-white border-[var(--color-text-accent-dark)] shadow-[1.5px_1.5px_0px_var(--color-text-accent-dark)]'
                  : 'bg-[var(--color-background)] border-[var(--color-text-accent-dark)] hover:bg-[#FF6B6B]/20'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${hasVoted ? 'fill-current' : ''}`} />
              <span>{formatCount(likes)}</span>
            </button>

            <span className="flex items-center gap-1 text-[var(--color-text-accent-dark)]/70">
              <MessageCircle className="w-3.5 h-3.5" />
              {entry.commentsCount}
            </span>

            <span className="hidden sm:flex items-center gap-1 text-[var(--color-text-accent-dark)]/60">
              <Eye className="w-3.5 h-3.5" />
              {formatCount(entry.views)}
            </span>
          </div>

          {/* Try It button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onTryIt(entry)}
            icon={<CheckCircle2 className="w-3.5 h-3.5" />}
          >
            Try It
          </Button>
        </div>
      </div>
    </div>
  );
};
