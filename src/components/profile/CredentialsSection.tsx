import React, { useState } from 'react';
import { KeyRound, Shield, Check, Eye, EyeOff, Save, User as UserIcon, Mail, Lock } from 'lucide-react';

interface CredentialsSectionProps {
  initialName?: string;
  initialUsername?: string;
  initialEmail: string;
  initialCity?: string;
  onSave: (data: {
    name?: string;
    username?: string;
    email: string;
    city: string;
    notifications: boolean;
  }) => Promise<void>;
}

export const CredentialsSection: React.FC<CredentialsSectionProps> = ({
  initialName = 'Alex Rivera',
  initialUsername = 'alex_rivera',
  initialEmail,
  initialCity = '',
  onSave,
}) => {
  const [name, setName] = useState(initialName);
  const [username, setUsername] = useState(initialUsername);
  const [email, setEmail] = useState(initialEmail);
  const [city, setCity] = useState(initialCity);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('••••••••••••');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      alert('New password and confirm password do not match!');
      return;
    }

    setSaving(true);
    try {
      await onSave({ name, username, email, city, notifications });
      setSavedMessage('Credentials & Security updated successfully!');
      if (newPassword) {
        setNewPassword('');
        setConfirmPassword('');
      }
      setTimeout(() => setSavedMessage(null), 3000);
    } catch {
      alert('Failed to update credentials. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border-[3px] border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#000] text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 mb-6 border-b-[2px] border-black/15">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#98EECC] border-[2px] border-black shadow-[2px_2px_0px_#000] flex items-center justify-center shrink-0">
            <KeyRound className="w-6 h-6 text-black stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-black text-xl sm:text-2xl text-black">
              Your Credentials & Security
            </h3>
            <p className="text-xs sm:text-sm font-bold text-black/60">
              Manage your personal maker account details, email, and password.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-[#FEF08A] border-[1.5px] border-black rounded-full text-xs font-black text-black">
          🔒 Secure Area
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Account Credentials */}
        <div>
          <h4 className="font-black text-sm uppercase tracking-wider text-black mb-3 flex items-center gap-1.5">
            <UserIcon className="w-4 h-4 text-black" />
            <span>Profile Identity</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-black/75 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FFFDF9] rounded-xl border-[2px] border-black shadow-[2px_2px_0px_#000] text-xs sm:text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-black/75 mb-1.5">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-black text-black/50">@</span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 bg-[#FFFDF9] rounded-xl border-[2px] border-black shadow-[2px_2px_0px_#000] text-xs sm:text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-black/75 mb-1.5 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                <span>Account Email</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FFFDF9] rounded-xl border-[2px] border-black shadow-[2px_2px_0px_#000] text-xs sm:text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-black/75 mb-1.5">
                City / Region
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Portland, OR"
                className="w-full px-4 py-2.5 bg-[#FFFDF9] rounded-xl border-[2px] border-black shadow-[2px_2px_0px_#000] text-xs sm:text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Password Management with Show/Hide toggle */}
        <div className="pt-4 border-t-[2px] border-black/10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-black text-sm uppercase tracking-wider text-black flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-black" />
              <span>Password & Authentication</span>
            </h4>

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs font-black text-black/75 hover:text-black flex items-center gap-1 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPassword ? 'Hide Characters' : 'Show Characters'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-black/75 mb-1.5">
                Current Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FFFDF9] rounded-xl border-[2px] border-black shadow-[2px_2px_0px_#000] text-xs sm:text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-black/75 mb-1.5">
                New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep same"
                className="w-full px-4 py-2.5 bg-[#FFFDF9] rounded-xl border-[2px] border-black shadow-[2px_2px_0px_#000] text-xs sm:text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-black/75 mb-1.5">
                Confirm New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                className="w-full px-4 py-2.5 bg-[#FFFDF9] rounded-xl border-[2px] border-black shadow-[2px_2px_0px_#000] text-xs sm:text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Notification Preferences */}
        <div className="pt-2">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-4 h-4 rounded border-black accent-black cursor-pointer"
            />
            <span className="text-xs font-bold text-black">
              Send me updates for weekly upcycling contests and community comments on my projects
            </span>
          </label>
        </div>

        {/* Actions & Feedback */}
        <div className="pt-3 border-t-[2px] border-black/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          {savedMessage ? (
            <div className="px-3.5 py-1.5 bg-[#98EECC] border-[2px] border-black rounded-full font-black text-xs text-black flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{savedMessage}</span>
            </div>
          ) : (
            <div />
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-7 py-3 rounded-full border-[2.5px] border-black bg-[#FDA4AF] text-black font-black text-sm shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating...' : 'Save Credentials & Password'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
