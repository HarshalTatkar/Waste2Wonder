import React from 'react';
import { Camera, Compass, Sparkles, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Button } from '../common/Button';
import { FloatingObject3D } from './FloatingObject3D';

interface HeroSectionProps {
  onScanClick: () => void;
  onExploreClick: () => void;
  onSelectMaterial: (category: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScanClick,
  onExploreClick,
  onSelectMaterial,
}) => {
  return (
    <section className="relative z-10 pt-8 pb-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Bold Neubrutalist Typography & CTAs */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Top Pill / Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFD166] text-[#3A3A3A] border-[2.5px] border-[#3A3A3A] shadow-[3px_3px_0px_#3A3A3A] rounded-xl text-xs sm:text-sm font-black mb-5 rotate-[-1deg]">
            <Sparkles className="w-4 h-4 text-[#C97C5D] stroke-[2.5]" />
            <span>NEOBRUTALISM ZERO-WASTE REVOLUTION</span>
            <span className="hidden sm:inline-block">☀️</span>
          </div>

          {/* Distinctive Display Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[var(--color-text-accent-dark)] tracking-tight leading-[1.08] mb-6">
            DON'T TRASH IT. <br />
            <span className="inline-block bg-[var(--color-primary)] text-white px-3 py-1 border-[3px] border-[var(--color-text-accent-dark)] shadow-[5px_5px_0px_var(--color-text-accent-dark)] rounded-2xl transform -rotate-1 mt-1">
              CRAFT WONDER.
            </span>
          </h1>

          {/* Clear, inspiring body text */}
          <p className="text-base sm:text-lg font-bold text-[var(--color-text-accent-dark)]/85 mb-8 max-w-2xl leading-relaxed">
            Upload up to 4 photos of any discarded household item. Our neural vision engine analyzes the material condition with surgical precision — matching verified community builds, curated video guides, or generating bespoke multi-stage tutorials from scratch.
          </p>

          {/* Action Button Row */}
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              onClick={onScanClick}
              icon={<Camera className="w-6 h-6 stroke-[2.5]" />}
              className="w-full sm:w-auto text-lg"
            >
              Scan Your Waste
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onExploreClick}
              icon={<Compass className="w-6 h-6" />}
              className="w-full sm:w-auto text-lg"
            >
              Explore Ideas
            </Button>
          </div>

          {/* Social Proof & Trust Badges */}
          <div className="mt-10 flex flex-wrap items-center gap-4 text-xs font-black text-[var(--color-text-accent-dark)]">
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border-[2px] border-[var(--color-text-accent-dark)] shadow-[3px_3px_0px_var(--color-text-accent-dark)]">
              <ShieldCheck className="w-4 h-4 text-[var(--color-primary)]" />
              <span>100% Verified Community Steps</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border-[2px] border-[var(--color-text-accent-dark)] shadow-[3px_3px_0px_var(--color-text-accent-dark)]">
              <span className="text-[var(--color-secondary)]">★</span>
              <span>Fair Rotating Contest Algorithm</span>
            </div>
          </div>
        </div>

        {/* Right Column: Floating Claymation 3D Cycler */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <FloatingObject3D onSelectObject={onSelectMaterial} />
        </div>
      </div>
    </section>
  );
};
