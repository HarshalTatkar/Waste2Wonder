import React from 'react';
import { Camera, Search, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

interface UploadTeaserProps {
  onStartScan: () => void;
}

export const UploadTeaser: React.FC<UploadTeaserProps> = ({ onStartScan }) => {
  const steps = [
    {
      num: '01',
      title: 'Snap up to 4 Photos',
      desc: 'Capture torn fabric, cracked plastic bottles, or corrugated cardboard boxes from multiple perspectives.',
      color: 'bg-[#FFD166]',
    },
    {
      num: '02',
      title: 'Precision Identification',
      desc: 'Our AI identifies the material condition (e.g. "torn cotton denim trousers") with detailed properties.',
      color: 'bg-[#70C1B3]',
    },
    {
      num: '03',
      title: 'Dual-Source Ranked Match',
      desc: 'Instant access to step-by-step in-app posts, curated video guides, or full AI synthesis.',
      color: 'bg-[#CDB4DB]',
    },
  ];

  return (
    <section className="relative z-10 my-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="neu-card bg-white p-8 sm:p-12 border-[3px] border-[var(--color-text-accent-dark)] shadow-[8px_8px_0px_var(--color-text-accent-dark)] rounded-3xl">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10 pb-8 border-b-[2.5px] border-[var(--color-text-accent-dark)]">
          <div>
            <span className="px-3 py-1 bg-[var(--color-primary)] text-white text-xs font-black rounded-lg uppercase tracking-wider">
              Visual Recognition Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[var(--color-text-accent-dark)] mt-2">
              HOW WASTE2WONDER WORKS
            </h2>
            <p className="text-sm sm:text-base font-bold text-[var(--color-text-accent-dark)]/75 mt-1">
              Zero guessing. Three intuitive steps from trash bin to proud handmade artifact.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={onStartScan}
            icon={<Camera className="w-5 h-5 stroke-[2.5]" />}
          >
            Launch Scanner Now
          </Button>
        </div>

        {/* 3 Step Neubrutalist Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((st) => (
            <div
              key={st.num}
              className="bg-[var(--color-background)] border-[2.5px] border-[var(--color-text-accent-dark)] shadow-[4px_4px_0px_var(--color-text-accent-dark)] rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--color-text-accent-dark)] transition-all"
            >
              <div>
                <div
                  className={`w-12 h-12 rounded-xl ${st.color} border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] flex items-center justify-center font-black text-lg text-[#3A3A3A] mb-4`}
                >
                  {st.num}
                </div>
                <h3 className="text-xl font-black text-[var(--color-text-accent-dark)] mb-2">
                  {st.title}
                </h3>
                <p className="text-sm font-bold text-[var(--color-text-accent-dark)]/80 leading-relaxed">
                  {st.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--color-text-accent-dark)]/20 flex items-center text-xs font-black text-[var(--color-primary)]">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                <span>Automated & Instant</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
