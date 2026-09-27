import React from 'react';
import { Sparkles, Recycle, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-20 border-t-[3.5px] border-[var(--color-text-accent-dark)] bg-white/90 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[var(--color-secondary)] border-[2.5px] border-[var(--color-text-accent-dark)] shadow-[3px_3px_0px_var(--color-text-accent-dark)] flex items-center justify-center text-white">
                <Recycle className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-black text-2xl tracking-tight text-[var(--color-text-accent-dark)]">
                Waste<span className="text-[var(--color-primary)]">2</span>Wonder
              </span>
            </div>
            <p className="text-sm font-bold text-[var(--color-text-accent-dark)]/80 max-w-md">
              A high-voltage, creative neubrutalism upcycling platform transforming household waste into functional crafts and fine art through smart AI vision, community wisdom, and weekly creative challenges.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-3 py-1 bg-[var(--color-background)] border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] rounded-lg text-xs font-black">
                🌱 100% Zero-Landfill Mission
              </span>
              <span className="px-3 py-1 bg-[#FFF6E0] border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] rounded-lg text-xs font-black">
                🎨 Neubrutalist Engine
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2.5">
            <h4 className="font-black text-base uppercase tracking-wider text-[var(--color-text-accent-dark)]">
              Explore Crafting
            </h4>
            <ul className="space-y-2 text-sm font-bold text-[var(--color-text-accent-dark)]/80">
              <li>
                <button
                  onClick={() => onNavigate('scan')}
                  className="hover:text-[var(--color-primary)] hover:underline cursor-pointer"
                >
                  AI Image Analysis & Scan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('materials')}
                  className="hover:text-[var(--color-primary)] hover:underline cursor-pointer"
                >
                  Materials I Have (Inverse Search)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-[var(--color-primary)] hover:underline cursor-pointer"
                >
                  Ranked Ideas Library
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contest')}
                  className="hover:text-[var(--color-secondary)] hover:underline cursor-pointer"
                >
                  Weekly Contest (Max 100 Entries)
                </button>
              </li>
            </ul>
          </div>

          {/* Community & Impact */}
          <div className="flex flex-col gap-2.5">
            <h4 className="font-black text-base uppercase tracking-wider text-[var(--color-text-accent-dark)]">
              Community & Impact
            </h4>
            <ul className="space-y-2 text-sm font-bold text-[var(--color-text-accent-dark)]/80">
              <li>
                <button
                  onClick={() => onNavigate('community')}
                  className="hover:text-[var(--color-primary)] hover:underline cursor-pointer"
                >
                  Maker Community Feed
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('create-post')}
                  className="hover:text-[var(--color-primary)] hover:underline cursor-pointer"
                >
                  Post Your Own Upcycle
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('profile')}
                  className="hover:text-[var(--color-primary)] hover:underline cursor-pointer"
                >
                  Your Environmental Footprint
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t-[2px] border-[var(--color-text-accent-dark)]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-black text-[var(--color-text-accent-dark)]/70">
          <p>© 2026 Waste2Wonder. Hybrid Neubrutalism + Glassmorphism Design System.</p>
          <div className="flex items-center gap-1.5 bg-[var(--color-background)] px-3 py-1.5 rounded-lg border-[1.5px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)]">
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-secondary)]" />
            <span>Built with creative energy & pure upcycling passion</span>
            <Heart className="w-3.5 h-3.5 text-[#FF6B6B] fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
};
