import React from 'react';
import { Project } from '../../types/project';
import { Trash2 } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  onDelete?: (project: Project) => void;
  className?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelect,
  onDelete,
  className = '',
}) => {
  // Color fallback if not explicitly set
  const baseBg = project.cardBgColor || '#98EECC';

  return (
    <div
      onClick={() => onSelect(project)}
      className={`border-[2.5px] border-black rounded-[24px] shadow-[6px_6px_0px_#000] overflow-hidden flex flex-col justify-between transition-all duration-150 cursor-pointer select-none hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_#000] bg-white group ${className}`}
    >
      {/* Top Media Thumbnail Container with Badges */}
      <div className="relative aspect-[4/3] w-full overflow-hidden border-b-[2.5px] border-black bg-gray-100">
        <img
          src={project.coverImage}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Material pill tag (Top-Left) */}
        <div className="absolute top-2.5 left-2.5">
          <span className="px-3 py-0.5 bg-white border-[2px] border-black rounded-full text-[10px] font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_#000] inline-block">
            {project.material}
          </span>
        </div>

        {/* Difficulty pill tag (Top-Right) */}
        <div className="absolute top-2.5 right-2.5">
          <span className="px-3 py-0.5 bg-[#FDA4AF] border-[2px] border-black rounded-full text-[10px] font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_#000] inline-block">
            {project.difficulty}
          </span>
        </div>

        {/* Delete Button (Bottom-Right) */}
        {onDelete && (
          <div className="absolute bottom-2.5 right-2.5 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project);
              }}
              className="p-2 bg-white border-[2px] border-[#FF6B6B] rounded-xl text-[#FF6B6B] shadow-[2px_2px_0px_#FF6B6B] hover:bg-[#FF6B6B]/10 active:translate-y-0.5 active:shadow-[0px_0px_0px_#FF6B6B] transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Solid Colored Card Base - exactly matching Image 4 */}
      <div
        className="p-4 sm:p-5 flex-1 flex flex-col justify-between"
        style={{ backgroundColor: baseBg }}
      >
        <div>
          {/* Title and Time Row */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-black text-base sm:text-lg tracking-wide text-black uppercase truncate">
              {project.title}
            </h3>
            <span className="px-2.5 py-0.5 bg-white border-[2px] border-black rounded-full text-[11px] font-black text-black shrink-0 shadow-[1.5px_1.5px_0px_#000]">
              {project.timeRequired}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs font-bold text-black/85 line-clamp-2 mt-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Bottom Specs: Cost and KG Saved */}
        <div className="mt-4 pt-2.5 flex items-center justify-between text-xs font-black text-black">
          <span>{project.estimatedCost || '$0'}</span>
          <span className="uppercase tracking-wider">{project.wasteSaved || '0.5 KG SAVED'}</span>
        </div>
      </div>
    </div>
  );
};
