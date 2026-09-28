import React, { useRef, useState } from 'react';
import { Upload, Sparkles, Trash2, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { aiService } from '../../services/aiService';
import { supabase } from '../../lib/supabase';

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
  steps: stepsProp,
  onStepsChange,
  onAutoDetermine,
  onNext,
  onPrev,
}) => {
  // Guard against undefined being passed before parent state initialises
  const steps = stepsProp ?? [];
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    setAnalyzeError(null);
    try {
      // Ensure the bucket exists (creates it as public if missing)
      await supabase.storage.createBucket('uploads', { public: true }).catch(() => {/* already exists */});

      const urls: string[] = [];
      for (const file of files) {
        const path = `process/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
        const { error } = await supabase.storage.from('uploads').upload(path, file, { upsert: false });
        if (error) throw new Error(error.message);
        const { data } = supabase.storage.from('uploads').getPublicUrl(path);
        urls.push(data.publicUrl);
      }
      onImagesChange([...processImages, ...urls]);
    } catch (err) {
      setAnalyzeError((err as Error).message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    onImagesChange(processImages.filter((_, i) => i !== index));
  };

  const handleGenerateTutorial = async () => {
    if (processImages.length === 0) {
      setAnalyzeError('Please upload at least one process photo first.');
      return;
    }
    setAnalyzing(true);
    setAnalyzeError(null);
    try {
      const res = await aiService.autoGenerateTutorial(processImages, 'waste material');
      onStepsChange(res.steps);
      onAutoDetermine({ difficulty: res.difficulty, precautions: res.precautions });
    } catch (err) {
      setAnalyzeError((err as Error).message || 'AI generation failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStepChange = (index: number, field: 'title' | 'instructions', val: string) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: val };
    onStepsChange(updated);
  };

  const handleAddStep = () => {
    onStepsChange([...steps, { stepNumber: steps.length + 1, title: '', instructions: '' }]);
  };

  const handleRemoveStep = (index: number) => {
    onStepsChange(
      steps
        .filter((_, i) => i !== index)
        .map((s, i) => ({ ...s, stepNumber: i + 1 }))
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <span className="px-3 py-1 bg-[var(--color-primary)] text-white text-xs font-black rounded-lg uppercase tracking-wider">
          Step 2 of 4
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-[var(--color-text-accent-dark)] mt-2">
          Process Photos & Tutorial
        </h3>
        <p className="text-sm font-bold text-[var(--color-text-accent-dark)]/70 mt-1">
          Upload photos of each stage of your craft. Our AI will generate step-by-step instructions from them.
        </p>
      </div>

      {/* Process Images Upload */}
      <div className="neu-card bg-white border-[2.5px] border-[var(--color-text-accent-dark)] shadow-[4px_4px_0px_var(--color-text-accent-dark)] rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h4 className="font-black text-sm uppercase tracking-wider text-[var(--color-text-accent-dark)]">
            Process Photos ({processImages.length})
          </h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            icon={<Upload className="w-4 h-4" />}
          >
            {uploading ? 'Uploading…' : 'Upload Photos'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        {/* Drop zone when empty */}
        {processImages.length === 0 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-12 rounded-xl border-[2px] border-dashed border-[var(--color-text-accent-dark)]/40 bg-[var(--color-background)] flex flex-col items-center justify-center gap-2 hover:bg-white transition-colors cursor-pointer"
          >
            <Upload className="w-8 h-8 text-[var(--color-text-accent-dark)]/40" />
            <span className="text-sm font-black text-[var(--color-text-accent-dark)]/60">
              Click to upload process photos
            </span>
            <span className="text-xs font-bold text-[var(--color-text-accent-dark)]/40">
              JPG, PNG, WEBP — upload multiple stages
            </span>
          </button>
        )}

        {/* Thumbnail grid */}
        {processImages.length > 0 && (
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
                  className="absolute top-1.5 right-1.5 p-1 bg-[#FF6B6B] text-white rounded border border-[var(--color-text-accent-dark)] hover:scale-110 transition-transform cursor-pointer"
                >
                  <Trash2 className="w-3 h-3 stroke-[2.5]" />
                </button>
                <span className="absolute bottom-1 left-1 bg-white/90 text-[10px] font-black px-1 rounded">
                  Stage {idx + 1}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {analyzeError && (
          <div className="flex items-start gap-2 p-3 bg-[#FF6B6B]/20 border border-[#FF6B6B] rounded-xl mb-3">
            <AlertCircle className="w-4 h-4 text-[#FF6B6B] shrink-0 mt-0.5" />
            <p className="text-xs font-bold text-[var(--color-text-accent-dark)]">{analyzeError}</p>
          </div>
        )}

        {/* AI Action */}
        <Button
          type="button"
          variant="secondary"
          size="md"
          fullWidth
          disabled={analyzing || processImages.length === 0}
          onClick={handleGenerateTutorial}
          icon={<Sparkles className="w-5 h-5 text-[#FFD166]" />}
        >
          {analyzing ? 'AI Analyzing Photos & Generating Steps…' : '⚡ Auto-Generate Tutorial from Photos'}
        </Button>
      </div>

      {/* Editable Steps */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-black text-lg text-[var(--color-text-accent-dark)]">
            {steps.length > 0 ? 'Review & Edit Steps' : 'Add Steps Manually'}
          </h4>
          <Button type="button" variant="outline" size="sm" onClick={handleAddStep}>
            + Add Step
          </Button>
        </div>

        {steps.length === 0 && (
          <p className="text-sm font-bold text-[var(--color-text-accent-dark)]/50 text-center py-6 border-[2px] border-dashed border-[var(--color-text-accent-dark)]/20 rounded-xl">
            Upload photos and click Auto-Generate, or add steps manually.
          </p>
        )}

        {steps.map((st, idx) => (
          <div
            key={idx}
            className="bg-white border-[2px] border-[var(--color-text-accent-dark)] shadow-[3px_3px_0px_var(--color-text-accent-dark)] rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 rounded-lg bg-[var(--color-secondary)] text-white text-xs font-black flex items-center justify-center shrink-0">
                {st.stepNumber}
              </span>
              <input
                type="text"
                value={st.title}
                onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                className="flex-1 px-3 py-1.5 bg-[var(--color-background)] rounded-lg border border-[var(--color-text-accent-dark)] font-black text-sm"
                placeholder="Step title…"
              />
              <button
                type="button"
                onClick={() => handleRemoveStep(idx)}
                className="p-1 text-[#FF6B6B] hover:scale-110 transition-transform cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <textarea
              rows={2}
              value={st.instructions}
              onChange={(e) => handleStepChange(idx, 'instructions', e.target.value)}
              className="w-full px-3 py-1.5 bg-[var(--color-background)] rounded-lg border border-[var(--color-text-accent-dark)] font-bold text-xs sm:text-sm resize-none"
              placeholder="Step instructions…"
            />
          </div>
        ))}
      </div>

      {/* Nav */}
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
