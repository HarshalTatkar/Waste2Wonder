import React from 'react';
import { Layers, ArrowRight, Check } from 'lucide-react';
import { Button } from '../common/Button';
import { MaterialTag } from '../common/MaterialTag';

interface MaterialsIHaveWidgetProps {
  materials: string[];
  onToggleMaterial: (mat: string) => void;
  onFindIdeas: () => void;
}

const ALL_POSSIBLE_MATERIALS = [
  'Plastic',
  'Paper-Cardboard',
  'Glass',
  'Fabric',
  'E-waste',
  'Metal',
  'Leather',
  'Wood / Skateboard',
];

export const MaterialsIHaveWidget: React.FC<MaterialsIHaveWidgetProps> = ({
  materials,
  onToggleMaterial,
  onFindIdeas,
}) => {
  return (
    <div className="neu-card bg-white border-[3px] border-[var(--color-text-accent-dark)] shadow-[6px_6px_0px_var(--color-text-accent-dark)] rounded-3xl p-6 sm:p-8 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-6 border-b-[2px] border-[var(--color-text-accent-dark)]/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#70C1B3] text-black border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)]">
            <Layers className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[var(--color-text-accent-dark)]">
              "Materials I Have" Shortcut
            </h3>
            <p className="text-xs sm:text-sm font-bold text-[var(--color-text-accent-dark)]/70">
              Your quick stash inventory — tap to update what recyclables you currently hold
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={onFindIdeas}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Find Matching Crafts
        </Button>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {ALL_POSSIBLE_MATERIALS.map((mat) => {
          const isSelected = materials.includes(mat);
          return (
            <button
              key={mat}
              type="button"
              onClick={() => onToggleMaterial(mat)}
              className={`px-3.5 py-2 rounded-xl border-[2px] border-[var(--color-text-accent-dark)] text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[var(--color-primary)] text-white shadow-[3px_3px_0px_var(--color-text-accent-dark)]'
                  : 'bg-[var(--color-background)] text-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] hover:bg-white'
              }`}
            >
              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              <span>{mat}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
