import React, { useState } from 'react';
import { ContestEntry } from '../../types/contestEntry';
import { Heart, MessageCircle, Eye, CheckCircle2, Trophy } from 'lucide-react';
import { formatCount } from '../../utils/formatters';
import confetti from 'canvas-confetti';

interface ContestEntryCardProps {
  entry: ContestEntry;
  onVote: (entryId: string) => void;
  onTryIt: (entry: ContestEntry) => void;
  onOpenComments?: (entry: ContestEntry) => void;
}

export const ContestEntryCard: React.FC<ContestEntryCardProps> = ({
  entry,
  onVote,
  onTryIt,
  onOpenComments,
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
    <div className="bg-white border-[2.5px] border-black shadow-[4px_4px_0px_#000] rounded-2xl overflow-hidden flex flex-col justify-between transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000]">
      {/* Media Preview with Before/After toggle */}
      <div className="relative aspect-video w-full overflow-hidden border-b-[2.5px] border-black bg-gray-100">
        <img
          src={showBefore ? entry.beforeImage : entry.afterImage}
          alt={entry.title}
          className="w-full h-full object-cover transition-all"
        />

        {/* Toggle between before and after */}
        <button
          onClick={() => setShowBefore(!showBefore)}
          className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-white rounded-lg border-[1.5px] border-black shadow-[2px_2px_0px_#000] text-[10px] font-black cursor-pointer hover:bg-black/5 transition-colors"
        >
          {showBefore ? '🗑️ Before Waste' : '✨ Finished Upcycle'}
        </button>

        {entry.rank && entry.rank <= 3 && (
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-[#FFD166] text-black border-[1.5px] border-black shadow-[2px_2px_0px_#000] rounded-lg text-[10px] font-black flex items-center gap-1">
            <Trophy className="w-3 h-3 text-[#D97706]" />
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
              className="w-6 h-6 rounded-full object-cover border border-black"
            />
            <span className="text-xs font-black text-black truncate">
              {entry.creator.name}
            </span>
            <span className="text-[10px] font-bold text-black/60">
              • {entry.materialType}
            </span>
          </div>

          <h3 className="font-black text-lg text-black line-clamp-2 leading-tight mb-2">
            {entry.title}
          </h3>

          <p className="text-xs font-bold text-black/75 line-clamp-2 leading-relaxed">
            {entry.description}
          </p>
        </div>

        {/* Engagement row and Try It button */}
        <div className="mt-5 pt-3 border-t-[2px] border-black/15 flex items-center justify-between gap-2">
          {/* Metrics */}
          <div className="flex items-center gap-2 text-xs font-black">
            <button
              onClick={handleVote}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border-[1.5px] border-black transition-all cursor-pointer ${
                hasVoted
                  ? 'bg-[#FDA4AF] text-black shadow-[2px_2px_0px_#000]'
                  : 'bg-white hover:bg-black/5'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${hasVoted ? 'fill-current text-[#E11D48]' : ''}`} />
              <span>{formatCount(likes)}</span>
            </button>

            <button
              onClick={() => onOpenComments && onOpenComments(entry)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg border-[1.5px] border-black bg-white hover:bg-black/5 cursor-pointer text-black"
              title="View & add comments"
            >
              <MessageCircle className="w-3.5 h-3.5 text-black" />
              <span>{entry.commentsCount}</span>
            </button>

            <span className="hidden sm:flex items-center gap-1 text-black/60">
              <Eye className="w-3.5 h-3.5" />
              {formatCount(entry.views)}
            </span>
          </div>

          {/* Try It button - opens implementation process guide */}
          <button
            onClick={() => onTryIt(entry)}
            className="px-3.5 py-1.5 rounded-full border-[2px] border-black bg-[#98EECC] text-black font-black text-xs shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Try It</span>
          </button>
        </div>
      </div>
    </div>
  );
};
