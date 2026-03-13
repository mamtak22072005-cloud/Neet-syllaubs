import React, { useRef } from 'react';
import { useStore } from '@/hooks/use-store';
import { Moon, Sun } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useStore();
  
  // Parallax background effect based on scroll
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  return (
    <div className="fixed inset-0 w-full h-full flex justify-center bg-black">
      {/* Animated gradient background spanning the whole app */}
      <motion.div 
        className="absolute inset-0 w-full h-full animated-gradient-bg z-0"
        style={{ y: bgY }}
      />

      {/* Main mobile-sized container */}
      <div 
        ref={containerRef}
        className="relative w-full max-w-[460px] h-full overflow-y-auto overflow-x-hidden bg-background/50 backdrop-blur-[2px] shadow-2xl z-10 scroll-smooth"
      >
        <header className="sticky top-0 z-50 px-6 py-5 flex justify-between items-center bg-background/40 backdrop-blur-xl border-b border-white/5">
          <div>
            <h1 className="text-xl font-display font-extrabold text-gradient text-glow">
              NEET 2027
            </h1>
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

        <main className="p-4 sm:p-6 pb-24 min-h-[calc(100vh-140px)]">
          {children}
        </main>

        <footer className="py-8 text-center opacity-80 pb-12">
          <p className="text-xs font-medium text-muted-foreground tracking-widest uppercase">Created by</p>
          <p className="text-sm font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary text-glow">
            NEERAJ NEERALA
          </p>
        </footer>
      </div>
    </div>
  );
};
