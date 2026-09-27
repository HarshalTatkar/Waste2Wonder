import React from 'react';
import { Project } from '../../types/project';
import { MaterialTag } from '../common/MaterialTag';
import { Clock, DollarSign, Heart, Eye, CheckCircle2, Video, Sparkles, User } from 'lucide-react';
import { formatCount, getDifficultyColor } from '../../utils/formatters';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  className?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelect,
  className = '',
}) => {
  const diffColor = getDifficultyColor(project.difficulty);

  const getSourceBadge = () => {
    if (project.source === 'in_app') {
      return (
        <span className="px-2.5 py-1 bg-white border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] rounded-lg text-[11px] font-black text-[var(--color-text-accent-dark)] flex items-center gap-1">
          <User className="w-3 h-3 text-[var(--color-primary)]" />
          <span>In-App Post</span>
        </span>
      );
    }
    if (project.source === 'youtube') {
      return (
        <span className="px-2.5 py-1 bg-[#FF6B6B] border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] rounded-lg text-[11px] font-black text-white flex items-center gap-1">
          <Video className="w-3 h-3 fill-current" />
          <span>YouTube Video</span>
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 bg-[#FFD166] border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] rounded-lg text-[11px] font-black text-[#3A3A3A] flex items-center gap-1">
        <Sparkles className="w-3 h-3 text-[#C97C5D]" />
        <span>AI Generated</span>
      </span>
    );
  };

  return (
    <div
      onClick={() => onSelect(project)}
      className={`neu-card bg-white border-[2.5px] border-[var(--color-text-accent-dark)] shadow-[4px_4px_0px_var(--color-text-accent-dark)] rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-150 cursor-pointer select-none hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_var(--color-text-accent-dark)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_var(--color-text-accent-dark)] group ${className}`}
    >
      {/* Top Media Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden border-b-[2.5px] border-[var(--color-text-accent-dark)] bg-gray-100">
        <img
          src={project.coverImage}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Source badge overlay */}
        <div className="absolute top-2.5 left-2.5">
          {getSourceBadge()}
        </div>

        {/* Difficulty badge */}
        <div className="absolute top-2.5 right-2.5">
          <span
            className={`px-2 py-0.5 rounded-lg border-[2px] ${diffColor.border} ${diffColor.bg} ${diffColor.text} text-[10px] font-black tracking-wider uppercase shadow-[2px_2px_0px_var(--color-text-accent-dark)]`}
          >
            {project.difficulty}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Material & Time pills */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <MaterialTag label={project.material} size="sm" />
            <div className="flex items-center gap-1.5 text-xs font-black text-[var(--color-text-accent-dark)]/75">
              <Clock className="w-3.5 h-3.5 text-[var(--color-secondary)]" />
              <span>{project.timeRequired}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-black text-lg text-[var(--color-text-accent-dark)] line-clamp-2 leading-tight group-hover:text-[var(--color-secondary)] transition-colors">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-xs font-bold text-[var(--color-text-accent-dark)]/75 line-clamp-2 mt-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Footer: Stats & Implementation count */}
        <div className="mt-4 pt-3 border-t-[2px] border-[var(--color-text-accent-dark)]/15 flex items-center justify-between text-xs font-black text-[var(--color-text-accent-dark)]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 hover:text-[var(--color-secondary)]">
              <Heart className="w-3.5 h-3.5" />
              {formatCount(project.likes)}
            </span>
            <span className="flex items-center gap-1 text-[var(--color-text-accent-dark)]/70">
              <Eye className="w-3.5 h-3.5" />
              {formatCount(project.views)}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[var(--color-primary)] bg-[var(--color-background)] px-2 py-1 rounded-md border border-[var(--color-text-accent-dark)]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{project.implementationsCount} tried</span>
          </div>
        </div>
      </div>
    </div>
  );
};
