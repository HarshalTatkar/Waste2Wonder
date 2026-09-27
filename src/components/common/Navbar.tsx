import React, { useState } from 'react';
import { Sparkles, Camera, Menu, X, Trophy, Layers, Compass, Users, User as UserIcon } from 'lucide-react';
import { Button } from './Button';

interface NavbarProps {
  activeTab: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore Ideas', icon: <Compass className="w-4 h-4" /> },
    { id: 'scan', label: 'Scan-Upload', icon: <Camera className="w-4 h-4" /> },
    { id: 'materials', label: 'Materials I Have', icon: <Layers className="w-4 h-4" /> },
    { id: 'contest', label: 'Contest', badge: 'LIVE', icon: <Trophy className="w-4 h-4 text-[#C97C5D]" /> },
    { id: 'community', label: 'Community', icon: <Users className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <UserIcon className="w-4 h-4" /> },
  ];

  const handleNav = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => handleNav('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] border-[2.5px] border-[var(--color-text-accent-dark)] shadow-[3px_3px_0px_var(--color-text-accent-dark)] flex items-center justify-center text-white group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-[4px_4px_0px_var(--color-text-accent-dark)] transition-all">
            <Sparkles className="w-5 h-5 text-[#FFD166] stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tight text-[var(--color-text-accent-dark)] leading-tight">
              Waste<span className="text-[var(--color-secondary)]">2</span>Wonder
            </span>
            <span className="text-[10px] font-black tracking-wider text-[var(--color-primary)] uppercase">
              Upcycling Engine
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`relative px-3.5 py-1.5 rounded-xl font-extrabold text-sm transition-all duration-150 inline-flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-white border-[2px] border-[var(--color-text-accent-dark)] text-[var(--color-text-accent-dark)] shadow-[3px_3px_0px_var(--color-text-accent-dark)]'
                    : 'text-[var(--color-text-accent-dark)]/80 hover:text-[var(--color-text-accent-dark)] hover:bg-white/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1 px-1.5 py-0.2 bg-[var(--color-secondary)] text-white text-[9px] font-black rounded-full uppercase tracking-wider animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Button CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleNav('scan')}
            icon={<Camera className="w-4 h-4" />}
          >
            Scan Waste
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleNav('create-post')}
          >
            + Post Craft
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl border-[2px] border-[var(--color-text-accent-dark)] bg-white text-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] active:translate-x-[1px] active:translate-y-[1px]"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 border-b border-[var(--color-primary)]/30 bg-[#F5F1E8]/95 backdrop-blur-xl animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-1 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl font-black text-sm flex items-center justify-between border-[2px] ${
                  activeTab === item.id
                    ? 'bg-white border-[var(--color-text-accent-dark)] shadow-[3px_3px_0px_var(--color-text-accent-dark)]'
                    : 'border-transparent text-[var(--color-text-accent-dark)]/85 hover:bg-white/50'
                }`}
              >
                <span className="flex items-center gap-2">
                  {item.icon}
                  {item.label}
                </span>
                {item.badge && (
                  <span className="px-2 py-0.5 bg-[var(--color-secondary)] text-white text-[10px] font-black rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
            <div className="pt-3 grid grid-cols-2 gap-2">
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={() => handleNav('scan')}
              >
                Scan Waste
              </Button>
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                onClick={() => handleNav('create-post')}
              >
                + Post Craft
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
