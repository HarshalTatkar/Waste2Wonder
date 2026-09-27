import React from 'react';
import { useCountdown } from '../../hooks/useCountdown';

interface CountdownTimerProps {
  targetDate?: string;
  variant?: 'neubrutalist' | 'compact' | 'glass';
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  variant = 'neubrutalist',
}) => {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  const units = [
    { label: 'D', value: days },
    { label: 'H', value: hours },
    { label: 'M', value: minutes },
    { label: 'S', value: seconds },
  ];

  if (variant === 'compact') {
    return (
      <div className="inline-flex items-center gap-1 font-mono font-black text-sm bg-white/80 px-2.5 py-1 rounded-md border border-[var(--color-text-accent-dark)]">
        <span>{String(days).padStart(2, '0')}d</span>:
        <span>{String(hours).padStart(2, '0')}h</span>:
        <span>{String(minutes).padStart(2, '0')}m</span>:
        <span className="text-[var(--color-secondary)]">{String(seconds).padStart(2, '0')}s</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {units.map((u, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white border-[2.5px] border-[var(--color-text-accent-dark)] shadow-[3px_3px_0px_var(--color-text-accent-dark)] rounded-xl flex items-center justify-center text-lg sm:text-xl font-black font-mono text-[var(--color-text-accent-dark)]">
            {String(u.value).padStart(2, '0')}
          </div>
          <span className="text-[10px] sm:text-xs font-black tracking-wider text-[var(--color-text-accent-dark)] uppercase mt-1">
            {u.label === 'D' ? 'Days' : u.label === 'H' ? 'Hours' : u.label === 'M' ? 'Mins' : 'Secs'}
          </span>
        </div>
      ))}
    </div>
  );
};
