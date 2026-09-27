import React, { useState } from 'react';
import { Upload, Sparkles, Plus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '../common/Button';
import { aiService } from '../../services/aiService';

interface ProcessStep {
  stepNumber: number;
  title: string;
  instructions: string;
}

interface ProcessImagesUploaderProps {
  processImages: string[];
  onImagesChange: (images: string[]) => void;
  steps: ProcessStep[];
  onStepsChange: (steps: ProcessStep[]) => void;
  onAutoDetermine: (data: { difficulty: 'Easy' | 'Medium' | 'Hard'; precautions: string[] }) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const ProcessImagesUploader: React.FC<ProcessImagesUploaderProps> = ({
  processImages,
  onImagesChange,
  steps,
  onStepsChange,
  onAutoDetermine,
  onNext,
  onPrev,
}) => {
  const [analyzing, setAnalyzing] = useState(false);

  const sampleProcessImages = [
    'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
  ];

  const handleAddSample = (url: string) => {
    if (!processImages.includes(url)) {
      onImagesChange([...processImages, url]);
    }
  };

  const handleRemoveImage = (index: number) => {
    onImagesChange(processImages.filter((_, i) => i !== index));
  };

  const handleGenerateTutorial = async () => {
    setAnalyzing(true);
    try {
      const res = await aiService.autoGenerateTutorial(
        processImages.length > 0 ? processImages : sampleProcessImages,
        'Fabric'
      );
      onStepsChange(res.steps);
      onAutoDetermine({
        difficulty: res.difficulty,
        precautions: res.precautions,
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStepChange = (index: number, field: 'title' | 'instructions', val: string) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: val };
    onStepsChange(updated);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <span className="px-3 py-1 bg-[var(--color-primary)] text-white text-xs font-black rounded-lg uppercase tracking-wider">
          Step 2 of 4
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-[var(--color-text-accent-dark)] mt-2">
          Process Photos & AI Tutorial Generation
        </h3>
        <p className="text-sm font-bold text-[var(--color-text-accent-dark)]/70 mt-1">
          Upload snapshots of your intermediate steps. Our AI scans the visual sequence to automatically synthesize clear, readable instructions.
        </p>
      </div>

      {/* Process Images Gallery */}
      <div className="neu-card bg-white border-[2.5px] border-[var(--color-text-accent-dark)] shadow-[4px_4px_0px_var(--color-text-accent-dark)] rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h4 className="font-black text-sm uppercase tracking-wider text-[var(--color-text-accent-dark)]">
            Uploaded Process Photos ({processImages.length})
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[var(--color-text-accent-dark)]/70">
              Quick insert:
            </span>
            {sampleProcessImages.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAddSample(s)}
                className="px-2 py-1 bg-[var(--color-background)] border border-[var(--color-text-accent-dark)] rounded text-[10px] font-bold hover:bg-[var(--color-primary)] hover:text-white transition-colors cursor-pointer"
              >
                Stage #{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Thumbnail grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {processImages.map((url, idx) => (
            <div
              key={idx}
              className="relative aspect-video rounded-xl border-[2px] border-[var(--color-text-accent-dark)] overflow-hidden bg-gray-100 group shadow-[2px_2px_0px_var(--color-text-accent-dark)]"
            >
              <img src={url} alt={`Stage ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1.5 right-1.5 p-1 bg-[#FF6B6B] text-white rounded border border-[var(--color-text-accent-dark)] shadow-xs hover:scale-110 transition-transform cursor-pointer"
              >
                <Trash2 className="w-3 h-3 stroke-[2.5]" />
              </button>
              <span className="absolute bottom-1 left-1 bg-white/90 text-[10px] font-black px-1 rounded">
                Stage {idx + 1}
              </span>
            </div>
          ))}

          {/* Add more button */}
          <button
            type="button"
            onClick={() => handleAddSample(sampleProcessImages[processImages.length % sampleProcessImages.length])}
            className="aspect-video rounded-xl border-[2px] border-dashed border-[var(--color-text-accent-dark)] bg-[var(--color-background)] flex flex-col items-center justify-center text-xs font-black text-[var(--color-text-accent-dark)] hover:bg-white transition-colors cursor-pointer"
          >
            <Plus className="w-5 h-5 mb-1" />
            <span>Add Stage</span>
          </button>
        </div>

        {/* AI Action Trigger */}
        <div className="pt-2">
          <Button
            type="button"
            variant="secondary"
            size="md"
            fullWidth
            disabled={analyzing}
            onClick={handleGenerateTutorial}
            icon={<Sparkles className="w-5 h-5 text-[#FFD166]" />}
          >
            {analyzing
              ? 'AI Analyzing Process Photos & Generating Steps...'
              : '⚡ Auto-Generate Step-by-Step Tutorial from Photos'}
          </Button>
        </div>
      </div>

      {/* Editable Tutorial Steps */}
      {steps.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-black text-lg text-[var(--color-text-accent-dark)]">
            Review & Edit AI-Generated Steps
          </h4>
          {steps.map((st, idx) => (
            <div
              key={idx}
              className="bg-white border-[2px] border-[var(--color-text-accent-dark)] shadow-[3px_3px_0px_var(--color-text-accent-dark)] rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-7 h-7 rounded-lg bg-[var(--color-secondary)] text-white text-xs font-black flex items-center justify-center">
                  {st.stepNumber}
                </span>
                <input
                  type="text"
                  value={st.title}
                  onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-[var(--color-background)] rounded-lg border border-[var(--color-text-accent-dark)] font-black text-sm"
                  placeholder="Step title..."
                />
              </div>
              <textarea
                rows={2}
                value={st.instructions}
                onChange={(e) => handleStepChange(idx, 'instructions', e.target.value)}
                className="w-full px-3 py-1.5 bg-[var(--color-background)] rounded-lg border border-[var(--color-text-accent-dark)] font-bold text-xs sm:text-sm resize-none"
                placeholder="Step instructions..."
              />
            </div>
          ))}
        </div>
      )}

      {/* Nav buttons */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" size="md" onClick={onPrev} icon={<ArrowLeft className="w-4 h-4" />}>
          Back
        </Button>
        <Button
          variant="primary"
          size="md"
          disabled={steps.length === 0}
          onClick={onNext}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Continue to Materials & Specs
        </Button>
      </div>
    </div>
  );
};
