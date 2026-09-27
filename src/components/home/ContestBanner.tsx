import React from 'react';
import { Trophy, ArrowRight, Flame } from 'lucide-react';
import { CountdownTimer } from '../common/CountdownTimer';
import { Button } from '../common/Button';

interface ContestBannerProps {
  onVoteNow: () => void;
}

export const ContestBanner: React.FC<ContestBannerProps> = ({ onVoteNow }) => {
  return (
    <div className="relative z-20 my-8">
      {/* Floating Glass Container - strictly adhering to Glassmorphism rules */}
      <div className="backdrop-blur-xl bg-white/75 border border-[var(--color-secondary)]/40 shadow-[0_16px_40px_rgba(58,58,58,0.14)] rounded-3xl p-5 sm:p-7 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-[0_20px_50px_rgba(58,58,58,0.18)]">
        {/* Left side: Contest Info */}
        <div className="flex items-center gap-4 text-left">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-secondary)] border-[2.5px] border-[var(--color-text-accent-dark)] shadow-[3px_3px_0px_var(--color-text-accent-dark)] flex items-center justify-center text-white shrink-0">
            <Trophy className="w-8 h-8 text-[#FFD166] stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-[#C97C5D] text-white flex items-center gap-1">
                <Flame className="w-3 h-3 fill-current" />
                WEEK 38 ACTIVE SHOWCASE
              </span>
              <span className="text-xs font-bold text-[var(--color-text-accent-dark)]/70">
                Max 100 Entries
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[var(--color-text-accent-dark)] mt-1">
              "Denim & Cardboard Renaissance" Challenge
            </h3>
            <p className="text-xs sm:text-sm font-bold text-[var(--color-text-accent-dark)]/80 mt-0.5">
              Vote on community creations or submit your own upcycle before the round ends!
            </p>
          </div>
        </div>

        {/* Right side: Countdown and Action */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto justify-end">
          <div className="flex flex-col items-center sm:items-end">
            <span className="text-[10px] uppercase font-black tracking-wider text-[var(--color-text-accent-dark)]/70 mb-1">
              Voting Closes In:
            </span>
            <CountdownTimer variant="compact" />
          </div>

          <Button
            variant="secondary"
            size="md"
            onClick={onVoteNow}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Vote Now
          </Button>
        </div>
      </div>
    </div>
  );
};
