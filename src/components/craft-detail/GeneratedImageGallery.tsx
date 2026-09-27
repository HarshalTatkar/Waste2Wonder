import React, { useState } from 'react';
import { Sparkles, Eye, Layers } from 'lucide-react';

interface GeneratedImageGalleryProps {
  finalOutputImage: string;
  inProgressImages?: string[];
}

export const GeneratedImageGallery: React.FC<GeneratedImageGalleryProps> = ({
  finalOutputImage,
  inProgressImages = [],
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(finalOutputImage);
  const [activeStage, setActiveStage] = useState<string>('Final Output');

  return (
    <div className="bg-white border-[2.5px] border-[var(--color-text-accent-dark)] shadow-[4px_4px_0px_var(--color-text-accent-dark)] rounded-3xl p-6 sm:p-8 my-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-6 border-b-[2px] border-[var(--color-text-accent-dark)]/20">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFD166] text-[#3A3A3A] border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] rounded-lg text-xs font-black mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#C97C5D]" />
            <span>AI SYNTHESIS VISUAL GALLERY</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[var(--color-text-accent-dark)]">
            AI Multi-Stage Visual Roadmap
          </h3>
          <p className="text-xs sm:text-sm font-bold text-[var(--color-text-accent-dark)]/70">
            Compare your live physical build against each generated stage milestone
          </p>
        </div>

        <span className="px-3 py-1.5 bg-[var(--color-background)] border-[2px] border-[var(--color-text-accent-dark)] rounded-xl text-xs font-black text-[var(--color-text-accent-dark)] flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-[var(--color-primary)]" />
          <span>Active: {activeStage}</span>
        </span>
      </div>

      {/* Main Showcase Image */}
      <div className="relative aspect-video sm:aspect-21/9 w-full rounded-2xl border-[3px] border-[var(--color-text-accent-dark)] shadow-[5px_5px_0px_var(--color-text-accent-dark)] overflow-hidden bg-gray-100 mb-6">
        <img
          src={selectedImage}
          alt={activeStage}
          className="w-full h-full object-cover transition-all duration-300"
        />
        <div className="absolute top-3 left-3 bg-white/95 px-3 py-1 rounded-xl border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] text-xs font-black text-[var(--color-text-accent-dark)]">
          {activeStage}
        </div>
      </div>

      {/* Thumbnails Row: Final Output + In-Progress Stage Images */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Final Output Tile */}
        <div
          onClick={() => {
            setSelectedImage(finalOutputImage);
            setActiveStage('Final Output');
          }}
          className={`relative aspect-video rounded-xl border-[2px] overflow-hidden cursor-pointer transition-all ${
            selectedImage === finalOutputImage
              ? 'border-[var(--color-secondary)] shadow-[4px_4px_0px_var(--color-secondary)] scale-102'
              : 'border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] hover:-translate-y-0.5'
          }`}
        >
          <img
            src={finalOutputImage}
            alt="Final Output"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="bg-[#FFD166] text-[#3A3A3A] px-2 py-0.5 rounded text-[10px] font-black border border-[#3A3A3A]">
              ★ Final Goal
            </span>
          </div>
        </div>

        {/* In-Progress Stages */}
        {inProgressImages.map((stageImg, idx) => {
          const stageName = `Stage ${idx + 1} Progress`;
          const isSelected = selectedImage === stageImg;

          return (
            <div
              key={idx}
              onClick={() => {
                setSelectedImage(stageImg);
                setActiveStage(stageName);
              }}
              className={`relative aspect-video rounded-xl border-[2px] overflow-hidden cursor-pointer transition-all ${
                isSelected
                  ? 'border-[var(--color-primary)] shadow-[4px_4px_0px_var(--color-primary)] scale-102'
                  : 'border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] hover:-translate-y-0.5'
              }`}
            >
              <img
                src={stageImg}
                alt={stageName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <span className="bg-white text-[#3A3A3A] px-2 py-0.5 rounded text-[10px] font-black border border-[#3A3A3A]">
                  Stage {idx + 1}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
