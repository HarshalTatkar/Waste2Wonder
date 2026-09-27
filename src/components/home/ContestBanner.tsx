import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';

interface ContestBannerProps {
  onVoteNow: () => void;
  onViewContest?: () => void;
}

export const ContestBanner: React.FC<ContestBannerProps> = ({
  onVoteNow,
  onViewContest,
}) => {
  // Real countdown timer
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 12,
    minutes: 42,
    seconds: 20,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="relative z-20 my-10 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Yellow Diagonal Striped Neubrutalist Banner matching Image 2 */}
      <div
        className="bg-[#FCD34D] border-[3px] border-black rounded-[28px] shadow-[6px_6px_0px_#000] p-6 sm:p-7 flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)',
        }}
      >
        {/* Left: Trophy Badge & Contest Titles */}
        <div className="flex items-center gap-4 text-left w-full lg:w-auto">
          <div className="w-14 h-14 rounded-full bg-[#FFAAA6] border-[2.5px] border-black shadow-[2px_2px_0px_#000] flex items-center justify-center shrink-0">
            <Trophy className="w-7 h-7 text-black stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-black/75 block">
              WEEKLY CONTEST
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-black tracking-tight leading-tight">
              BEST BOTTLE REBUILD
            </h3>
            <p className="text-xs sm:text-sm font-bold text-black/85 mt-0.5">
              Vote for this week's most creative upcycling project.
            </p>
          </div>
        </div>

        {/* Center: 4 Countdown Pills */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex flex-col items-center">
            <div className="bg-white border-[2px] border-black rounded-xl px-3 py-1.5 shadow-[2px_2px_0px_#000] text-center min-w-[52px]">
              <span className="text-xl sm:text-2xl font-black text-black leading-none block">
                {pad(timeLeft.days)}
              </span>
            </div>
            <span className="text-[9px] font-black uppercase text-black/70 mt-1">DAYS</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-white border-[2px] border-black rounded-xl px-3 py-1.5 shadow-[2px_2px_0px_#000] text-center min-w-[52px]">
              <span className="text-xl sm:text-2xl font-black text-black leading-none block">
                {pad(timeLeft.hours)}
              </span>
            </div>
            <span className="text-[9px] font-black uppercase text-black/70 mt-1">HRS</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-white border-[2px] border-black rounded-xl px-3 py-1.5 shadow-[2px_2px_0px_#000] text-center min-w-[52px]">
              <span className="text-xl sm:text-2xl font-black text-black leading-none block">
                {pad(timeLeft.minutes)}
              </span>
            </div>
            <span className="text-[9px] font-black uppercase text-black/70 mt-1">MIN</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-white border-[2px] border-black rounded-xl px-3 py-1.5 shadow-[2px_2px_0px_#000] text-center min-w-[52px]">
              <span className="text-xl sm:text-2xl font-black text-black leading-none block">
                {pad(timeLeft.seconds)}
              </span>
            </div>
            <span className="text-[9px] font-black uppercase text-black/70 mt-1">SEC</span>
          </div>
        </div>

        {/* Right: Vote Now & View Contest Buttons */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          <button
            onClick={onVoteNow}
            className="px-5 py-2.5 rounded-full border-[2px] border-black bg-[#98EECC] text-black font-black text-sm shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            Vote Now
          </button>
          <button
            onClick={onViewContest || onVoteNow}
            className="px-5 py-2.5 rounded-full border-[2px] border-black bg-white text-black font-black text-sm shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            View Contest
          </button>
        </div>
      </div>
    </div>
  );
};
