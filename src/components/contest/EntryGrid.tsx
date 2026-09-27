import React, { useState, useEffect } from 'react';
import { ContestEntry } from '../../types/contestEntry';
import { ContestEntryCard } from './ContestEntryCard';
import { Shuffle, ShieldCheck } from 'lucide-react';
import { contestService } from '../../services/contestService';

interface EntryGridProps {
  initialEntries: ContestEntry[];
  onVote: (entryId: string) => void;
  onTryIt: (entry: ContestEntry) => void;
}

export const EntryGrid: React.FC<EntryGridProps> = ({
  initialEntries,
  onVote,
  onTryIt,
}) => {
  const [entries, setEntries] = useState<ContestEntry[]>(initialEntries);
  const [isFairShuffled, setIsFairShuffled] = useState(true);

  // Fair distribution: shuffle on mount to guarantee roughly-equal exposure
  useEffect(() => {
    handleReshuffle();
  }, []);

  const handleReshuffle = async () => {
    const shuffled = await contestService.getShuffledEntries();
    setEntries(shuffled);
    setIsFairShuffled(true);
  };

  return (
    <div>
      {/* Fair exposure banner & shuffle control */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border-[2px] border-[var(--color-text-accent-dark)] shadow-[3px_3px_0px_var(--color-text-accent-dark)] mb-8">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#EBF0E4] border border-[var(--color-text-accent-dark)] text-[var(--color-primary)]">
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <p className="font-black text-xs sm:text-sm text-[var(--color-text-accent-dark)]">
              Fair-Distribution Exposure Algorithm Active
            </p>
            <p className="text-[11px] font-bold text-[var(--color-text-accent-dark)]/70">
              Entries are dynamically rotated so late submissions receive equal visibility as early posts.
            </p>
          </div>
        </div>

        <button
          onClick={handleReshuffle}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-background)] rounded-xl border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] text-xs font-black hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer"
        >
          <Shuffle className="w-3.5 h-3.5 text-[var(--color-secondary)]" />
          <span>Rotate Showcase Order</span>
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
          />
        ))}
      </div>
    </div>
  );
};
