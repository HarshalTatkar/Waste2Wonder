import React, { ReactNode } from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { AnimatedBackground } from '../components/home/AnimatedBackground';

interface MainLayoutProps {
  children: ReactNode;
  activeTab: string;
  onNavigate: (page: string) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  activeTab,
  onNavigate,
}) => {
  return (
    <div className="min-h-screen relative flex flex-col bg-[var(--color-background)] selection:bg-[var(--color-secondary)] selection:text-white">
      {/* Live Mandala Animated Background Layer for the Whole Website */}
      <AnimatedBackground />

      {/* Sticky Frosted Glass Navbar */}
      <Navbar activeTab={activeTab} onNavigate={onNavigate} />

      {/* Main Content Area */}
      <main className="flex-1 relative z-20">
        {children}
      </main>

      {/* Neubrutalist Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
};
