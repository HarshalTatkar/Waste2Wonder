import React from 'react';
import { HeroJarCard } from './HeroJarCard';

interface HeroSectionProps {
  onScanClick: () => void;
  onExploreClick: () => void;
  onSelectMaterial: (category: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScanClick,
  onExploreClick,
}) => {
  return (
    <section className="relative z-10 pt-10 sm:pt-14 pb-10 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* Left Column: Bold Neubrutalist Typography & CTAs - matching Image 1 */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Top Pill / Badge: AI-POWERED UPCYCLING */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white text-black border-[2px] border-black shadow-[2px_2px_0px_#000] rounded-full text-xs font-black mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FDA4AF]" />
            <span className="tracking-wide uppercase">AI-POWERED UPCYCLING</span>
          </div>

          {/* Heading matching Image 1 exactly */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-black tracking-tight leading-[0.94] mb-6">
            TURN<br />
            YOUR<br />
            <span className="inline-block bg-[#98EECC] text-black px-4 sm:px-5 py-1 sm:py-1.5 rounded-2xl border-[3.5px] border-black shadow-[5px_5px_0px_#000] my-1.5 transform -rotate-1">
              TRASH
            </span><br />
            INTO<br />
            <span className="inline-block bg-[#FCD34D] text-black px-4 sm:px-5 py-1 sm:py-1.5 rounded-2xl border-[3.5px] border-black shadow-[5px_5px_0px_#000] my-1.5 transform rotate-1">
              WONDER
            </span>
          </h1>

          {/* Subtitle text matching Image 1 */}
          <p className="text-sm sm:text-base font-bold text-black/85 mb-8 max-w-xl leading-relaxed">
            Snap a photo of any household waste. Our AI identifies the material and delivers step-by-step DIY project ideas, safety tips, cost, time and your real environmental impact.
          </p>

          {/* Action Button Row */}
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10">
            <button
              onClick={onScanClick}
              className="px-7 py-3 rounded-full border-[2.5px] border-black bg-[#FFAAA6] text-black font-black text-base shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              Scan Your Waste
            </button>
            <button
              onClick={onExploreClick}
              className="px-7 py-3 rounded-full border-[2.5px] border-black bg-white text-black font-black text-base shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              Explore Ideas
            </button>
          </div>

          {/* Stat boxes matching Image 1 */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="bg-white px-4 py-2.5 rounded-2xl border-[2.5px] border-black shadow-[3px_3px_0px_#000] text-center min-w-[100px]">
              <div className="text-xl sm:text-2xl font-black text-black leading-none">12.4K</div>
              <div className="text-[10px] font-black uppercase text-black/70 mt-1 tracking-wider">PROJECTS MADE</div>
            </div>
            <div className="bg-white px-4 py-2.5 rounded-2xl border-[2.5px] border-black shadow-[3px_3px_0px_#000] text-center min-w-[100px]">
              <div className="text-xl sm:text-2xl font-black text-black leading-none">38T</div>
              <div className="text-[10px] font-black uppercase text-black/70 mt-1 tracking-wider">WASTE DIVERTED</div>
            </div>
            <div className="bg-white px-4 py-2.5 rounded-2xl border-[2.5px] border-black shadow-[3px_3px_0px_#000] text-center min-w-[100px]">
              <div className="text-xl sm:text-2xl font-black text-black leading-none">9.1K</div>
              <div className="text-[10px] font-black uppercase text-black/70 mt-1 tracking-wider">ACTIVE MAKERS</div>
            </div>
          </div>
        </div>

        {/* Right Column: Mint Green Concentric Card with Fairy Light Jar */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <HeroJarCard onCardClick={onExploreClick} />
        </div>
      </div>
    </section>
  );
};
