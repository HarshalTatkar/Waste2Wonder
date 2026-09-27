import React, { useState } from 'react';
import { Settings, Save, Check } from 'lucide-react';
import { Button } from '../common/Button';

interface AccountSettingsProps {
  initialEmail: string;
  initialCity?: string;
  onSave: (data: { email: string; city: string; notifications: boolean }) => Promise<void>;
}

export const AccountSettings: React.FC<AccountSettingsProps> = ({
  initialEmail,
  initialCity = '',
  onSave,
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [city, setCity] = useState(initialCity);
  const [password, setPassword] = useState('••••••••••••');
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ email, city, notifications });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white/80 border-[2px] border-[var(--color-text-accent-dark)]/50 rounded-2xl p-6 sm:p-7 max-w-3xl mx-auto opacity-95">
      <div className="flex items-center justify-between pb-3 mb-5 border-b border-[var(--color-text-accent-dark)]/20">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-[var(--color-text-accent-dark)]/70" />
          <h4 className="font-black text-lg text-[var(--color-text-accent-dark)]">
            Account & Preference Settings
          </h4>
        </div>
        <span className="text-xs font-bold text-[var(--color-text-accent-dark)]/60">
          Private Account Configuration
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase text-[var(--color-text-accent-dark)]/80 mb-1">
              Account Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 bg-[var(--color-background)] rounded-xl border border-[var(--color-text-accent-dark)] text-xs font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[var(--color-text-accent-dark)]/80 mb-1">
              City / Location (Optional)
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Seattle, WA"
              className="w-full px-3.5 py-2 bg-[var(--color-background)] rounded-xl border border-[var(--color-text-accent-dark)] text-xs font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black uppercase text-[var(--color-text-accent-dark)]/80 mb-1">
            Change Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2 bg-[var(--color-background)] rounded-xl border border-[var(--color-text-accent-dark)] text-xs font-bold"
          />
        </div>

        {/* Notifications Checkbox */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="notifs"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="w-4 h-4 accent-[var(--color-primary)] cursor-pointer"
          />
          <label htmlFor="notifs" className="text-xs font-bold text-[var(--color-text-accent-dark)] cursor-pointer">
            Receive weekly contest updates and implementation notifications
          </label>
        </div>

        <div className="pt-2 flex items-center justify-between">
          {saved && (
            <span className="flex items-center gap-1 text-xs font-black text-[var(--color-primary)]">
              <Check className="w-4 h-4" /> Preferences Saved!
            </span>
          )}
          {!saved && <div />}

          <Button
            type="submit"
            variant="cream"
            size="sm"
            disabled={saving}
            icon={<Save className="w-4 h-4" />}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};
