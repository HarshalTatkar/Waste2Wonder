import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';

interface RecyclableObject {
  id: string;
  name: string;
  category: string;
  color: string;
  shadowColor: string;
  borderColor: string;
  icon: string;
  tagline: string;
  potentialCraft: string;
  accentBg: string;
}

const RECYCLABLE_OBJECTS: RecyclableObject[] = [
  {
    id: 'plastic',
    name: 'PET Soda Bottle',
    category: 'Plastic',
    color: '#f91a4e',
    shadowColor: '#ece21d',
    borderColor: '#3A3A3A',
    icon: '🍾',
    tagline: 'High-density transparent PET polymer',
    potentialCraft: 'Sub-irrigated Window Herb Planter',
    accentBg: '#E0F4F2',
  },
  {
    id: 'cardboard',
    name: 'Corrugated Shipping Box',
    category: 'Paper-Cardboard',
    color: '#C97C5D',
    shadowColor: '#804128',
    borderColor: '#3A3A3A',
    icon: '📦',
    tagline: 'Sturdy fluted fiber structure',
    potentialCraft: 'Isometric Desk Caddy & Tablet Cradle',
    accentBg: '#F9EDE7',
  },
  {
    id: 'fabric',
    name: 'Frayed Denim Jeans',
    category: 'Fabric',
    color: '#8A9A5B',
    shadowColor: '#4A5B28',
    borderColor: '#3A3A3A',
    icon: '👖',
    tagline: 'Heavy twill indigo cotton weave',
    potentialCraft: 'Reinforced Market Carrier Bag',
    accentBg: '#EBF0E4',
  },
  {
    id: 'glass',
    name: 'Broken Ceramic Coffee Mug',
    category: 'Glass',
    color: '#FFD166',
    shadowColor: '#B38B21',
    borderColor: '#3A3A3A',
    icon: '☕',
    tagline: 'Earthenware clay body fissures',
    potentialCraft: 'Kintsugi Warm Amber Nightlight',
    accentBg: '#FFF6E0',
  },
  {
    id: 'ewaste',
    name: 'Dead Computer Motherboard',
    category: 'E-waste',
    color: '#CDB4DB',
    shadowColor: '#7A5B8B',
    borderColor: '#3A3A3A',
    icon: '💾',
    tagline: 'Gold-plated copper circuit traces',
    potentialCraft: 'Resin Glazed Cyberpunk Coasters',
    accentBg: '#F4EDF8',
  },
];

export const FloatingObject3D: React.FC<{ onSelectObject?: (category: string) => void }> = ({
  onSelectObject,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isWobbling, setIsWobbling] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsWobbling(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % RECYCLABLE_OBJECTS.length);
        setIsWobbling(false);
      }, 250);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const current = RECYCLABLE_OBJECTS[currentIndex];

  const handleNext = () => {
    setIsWobbling(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % RECYCLABLE_OBJECTS.length);
      setIsWobbling(false);
    }, 150);
  };

  return (
    <div className="relative flex flex-col items-center select-none group">
      {/* 3D Claymation-Style Display Platform */}
      <div
        onClick={handleNext}
        className={`relative cursor-pointer transition-all duration-300 ease-out transform ${
          isWobbling ? 'scale-95 rotate-6' : 'hover:scale-105 hover:-translate-y-2'
        }`}
        title="Click to cycle next recyclable object"
      >
        {/* Glow halo */}
        <div
          className="absolute -inset-4 rounded-3xl blur-xl opacity-35 transition-colors duration-500"
          style={{ backgroundColor: current.color }}
        />

        {/* Main 3D Card Object */}
        <div
          className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl border-[3.5px] border-[#3A3A3A] p-6 flex flex-col items-center justify-between text-center transition-all duration-300"
          style={{
            backgroundColor: current.color,
            boxShadow: `8px 8px 0px #3A3A3A, inset 4px 4px 0px rgba(255,255,255,0.4), inset -4px -4px 0px rgba(0,0,0,0.15)`,
          }}
        >
          {/* Top Pill with live sticker */}
          <div className="w-full flex items-center justify-between">
            <span className="px-2.5 py-1 bg-white border-[2px] border-[#3A3A3A] shadow-[2px_2px_0px_#3A3A3A] rounded-full text-[11px] font-black text-[#3A3A3A] flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#C97C5D] fill-current" />
              <span>CLAY 3D OBJECT</span>
            </span>
            <span className="text-xs font-black text-white/90 bg-[#3A3A3A] px-2 py-0.5 rounded-md">
              0{currentIndex + 1}/0{RECYCLABLE_OBJECTS.length}
            </span>
          </div>

          {/* Central 3D Icon & Character Face */}
          <div className="relative my-auto flex flex-col items-center">
            <div className="text-6xl sm:text-7xl filter drop-shadow-[0_8px_8px_rgba(0,0,0,0.25)] animate-bounce duration-1000">
              {current.icon}
            </div>
            {/* Claymation Eyes & Smile Sticker for Retro Neobrutalism Vibe */}
            <div className="mt-1 px-3 py-1 bg-white border-[2px] border-[#3A3A3A] shadow-[2px_2px_0px_#3A3A3A] rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#3A3A3A]" />
              <span className="text-[10px] font-black text-[#3A3A3A]">●‿●</span>
              <span className="w-2 h-2 rounded-full bg-[#3A3A3A]" />
            </div>
          </div>

          {/* Bottom Object Info */}
          <div className="w-full bg-white/95 border-[2px] border-[#3A3A3A] shadow-[3px_3px_0px_#3A3A3A] rounded-xl p-2.5 text-left">
            <div className="flex items-center justify-between">
              <p className="font-black text-sm text-[#3A3A3A] leading-tight">
                {current.name}
              </p>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-[#F5F1E8] border border-[#3A3A3A] rounded">
                {current.category}
              </span>
            </div>
            <p className="text-[11px] font-bold text-[#3A3A3A]/70 truncate mt-0.5">
              Craft: {current.potentialCraft}
            </p>
          </div>
        </div>

        {/* Floating Decorative Neo Star Sticker */}
        <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#FFD166] border-[2.5px] border-[#3A3A3A] shadow-[3px_3px_0px_#3A3A3A] rounded-full flex items-center justify-center font-black text-base text-[#3A3A3A] rotate-12 animate-pulse">
          ★
        </div>
      </div>

      {/* Interactive Controls & Tap prompt */}
      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={handleNext}
          className="px-3.5 py-1.5 bg-white border-[2px] border-[#3A3A3A] shadow-[2px_2px_0px_#3A3A3A] rounded-xl text-xs font-black text-[#3A3A3A] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#3A3A3A] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C97C5D]" />
          <span>Next Waste Prototype</span>
          <ArrowRight className="w-3 h-3" />
        </button>

        {onSelectObject && (
          <button
            onClick={() => onSelectObject(current.category)}
            className="px-3.5 py-1.5 bg-[var(--color-primary)] text-white border-[2px] border-[#3A3A3A] shadow-[2px_2px_0px_#3A3A3A] rounded-xl text-xs font-black hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#3A3A3A] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            Explore {current.category}
          </button>
        )}
      </div>
    </div>
  );
};
