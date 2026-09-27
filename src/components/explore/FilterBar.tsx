import React from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { MaterialTag } from '../common/MaterialTag';
import { FilterState } from '../../hooks/useFilter';

interface FilterBarProps {
  filters: FilterState;
  onSearchChange: (q: string) => void;
  onToggleMaterial: (mat: string) => void;
  onDifficultyChange: (diff: string) => void;
  onSortChange: (sort: 'popular' | 'newest' | 'implementations') => void;
  onReset: () => void;
  totalResults: number;
}

const ALL_MATERIALS = [
  'Plastic',
  'Paper-Cardboard',
  'Fabric',
  'Glass',
  'E-waste',
  'Metal',
];

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onSearchChange,
  onToggleMaterial,
  onDifficultyChange,
  onSortChange,
  onReset,
  totalResults,
}) => {
  return (
    <div className="neu-card bg-white border-[2.5px] border-[var(--color-text-accent-dark)] shadow-[4px_4px_0px_var(--color-text-accent-dark)] rounded-2xl p-5 sm:p-6 mb-8">
      {/* Top Search & Sort Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-5 border-b-[2px] border-[var(--color-text-accent-dark)]/20">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-accent-dark)]/60" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by waste item, keyword, or craft name (e.g. tote bag, planter, denim)..."
            className="w-full pl-11 pr-4 py-2.5 bg-[var(--color-background)] rounded-xl border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] text-sm font-bold text-[var(--color-text-accent-dark)] focus:outline-none focus:bg-white"
          />
        </div>

        {/* Sort and Reset controls */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <div className="flex items-center gap-1.5 text-xs font-black text-[var(--color-text-accent-dark)]">
            <SlidersHorizontal className="w-4 h-4 text-[var(--color-secondary)]" />
            <span>Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                onSortChange(e.target.value as 'popular' | 'newest' | 'implementations')
              }
              className="px-3 py-2 bg-white rounded-xl border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] font-bold text-xs cursor-pointer focus:outline-none"
            >
              <option value="popular">Most Popular</option>
              <option value="implementations">Most Implemented</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          <button
            onClick={onReset}
            className="p-2 rounded-xl border-[2px] border-[var(--color-text-accent-dark)] bg-[var(--color-background)] hover:bg-[#FF6B6B]/20 text-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Materials Chip Row */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-black uppercase tracking-wider text-[var(--color-text-accent-dark)]/80 mr-1">
          Materials:
        </span>
        {ALL_MATERIALS.map((mat) => {
          const isSelected = filters.selectedMaterials.includes(mat);
          return (
            <MaterialTag
              key={mat}
              label={mat}
              selected={isSelected}
              onClick={() => onToggleMaterial(mat)}
              size="sm"
            />
          );
        })}
      </div>

      {/* Difficulty & Result count row */}
      <div className="mt-4 pt-4 border-t border-[var(--color-text-accent-dark)]/15 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-black uppercase tracking-wider text-[var(--color-text-accent-dark)]/80">
            Difficulty:
          </span>
          <div className="inline-flex rounded-xl border-[2px] border-[var(--color-text-accent-dark)] p-0.5 bg-[var(--color-background)] shadow-[2px_2px_0px_var(--color-text-accent-dark)]">
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff}
                onClick={() => onDifficultyChange(diff)}
                className={`px-2.5 py-1 rounded-lg font-black transition-all cursor-pointer ${
                  filters.selectedDifficulty === diff
                    ? 'bg-[var(--color-primary)] text-white shadow-xs'
                    : 'text-[var(--color-text-accent-dark)] hover:text-black'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        <div className="font-black text-[var(--color-text-accent-dark)] bg-[var(--color-background)] px-3 py-1 rounded-lg border border-[var(--color-text-accent-dark)]">
          Showing <span className="text-[var(--color-secondary)]">{totalResults}</span> craft projects
        </div>
      </div>
    </div>
  );
};
