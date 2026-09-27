import React, { useEffect, useState } from 'react';
import { Sparkles, Scan, Search, Cpu, Check } from 'lucide-react';

export const AnalysisLoader: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { label: 'Analyzing edge contours & physical geometry', icon: <Scan className="w-4 h-4" /> },
    { label: 'Detecting polymer/fiber composition & wear grade', icon: <Cpu className="w-4 h-4" /> },
    { label: 'Querying In-App community posts & YouTube crafts', icon: <Search className="w-4 h-4" /> },
    { label: 'Synthesizing ranked upcycle recommendations', icon: <Sparkles className="w-4 h-4" /> },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 400);

    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="neu-card bg-white p-8 sm:p-10 border-[3px] border-[var(--color-text-accent-dark)] shadow-[8px_8px_0px_var(--color-text-accent-dark)] rounded-3xl max-w-xl mx-auto my-8 text-center animate-in fade-in duration-300">
      {/* Central Rotating Icon Badge */}
      <div className="w-20 h-20 mx-auto rounded-3xl bg-[var(--color-primary)] border-[3px] border-[var(--color-text-accent-dark)] shadow-[5px_5px_0px_var(--color-text-accent-dark)] flex items-center justify-center text-white mb-6 relative">
        <Sparkles className="w-10 h-10 text-[#FFD166] stroke-[2.5] animate-spin" />
        <span className="absolute -top-2 -right-2 bg-[var(--color-secondary)] text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-[var(--color-text-accent-dark)]">
          AI
        </span>
      </div>

      <h3 className="text-2xl font-black text-[var(--color-text-accent-dark)] mb-2">
        AI Vision Neural Processing
      </h3>
      <p className="text-sm font-bold text-[var(--color-text-accent-dark)]/70 mb-6">
        Running convolutional analysis on your uploaded waste item angles...
      </p>

      {/* Step by step checklist */}
      <div className="space-y-3 text-left bg-[var(--color-background)] p-5 rounded-2xl border-[2px] border-[var(--color-text-accent-dark)] shadow-[3px_3px_0px_var(--color-text-accent-dark)]">
        {steps.map((st, idx) => {
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 text-xs sm:text-sm font-black transition-all ${
                isDone
                  ? 'text-[var(--color-primary)]'
                  : isCurrent
                  ? 'text-[var(--color-secondary)]'
                  : 'text-[var(--color-text-accent-dark)]/40'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg border-[2px] border-[var(--color-text-accent-dark)] flex items-center justify-center shrink-0 ${
                  isDone
                    ? 'bg-[var(--color-primary)] text-white'
                    : isCurrent
                    ? 'bg-[var(--color-secondary)] text-white animate-pulse'
                    : 'bg-white text-gray-300'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
              </div>
              <span className="flex-1">{st.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
