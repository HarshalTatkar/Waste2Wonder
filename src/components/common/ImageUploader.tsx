import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { UploadedFileItem } from '../../hooks/useImageUpload';

interface ImageUploaderProps {
  images: UploadedFileItem[];
  onAddFiles: (files: FileList | File[]) => void;
  onRemoveImage: (id: string) => void;
  maxCount?: number;
  label?: string;
  sublabel?: string;
  error?: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onAddFiles,
  onRemoveImage,
  maxCount = 4,
  label = 'Drop waste photos here or browse',
  sublabel = 'Upload up to 4 clear photos from different angles (PNG, JPG, WEBP)',
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const isFull = images.length >= maxCount;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isFull) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isFull && e.dataTransfer.files) {
      onAddFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddFiles(e.target.files);
      e.target.value = ''; // reset so same files can be re-selected if needed
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (!isFull && fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
        className={`neu-card border-[2.5px] border-dashed transition-all duration-150 p-6 sm:p-8 flex flex-col items-center justify-center text-center select-none ${
          isFull
            ? 'opacity-60 cursor-not-allowed bg-gray-100 border-[var(--color-text-accent-dark)]'
            : isDragging
            ? 'bg-[#EBF0E4] border-[var(--color-primary)] scale-[1.01]'
            : 'bg-white/90 border-[var(--color-text-accent-dark)] hover:bg-[#F5F1E8] cursor-pointer'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          disabled={isFull}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)] border-[2.5px] border-[var(--color-text-accent-dark)] shadow-[3px_3px_0px_var(--color-text-accent-dark)] flex items-center justify-center text-white mb-3">
          <Upload className="w-7 h-7 stroke-[2.5]" />
        </div>

        <p className="font-extrabold text-base sm:text-lg text-[var(--color-text-accent-dark)]">
          {isFull ? `Upload limit reached (${maxCount}/${maxCount} photos)` : label}
        </p>

        <p className="text-xs sm:text-sm text-[var(--color-text-accent-dark)]/70 mt-1 max-w-sm">
          {sublabel}
        </p>

        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--color-background)] border-[2px] border-[var(--color-text-accent-dark)] rounded-lg text-xs font-black shadow-[2px_2px_0px_var(--color-text-accent-dark)]">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>
            {images.length} / {maxCount} photos added
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-[#FF6B6B]/15 border-[2px] border-[#FF6B6B] text-[var(--color-text-accent-dark)] font-bold text-xs p-2.5 rounded-xl shadow-[2px_2px_0px_#FF6B6B]">
          {error}
        </div>
      )}

      {/* Removable Thumbnails */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="relative aspect-square rounded-xl border-[2.5px] border-[var(--color-text-accent-dark)] shadow-[3px_3px_0px_var(--color-text-accent-dark)] overflow-hidden bg-white group"
            >
              <img
                src={img.previewUrl}
                alt={`Upload preview ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 left-1 bg-white/90 border border-[var(--color-text-accent-dark)] px-1.5 py-0.5 rounded text-[10px] font-black">
                #{idx + 1}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveImage(img.id);
                }}
                className="absolute top-1.5 right-1.5 p-1 bg-[var(--color-secondary)] text-white border-[2px] border-[var(--color-text-accent-dark)] rounded-lg shadow-[2px_2px_0px_var(--color-text-accent-dark)] hover:scale-110 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-transform"
                title="Remove photo"
              >
                <X className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
