import React, { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'sage' | 'terracotta' | 'cream' | 'default';
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  variant = 'default',
  onClick,
}) => {
  // Reserved strictly for floating elements and banners hovering above brutalist surfaces
  let tintStyles = 'bg-[var(--color-background)]/80 border-[var(--color-primary)]/40 text-[var(--color-text-accent-dark)]';
  
  if (variant === 'sage') {
    tintStyles = 'bg-[var(--color-primary)]/15 border-[var(--color-primary)]/50 text-[var(--color-text-accent-dark)]';
  } else if (variant === 'terracotta') {
    tintStyles = 'bg-[var(--color-secondary)]/15 border-[var(--color-secondary)]/50 text-[var(--color-text-accent-dark)]';
  } else if (variant === 'cream') {
    tintStyles = 'bg-[#F5F1E8]/90 border-[var(--color-secondary)]/30 text-[var(--color-text-accent-dark)]';
  }

  return (
    <div
      onClick={onClick}
      className={`backdrop-blur-md border shadow-[0_10px_30px_rgba(58,58,58,0.12)] rounded-2xl ${tintStyles} ${className}`}
    >
      {children}
    </div>
  );
};
