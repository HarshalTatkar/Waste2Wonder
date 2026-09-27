import React from 'react';

interface HeroJarCardProps {
  onCardClick?: () => void;
}

export const HeroJarCard: React.FC<HeroJarCardProps> = ({ onCardClick }) => {
  return (
    <div
      onClick={onCardClick}
      className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-square bg-[#98EECC] border-[3.5px] border-black rounded-[28px] shadow-[8px_8px_0px_#000] p-5 flex flex-col justify-between select-none cursor-pointer transition-transform duration-200 hover:-translate-y-1 hover:shadow-[10px_10px_0px_#000]"
    >
      {/* Overlapping top-right pink badge: V2.0 */}
      <div className="absolute -top-3.5 -right-3 px-3 py-1 bg-[#FFAAA6] border-[2.5px] border-black rounded-full font-black text-xs text-black shadow-[3px_3px_0px_#000] rotate-6 z-20">
        V2.0
      </div>

      {/* Overlapping bottom-left yellow circle accent */}
      <div className="absolute -bottom-3 -left-3 w-8 h-8 rounded-full bg-[#FCD34D] border-[2.5px] border-black shadow-[3px_3px_0px_#000] z-20" />

      {/* Top inner row: LIVE AI badge */}
      <div className="w-full flex items-center justify-between z-10">
        <span className="px-3 py-1 bg-[#FCD34D] border-[2px] border-black rounded-full text-[10px] font-black uppercase text-black shadow-[2px_2px_0px_#000]">
          LIVE AI
        </span>
        <div />
      </div>

      {/* Center illustration: Concentric rings + Fairy Light Mason Jar */}
      <div className="relative my-auto flex items-center justify-center w-full h-[220px]">
        {/* Concentric rings behind jar */}
        <div className="absolute w-[230px] h-[230px] rounded-full border-[2.5px] border-[#34D399]/70 pointer-events-none" />
        <div className="absolute w-[170px] h-[170px] rounded-full border-[2px] border-[#34D399]/60 pointer-events-none" />
        <div className="absolute w-[110px] h-[110px] rounded-full border-[1.5px] border-[#34D399]/50 pointer-events-none" />

        {/* Mason Jar with fairy lights - SVG matching screenshot */}
        <svg
          viewBox="0 0 160 210"
          className="w-40 sm:w-44 h-auto filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.18)] z-10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Glass body background with subtle opacity */}
          <rect
            x="32"
            y="52"
            width="96"
            height="140"
            rx="28"
            fill="white"
            fillOpacity="0.82"
            stroke="black"
            strokeWidth="3.5"
          />

          {/* Warm pink/peach bottom glow layer inside jar */}
          <path
            d="M34 165 C34 165, 50 158, 80 158 C110 158, 126 165, 126 165 L126 168 C126 182, 114 190, 98 190 L62 190 C46 190, 34 182, 34 168 Z"
            fill="#FDA4AF"
            fillOpacity="0.75"
          />

          {/* Golden wire connecting fairy lights */}
          <path
            d="M 52 170 Q 70 145 56 120 T 98 100 T 72 75 T 104 64"
            stroke="#D97706"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />

          {/* Glowing fairy lights nodes */}
          <circle cx="56" cy="170" r="4.5" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5" />
          <circle cx="56" cy="170" r="9" fill="#FDE047" fillOpacity="0.4" />

          <circle cx="82" cy="162" r="5" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5" />
          <circle cx="82" cy="162" r="10" fill="#FDE047" fillOpacity="0.45" />

          <circle cx="106" cy="168" r="4.5" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5" />
          <circle cx="106" cy="168" r="9" fill="#FDE047" fillOpacity="0.38" />

          <circle cx="68" cy="138" r="5.5" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5" />
          <circle cx="68" cy="138" r="11" fill="#FDE047" fillOpacity="0.5" />

          <circle cx="95" cy="134" r="5" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5" />
          <circle cx="95" cy="134" r="10" fill="#FDE047" fillOpacity="0.45" />

          <circle cx="54" cy="112" r="4.5" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5" />
          <circle cx="54" cy="112" r="9" fill="#FDE047" fillOpacity="0.4" />

          <circle cx="80" cy="104" r="6" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5" />
          <circle cx="80" cy="104" r="12" fill="#FDE047" fillOpacity="0.55" />

          <circle cx="105" cy="98" r="4.5" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5" />
          <circle cx="105" cy="98" r="9" fill="#FDE047" fillOpacity="0.4" />

          <circle cx="70" cy="74" r="5" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5" />
          <circle cx="70" cy="74" r="10" fill="#FDE047" fillOpacity="0.45" />

          <circle cx="98" cy="68" r="4" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5" />
          <circle cx="98" cy="68" r="8" fill="#FDE047" fillOpacity="0.35" />

          {/* Glass reflection highlight curves */}
          <path
            d="M 42 66 Q 38 100 40 145"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 46 72 Q 44 95 45 125"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Jar Neck and Ridges */}
          <rect
            x="44"
            y="42"
            width="72"
            height="12"
            rx="3"
            fill="#FEF3C7"
            stroke="black"
            strokeWidth="3"
          />

          {/* Metal screw lid */}
          <rect
            x="48"
            y="32"
            width="64"
            height="11"
            rx="4"
            fill="#FDE68A"
            stroke="black"
            strokeWidth="3"
          />
          {/* Lid ridges */}
          <line x1="56" y1="34" x2="56" y2="41" stroke="black" strokeWidth="2" strokeLinecap="round" />
          <line x1="68" y1="34" x2="68" y2="41" stroke="black" strokeWidth="2" strokeLinecap="round" />
          <line x1="80" y1="34" x2="80" y2="41" stroke="black" strokeWidth="2" strokeLinecap="round" />
          <line x1="92" y1="34" x2="92" y2="41" stroke="black" strokeWidth="2" strokeLinecap="round" />
          <line x1="104" y1="34" x2="104" y2="41" stroke="black" strokeWidth="2" strokeLinecap="round" />

          {/* Jar handle/knob on top */}
          <path
            d="M 72 32 C 72 23, 88 23, 88 32"
            fill="#FDE68A"
            stroke="black"
            strokeWidth="3"
          />
          <circle cx="80" cy="22" r="4.5" fill="#FCD34D" stroke="black" strokeWidth="2.5" />
        </svg>
      </div>

      {/* Bottom inner badges */}
      <div className="w-full flex items-center justify-between z-10 pt-1">
        <span className="px-3 py-1 bg-white border-[2px] border-black rounded-full text-[10px] font-black uppercase text-black shadow-[2px_2px_0px_#000]">
          MATERIAL: GLASS
        </span>
        <span className="px-3 py-1 bg-[#FFAAA6] border-[2px] border-black rounded-full text-[10px] font-black uppercase text-black shadow-[2px_2px_0px_#000]">
          IDEAS: 15
        </span>
      </div>
    </div>
  );
};
