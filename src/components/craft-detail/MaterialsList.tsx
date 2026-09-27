import React, { useState } from 'react';
import { CheckSquare, Square, PackageCheck } from 'lucide-react';

interface MaterialsListProps {
  materials: string[];
}

export const MaterialsList: React.FC<MaterialsListProps> = ({ materials }) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="bg-white border-[2.5px] border-[var(--color-text-accent-dark)] shadow-[4px_4px_0px_var(--color-text-accent-dark)] rounded-2xl p-6 my-6">
      <div className="flex items-center justify-between pb-3 mb-4 border-b-[2px] border-[var(--color-text-accent-dark)]/20">
        <div className="flex items-center gap-2">
          <PackageCheck className="w-5 h-5 text-[var(--color-primary)] stroke-[2.5]" />
          <h3 className="font-black text-xl text-[var(--color-text-accent-dark)]">
            Required Materials & Tools
          </h3>
        </div>
        <span className="text-xs font-bold text-[var(--color-text-accent-dark)]/70">
          Check off what you have
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {materials.map((mat, idx) => {
          const isChecked = !!checkedItems[idx];
          return (
            <div
              key={idx}
              onClick={() => toggleCheck(idx)}
              className={`flex items-start gap-3 p-3 rounded-xl border-[2px] transition-all cursor-pointer select-none ${
                isChecked
                  ? 'bg-[#EBF0E4] border-[var(--color-primary)] shadow-none translate-x-[1px] translate-y-[1px]'
                  : 'bg-[var(--color-background)] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--color-text-accent-dark)]'
              }`}
            >
              <div className="mt-0.5 text-[var(--color-text-accent-dark)] shrink-0">
                {isChecked ? (
                  <CheckSquare className="w-5 h-5 text-[var(--color-primary)] stroke-[2.5]" />
                ) : (
                  <Square className="w-5 h-5 stroke-[2]" />
                )}
              </div>
              <span
                className={`text-sm font-bold leading-tight ${
                  isChecked
                    ? 'line-through text-[var(--color-text-accent-dark)]/50'
                    : 'text-[var(--color-text-accent-dark)]'
                }`}
              >
                {mat}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
