import React, { useState } from 'react';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ArrowRight } from 'lucide-react';

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToSignup: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToSignup }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('alex.rivera@waste2wonder.org');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = () => {
    setForgotSent(true);
    setTimeout(() => setForgotSent(false), 3000);
  };

  return (
    <div className="neu-card bg-white border-[3px] border-[var(--color-text-accent-dark)] shadow-[8px_8px_0px_var(--color-text-accent-dark)] rounded-3xl p-6 sm:p-10 w-full max-w-md mx-auto text-left">
      <div className="mb-6">
        <span className="px-3 py-1 bg-[var(--color-primary)] text-white text-xs font-black rounded-lg uppercase">
          Welcome Back
        </span>
        <h2 className="text-3xl font-black text-[var(--color-text-accent-dark)] mt-2">
          Log In to Waste2Wonder
        </h2>
        <p className="text-xs sm:text-sm font-bold text-[var(--color-text-accent-dark)]/70 mt-1">
          Continue your zero-landfill crafting and community impact.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-[var(--color-text-accent-dark)] mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-accent-dark)]/60" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-background)] rounded-xl border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] font-bold text-xs sm:text-sm focus:outline-none focus:bg-white"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-black uppercase tracking-wider text-[var(--color-text-accent-dark)]">
              Password
            </label>
            <button
              type="button"
              onClick={handleForgot}
              className="text-xs font-black text-[var(--color-secondary)] hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-accent-dark)]/60" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-background)] rounded-xl border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] font-bold text-xs sm:text-sm focus:outline-none focus:bg-white"
            />
          </div>
        </div>

        {forgotSent && (
          <div className="p-2.5 bg-[#FFF6E0] border border-[var(--color-text-accent-dark)] rounded-xl text-xs font-bold text-[var(--color-text-accent-dark)]">
            Reset link dispatched to your email!
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={loading}
          icon={<ArrowRight className="w-5 h-5" />}
          className="mt-2"
        >
          {loading ? 'Logging In...' : 'Log In → Enter App'}
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-[var(--color-text-accent-dark)]/20 text-center">
        <p className="text-xs font-bold text-[var(--color-text-accent-dark)]/75">
          New to the upcycling community?{' '}
          <button
            onClick={onSwitchToSignup}
            className="font-black text-[var(--color-secondary)] hover:underline cursor-pointer ml-1"
          >
            Create an Account
          </button>
        </p>
      </div>
    </div>
  );
};
