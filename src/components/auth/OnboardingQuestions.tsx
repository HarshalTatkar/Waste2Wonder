import React from 'react';
import { Check } from 'lucide-react';

interface OnboardingQuestionsProps {
  selectedWasteTypes: string[];
  onToggleWasteType: (type: string) => void;
  selectedGoal: string;
  onSelectGoal: (goal: string) => void;
}

const WASTE_OPTIONS = [
  'Plastic',
  'Paper-Cardboard',
  'Glass',
  'Fabric',
  'E-waste',
  'Metal',
  'Other',
];

const GOAL_OPTIONS = [
  'Reduce waste',
  'Learn upcycling',
  'Join contests & community',
  'Just exploring',
];

export const OnboardingQuestions: React.FC<OnboardingQuestionsProps> = ({
  selectedWasteTypes,
  onToggleWasteType,
  selectedGoal,
  onSelectGoal,
}) => {
  return (
    <div className="space-y-6 pt-4 border-t-[2px] border-[var(--color-text-accent-dark)]/20 text-left">
      {/* Waste Types Question (Multi-select) */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-[var(--color-text-accent-dark)] mb-2">
          What kind of waste do you usually deal with? (Multi-select) *
        </label>
        <div className="flex flex-wrap gap-2">
          {WASTE_OPTIONS.map((w) => {
            const isSelected = selectedWasteTypes.includes(w);
            return (
              <button
                key={w}
                type="button"
                onClick={() => onToggleWasteType(w)}
                className={`px-3 py-1.5 rounded-xl border-[2px] border-[var(--color-text-accent-dark)] text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--color-primary)] text-white shadow-[2px_2px_0px_var(--color-text-accent-dark)] translate-x-[1px] translate-y-[1px]'
                    : 'bg-[var(--color-background)] text-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] hover:bg-white'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                <span>{w}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Goal Question (Single-select) */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-[var(--color-text-accent-dark)] mb-2">
          Your main goal here? (Single-select) *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {GOAL_OPTIONS.map((g) => {
            const isSelected = selectedGoal === g;
            return (
              <button
                key={g}
                type="button"
                onClick={() => onSelectGoal(g)}
                className={`p-3 rounded-xl border-[2px] border-[var(--color-text-accent-dark)] text-xs font-black text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--color-secondary)] text-white shadow-[2px_2px_0px_var(--color-text-accent-dark)] translate-x-[1px] translate-y-[1px]'
                    : 'bg-[var(--color-background)] text-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] hover:bg-white'
                }`}
              >
                <span>{g}</span>
                {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
