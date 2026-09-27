import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ProjectSource } from '../../types/project';
import { Upload, Sparkles, CheckCircle2, Leaf, Heart } from 'lucide-react';
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
  referenceId,
  creatorName,
  onSubmitResult,
}) => {
  const [title, setTitle] = useState(`My Build: ${craftTitle}`);
  const [photoUrl, setPhotoUrl] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const samplePhotos = [
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1459156212016-c812468e2115?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || submitting) return;

    setSubmitting(true);
    try {
      const selectedImg = photoUrl || samplePhotos[0];
      await onSubmitResult({
        implementedCraftTitle: title,
        uploadedResultPhoto: selectedImg,
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
        onClose();
      }, 2000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Your Finished Craft" maxWidth="lg">
      {success ? (
        <div className="py-8 text-center flex flex-col items-center gap-3 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] text-white border-[3px] border-[var(--color-text-accent-dark)] shadow-[4px_4px_0px_var(--color-text-accent-dark)] flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>
          <h3 className="text-2xl font-black text-[var(--color-text-accent-dark)]">
            Upcycle Verified & Saved!
          </h3>
          <p className="text-sm font-bold text-[var(--color-text-accent-dark)]/80 max-w-sm">
            {referenceSource === 'in_app'
              ? `Saved to your profile and linked to ${creatorName || 'original post'}'s showcase!`
              : 'Saved to your profile and logged in your zero-waste environmental impact tracker!'}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Context pill explaining spec behavior */}
          <div className="p-3.5 bg-[var(--color-background)] border-[2px] border-[var(--color-text-accent-dark)] rounded-xl shadow-[2px_2px_0px_var(--color-text-accent-dark)] text-xs font-bold text-[var(--color-text-accent-dark)]">
            {referenceSource === 'in_app' ? (
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#FF6B6B] shrink-0" />
                <span>
                  Linking back to original post by <strong>{creatorName}</strong> and boosting their implementation count!
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                <span>
                  Logging this completed project into your <strong>Environmental Footprint & Impact Tracking</strong>!
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[var(--color-text-accent-dark)] mb-1">
              Your Build Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-white rounded-xl border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] font-bold text-sm"
            />
          </div>

          {/* Photo Selection / URL */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[var(--color-text-accent-dark)] mb-1">
              Finished Result Photo
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {samplePhotos.map((url, idx) => (
                <div
                  key={idx}
                  onClick={() => setPhotoUrl(url)}
                  className={`aspect-video rounded-xl border-[2px] overflow-hidden cursor-pointer transition-all ${
                    (photoUrl || samplePhotos[0]) === url
                      ? 'border-[var(--color-secondary)] shadow-[3px_3px_0px_var(--color-secondary)]'
                      : 'border-[var(--color-text-accent-dark)] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="Option" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <input
              type="text"
              placeholder="Or paste an image URL..."
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full px-3 py-2 bg-white rounded-xl border-[2px] border-[var(--color-text-accent-dark)] text-xs font-bold"
            />
          </div>

          {/* Feedback note */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[var(--color-text-accent-dark)] mb-1">
              Notes & Craft Experience (Optional)
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Any modifications you made, tools you substituted, or tips for others..."
              className="w-full px-4 py-2 bg-white rounded-xl border-[2px] border-[var(--color-text-accent-dark)] text-xs sm:text-sm font-bold resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={submitting}
              icon={<Sparkles className="w-4 h-4 text-[#FFD166]" />}
            >
              {submitting ? 'Verifying...' : 'Publish to Profile & Impact'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
