import { useState, useMemo } from 'react';
import { Project } from '../types/project';

export interface FilterState {
  searchQuery: string;
  selectedMaterials: string[];
  selectedDifficulty: string;
  sortBy: 'popular' | 'newest' | 'implementations';
}

export function useFilter(projects: Project[]) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedMaterials: [],
    selectedDifficulty: 'All',
    sortBy: 'popular',
  });

  const setFilterField = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleMaterial = (mat: string) => {
    setFilters((prev) => {
      const exists = prev.selectedMaterials.includes(mat);
      return {
        ...prev,
        selectedMaterials: exists
          ? prev.selectedMaterials.filter((m) => m !== mat)
          : [...prev.selectedMaterials, mat],
      };
    });
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      selectedMaterials: [],
      selectedDifficulty: 'All',
      sortBy: 'popular',
    });
  };

  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        // Search query
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchTitle = project.title.toLowerCase().includes(q);
          const matchDesc = project.description.toLowerCase().includes(q);
          const matchMaterial = project.material.toLowerCase().includes(q);
          const matchTags = project.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchMaterial && !matchTags) {
            return false;
          }
        }

        // Materials
        if (filters.selectedMaterials.length > 0) {
          if (!filters.selectedMaterials.includes(project.material)) {
            return false;
          }
        }

        // Difficulty
        if (filters.selectedDifficulty !== 'All') {
          if (project.difficulty !== filters.selectedDifficulty) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'popular') {
          return b.likes - a.likes;
        }
        if (filters.sortBy === 'implementations') {
          return b.implementationsCount - a.implementationsCount;
        }
        if (filters.sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      });
  }, [projects, filters]);

  return {
    filters,
    setFilterField,
    toggleMaterial,
    resetFilters,
    filteredProjects,
  };
}
