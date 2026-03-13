import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer } from 'lucide-react';
import { useStore } from '@/hooks/use-store';

const NEET_DATE = new Date('2027-05-02T00:00:00');
const TOTAL_DAYS = Math.ceil(
  (NEET_DATE.getTime() - new Date('2026-01-01').getTime()) / (1000 * 60 * 60 * 24)
);

function getTimeLeft() {
  const diff = NEET_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function FlipUnit({ value, label, isDark }: { value: number; label: string; isDark: boolean }) {
  const display = String(value).padStart(2, '0');

  const numStyle: React.CSSProperties = isDark
    ? {
        background: 'rgba(255,255,255,0.09)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid rgba(255,255,255,0.14)',
        boxShadow: '0 6px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)',
        color: '#fff',
      }
    : {
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid rgba(124,58,237,0.18)',
        boxShadow: '0 4px 18px rgba(124,58,237,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
        color: 'hsl(260 85% 50%)',
      };

  return (
    <div className="flex flex-col items-center gap-1.5">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={display}
          initial={{ y: -16, opacity: 0, scale: 0.82 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 16, opacity: 0, scale: 0.82 }}
          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
          className="min-w-[50px] h-[54px] flex items-center justify-center rounded-2xl text-[22px] font-display font-black tabular-nums relative"
          style={{ ...numStyle, willChange: 'transform, opacity' }}
        >
          {display}
          <div
            className="absolute inset-x-2 top-1/2 h-px pointer-events-none"
            style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(124,58,237,0.07)' }}
          />
        </motion.div>
      </AnimatePresence>
      <span
        className="text-[9px] font-black uppercase tracking-widest"
        style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(124,58,237,0.55)' }}
      >
        {label}
      </span>
    </div>
  );
}

export const Countdown: React.FC = () => {
  const { theme } = useStore();
  const isDark = theme === 'dark';

  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const remainPct = useMemo(
    () => Math.min(100, Math.max(0, (time.days / TOTAL_DAYS) * 100)),
    [time.days]
  );

  /* ── Theme-based styles ── */
  const wrapStyle: React.CSSProperties = isDark
    ? {
        borderRadius: 24,
        background: 'linear-gradient(135deg, #3b1fa3 0%, #6d28d9 45%, #0d6f92 100%)',
        boxShadow: '0 16px 48px rgba(109,40,217,0.45), 0 0 0 1px rgba(255,255,255,0.07)',
        padding: '1px',
      }
    : {
        borderRadius: 24,
        background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #06b6d4 100%)',
        boxShadow: '0 12px 40px rgba(124,58,237,0.28), 0 0 0 1px rgba(255,255,255,0.6)',
        padding: '1px',
      };

  const innerStyle: React.CSSProperties = isDark
    ? {
        borderRadius: 23,
        background: 'linear-gradient(145deg, #130c30 0%, #0e1a2e 60%, #060f1e 100%)',
        padding: '20px 20px 18px',
        position: 'relative',
        overflow: 'hidden',
      }
    : {
        borderRadius: 23,
        background: 'linear-gradient(145deg, rgba(245,243,255,0.92) 0%, rgba(236,252,255,0.88) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '20px 20px 18px',
        position: 'relative',
        overflow: 'hidden',
      };

  const orb1Style: React.CSSProperties = {
    background: isDark
      ? 'radial-gradient(circle, rgba(109,40,217,0.4) 0%, transparent 70%)'
      : 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
  };
  const orb2Style: React.CSSProperties = {
    background: isDark
      ? 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)'
      : 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
  };

  const labelColor = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(109,40,217,0.55)';
  const dateColor = isDark ? 'rgba(255,255,255,0.75)' : 'rgba(109,40,217,0.85)';
  const sepColor = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(109,40,217,0.35)';
  const trackColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(124,58,237,0.12)';

  return (
    <motion.div
      style={wrapStyle}
      animate={isDark ? {} : {}}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden"
    >
      <div style={innerStyle}>
        {/* Orbs */}
        <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full pointer-events-none" style={orb1Style} />
        <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full pointer-events-none" style={orb2Style} />

        {/* Header */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2.5">
            <div
              className="p-2 rounded-xl shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                boxShadow: '0 4px 14px rgba(124,58,237,0.5)',
              }}
            >
              <Timer className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: labelColor }}>
                Countdown to
              </p>
              <p
                className="text-sm font-display font-extrabold"
                style={{
                  background: 'linear-gradient(90deg, #a78bfa, #22d3ee)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                NEET 2027
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-semibold" style={{ color: labelColor }}>Exam Date</p>
            <p className="text-[11px] font-bold" style={{ color: dateColor }}>2 May 2027</p>
          </div>
        </div>

        {/* Flip units */}
        <div className="flex items-end justify-center gap-1.5 relative z-10 mb-4">
          <FlipUnit value={time.days} label="Days" isDark={isDark} />
          <span className="text-xl font-black mb-3.5 select-none" style={{ color: sepColor }}>:</span>
          <FlipUnit value={time.hours} label="Hours" isDark={isDark} />
          <span className="text-xl font-black mb-3.5 select-none" style={{ color: sepColor }}>:</span>
          <FlipUnit value={time.minutes} label="Mins" isDark={isDark} />
          <span className="text-xl font-black mb-3.5 select-none" style={{ color: sepColor }}>:</span>
          <FlipUnit value={time.seconds} label="Secs" isDark={isDark} />
        </div>

        {/* Progress bar */}
        <div className="relative z-10">
          <div className="flex justify-between text-[9px] font-bold mb-1.5" style={{ color: labelColor }}>
            <span>Time remaining</span>
            <span>{time.days} days left</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: trackColor }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }}
              initial={{ width: 0 }}
              animate={{ width: `${remainPct}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
