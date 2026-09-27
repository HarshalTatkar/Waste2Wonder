import React, { useState, useEffect } from 'react';
import { ContestEntry } from '../../types/contestEntry';
import { ContestEntryCard } from './ContestEntryCard';
import { Shuffle } from 'lucide-react';
import { contestService } from '../../services/contestService';

interface EntryGridProps {
  initialEntries: ContestEntry[];
  onVote: (entryId: string) => void;
  onTryIt: (entry: ContestEntry) => void;
  onOpenComments?: (entry: ContestEntry) => void;
}

export const EntryGrid: React.FC<EntryGridProps> = ({
  initialEntries,
  onVote,
  onTryIt,
  onOpenComments,
}) => {
  const [entries, setEntries] = useState<ContestEntry[]>(initialEntries);

  useEffect(() => {
    setEntries(initialEntries);
  }, [initialEntries]);

  const handleReshuffle = async () => {
    const shuffled = await contestService.getShuffledEntries();
    setEntries(shuffled);
  };

  return (
    <div>
      {/* Clean Header Row with Shuffle Order Button */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-black text-xl text-black">
            Community Submissions ({entries.length})
          </h3>
          <p className="text-xs font-bold text-black/60">
            Vote for your favorite rebuilds or try them yourself!
          </p>
        </div>

        <button
          onClick={handleReshuffle}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white rounded-full border-[2px] border-black shadow-[2px_2px_0px_#000] text-xs font-black text-black hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Shuffle Order</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entries.map((entry) => (
          <ContestEntryCard
            key={entry.id}
            entry={entry}
            onVote={onVote}
            onTryIt={onTryIt}
            onOpenComments={onOpenComments}
          />
        ))}
      </div>
    </div>
  );
};
