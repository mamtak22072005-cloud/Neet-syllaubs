import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/hooks/use-store';
import { Moon, Sun } from 'lucide-react';
import { useLocation } from 'wouter';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useStore();
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30">
      {/* Background Images based on theme */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen transition-opacity duration-1000 bg-cover bg-center"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/mesh-bg-${theme}.png)` }}
      />
      
      {/* Mobile constraint wrapper */}
      <div className="max-w-md mx-auto min-h-screen relative shadow-2xl dark:shadow-black/50 bg-background/50 backdrop-blur-[2px] flex flex-col border-x border-white/10">
        
        {/* Header */}
        <header className="sticky top-0 z-50 glass-panel border-b border-x-0 border-t-0 rounded-none px-6 py-4 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              NEET Ultimate Tracker
            </h1>
          </div>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 pb-24 z-10 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="mt-auto py-6 text-center z-10 relative">
          <p className="text-sm font-medium text-muted-foreground/70 tracking-widest uppercase">
            Created by <span className="text-primary font-bold text-glow">NEERAJ NEERALA</span>
          </p>
        </footer>
      </div>
    </div>
  );
};
