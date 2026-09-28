import React from 'react';
import { ArrowLeft, Sparkles, CheckCircle2, Clock, DollarSign } from 'lucide-react';
import { Button } from '../common/Button';
import { getDifficultyColor } from '../../utils/formatters';

interface PostPreviewProps {
  data: {
    title: string;
    description: string;
    beforeImage: string;
    afterImage: string;
    materials: string[];
    cost: string;
    timeTaken: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    precautions: string[];
    steps: { stepNumber: number; title: string; instructions: string }[];
    isContestEntry: boolean;
  };
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  onPublish: () => void;
  onPrev: () => void;
  publishing: boolean;
}

export const PostPreview: React.FC<PostPreviewProps> = ({
  data,
  author,
  onPublish,
  onPrev,
  publishing,
}) => {
  const diff = getDifficultyColor(data.difficulty);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <span className="px-3 py-1 bg-[var(--color-primary)] text-white text-xs font-black rounded-lg uppercase tracking-wider">
          Final Review
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-[var(--color-text-accent-dark)] mt-2">
          Preview Your Upcycle Showcase
        </h3>
        <p className="text-sm font-bold text-[var(--color-text-accent-dark)]/70 mt-1">
          Review how your upcycling build will appear in the Community Feed and your Maker Profile. Initial Likes, Views, and Implementations start at 0.
        </p>
      </div>

      {/* Simulated Live Post Card */}
      <div className="neu-card bg-white border-[3px] border-[var(--color-text-accent-dark)] shadow-[6px_6px_0px_var(--color-text-accent-dark)] rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto">
        {/* Creator Info */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b-[2px] border-[var(--color-text-accent-dark)]/20">
          <div className="flex items-center gap-3">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-12 h-12 rounded-xl object-cover border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)]"
            />
            <div>
              <h4 className="font-black text-base text-[var(--color-text-accent-dark)]">
                {author.name}
              </h4>
              <p className="text-xs font-bold text-[var(--color-text-accent-dark)]/60">
                @{author.username} • Just now
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {data.isContestEntry && (
              <span className="px-2.5 py-0.5 bg-[var(--color-secondary)] text-white font-black text-[10px] rounded-lg">
                🏆 Contest Entry
              </span>
            )}
            <span
              className={`px-3 py-1 rounded-xl border-[2px] ${diff.border} ${diff.bg} ${diff.text} text-xs font-black`}
            >
              {data.difficulty}
            </span>
          </div>
        </div>

        {/* Title & Desc */}
        <h3 className="text-2xl font-black text-[var(--color-text-accent-dark)] mb-2">
          {data.title}
        </h3>
        <p className="text-sm font-bold text-[var(--color-text-accent-dark)]/80 mb-4 leading-relaxed">
          {data.description}
        </p>

        {/* Before / After Split Preview */}
        {(data.beforeImage || data.afterImage) && (
          <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden border-[2.5px] border-[var(--color-text-accent-dark)] shadow-[3px_3px_0px_var(--color-text-accent-dark)] mb-4">
            <div className="relative aspect-square bg-gray-100">
              {data.beforeImage
                ? <img src={data.beforeImage} alt="Before" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-xs font-black text-black/40">No before photo</div>}
              <span className="absolute bottom-2 left-2 bg-white/90 border border-[var(--color-text-accent-dark)] px-2 py-0.5 rounded text-[10px] font-black">
                🗑️ Before
              </span>
            </div>
            <div className="relative aspect-square bg-gray-100">
              {data.afterImage
                ? <img src={data.afterImage} alt="After" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-xs font-black text-black/40">No after photo</div>}
              <span className="absolute bottom-2 left-2 bg-[var(--color-primary)] text-white border border-[var(--color-text-accent-dark)] px-2 py-0.5 rounded text-[10px] font-black">
                ✨ After
              </span>
            </div>
          </div>
        )}

        {/* Info stats */}
        <div className="p-3.5 bg-[var(--color-background)] rounded-xl border-[2px] border-[var(--color-text-accent-dark)] flex flex-wrap items-center justify-between gap-2 text-xs font-black">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[var(--color-secondary)]" />
              {data.timeTaken}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              {data.cost}
            </span>
          </div>
          <span className="text-[var(--color-primary)]">
            0 Likes • 0 Views • 0 Implementations
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" size="md" onClick={onPrev} icon={<ArrowLeft className="w-4 h-4" />}>
          Back to Edit
        </Button>
        <Button
          variant="primary"
          size="lg"
          disabled={publishing}
          onClick={onPublish}
          icon={<Sparkles className="w-5 h-5 text-[#FFD166]" />}
        >
          {publishing ? 'Publishing to Community...' : '🚀 Publish Upcycle Post'}
        </Button>
      </div>
    </div>
  );
};
