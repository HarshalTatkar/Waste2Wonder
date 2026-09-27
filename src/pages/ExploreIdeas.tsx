import React, { useState, useEffect } from 'react';
import { ProjectCard } from '../components/explore/ProjectCard';
import { FilterBar } from '../components/explore/FilterBar';
import { useFilter } from '../hooks/useFilter';
import { Project } from '../types/project';
import mockProjectsData from '../data/mockProjects.json';
import { Compass, Sparkles, FolderX } from 'lucide-react';
import { Button } from '../components/common/Button';

interface ExploreIdeasProps {
  onNavigate: (page: string, params?: any) => void;
  initialMaterial?: string;
  initialMaterials?: string[];
}

export const ExploreIdeas: React.FC<ExploreIdeasProps> = ({
  onNavigate,
  initialMaterial,
  initialMaterials,
}) => {
  const [projects] = useState<Project[]>(mockProjectsData as unknown as Project[]);
  const {
    filters,
    setFilterField,
    toggleMaterial,
    resetFilters,
    filteredProjects,
  } = useFilter(projects);

  // Apply initial filters passed from props (e.g. from MaterialsIHave or Hero)
  useEffect(() => {
    if (initialMaterials && initialMaterials.length > 0) {
      setFilterField('selectedMaterials', initialMaterials);
    } else if (initialMaterial) {
      setFilterField('selectedMaterials', [initialMaterial]);
    }
  }, [initialMaterial, initialMaterials]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border-[2px] border-black rounded-full text-xs font-black shadow-[2px_2px_0px_#000] uppercase tracking-wider mb-2">
          <Compass className="w-3.5 h-3.5" />
          <span>Upcycling Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-black tracking-tight uppercase">
          EXPLORE UPCYCLING IDEAS
        </h1>
        <p className="text-sm sm:text-base font-bold text-black/75 mt-1 max-w-2xl">
          Browse tested maker builds, video guides, and AI-generated projects. Filter by material, time, or difficulty.
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onSearchChange={(q) => setFilterField('searchQuery', q)}
        onToggleMaterial={toggleMaterial}
        onDifficultyChange={(d) => setFilterField('selectedDifficulty', d)}
        onSortChange={(s) => setFilterField('sortBy', s)}
        onReset={resetFilters}
        totalResults={filteredProjects.length}
      />

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={(p) => onNavigate('craft-detail', { project: p })}
            />
          ))}
        </div>
      ) : (
        <div className="neu-card bg-white border-[3px] border-[var(--color-text-accent-dark)] shadow-[6px_6px_0px_var(--color-text-accent-dark)] rounded-3xl p-12 text-center my-12 max-w-md mx-auto">
          <FolderX className="w-12 h-12 mx-auto text-[var(--color-secondary)] mb-3" />
          <h3 className="text-xl font-black text-[var(--color-text-accent-dark)] mb-2">
            No matching crafts found
          </h3>
          <p className="text-xs sm:text-sm font-bold text-[var(--color-text-accent-dark)]/70 mb-5">
            Try adjusting your search keywords or resetting material filters to see all available ideas.
          </p>
          <Button variant="secondary" size="sm" onClick={resetFilters}>
            Reset All Filters
          </Button>
        </div>
      )}
    </div>
  );
};
