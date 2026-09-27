import React, { useState } from 'react';
import { Modal } from './Modal';
import { CheckCircle2, Clock, DollarSign, AlertTriangle, Sparkles, CheckSquare, Square, ChevronRight } from 'lucide-react';

export interface ProcessModalCraft {
  title: string;
  material?: string;
  difficulty?: string;
  timeRequired?: string;
  estimatedCost?: string;
  coverImage?: string;
  description?: string;
  materialsNeeded?: string[];
  steps?: Array<{
    stepNumber: number;
    title: string;
    instructions: string;
    image?: string;
    tip?: string;
  }>;
  precautions?: string[];
  creatorName?: string;
}

interface ImplementationProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  craft: ProcessModalCraft;
  onProceedToAttachWork: () => void;
}

export const ImplementationProcessModal: React.FC<ImplementationProcessModalProps> = ({
  isOpen,
  onClose,
  craft,
  onProceedToAttachWork,
}) => {
  const [checkedMaterials, setCheckedMaterials] = useState<Record<number, boolean>>({});

  const toggleMaterial = (idx: number) => {
    setCheckedMaterials((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Fallback default steps if not provided on the craft
  const steps = craft.steps && craft.steps.length > 0 ? craft.steps : [
    {
      stepNumber: 1,
      title: 'Inspect & Clean Waste Material',
      instructions: `Sanitize the ${craft.material || 'recycled material'} thoroughly and remove any paper labels or residue with warm water.`,
    },
    {
      stepNumber: 2,
      title: 'Measure & Cut Components',
      instructions: 'Carefully follow dimensions using safety scissors or craft knife on a flat protected surface.',
    },
    {
      stepNumber: 3,
      title: 'Assemble & Finish',
      instructions: 'Join structural parts securely with glue, screws, or twine. Allow bond to cure before daily use.',
    },
  ];

  const materials = craft.materialsNeeded && craft.materialsNeeded.length > 0 ? craft.materialsNeeded : [
    `Clean ${craft.material || 'waste'} item`,
    'Craft scissors or utility knife',
    'Adhesive or binder (PVA glue / thread / wire)',
    'Ruler or measuring tape',
  ];

  const precautions = craft.precautions && craft.precautions.length > 0 ? craft.precautions : [
    'Always cut away from yourself on a stable cutting board.',
    'Keep adhesives in well-ventilated areas.',
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="How to Build — Implementation Process"
      maxWidth="xl"
    >
      <div className="space-y-6 text-left">
        {/* Craft Overview Header Card */}
        <div className="bg-[#FFFDF9] border-[2.5px] border-black rounded-2xl p-5 shadow-[4px_4px_0px_#000]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b-[2px] border-black/15">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {craft.material && (
                  <span className="px-2.5 py-0.5 bg-white border-[1.5px] border-black rounded-full text-[10px] font-black uppercase">
                    {craft.material}
                  </span>
                )}
                {craft.difficulty && (
                  <span className="px-2.5 py-0.5 bg-[#FDA4AF] border-[1.5px] border-black rounded-full text-[10px] font-black uppercase">
                    {craft.difficulty}
                  </span>
                )}
                {craft.creatorName && (
                  <span className="text-xs font-bold text-black/60">
                    By {craft.creatorName}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-black text-black">
                {craft.title}
              </h2>
            </div>

            {/* Quick Specs Badges */}
            <div className="flex items-center gap-2 text-xs font-black">
              {craft.timeRequired && (
                <span className="px-3 py-1.5 bg-[#FEF08A] border-[2px] border-black rounded-xl shadow-[2px_2px_0px_#000] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {craft.timeRequired}
                </span>
              )}
              {craft.estimatedCost && (
                <span className="px-3 py-1.5 bg-[#98EECC] border-[2px] border-black rounded-xl shadow-[2px_2px_0px_#000] flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  {craft.estimatedCost}
                </span>
              )}
            </div>
          </div>

          {craft.description && (
            <p className="text-xs sm:text-sm font-bold text-black/80 mt-3 leading-relaxed">
              {craft.description}
            </p>
          )}
        </div>

        {/* Materials Needed Checklist */}
        <div className="bg-white border-[2.5px] border-black rounded-2xl p-5 shadow-[4px_4px_0px_#000]">
          <h4 className="font-black text-base text-black mb-1 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            Materials & Tools Needed (Tap to check off)
          </h4>
          <p className="text-xs font-bold text-black/60 mb-3">
            Gather these recycled items and household tools before starting.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {materials.map((mat, idx) => {
              const isChecked = Boolean(checkedMaterials[idx]);
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => toggleMaterial(idx)}
                  className={`p-2.5 rounded-xl border-[2px] border-black text-xs font-bold flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-[#98EECC] text-black shadow-[2px_2px_0px_#000]'
                      : 'bg-white hover:bg-black/5'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-black shrink-0 stroke-[2.5]" />
                  ) : (
                    <Square className="w-4 h-4 text-black/50 shrink-0 stroke-[2]" />
                  )}
                  <span className={isChecked ? 'line-through opacity-80' : ''}>
                    {mat}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step-by-Step Implementation Guide */}
        <div className="bg-white border-[2.5px] border-black rounded-2xl p-5 shadow-[4px_4px_0px_#000]">
          <h4 className="font-black text-base text-black mb-3">
            Step-by-Step Instructions
          </h4>

          <div className="space-y-4">
            {steps.map((st, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border-[2px] border-black bg-[#FFFDF9] shadow-[2px_2px_0px_#000] flex flex-col gap-2"
              >
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-black text-white font-black text-xs flex items-center justify-center shrink-0">
                    0{st.stepNumber || idx + 1}
                  </span>
                  <h5 className="font-black text-sm text-black">
                    {st.title}
                  </h5>
                </div>

                <p className="text-xs font-bold text-black/80 pl-9 leading-relaxed">
                  {st.instructions}
                </p>

                {st.tip && (
                  <div className="ml-9 p-2 rounded-lg bg-[#FEF9C3] border border-black text-[11px] font-bold text-black flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                    <span><strong>Pro Tip:</strong> {st.tip}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Safety Precautions Box */}
        {precautions.length > 0 && (
          <div className="p-4 rounded-xl border-[2px] border-black bg-[#FEF2F2] shadow-[3px_3px_0px_#000] flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
            <div className="text-xs font-bold text-black/85">
              <span className="font-black uppercase tracking-wider text-[#991B1B] block mb-1">
                Safety Notes
              </span>
              <ul className="list-disc list-inside space-y-0.5">
                {precautions.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Bottom CTA to attach work after reading process */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-[2px] border-black/20">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border-[2px] border-black bg-white font-black text-xs text-black cursor-pointer hover:bg-black/5"
          >
            Close Guide
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onProceedToAttachWork();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-full border-[2.5px] border-black bg-[#98EECC] font-black text-sm text-black shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>I Built This! Attach My Work / Upload Photo</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </Modal>
  );
};
