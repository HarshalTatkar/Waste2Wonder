import React from 'react';
import { Clock, DollarSign, BarChart2, Layers } from 'lucide-react';
import { getDifficultyColor } from '../../utils/formatters';

interface InfoStatsRowProps {
  timeRequired: string;
  estimatedCost: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  material: string;
  isAiGeneratedLabel?: boolean;
}

export const InfoStatsRow: React.FC<InfoStatsRowProps> = ({
  timeRequired,
  estimatedCost,
  difficulty,
  material,
  isAiGeneratedLabel = false,
}) => {
  const diff = getDifficultyColor(difficulty);

  const stats = [
    {
      label: 'Time Required',
      value: timeRequired,
      icon: <Clock className="w-5 h-5 text-[var(--color-secondary)]" />,
      sub: isAiGeneratedLabel ? 'AI Estimate' : 'Verified',
    },
    {
      label: 'Estimated Cost',
      value: estimatedCost,
      icon: <DollarSign className="w-5 h-5 text-[var(--color-primary)]" />,
      sub: 'Materials cost',
    },
    {
      label: 'Difficulty',
      value: difficulty,
      icon: <BarChart2 className="w-5 h-5 text-[#3A3A3A]" />,
      badge: true,
    },
    {
      label: 'Core Material',
      value: material,
      icon: <Layers className="w-5 h-5 text-[#70C1B3]" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
      {stats.map((s, idx) => (
        <div
          key={idx}
          className="bg-white border-[2.5px] border-[var(--color-text-accent-dark)] shadow-[3px_3px_0px_var(--color-text-accent-dark)] rounded-2xl p-4 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[var(--color-text-accent-dark)]/70">
              {s.label}
            </span>
            <div className="p-1.5 rounded-lg bg-[var(--color-background)] border border-[var(--color-text-accent-dark)]">
              {s.icon}
            </div>
          </div>

          <div>
            {s.badge ? (
              <span
                className={`inline-block px-2.5 py-1 rounded-lg border-[2px] ${diff.border} ${diff.bg} ${diff.text} font-black text-sm shadow-[2px_2px_0px_var(--color-text-accent-dark)]`}
              >
                {s.value}
              </span>
            ) : (
              <p className="font-black text-lg text-[var(--color-text-accent-dark)]">
                {s.value}
              </p>
            )}
            {s.sub && (
              <span className="text-[10px] font-bold text-[var(--color-text-accent-dark)]/60">
                {s.sub}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
