import React from 'react';
import { useLocation, Link } from 'wouter';
import { motion } from 'framer-motion';
import { Home, BarChart3, Users, User } from 'lucide-react';
import { useStore } from '@/hooks/use-store';

const TABS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/progress', label: 'Progress', icon: BarChart3 },
  { path: '/study', label: 'Study', icon: Users },
  { path: '/profile', label: 'Profile', icon: User },
];

export const BottomNav: React.FC = () => {
  const [location] = useLocation();
  const { theme } = useStore();
  const isDark = theme === 'dark';

  const isActive = (path: string) => {
    if (path === '/') return location === '/';
    return location.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div
        className="pointer-events-auto w-full max-w-[460px] mx-auto"
        style={{
          background: isDark
            ? 'rgba(10, 6, 28, 0.88)'
            : 'rgba(245, 243, 255, 0.88)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: isDark
            ? '1px solid rgba(255,255,255,0.06)'
            : '1px solid rgba(124,58,237,0.10)',
          boxShadow: isDark
            ? '0 -8px 32px rgba(0,0,0,0.4)'
            : '0 -8px 32px rgba(124,58,237,0.10)',
        }}
      >
        <div className="flex items-center justify-around px-2 py-2 pb-safe">
          {TABS.map(({ path, label, icon: Icon }) => {
            const active = isActive(path);
            return (
              <Link key={path} href={path}>
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  className="relative flex flex-col items-center justify-center gap-0.5 px-5 py-2 rounded-2xl cursor-pointer select-none"
                  style={{
                    minWidth: 64,
                    background: active
                      ? (isDark ? 'rgba(124,58,237,0.18)' : 'rgba(124,58,237,0.10)')
                      : 'transparent',
                    transition: 'background 0.2s',
                  }}
                >
                  {active && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: isDark
                          ? 'linear-gradient(135deg, rgba(124,58,237,0.22), rgba(6,182,212,0.12))'
                          : 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.08))',
                        border: isDark
                          ? '1px solid rgba(124,58,237,0.30)'
                          : '1px solid rgba(124,58,237,0.20)',
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                    />
                  )}
                  <Icon
                    className="w-5 h-5 relative z-10"
                    style={{
                      color: active
                        ? 'hsl(var(--primary))'
                        : isDark ? 'rgba(255,255,255,0.4)' : 'rgba(80,60,120,0.45)',
                      transition: 'color 0.2s',
                    }}
                    strokeWidth={active ? 2.2 : 1.8}
                  />
                  <span
                    className="text-[10px] font-bold relative z-10"
                    style={{
                      color: active
                        ? 'hsl(var(--primary))'
                        : isDark ? 'rgba(255,255,255,0.35)' : 'rgba(80,60,120,0.40)',
                      letterSpacing: active ? '0.03em' : 0,
                      transition: 'color 0.2s',
                    }}
                  >
                    {label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
