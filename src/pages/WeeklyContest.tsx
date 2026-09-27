import React, { useState, useEffect } from 'react';
import { EntryGrid } from '../components/contest/EntryGrid';
import { CountdownTimer } from '../components/common/CountdownTimer';
import { Button } from '../components/common/Button';
import { UploadResultModal } from '../components/craft-detail/UploadResultModal';
import { contestService } from '../services/contestService';
import { ContestEntry } from '../types/contestEntry';
import { useUser } from '../context/UserContext';
import { Trophy, Flame, PlusCircle, Sparkles, Users } from 'lucide-react';

interface WeeklyContestProps {
  onNavigate: (page: string, params?: any) => void;
}

export const WeeklyContest: React.FC<WeeklyContestProps> = ({ onNavigate }) => {
  const { addImplementedCraft } = useUser();
  const [entries, setEntries] = useState<ContestEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tryItEntry, setTryItEntry] = useState<ContestEntry | null>(null);

  useEffect(() => {
    loadContest();
  }, []);

  const loadContest = async () => {
    try {
      const data = await contestService.getContestEntries();
      setEntries(data);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (entryId: string) => {
    await contestService.voteContestEntry(entryId);
  };

  const handleTryItSubmit = async (data: {
    implementedCraftTitle: string;
    uploadedResultPhoto: string;
    feedbackNote: string;
  }) => {
    if (!tryItEntry) return;
    await addImplementedCraft({
      originalReferenceTitle: tryItEntry.title,
      originalReferenceSource: 'in_app',
      originalReferenceId: tryItEntry.postId,
      implementedCraftTitle: data.implementedCraftTitle,
      uploadedResultPhoto: data.uploadedResultPhoto,
      feedbackNote: data.feedbackNote,
      creatorName: tryItEntry.creator.name,
    });
    await loadContest();
  };

  const isUnderCap = entries.length < 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      {/* Contest Header Banner */}
      <div className="neu-card bg-white border-[3px] border-[var(--color-text-accent-dark)] shadow-[8px_8px_0px_var(--color-text-accent-dark)] rounded-3xl p-6 sm:p-10 mb-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[var(--color-secondary)] border-[3px] border-[var(--color-text-accent-dark)] shadow-[4px_4px_0px_var(--color-text-accent-dark)] flex items-center justify-center text-white shrink-0">
              <Trophy className="w-10 h-10 text-[#FFD166] stroke-[2.5]" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-3 py-1 bg-[#C97C5D] text-white text-xs font-black rounded-lg uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  WEEK 38 SHOWCASE
                </span>
                <span className="text-xs font-black bg-[var(--color-background)] px-2.5 py-1 rounded-lg border border-[var(--color-text-accent-dark)]">
                  {entries.length} / 100 Entries Cap
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-[var(--color-text-accent-dark)] tracking-tight">
                THE RE-CREATION DERBY
              </h1>
              <p className="text-sm sm:text-base font-bold text-[var(--color-text-accent-dark)]/75 mt-1 max-w-xl">
                Every entry is shown in rotated sequence via our Fair Exposure engine. Vote for your favorite builds or try them out yourself!
              </p>
            </div>
          </div>

          {/* Right side: Countdown & Submit Entry */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-4 w-full lg:w-auto">
            <div className="flex flex-col items-start sm:items-end">
              <span className="text-xs font-black uppercase tracking-wider text-[var(--color-text-accent-dark)]/70 mb-1.5">
                Round Closes In:
              </span>
              <CountdownTimer variant="neubrutalist" />
            </div>

            {isUnderCap ? (
              <Button
                variant="primary"
                size="lg"
                onClick={() => onNavigate('create-post', { isContestEntry: true })}
                icon={<PlusCircle className="w-5 h-5" />}
              >
                Submit Contest Entry
              </Button>
            ) : (
              <div className="px-4 py-2 bg-gray-100 rounded-xl border border-[var(--color-text-accent-dark)] text-xs font-black text-gray-500">
                Weekly Cap Reached (100/100)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fair Rotating Entries Grid */}
      <EntryGrid
        initialEntries={entries}
        onVote={handleVote}
        onTryIt={(entry) => setTryItEntry(entry)}
      />

      {/* Try It Modal */}
      {tryItEntry && (
        <UploadResultModal
          isOpen={Boolean(tryItEntry)}
          onClose={() => setTryItEntry(null)}
          craftTitle={tryItEntry.title}
          referenceSource="in_app"
          referenceId={tryItEntry.postId}
          creatorName={tryItEntry.creator.name}
          onSubmitResult={handleTryItSubmit}
        />
      )}
    </div>
  );
};
