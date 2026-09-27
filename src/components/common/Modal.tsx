import React, { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass =
    maxWidth === 'sm'
      ? 'max-w-sm'
      : maxWidth === 'lg'
      ? 'max-w-2xl'
      : maxWidth === 'xl'
      ? 'max-w-3xl'
      : maxWidth === '2xl'
      ? 'max-w-4xl'
      : 'max-w-lg';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative z-10 w-full ${maxWidthClass} bg-[var(--color-background)] border-[3px] border-[var(--color-text-accent-dark)] shadow-[8px_8px_0px_var(--color-text-accent-dark)] rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b-[2px] border-[var(--color-text-accent-dark)]">
          {title && (
            <h3 className="text-xl sm:text-2xl font-black text-[var(--color-text-accent-dark)]">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border-[2px] border-[var(--color-text-accent-dark)] bg-white text-[var(--color-text-accent-dark)] hover:bg-[var(--color-secondary)] hover:text-white transition-all shadow-[2px_2px_0px_var(--color-text-accent-dark)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
