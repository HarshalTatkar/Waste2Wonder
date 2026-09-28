import React, { useState } from 'react';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { OnboardingQuestions } from './OnboardingQuestions';
import { User, Mail, Lock, MapPin, Sparkles } from 'lucide-react';

interface SignupFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [city, setCity] = useState('');
  const [wasteTypes, setWasteTypes] = useState<string[]>([]);
  const [mainGoal, setMainGoal] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleWaste = (t: string) => {
    setWasteTypes((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (wasteTypes.length === 0) {
      setError('Please pick at least one waste material you deal with.');
      return;
    }

    setLoading(true);
    try {
      await signup({
        name,
        email,
        password,
        wasteTypes,
        mainGoal,
        city,
      });
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="neu-card bg-white border-[3px] border-[var(--color-text-accent-dark)] shadow-[8px_8px_0px_var(--color-text-accent-dark)] rounded-3xl p-6 sm:p-10 w-full max-w-xl mx-auto text-left">
      <div className="mb-6">
        <span className="px-3 py-1 bg-[var(--color-secondary)] text-white text-xs font-black rounded-lg uppercase">
          Join the Collective
        </span>
        <h2 className="text-3xl font-black text-[var(--color-text-accent-dark)] mt-2">
          Create Maker Account
        </h2>
        <p className="text-xs sm:text-sm font-bold text-[var(--color-text-accent-dark)]/70 mt-1">
          Tell us about your materials and crafting goals so we can tailor recommendations.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-[#FF6B6B]/20 border-[2px] border-[#FF6B6B] rounded-xl text-xs font-black text-[var(--color-text-accent-dark)] mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[var(--color-text-accent-dark)] mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-accent-dark)]/60" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full pl-10 pr-3 py-2 bg-[var(--color-background)] rounded-xl border-[2px] border-[var(--color-text-accent-dark)] text-xs sm:text-sm font-bold focus:outline-none focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[var(--color-text-accent-dark)] mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-accent-dark)]/60" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-10 pr-3 py-2 bg-[var(--color-background)] rounded-xl border-[2px] border-[var(--color-text-accent-dark)] text-xs sm:text-sm font-bold focus:outline-none focus:bg-white"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[var(--color-text-accent-dark)] mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-accent-dark)]/60" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-[var(--color-background)] rounded-xl border-[2px] border-[var(--color-text-accent-dark)] text-xs sm:text-sm font-bold focus:outline-none focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[var(--color-text-accent-dark)] mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-accent-dark)]/60" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-[var(--color-background)] rounded-xl border-[2px] border-[var(--color-text-accent-dark)] text-xs sm:text-sm font-bold focus:outline-none focus:bg-white"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-[var(--color-text-accent-dark)] mb-1">
            City (Optional)
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-accent-dark)]/60" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Seattle, WA or London, UK"
              className="w-full pl-10 pr-3 py-2 bg-[var(--color-background)] rounded-xl border-[2px] border-[var(--color-text-accent-dark)] text-xs sm:text-sm font-bold focus:outline-none focus:bg-white"
            />
          </div>
        </div>

        {/* Required Onboarding Questions */}
        <OnboardingQuestions
          selectedWasteTypes={wasteTypes}
          onToggleWasteType={toggleWaste}
          selectedGoal={mainGoal}
          onSelectGoal={setMainGoal}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={loading}
          icon={<Sparkles className="w-5 h-5 text-[#FFD166]" />}
          className="mt-4"
        >
          {loading ? 'Creating Profile...' : 'Complete Signup → Go to Home'}
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-[var(--color-text-accent-dark)]/20 text-center">
        <p className="text-xs font-bold text-[var(--color-text-accent-dark)]/75">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="font-black text-[var(--color-secondary)] hover:underline cursor-pointer ml-1"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};
