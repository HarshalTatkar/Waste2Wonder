import React, { useRef, useState } from 'react';
import { UploadCloud, Camera, ImagePlus, AlertCircle } from 'lucide-react';

interface DropZoneProps {
  onFilesSelected: (files: FileList | File[]) => void;
  disabled?: boolean;
  currentCount: number;
  maxCount?: number;
}

export const DropZone: React.FC<DropZoneProps> = ({
  onFilesSelected,
  disabled = false,
  currentCount,
  maxCount = 4,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFull = currentCount >= maxCount;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isFull) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!disabled && !isFull && e.dataTransfer.files) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => {
        if (!disabled && !isFull && fileInputRef.current) {
          fileInputRef.current.click();
        }
      }}
      className={`border-[3px] border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all select-none ${
        isFull
          ? 'bg-gray-100 border-[var(--color-text-accent-dark)]/40 cursor-not-allowed opacity-75'
          : isDragOver
          ? 'bg-[#EBF0E4] border-[var(--color-primary)] scale-[1.01] shadow-[6px_6px_0px_var(--color-text-accent-dark)]'
          : 'bg-white border-[var(--color-text-accent-dark)] hover:bg-[#F5F1E8] cursor-pointer shadow-[4px_4px_0px_var(--color-text-accent-dark)] hover:shadow-[6px_6px_0px_var(--color-text-accent-dark)]'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        disabled={disabled || isFull}
        onChange={(e) => {
          if (e.target.files) {
            onFilesSelected(e.target.files);
            e.target.value = '';
          }
        }}
        className="hidden"
      />

      <div className="w-18 h-18 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-[var(--color-primary)] border-[3px] border-[var(--color-text-accent-dark)] shadow-[4px_4px_0px_var(--color-text-accent-dark)] flex items-center justify-center text-white mb-5">
        <UploadCloud className="w-10 h-10 stroke-[2.5]" />
      </div>

      <h3 className="text-xl sm:text-2xl font-black text-[var(--color-text-accent-dark)] mb-2">
        {isFull ? 'Photo Limit Reached' : 'Drag & Drop Your Waste Photo Here'}
      </h3>

      <p className="text-sm font-bold text-[var(--color-text-accent-dark)]/70 max-w-md mx-auto mb-5">
        {isFull
          ? `You have attached the maximum ${maxCount} photos. Remove any thumbnail below to swap.`
          : `Upload up to ${maxCount} clear photos. Show tears, cracks, labels, or textures from different perspectives.`}
      </p>

      {!isFull && (
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-secondary)] text-white font-extrabold text-sm rounded-xl border-[2.5px] border-[var(--color-text-accent-dark)] shadow-[3px_3px_0px_var(--color-text-accent-dark)]">
          <Camera className="w-4 h-4 stroke-[2.5]" />
          <span>Or Choose from Device</span>
        </div>
      )}

      {isFull && (
        <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFF6E0] border-[2px] border-[var(--color-text-accent-dark)] rounded-xl text-xs font-black text-[var(--color-text-accent-dark)]">
          <AlertCircle className="w-4 h-4 text-[var(--color-secondary)]" />
          <span>4/4 slots occupied</span>
        </div>
      )}
    </div>
  );
};
