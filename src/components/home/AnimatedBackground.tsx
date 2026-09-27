import React, { useEffect, useState } from 'react';
import mandalaImg from '../../assets/illustrations/mandala-bg.jpg';
import { Sparkles, Eye, Pause, Play } from 'lucide-react';

export const AnimatedBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(true);
  const [opacityLevel, setOpacityLevel] = useState(0.24); // Sweet spot for vibrant mandala art + perfect readability

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20; // gentle tilt offset
      const y = (e.clientY / innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Dynamic Animated Mandala Container with Parallax & Slow Kinetic Spin */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
        }}
      >
        {/* Layer 1: Massive Central Mandala */}
        <div
          className={`w-[140vmax] h-[140vmax] max-w-none rounded-full transition-opacity duration-500 ${
            isPlaying ? 'animate-spin-slow' : ''
          }`}
          style={{
            backgroundImage: `url(${mandalaImg})`,
            backgroundRepeat: 'repeat',
            backgroundPosition: 'center',
            backgroundSize: '800px 800px',
            opacity: opacityLevel,
            filter: 'contrast(1.15) saturate(1.1)',
          }}
        />

        {/* Layer 2: Counter-rotating concentric mandala halo for kaleidoscopic depth */}
        <div
          className={`absolute w-[95vmax] h-[95vmax] rounded-full pointer-events-none ${
            isPlaying ? 'animate-spin-reverse-slow' : ''
          }`}
          style={{
            backgroundImage: `url(${mandalaImg})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            opacity: opacityLevel * 0.7,
            mixBlendMode: 'multiply',
          }}
        />
      </div>

      {/* Layer 3: Neubrutalism Warm Tone Atmospheric Wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(245, 241, 232, 0.45) 0%, rgba(245, 241, 232, 0.85) 65%, rgba(245, 241, 232, 0.96) 100%)',
        }}
      />

      {/* Floating Creative Energy Stickers & Neubrutalist Badges */}
      <div className="absolute top-24 left-8 animate-float opacity-80 hidden md:block">
        <div className="bg-[#FFD166] text-[#3A3A3A] px-3 py-1 rounded-lg border-[2px] border-[#3A3A3A] shadow-[3px_3px_0px_#3A3A3A] text-xs font-black rotate-[-8deg] flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#3A3A3A]" />
          <span>RE-CREATIVE MODE</span>
        </div>
      </div>

      <div className="absolute top-1/3 right-10 animate-float opacity-75 hidden md:block" style={{ animationDelay: '1.5s' }}>
        <div className="bg-[#8A9A5B] text-white px-3 py-1 rounded-lg border-[2px] border-[#3A3A3A] shadow-[3px_3px_0px_#3A3A3A] text-xs font-black rotate-[6deg]">
          🌿 ZERO WASTE ARCHIVE
        </div>
      </div>

      <div className="absolute bottom-24 left-14 animate-float opacity-80 hidden lg:block" style={{ animationDelay: '2.5s' }}>
        <div className="bg-[#C97C5D] text-white px-3 py-1 rounded-lg border-[2px] border-[#3A3A3A] shadow-[3px_3px_0px_#3A3A3A] text-xs font-black rotate-[-4deg]">
          ⚡ NEUBRUTALISM × MANDALA
        </div>
      </div>

      {/* Interactive Live Background Controls floating subtly in bottom corner */}
      <div className="absolute bottom-4 right-4 pointer-events-auto z-20 hidden sm:flex items-center gap-2 bg-white/85 backdrop-blur-md px-3 py-1.5 rounded-xl border-[2px] border-[var(--color-text-accent-dark)] shadow-[3px_3px_0px_var(--color-text-accent-dark)] text-xs font-bold">
        <span className="text-[10px] uppercase font-black text-[var(--color-text-accent-dark)]/70 flex items-center gap-1">
          <Eye className="w-3 h-3 text-[var(--color-secondary)]" /> Live Mandala:
        </span>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-1 rounded hover:bg-black/5 text-[var(--color-text-accent-dark)] cursor-pointer"
          title={isPlaying ? 'Pause Mandala Rotation' : 'Resume Mandala Rotation'}
        >
          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </button>
        <button
          onClick={() => setOpacityLevel((prev) => (prev >= 0.4 ? 0.15 : prev + 0.1))}
          className="px-1.5 py-0.5 rounded bg-[var(--color-background)] border border-[var(--color-text-accent-dark)] text-[10px] font-black cursor-pointer hover:bg-[var(--color-primary)] hover:text-white transition-colors"
          title="Toggle Mandala Intensity"
        >
          {Math.round(opacityLevel * 100)}% Art
        </button>
      </div>
    </div>
  );
};
