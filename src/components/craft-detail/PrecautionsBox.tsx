import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

interface PrecautionsBoxProps {
  precautions: string[];
}

export const PrecautionsBox: React.FC<PrecautionsBoxProps> = ({ precautions }) => {
  if (!precautions || precautions.length === 0) return null;

  return (
    <div className="bg-[#FFF6E0] border-[2.5px] border-[var(--color-text-accent-dark)] shadow-[4px_4px_0px_var(--color-text-accent-dark)] rounded-2xl p-6 my-6">
      <div className="flex items-center gap-2.5 pb-3 mb-3 border-b-[2px] border-[var(--color-text-accent-dark)]/20">
        <div className="p-1 rounded-lg bg-[var(--color-secondary)] text-white border border-[var(--color-text-accent-dark)]">
          <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
        </div>
        <h3 className="font-black text-lg text-[var(--color-text-accent-dark)]">
          Safety Precautions & Handling Tips
        </h3>
      </div>

      <ul className="space-y-2.5">
        {precautions.map((p, idx) => (
          <li
            key={idx}
            className="flex items-start gap-2.5 text-xs sm:text-sm font-bold text-[var(--color-text-accent-dark)]"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--color-secondary)] mt-1.5 shrink-0" />
            <span className="leading-relaxed">{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
