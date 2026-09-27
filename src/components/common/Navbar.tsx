import React, { useState } from 'react';
import { Menu, X, Sparkles, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';

interface NavbarProps {
  activeTab: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { user } = useUser();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore' },
    { id: 'contest', label: 'Contest' },
    { id: 'community', label: 'Community' },
  ];

  const handleNav = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-3 z-40 w-full max-w-6xl mx-auto px-3 sm:px-6 transition-all duration-200">
      <div className="floating-capsule-nav px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Brand Logo - exactly matching user images */}
        <div
          onClick={() => handleNav('home')}
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          {/* Black rounded square with mint emblem */}
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center p-1.5 shadow-[1.5px_1.5px_0px_#000]">
            <div className="w-3.5 h-3.5 bg-[#98EECC] rotate-45 rounded-[2px]" />
          </div>
          <span className="font-black text-lg sm:text-xl tracking-tight text-black uppercase">
            WASTE2WONDER
          </span>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`font-black text-sm tracking-wide transition-all cursor-pointer select-none ${
                  isActive
                    ? 'text-black underline underline-offset-4 decoration-2 decoration-black'
                    : 'text-black/80 hover:text-black hover:opacity-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Auth Buttons - exactly matching screenshot */}
        <div className="hidden sm:flex items-center gap-2.5">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNav('profile')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-[2px] border-black bg-white shadow-[2px_2px_0px_#000] font-black text-xs cursor-pointer hover:-translate-y-0.5 transition-all ${
                  activeTab === 'profile' ? 'ring-2 ring-black bg-[#98EECC]' : ''
                }`}
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                  alt={user?.name || 'Profile'}
                  className="w-5 h-5 rounded-full object-cover border border-black"
                />
                <span className="truncate max-w-[90px]">{user?.name?.split(' ')[0] || 'Profile'}</span>
              </button>
              <button
                onClick={() => handleNav('scan')}
                className="px-3.5 py-1.5 rounded-full border-[2px] border-black bg-[#FDA4AF] shadow-[2px_2px_0px_#000] font-black text-xs text-black cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5 transition-all"
              >
                Scan Waste
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => handleNav('login')}
                className="px-4 py-1.5 rounded-full border-[2px] border-black bg-white shadow-[2px_2px_0px_#000] font-black text-xs text-black cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5 transition-all"
              >
                Log In
              </button>
              <button
                onClick={() => handleNav('signup')}
                className="px-4 py-1.5 rounded-full border-[2px] border-black bg-[#FDA4AF] shadow-[2px_2px_0px_#000] font-black text-xs text-black cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5 transition-all"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 rounded-full border-[2px] border-black bg-white shadow-[2px_2px_0px_#000]"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 bg-[#FCD5CE] border-[2.5px] border-black rounded-3xl shadow-[4px_4px_0px_#000] flex flex-col gap-2.5 animate-in slide-in-from-top-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`text-left px-4 py-2 rounded-xl font-black text-sm border-[2px] ${
                activeTab === item.id
                  ? 'bg-white border-black shadow-[2px_2px_0px_#000]'
                  : 'border-transparent text-black hover:bg-white/60'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-black/20 flex gap-2">
            <button
              onClick={() => handleNav('profile')}
              className="flex-1 py-2 rounded-full border-[2px] border-black bg-white shadow-[2px_2px_0px_#000] font-black text-xs text-black text-center"
            >
              My Profile
            </button>
            <button
              onClick={() => handleNav('scan')}
              className="flex-1 py-2 rounded-full border-[2px] border-black bg-[#FDA4AF] shadow-[2px_2px_0px_#000] font-black text-xs text-black text-center"
            >
              Scan Waste
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
