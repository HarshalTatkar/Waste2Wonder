import React from 'react';
import { Sparkles, Recycle, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-20 border-t-[3px] border-black bg-white/95 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          {/* Brand Col */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center p-1.5 shadow-[2px_2px_0px_#000]">
                <div className="w-4 h-4 bg-[#98EECC] rotate-45 rounded-[2px]" />
              </div>
              <span className="font-black text-2xl tracking-tight text-black uppercase">
                Waste2Wonder
              </span>
            </div>
            <p className="text-sm font-bold text-black/80 max-w-md">
              Transforming household waste into functional crafts and decor through smart AI vision, step-by-step maker guides, and weekly community challenges.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-3 py-1 bg-white border-[2px] border-black shadow-[2px_2px_0px_#000] rounded-full text-xs font-black text-black">
                🌱 100% Zero-Landfill Mission
              </span>
              <span className="px-3 py-1 bg-[#98EECC] border-[2px] border-black shadow-[2px_2px_0px_#000] rounded-full text-xs font-black text-black">
                ✨ Verified Maker Guides
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2.5">
            <h4 className="font-black text-base uppercase tracking-wider text-black">
              Explore
            </h4>
            <ul className="space-y-2 text-sm font-bold text-black/80">
              <li>
                <button
                  onClick={() => onNavigate('scan')}
                  className="hover:underline cursor-pointer"
                >
                  AI Image Scanner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:underline cursor-pointer"
                >
                  Explore DIY Ideas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contest')}
                  className="hover:underline cursor-pointer"
                >
                  Weekly Contest
                </button>
              </li>
            </ul>
          </div>

          {/* Community & Impact */}
          <div className="flex flex-col gap-2.5">
            <h4 className="font-black text-base uppercase tracking-wider text-black">
              Community & Impact
            </h4>
            <ul className="space-y-2 text-sm font-bold text-black/80">
              <li>
                <button
                  onClick={() => onNavigate('community')}
                  className="hover:underline cursor-pointer"
                >
                  Maker Community Feed
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('create-post')}
                  className="hover:underline cursor-pointer"
                >
                  Post Your Craft
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('profile')}
                  className="hover:underline cursor-pointer"
                >
                  Your Environmental Footprint
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t-[2px] border-black/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-black text-black/70">
          <p>© 2026 Waste2Wonder. Turn your household trash into handmade wonder.</p>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border-[1.5px] border-black shadow-[2px_2px_0px_#000]">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Built with creative energy & upcycling passion</span>
            <Heart className="w-3.5 h-3.5 text-[#E11D48] fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
};
