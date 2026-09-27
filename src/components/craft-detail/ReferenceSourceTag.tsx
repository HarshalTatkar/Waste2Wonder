import React from 'react';
import { ProjectSource } from '../../types/project';
import { User, Video, Sparkles } from 'lucide-react';

interface ReferenceSourceTagProps {
  source: ProjectSource;
  authorName?: string;
}

export const ReferenceSourceTag: React.FC<ReferenceSourceTagProps> = ({
  source,
  authorName,
}) => {
  if (source === 'in_app') {
    return (
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border-[2px] border-[var(--color-text-accent-dark)] shadow-[3px_3px_0px_var(--color-text-accent-dark)] rounded-xl text-xs font-black text-[var(--color-text-accent-dark)]">
        <User className="w-4 h-4 text-[var(--color-primary)]" />
        <span>In-App Community Post by {authorName || 'Community Crafter'}</span>
      </div>
    );
  }

  if (source === 'youtube') {
    return (
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FF6B6B] border-[2px] border-[var(--color-text-accent-dark)] shadow-[3px_3px_0px_var(--color-text-accent-dark)] rounded-xl text-xs font-black text-white">
        <Video className="w-4 h-4 fill-current" />
        <span>YouTube Guide • AI-Generated Tutorial</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFD166] border-[2px] border-[var(--color-text-accent-dark)] shadow-[3px_3px_0px_var(--color-text-accent-dark)] rounded-xl text-xs font-black text-[#3A3A3A]">
      <Sparkles className="w-4 h-4 text-[#C97C5D]" />
      <span>AI Full Synthesis (No Direct Match Found)</span>
    </div>
  );
};
