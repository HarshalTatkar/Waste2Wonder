import React from 'react';
import { EnvironmentalImpact } from '../../types/user';
import { Leaf, Recycle, Wind, Trees, Award } from 'lucide-react';

interface ImpactPanelProps {
  impact: EnvironmentalImpact;
}

export const ImpactPanel: React.FC<ImpactPanelProps> = ({ impact }) => {
  const metrics = [
    {
      label: 'Materials Reused',
      value: `${impact.materialsReusedKg} kg`,
      icon: <Recycle className="w-5 h-5 text-[var(--color-primary)] stroke-[2.5]" />,
      bg: 'bg-[#EBF0E4]',
      desc: 'Solid diverted detritus',
    },
    {
      label: 'Waste Prevented',
      value: `${impact.wastePreventedItems} units`,
      icon: <Leaf className="w-5 h-5 text-[var(--color-secondary)] stroke-[2.5]" />,
      bg: 'bg-[#F9EDE7]',
      desc: 'Items spared from landfill',
    },
    {
      label: 'Carbon Abated',
      value: `${impact.carbonSavedKg} kg`,
      icon: <Wind className="w-5 h-5 text-[#3A3A3A] stroke-[2.5]" />,
      bg: 'bg-[#FFF6E0]',
      desc: 'CO2e emissions prevented',
    },
    {
      label: 'Tree Equivalent',
      value: `${impact.treesEquivalent} trees`,
      icon: <Trees className="w-5 h-5 text-[var(--color-primary)] stroke-[2.5]" />,
      bg: 'bg-[#E0F4F2]',
      desc: 'Annual carbon absorption',
    },
  ];

  return (
    <div className="neu-card bg-white border-[3px] border-[var(--color-text-accent-dark)] shadow-[6px_6px_0px_var(--color-text-accent-dark)] rounded-3xl p-6 sm:p-8 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-6 border-b-[2px] border-[var(--color-text-accent-dark)]/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[var(--color-primary)] text-white border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)]">
            <Award className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[var(--color-text-accent-dark)]">
              Your Environmental Impact
            </h3>
            <p className="text-xs sm:text-sm font-bold text-[var(--color-text-accent-dark)]/70">
              Verified metric tally updated with every finished upcycling craft upload
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-[var(--color-primary)] text-white text-xs font-black rounded-lg border border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)]">
          Zero-Landfill Verified
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className={`${m.bg} border-[2px] border-[var(--color-text-accent-dark)] shadow-[3px_3px_0px_var(--color-text-accent-dark)] rounded-2xl p-5 flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-[var(--color-text-accent-dark)]/80">
                {m.label}
              </span>
              <div className="p-1.5 rounded-lg bg-white border border-[var(--color-text-accent-dark)] shadow-xs">
                {m.icon}
              </div>
            </div>

            <div>
              <p className="text-2xl sm:text-3xl font-black text-[var(--color-text-accent-dark)]">
                {m.value}
              </p>
              <p className="text-[11px] font-bold text-[var(--color-text-accent-dark)]/70 mt-0.5">
                {m.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
