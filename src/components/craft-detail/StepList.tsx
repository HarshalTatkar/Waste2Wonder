import React from 'react';
import { CraftStep } from '../../types/project';
import { Lightbulb, CheckCircle } from 'lucide-react';

interface StepListProps {
  steps: CraftStep[];
  isAiGenerated?: boolean;
}

export const StepList: React.FC<StepListProps> = ({ steps, isAiGenerated = false }) => {
  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-black text-2xl text-[var(--color-text-accent-dark)] tracking-tight">
            Step-by-Step Instructions
          </h3>
          <p className="text-xs sm:text-sm font-bold text-[var(--color-text-accent-dark)]/70">
            {isAiGenerated
              ? 'AI-Synthesized multi-stage workflow from video/reference'
              : 'Original creator tutorial steps'}
          </p>
        </div>

        <span className="px-3 py-1 bg-[var(--color-primary)] text-white text-xs font-black rounded-lg border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)]">
          {steps.length} Steps
        </span>
      </div>

      <div className="space-y-6">
        {steps.map((st) => (
          <div
            key={st.stepNumber}
            className="neu-card bg-white border-[2.5px] border-[var(--color-text-accent-dark)] shadow-[4px_4px_0px_var(--color-text-accent-dark)] rounded-2xl p-6 transition-all hover:shadow-[6px_6px_0px_var(--color-text-accent-dark)]"
          >
            <div className="flex items-start gap-4">
              {/* Step number badge */}
              <div className="w-10 h-10 rounded-xl bg-[var(--color-secondary)] text-white border-[2px] border-[var(--color-text-accent-dark)] shadow-[2.5px_2.5px_0px_var(--color-text-accent-dark)] flex items-center justify-center font-black text-base shrink-0">
                {st.stepNumber}
              </div>

              <div className="flex-1">
                <h4 className="font-black text-lg text-[var(--color-text-accent-dark)] mb-2">
                  {st.title}
                </h4>
                <p className="text-sm font-bold text-[var(--color-text-accent-dark)]/85 leading-relaxed">
                  {st.instructions}
                </p>

                {/* Step Image preview if present */}
                {st.image && (
                  <div className="mt-4 rounded-xl border-[2px] border-[var(--color-text-accent-dark)] overflow-hidden shadow-[3px_3px_0px_var(--color-text-accent-dark)] max-w-md bg-gray-100">
                    <img
                      src={st.image}
                      alt={st.title}
                      className="w-full h-52 object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Tip note if present */}
                {st.tip && (
                  <div className="mt-4 inline-flex items-center gap-2 p-3 rounded-xl bg-[#FFF6E0] border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] text-xs font-black text-[#3A3A3A]">
                    <Lightbulb className="w-4 h-4 text-[var(--color-secondary)] shrink-0" />
                    <span>Pro Tip: {st.tip}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
