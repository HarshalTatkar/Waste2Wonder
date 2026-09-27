import React from 'react';
import { Button } from '../components/common/Button';
import { Home, AlertOctagon } from 'lucide-react';

interface NotFoundProps {
  onNavigateHome: () => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onNavigateHome }) => {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="neu-card bg-white border-[3px] border-[var(--color-text-accent-dark)] shadow-[8px_8px_0px_var(--color-text-accent-dark)] rounded-3xl p-8 sm:p-12">
        <div className="w-18 h-18 mx-auto rounded-3xl bg-[#FF6B6B] border-[3px] border-[var(--color-text-accent-dark)] shadow-[4px_4px_0px_var(--color-text-accent-dark)] flex items-center justify-center text-white mb-6">
          <AlertOctagon className="w-10 h-10 stroke-[2.5]" />
        </div>

        <h1 className="text-6xl font-black text-[var(--color-text-accent-dark)] mb-2">
          404
        </h1>
        <h2 className="text-xl font-black text-[var(--color-text-accent-dark)] mb-2">
          Discarded Page Not Found
        </h2>
        <p className="text-xs sm:text-sm font-bold text-[var(--color-text-accent-dark)]/70 mb-6">
          This craft route has been recycled into the zero-landfill cosmos. Let's get you back to the main workshop!
        </p>

        <Button
          variant="primary"
          size="lg"
          onClick={onNavigateHome}
          icon={<Home className="w-5 h-5" />}
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};
