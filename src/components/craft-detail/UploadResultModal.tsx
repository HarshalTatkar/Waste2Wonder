import React, { useState, useRef } from 'react';
import { Modal } from '../common/Modal';
import { ProjectSource } from '../../types/project';
import { Upload, Sparkles, CheckCircle2, Image as ImageIcon, X, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface UploadResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  craftTitle: string;
  referenceSource: ProjectSource;
  referenceId: string;
  creatorName?: string;
  onSubmitResult: (data: {
    implementedCraftTitle: string;
    uploadedResultPhoto: string;
    feedbackNote: string;
  }) => Promise<void>;
}

export const UploadResultModal: React.FC<UploadResultModalProps> = ({
  isOpen,
  onClose,
  craftTitle,
  referenceSource,
  creatorName,
  onSubmitResult,
}) => {
  const [title, setTitle] = useState(`My Build: ${craftTitle}`);
  const [photoUrl, setPhotoUrl] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlOption, setShowUrlOption] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewImage(result);
      setPhotoUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewImage(null);
    setPhotoUrl('');
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalPhoto = previewImage || photoUrl;
    if (!title.trim() || !finalPhoto || submitting) return;

    setSubmitting(true);
    try {
      await onSubmitResult({
        implementedCraftTitle: title,
        uploadedResultPhoto: finalPhoto,
        feedbackNote: feedback,
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        handleRemovePhoto();
        onClose();
      }, 1800);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Attach Your Finished Upcycle" maxWidth="lg">
      {success ? (
        <div className="py-8 text-center flex flex-col items-center gap-3 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-[#98EECC] text-black border-[3px] border-black shadow-[4px_4px_0px_#000] flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>
          <h3 className="text-2xl font-black text-black">
            Photo Uploaded & Saved!
          </h3>
          <p className="text-sm font-bold text-black/80 max-w-sm">
            {referenceSource === 'in_app'
              ? `Saved to your profile and linked to ${creatorName || 'original post'}'s build!`
              : 'Saved to your profile and added to your zero-waste impact counter!'}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {/* Build Title */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
              Your Build Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-white rounded-xl border-[2px] border-black shadow-[2px_2px_0px_#000] font-bold text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Genuine Local File Upload Section */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
              Upload Your Finished Photo <span className="text-[#E11D48]">*</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {!previewImage ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 sm:p-8 rounded-2xl border-[2.5px] border-dashed text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                  isDragging
                    ? 'border-black bg-[#98EECC]/30 scale-[1.01]'
                    : 'border-black bg-white hover:bg-[#FFFDF9] shadow-[3px_3px_0px_#000]'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-[#98EECC] border-[2px] border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-black mb-1">
                  <Upload className="w-6 h-6 stroke-[2.5]" />
                </div>
                <p className="font-black text-sm text-black">
                  Click to select photo or drag & drop here
                </p>
                <p className="text-xs font-bold text-black/60">
                  Supports JPG, PNG, WEBP from your phone or computer
                </p>
                <button
                  type="button"
                  className="mt-2 px-4 py-1.5 rounded-full border-[2px] border-black bg-white font-black text-xs text-black shadow-[2px_2px_0px_#000] hover:bg-black/5"
                >
                  Browse Files
                </button>
              </div>
            ) : (
              /* Photo Preview with remove/change controls */
              <div className="relative rounded-2xl border-[2.5px] border-black shadow-[4px_4px_0px_#000] overflow-hidden bg-black/5">
                <div className="aspect-video w-full max-h-[260px] overflow-hidden flex items-center justify-center bg-gray-50">
                  <img
                    src={previewImage}
                    alt="Uploaded preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-3 bg-white border-t-[2px] border-black flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <ImageIcon className="w-4 h-4 text-black shrink-0" />
                    <span className="text-xs font-black text-black truncate">
                      {fileName || 'Uploaded Photo'}
                    </span>
                    <span className="px-2 py-0.5 bg-[#98EECC] border border-black rounded text-[10px] font-black">
                      Ready
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-lg border-[1.5px] border-black bg-white text-xs font-bold flex items-center gap-1 hover:bg-black/5 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Change</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="p-1 rounded-lg border-[1.5px] border-black bg-[#FDA4AF] text-black hover:opacity-90 cursor-pointer"
                      title="Remove Photo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Optional URL Toggle */}
            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={() => setShowUrlOption(!showUrlOption)}
                className="text-[11px] font-black text-black/70 hover:text-black underline cursor-pointer"
              >
                {showUrlOption ? 'Hide URL input' : 'Or paste an image web link'}
              </button>
            </div>

            {showUrlOption && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="https://images.example.com/my-upcycle.jpg"
                  value={photoUrl.startsWith('data:') ? '' : photoUrl}
                  onChange={(e) => {
                    setPhotoUrl(e.target.value);
                    setPreviewImage(e.target.value);
                    setFileName('Linked URL Image');
                  }}
                  className="w-full px-3.5 py-2 bg-white rounded-xl border-[2px] border-black text-xs font-bold text-black"
                />
              </div>
            )}
          </div>

          {/* Notes & Crafting Experience */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
              Maker Notes & Modifications (Optional)
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What materials did you reuse? Any tweaks to the original steps?"
              className="w-full px-4 py-2.5 bg-white rounded-xl border-[2px] border-black text-xs sm:text-sm font-bold text-black resize-none focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border-[2px] border-black bg-white font-black text-xs text-black cursor-pointer hover:bg-black/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || (!previewImage && !photoUrl)}
              className={`px-6 py-2.5 rounded-full border-[2.5px] border-black font-black text-xs text-black shadow-[3px_3px_0px_#000] flex items-center gap-1.5 cursor-pointer transition-all ${
                submitting || (!previewImage && !photoUrl)
                  ? 'bg-gray-200 opacity-60 cursor-not-allowed shadow-none'
                  : 'bg-[#98EECC] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000] active:translate-y-0.5'
              }`}
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>{submitting ? 'Saving...' : 'Publish to Profile & Impact'}</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
