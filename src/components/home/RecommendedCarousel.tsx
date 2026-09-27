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
    <section className="relative z-10 my-14 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Header with Title and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
        <div className="text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border-[2px] border-black shadow-[2px_2px_0px_#000] rounded-full text-xs font-black text-black mb-2 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>COMMUNITY PICKS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight uppercase">
            FEATURED UPCYCLE PROJECTS
          </h2>
          <p className="text-sm font-bold text-black/75 mt-0.5">
            Tested maker builds with step-by-step instructions and verified material savings.
          </p>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={prev}
            disabled={!hasPrev}
            className={`p-2.5 rounded-full border-[2px] border-black bg-white text-black shadow-[2px_2px_0px_#000] transition-all ${
              !hasPrev
                ? 'opacity-40 cursor-not-allowed shadow-none'
                : 'hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer'
            }`}
            aria-label="Previous project"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <button
            onClick={next}
            disabled={!hasNext}
            className={`p-2.5 rounded-full border-[2px] border-black bg-white text-black shadow-[2px_2px_0px_#000] transition-all ${
              !hasNext
                ? 'opacity-40 cursor-not-allowed shadow-none'
                : 'hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer'
            }`}
            aria-label="Next project"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
          <button
            onClick={onExploreMore}
            className="hidden md:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border-[2px] border-black bg-white text-black font-black text-xs shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer transition-all ml-1.5"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
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
            className="w-[280px] sm:w-[320px] md:w-[340px] shrink-0"
            style={{ scrollSnapAlign: 'start' }}
          >
            <ProjectCard project={proj} onSelect={onSelectProject} />
          </div>
        ))}
      </div>
    </section>
  );
};
