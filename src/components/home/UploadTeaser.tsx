import React from 'react';
import { Camera, CheckCircle2 } from 'lucide-react';

interface UploadTeaserProps {
  onStartScan: () => void;
}

export const UploadTeaser: React.FC<UploadTeaserProps> = ({ onStartScan }) => {
  const steps = [
    {
      num: '01',
      title: 'Snap Your Waste',
      desc: 'Take photos of plastic bottles, denim jeans, cardboard, or cans around your house.',
      color: 'bg-[#FFD166]',
    },
    {
      num: '02',
      title: 'Smart Material ID',
      desc: 'Our AI scans the material and matches practical, high-value upcycling projects.',
      color: 'bg-[#98EECC]',
    },
    {
      num: '03',
      title: 'Build & Divert Waste',
      desc: 'Follow curated instructions, log your impact, and share your handmade creation.',
      color: 'bg-[#FDA4AF]',
    },
  ];

  return (
    <section className="relative z-10 my-16 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="bg-white p-8 sm:p-10 border-[3px] border-black shadow-[6px_6px_0px_#000] rounded-3xl">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10 pb-6 border-b-[2px] border-black/20">
          <div className="text-left">
            <span className="px-3.5 py-1 bg-white border-[2px] border-black text-black text-xs font-black rounded-full shadow-[2px_2px_0px_#000] uppercase tracking-wider">
              Easy Upcycling Guide
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-black mt-3 uppercase tracking-tight">
              HOW WASTE2WONDER WORKS
            </h2>
            <p className="text-sm sm:text-base font-bold text-black/75 mt-1">
              Three simple steps from household waste to proud handmade creations.
            </p>
          </div>

          <button
            onClick={onStartScan}
            className="px-6 py-3 rounded-full border-[2.5px] border-black bg-[#FDA4AF] text-black font-black text-sm shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 flex items-center gap-2 cursor-pointer transition-all shrink-0"
          >
            <Camera className="w-5 h-5 stroke-[2.5]" />
            <span>Launch Scanner Now</span>
          </button>
        </div>

        {/* 3 Step Neubrutalist Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {steps.map((st) => (
            <div
              key={st.num}
              className="bg-[#FFFDF9] border-[2.5px] border-black shadow-[4px_4px_0px_#000] rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] transition-all"
            >
              <div>
                <div
                  className={`w-12 h-12 rounded-xl ${st.color} border-[2px] border-black shadow-[2px_2px_0px_#000] flex items-center justify-center font-black text-lg text-black mb-4`}
                >
                  {st.num}
                </div>
                <h3 className="text-xl font-black text-black mb-2 uppercase">
                  {st.title}
                </h3>
                <p className="text-sm font-bold text-black/80 leading-relaxed">
                  {st.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-black/15 flex items-center text-xs font-black text-black">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-[#059669]" />
                <span>Instant & Automated</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
