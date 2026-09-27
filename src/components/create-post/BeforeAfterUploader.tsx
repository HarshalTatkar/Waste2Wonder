import React, { useRef } from 'react';
import { Upload, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

interface BeforeAfterUploaderProps {
  beforeImage: string;
  afterImage: string;
  onBeforeChange: (url: string) => void;
  onAfterChange: (url: string) => void;
  onNext: () => void;
}

export const BeforeAfterUploader: React.FC<BeforeAfterUploaderProps> = ({
  beforeImage,
  afterImage,
  onBeforeChange,
  onAfterChange,
  onNext,
}) => {
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  const sampleBefores = [
    'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
  ];

  const sampleAfters = [
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'before' | 'after') => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      if (target === 'before') onBeforeChange(url);
      else onAfterChange(url);
    }
  };

  const isComplete = Boolean(beforeImage && afterImage);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <span className="px-3 py-1 bg-[var(--color-primary)] text-white text-xs font-black rounded-lg uppercase tracking-wider">
          Step 1 of 4
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-[var(--color-text-accent-dark)] mt-2">
          Upload Before & After Transformation
        </h3>
        <p className="text-sm font-bold text-[var(--color-text-accent-dark)]/70 mt-1">
          Every great upcycle story begins with discarded waste and ends with functional beauty. Both images are required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Before Upload Card */}
        <div className="neu-card bg-white border-[2.5px] border-[var(--color-text-accent-dark)] shadow-[4px_4px_0px_var(--color-text-accent-dark)] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 bg-[var(--color-secondary)] text-white font-black text-xs rounded-lg uppercase">
              1. Before (The Waste)
            </span>
            {beforeImage && (
              <span className="flex items-center gap-1 text-xs font-black text-[var(--color-primary)]">
                <CheckCircle2 className="w-4 h-4" /> Ready
              </span>
            )}
          </div>

          <div
            onClick={() => beforeInputRef.current?.click()}
            className="aspect-video rounded-xl border-[2px] border-dashed border-[var(--color-text-accent-dark)] bg-[var(--color-background)] overflow-hidden cursor-pointer flex flex-col items-center justify-center text-center p-4 hover:bg-white transition-colors relative"
          >
            <input
              ref={beforeInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'before')}
            />

            {beforeImage ? (
              <img src={beforeImage} alt="Before Preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <Upload className="w-8 h-8 text-[var(--color-secondary)] mb-2" />
                <p className="font-extrabold text-sm text-[var(--color-text-accent-dark)]">
                  Click to select Before photo
                </p>
                <p className="text-[11px] font-bold text-[var(--color-text-accent-dark)]/60 mt-1">
                  Or pick a sample prototype below
                </p>
              </>
            )}
          </div>

          {/* Quick sample buttons */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] font-black text-[var(--color-text-accent-dark)]/60 uppercase">
              Sample:
            </span>
            {sampleBefores.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onBeforeChange(s)}
                className="px-2 py-1 bg-[var(--color-background)] border border-[var(--color-text-accent-dark)] rounded text-[10px] font-bold hover:bg-[var(--color-secondary)] hover:text-white transition-colors cursor-pointer"
              >
                Sample #{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* After Upload Card */}
        <div className="neu-card bg-white border-[2.5px] border-[var(--color-text-accent-dark)] shadow-[4px_4px_0px_var(--color-text-accent-dark)] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 bg-[var(--color-primary)] text-white font-black text-xs rounded-lg uppercase">
              2. After (The Upcycled Craft)
            </span>
            {afterImage && (
              <span className="flex items-center gap-1 text-xs font-black text-[var(--color-primary)]">
                <CheckCircle2 className="w-4 h-4" /> Ready
              </span>
            )}
          </div>

          <div
            onClick={() => afterInputRef.current?.click()}
            className="aspect-video rounded-xl border-[2px] border-dashed border-[var(--color-text-accent-dark)] bg-[var(--color-background)] overflow-hidden cursor-pointer flex flex-col items-center justify-center text-center p-4 hover:bg-white transition-colors relative"
          >
            <input
              ref={afterInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'after')}
            />

            {afterImage ? (
              <img src={afterImage} alt="After Preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <Upload className="w-8 h-8 text-[var(--color-primary)] mb-2" />
                <p className="font-extrabold text-sm text-[var(--color-text-accent-dark)]">
                  Click to select After photo
                </p>
                <p className="text-[11px] font-bold text-[var(--color-text-accent-dark)]/60 mt-1">
                  Show off the finished creation
                </p>
              </>
            )}
          </div>

          {/* Quick sample buttons */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] font-black text-[var(--color-text-accent-dark)]/60 uppercase">
              Sample:
            </span>
            {sampleAfters.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onAfterChange(s)}
                className="px-2 py-1 bg-[var(--color-background)] border border-[var(--color-text-accent-dark)] rounded text-[10px] font-bold hover:bg-[var(--color-primary)] hover:text-white transition-colors cursor-pointer"
              >
                Sample #{idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          variant="primary"
          size="md"
          disabled={!isComplete}
          onClick={onNext}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Continue to Process Images
        </Button>
      </div>
    </div>
  );
};
