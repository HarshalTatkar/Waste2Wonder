import React from 'react';

interface MaterialTagProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md';
}

export const MaterialTag: React.FC<MaterialTagProps> = ({
  label,
  selected = false,
  onClick,
  className = '',
  size = 'md',
}) => {
  // Map materials to distinctive flat color fills
  const getFill = (mat: string) => {
    switch (mat.toLowerCase()) {
      case 'plastic':
        return selected ? 'bg-[#70C1B3] text-black' : 'bg-[#E0F4F2] text-[#3A3A3A]';
      case 'fabric':
        return selected ? 'bg-[var(--color-primary)] text-white' : 'bg-[#EBF0E4] text-[#3A3A3A]';
      case 'paper-cardboard':
      case 'cardboard':
        return selected ? 'bg-[var(--color-secondary)] text-white' : 'bg-[#F9EDE7] text-[#3A3A3A]';
      case 'glass':
        return selected ? 'bg-[#FFD166] text-black' : 'bg-[#FFF6E0] text-[#3A3A3A]';
      case 'e-waste':
        return selected ? 'bg-[#CDB4DB] text-black' : 'bg-[#F4EDF8] text-[#3A3A3A]';
      case 'metal':
        return selected ? 'bg-[#A0C4FF] text-black' : 'bg-[#EDF4FF] text-[#3A3A3A]';
      default:
        return selected ? 'bg-[var(--color-text-accent-dark)] text-white' : 'bg-[var(--color-background)] text-[#3A3A3A]';
    }
  };

  const isClickable = !!onClick;
  const padding = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3.5 py-1.5 text-sm';

  return (
    <span
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      className={`inline-flex items-center font-bold tracking-tight rounded-lg border-[2px] border-[var(--color-text-accent-dark)] select-none ${getFill(
        label
      )} ${
        isClickable
          ? 'cursor-pointer transition-all duration-150 shadow-[2px_2px_0px_var(--color-text-accent-dark)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--color-text-accent-dark)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none'
          : 'shadow-[1.5px_1.5px_0px_var(--color-text-accent-dark)]'
      } ${padding} ${className}`}
    >
      {label}
    </span>
  );
};
