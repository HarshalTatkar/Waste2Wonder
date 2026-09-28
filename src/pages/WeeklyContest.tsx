import React, { useState, useEffect } from 'react';
import { EntryGrid } from '../components/contest/EntryGrid';
import { CountdownTimer } from '../components/common/CountdownTimer';
import { Button } from '../components/common/Button';
import { UploadResultModal } from '../components/craft-detail/UploadResultModal';
import { ImplementationProcessModal, ProcessModalCraft } from '../components/common/ImplementationProcessModal';
import { CommentSection } from '../components/community/CommentSection';
import { Modal } from '../components/common/Modal';
import { contestService } from '../services/contestService';
import { ContestEntry } from '../types/contestEntry';
import { useUser } from '../context/UserContext';
import { Trophy, PlusCircle } from 'lucide-react';
import { Comment } from '../types/post';

interface WeeklyContestProps {
  onNavigate: (page: string, params?: any) => void;
}

export const WeeklyContest: React.FC<WeeklyContestProps> = ({ onNavigate }) => {
  const { user, addImplementedCraft } = useUser();
  const [entries, setEntries] = useState<ContestEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // States for process guide, upload modal, and comments modal
  const [processEntry, setProcessEntry] = useState<ContestEntry | null>(null);
  const [uploadEntry, setUploadEntry] = useState<ContestEntry | null>(null);
  const [activeCommentsEntry, setActiveCommentsEntry] = useState<ContestEntry | null>(null);

  // Dynamic comments mapping per entry
  const [entryComments, setEntryComments] = useState<Record<string, Comment[]>>({
    'contest-1': [
      {
        id: 'c-1',
        author: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        text: 'The rope suspension idea is super clean. Did you need wall anchors?',
        date: '1 day ago',
        likes: 5,
      },
    ],
    'contest-2': [
      {
        id: 'c-2',
        author: 'Maya Lin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        text: 'The colors in sunlight look incredible! Going to try with green soda bottles.',
        date: '2 days ago',
        likes: 9,
      },
    ],
  });

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
    if (!user) return;
    await contestService.voteContestEntry(entryId, user.id);
  };

  // Called when user clicks "Try It" on any card
  const handleTryItClick = (entry: ContestEntry) => {
    setProcessEntry(entry);
  };

  // Called from inside ImplementationProcessModal when user is ready to attach their work
  const handleProceedToAttachWork = () => {
    if (processEntry) {
      setUploadEntry(processEntry);
      setProcessEntry(null);
    }
  };

  const handleUploadSubmit = async (data: {
    implementedCraftTitle: string;
    uploadedResultPhoto: string;
    feedbackNote: string;
  }) => {
    if (!uploadEntry) return;
    await addImplementedCraft({
      originalReferenceTitle: uploadEntry.title,
      originalReferenceSource: 'in_app',
      originalReferenceId: uploadEntry.postId,
      implementedCraftTitle: data.implementedCraftTitle,
      uploadedResultPhoto: data.uploadedResultPhoto,
      feedbackNote: data.feedbackNote,
      creatorName: uploadEntry.creator.name,
    });
    setUploadEntry(null);
    await loadContest();
  };

  const handleAddComment = (text: string) => {
    if (!activeCommentsEntry) return;
    const newComm: Comment = {
      id: `comm-${Date.now()}`,
      author: user?.name || 'You',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      text,
      date: 'Just now',
      likes: 0,
    };

    setEntryComments((prev) => ({
      ...prev,
      [activeCommentsEntry.id]: [newComm, ...(prev[activeCommentsEntry.id] || [])],
    }));

    // Increment count on entry
    setEntries((prev) =>
      prev.map((e) =>
        e.id === activeCommentsEntry.id
          ? { ...e, commentsCount: e.commentsCount + 1 }
          : e
      )
    );
  };

  const getCraftDataForModal = (entry: ContestEntry): ProcessModalCraft => {
    return {
      title: entry.title,
      material: entry.materialType,
      difficulty: 'Medium',
      timeRequired: '45 mins',
      estimatedCost: '$1 - $3',
      description: entry.description,
      creatorName: entry.creator.name,
      materialsNeeded: [
        `Waste ${entry.materialType} material`,
        'Heavy scissors or hobby utility knife',
        'Strong craft adhesive / hot glue',
        'Ruler and marking pencil',
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Prep & Clean Recycled Item',
          instructions: `Rinse and wipe down the ${entry.materialType}. Remove any labels, grease, or old adhesive tape.`,
        },
        {
          stepNumber: 2,
          title: 'Cut & Assemble Form',
          instructions: 'Score cleanly along measured guidelines and interlock or join pieces according to the build structure.',
        },
        {
          stepNumber: 3,
          title: 'Final Details & Finish',
          instructions: 'Sand rough edges smooth and add decorative accents or protective clear seal before photographing your result.',
        },
      ],
      precautions: [
        'Always cut away from fingers on a solid cutting board.',
        'Allow adhesives to cure completely before handling.',
      ],
    };
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      {/* Contest Header Banner */}
      <div className="bg-[#FCD34D] border-[3px] border-black shadow-[6px_6px_0px_#000] rounded-3xl p-6 sm:p-8 mb-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#FFAAA6] border-[2.5px] border-black shadow-[3px_3px_0px_#000] flex items-center justify-center shrink-0">
              <Trophy className="w-8 h-8 text-black stroke-[2.5]" />
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-wider text-black/75">
                WEEKLY CHALLENGE
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-black tracking-tight leading-tight">
                BEST BOTTLE & MATERIAL REBUILD
              </h1>
              <p className="text-sm font-bold text-black/80 mt-1 max-w-xl">
                Vote on community transformations or try building one yourself with step-by-step guidance!
              </p>
            </div>
          </div>

          {/* Right side: Countdown & Submit Entry */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 w-full lg:w-auto">
            <div className="flex flex-col items-start sm:items-end">
              <span className="text-xs font-black uppercase tracking-wider text-black/70 mb-1">
                Voting Closes In:
              </span>
              <CountdownTimer variant="neubrutalist" />
            </div>

            <button
              onClick={() => onNavigate('create-post', { isContestEntry: true })}
              className="px-6 py-2.5 rounded-full border-[2.5px] border-black bg-white text-black font-black text-xs shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 flex items-center gap-2 cursor-pointer transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit My Entry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Entries Grid */}
      <EntryGrid
        initialEntries={entries}
        onVote={handleVote}
        onTryIt={handleTryItClick}
        onOpenComments={(entry) => setActiveCommentsEntry(entry)}
      />

      {/* Step-by-Step Implementation Process Modal */}
      {processEntry && (
        <ImplementationProcessModal
          isOpen={Boolean(processEntry)}
          onClose={() => setProcessEntry(null)}
          craft={getCraftDataForModal(processEntry)}
          onProceedToAttachWork={handleProceedToAttachWork}
        />
      )}

      {/* Upload Result Modal with Real File Picker */}
      {uploadEntry && (
        <UploadResultModal
          isOpen={Boolean(uploadEntry)}
          onClose={() => setUploadEntry(null)}
          craftTitle={uploadEntry.title}
          referenceSource="in_app"
          referenceId={uploadEntry.postId}
          creatorName={uploadEntry.creator.name}
          onSubmitResult={handleUploadSubmit}
        />
      )}

      {/* Contest Entry Comments Modal */}
      {activeCommentsEntry && (
        <Modal
          isOpen={Boolean(activeCommentsEntry)}
          onClose={() => setActiveCommentsEntry(null)}
          title={`Discussion on "${activeCommentsEntry.title}"`}
          maxWidth="lg"
        >
          <CommentSection
            comments={entryComments[activeCommentsEntry.id] || []}
            onAddComment={handleAddComment}
            currentUserAvatar={user?.avatar}
            currentUserName={user?.name}
          />
        </Modal>
      )}
    </div>
  );
};
