import React from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';

interface LoaderProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Loader: React.FC<LoaderProps> = ({
  label = 'Crafting waste into wonder...',
  size = 'md',
}) => {
  const boxDimensions = size === 'sm' ? 'p-3' : size === 'lg' ? 'p-8' : 'p-6';

  return (
    <div className="flex flex-col items-center justify-center p-6 gap-3">
      <div
        className={`neu-card bg-[var(--color-primary)] text-white border-[3px] border-[var(--color-text-accent-dark)] shadow-[5px_5px_0px_var(--color-text-accent-dark)] ${boxDimensions} flex items-center justify-center relative animate-bounce`}
      >
        <RefreshCw className="w-8 h-8 text-white animate-spin" />
        <Sparkles className="w-4 h-4 text-[#FFD166] absolute -top-2 -right-2 animate-pulse" />
      </div>
      {label && (
        <p className="font-extrabold text-sm sm:text-base tracking-tight text-[var(--color-text-accent-dark)]">
          {label}
        </p>
      )}
    </div>
  );
};
