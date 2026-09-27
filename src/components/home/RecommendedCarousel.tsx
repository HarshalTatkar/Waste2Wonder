import React from 'react';
import { Project } from '../../types/project';
import { ProjectCard } from '../explore/ProjectCard';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { useCarousel } from '../../hooks/useCarousel';

interface RecommendedCarouselProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onExploreMore: () => void;
}

export const RecommendedCarousel: React.FC<RecommendedCarouselProps> = ({
  projects,
  onSelectProject,
  onExploreMore,
}) => {
  const { containerRef, next, prev, hasPrev, hasNext } = useCarousel(projects);

  return (
    <section className="relative z-10 my-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header with Title and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF6E0] border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] rounded-lg text-xs font-black text-[var(--color-text-accent-dark)] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-secondary)]" />
            <span>COMMUNITY PICKS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[var(--color-text-accent-dark)] tracking-tight">
            RECOMMENDED PROJECTS
          </h2>
          <p className="text-sm font-bold text-[var(--color-text-accent-dark)]/75 mt-0.5">
            Curated top-performing upcycles tested and perfected by the maker community.
          </p>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={prev}
            disabled={!hasPrev}
            className={`p-2.5 rounded-xl border-[2.5px] border-[var(--color-text-accent-dark)] bg-white text-[var(--color-text-accent-dark)] shadow-[3px_3px_0px_var(--color-text-accent-dark)] transition-all ${
              !hasPrev
                ? 'opacity-40 cursor-not-allowed shadow-none'
                : 'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_var(--color-text-accent-dark)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer'
            }`}
            aria-label="Previous project"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <button
            onClick={next}
            disabled={!hasNext}
            className={`p-2.5 rounded-xl border-[2.5px] border-[var(--color-text-accent-dark)] bg-white text-[var(--color-text-accent-dark)] shadow-[3px_3px_0px_var(--color-text-accent-dark)] transition-all ${
              !hasNext
                ? 'opacity-40 cursor-not-allowed shadow-none'
                : 'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_var(--color-text-accent-dark)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer'
            }`}
            aria-label="Next project"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
          <button
            onClick={onExploreMore}
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-[2.5px] border-[var(--color-text-accent-dark)] bg-[var(--color-primary)] text-white font-extrabold text-sm shadow-[3px_3px_0px_var(--color-text-accent-dark)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_var(--color-text-accent-dark)] active:translate-y-0.5 cursor-pointer transition-all ml-2"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrolling Track */}
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth no-scrollbar"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="w-[280px] sm:w-[320px] md:w-[350px] shrink-0"
            style={{ scrollSnapAlign: 'start' }}
          >
            <ProjectCard project={proj} onSelect={onSelectProject} />
          </div>
        ))}
      </div>
    </section>
  );
};
