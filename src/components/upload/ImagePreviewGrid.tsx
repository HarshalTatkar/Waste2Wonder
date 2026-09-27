import React from 'react';
import { X, CheckCircle } from 'lucide-react';
import { UploadedFileItem } from '../../hooks/useImageUpload';

interface ImagePreviewGridProps {
  images: UploadedFileItem[];
  onRemove: (id: string) => void;
  maxCount?: number;
}

export const ImagePreviewGrid: React.FC<ImagePreviewGridProps> = ({
  images,
  onRemove,
  maxCount = 4,
}) => {
  if (images.length === 0) return null;

  return (
    <div className="w-full mt-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-black text-sm uppercase tracking-wider text-[var(--color-text-accent-dark)]">
          Selected Waste Angles ({images.length}/{maxCount})
        </h4>
        <span className="text-xs font-bold text-[var(--color-text-accent-dark)]/70">
          Click the red cross to delete an angle
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {images.map((item, index) => (
          <div
            key={item.id}
            className="group relative aspect-square rounded-2xl border-[2.5px] border-[var(--color-text-accent-dark)] shadow-[4px_4px_0px_var(--color-text-accent-dark)] overflow-hidden bg-white"
          >
            <img
              src={item.previewUrl}
              alt={`Waste preview ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />

            {/* Corner badge */}
            <div className="absolute top-2 left-2 bg-white/95 px-2 py-0.5 rounded-lg border-[1.5px] border-[var(--color-text-accent-dark)] text-[10px] font-black shadow-[1.5px_1.5px_0px_var(--color-text-accent-dark)]">
              Angle {index + 1}
            </div>

            {/* Remove button */}
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="absolute top-2 right-2 p-1.5 bg-[#FF6B6B] text-white rounded-xl border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] hover:scale-110 active:scale-95 transition-all cursor-pointer"
              title="Remove photo"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>

            {/* Bottom filename */}
            <div className="absolute bottom-0 inset-x-0 bg-white/90 p-1.5 border-t border-[var(--color-text-accent-dark)] text-[10px] font-bold text-center truncate">
              {item.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
