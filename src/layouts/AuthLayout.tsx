import React, { ReactNode } from 'react';
import { AnimatedBackground } from '../components/home/AnimatedBackground';
import { Sparkles, Recycle } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  onHomeClick?: () => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, onHomeClick }) => {
  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center p-4 sm:p-6 bg-[var(--color-background)] selection:bg-[var(--color-secondary)] selection:text-white">
      {/* Live Mandala Background */}
      <AnimatedBackground />

      {/* Header Logo */}
      <div
        onClick={onHomeClick}
        className="relative z-10 mb-8 flex items-center gap-3 cursor-pointer select-none"
      >
        <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)] border-[3px] border-[var(--color-text-accent-dark)] shadow-[4px_4px_0px_var(--color-text-accent-dark)] flex items-center justify-center text-white">
          <Recycle className="w-7 h-7 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[var(--color-text-accent-dark)]">
            Waste<span className="text-[var(--color-secondary)]">2</span>Wonder
          </h1>
          <p className="text-xs font-black uppercase tracking-wider text-[var(--color-primary)]">
            Zero-Waste Creative Studio
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>

      {/* Footer minimal info */}
      <div className="relative z-10 mt-8 text-center text-xs font-bold text-[var(--color-text-accent-dark)]/70">
        © 2026 Waste2Wonder • All rights reserved
      </div>
    </div>
  );
};
