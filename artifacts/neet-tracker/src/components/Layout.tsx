import React, { useRef } from 'react';
import { useStore } from '@/hooks/use-store';
import { useLocation } from 'wouter';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { InstallPrompt } from './InstallPrompt';
import { BottomNav } from './BottomNav';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useStore();
  const [location] = useLocation();
  const isHome = location === '/';
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="fixed inset-0 w-full h-full flex justify-center" style={{ background: 'hsl(var(--background))' }}>
      {/* Gradient background */}
      <div className="absolute inset-0 w-full h-full animated-gradient-bg z-0 pointer-events-none" />

      {/* Main mobile-sized container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[460px] h-full overflow-y-auto overflow-x-hidden z-10 scroll-smooth"
        style={{ overscrollBehavior: 'none' }}
      >
        {/* Header */}
        <header className="sticky top-0 z-50 px-5 py-4 flex justify-between items-center"
          style={{
            background: theme === 'dark' ? 'rgba(12, 8, 30, 0.75)' : 'rgba(248, 246, 255, 0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: theme === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(124,58,237,0.10)',
          }}
        >
          <div>
            <h1 className="text-xl font-display font-extrabold text-gradient text-glow">NEET 2027</h1>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Ultimate Tracker</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-foreground hover:bg-white/10 transition-colors"
          >
            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </motion.button>
        </header>

        <main className={`p-4 ${isHome ? 'pb-24' : 'pb-36'}`}>
          {children}
        </main>

        <InstallPrompt />
        <BottomNav />

        {/* Footer — hidden on home */}
        {!isHome && (
          <footer className="pb-28 pt-2 px-6 text-center">
            <div
              className="h-px w-full rounded-full mb-5 opacity-40"
              style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--primary)/0.6), hsl(var(--secondary)/0.6), transparent)' }}
            />
            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-muted-foreground/55 mb-1">Created by</p>
            <p
              className="text-sm font-display font-black tracking-wide"
              style={{
                background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--secondary)))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 8px hsl(var(--primary)/0.4))',
              }}
            >
              NEERAJ NEERALA
            </p>
          </footer>
        )}
      </div>
    </div>
  );
};
