import React, { useEffect, useState } from 'react';
import mandalaImg from '../../assets/illustrations/mandala-bg.jpg';

export const AnimatedBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 15;
      const y = (e.clientY / innerHeight - 0.5) * 15;
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
      {/* Warm Peach/Apricot Radiant Gradient Canvas matching user screenshots */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 70% 20%, #FFE2D5 0%, #FAD2C0 35%, #F7C1B3 70%, #F5ABA0 100%)',
        }}
      />

      {/* Kinetic Mandala Overlay Layer with Parallax */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
        }}
      >
        {/* Central Rotating Mandala */}
        <div
          className="w-[140vmax] h-[140vmax] max-w-none rounded-full animate-spin-slow"
          style={{
            backgroundImage: `url(${mandalaImg})`,
            backgroundRepeat: 'repeat',
            backgroundPosition: 'center',
            backgroundSize: '820px 820px',
            opacity: 0.22,
            mixBlendMode: 'multiply',
            filter: 'contrast(1.25) saturate(1.15)',
          }}
        />

        {/* Subtle Counter-rotating Concentric Layer for Organic Depth */}
        <div
          className="absolute w-[100vmax] h-[100vmax] rounded-full pointer-events-none animate-spin-reverse-slow"
          style={{
            backgroundImage: `url(${mandalaImg})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            opacity: 0.14,
            mixBlendMode: 'multiply',
          }}
        />
      </div>

      {/* Soft Vignette Edge Wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, transparent 40%, rgba(245, 171, 160, 0.35) 100%)',
        }}
      />
    </div>
  );
};
