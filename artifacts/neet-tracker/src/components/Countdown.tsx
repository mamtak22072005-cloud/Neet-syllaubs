import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer } from 'lucide-react';

const NEET_DATE = new Date('2027-05-02T00:00:00');

function getTimeLeft() {
  const now = new Date();
  const diff = NEET_DATE.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    total: diff,
  };
}

function FlipUnit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={display}
            initial={{ y: -20, opacity: 0, scale: 0.85 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="min-w-[52px] h-[56px] flex items-center justify-center rounded-2xl text-2xl font-display font-extrabold text-white relative"
            style={{
              background: 'rgba(255,255,255,0.10)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.18)',
              boxShadow: '0 8px 28px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.15)',
            }}
          >
            <span className="relative z-10 tabular-nums">{display}</span>
            <div
              className="absolute inset-x-0 top-1/2 h-px pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">{label}</span>
    </div>
  );
}

export const Countdown: React.FC = () => {
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const totalDays = Math.ceil((NEET_DATE.getTime() - new Date('2026-01-01').getTime()) / (1000 * 60 * 60 * 24));
  const remainPct = Math.min(100, Math.max(0, (time.days / totalDays) * 100));

  return (
    <div
      className="relative overflow-hidden"
      style={{
        borderRadius: 24,
        background: 'linear-gradient(135deg, #4f1fbf 0%, #7c3aed 40%, #0e7fa3 100%)',
        boxShadow: '0 20px 60px rgba(124,58,237,0.40), 0 0 0 1px rgba(255,255,255,0.08)',
        padding: '1px',
      }}
    >
      {/* Inner glowing border gradient trick */}
      <div
        style={{
          borderRadius: 23,
          background: 'linear-gradient(135deg, #1a0a3e 0%, #130d30 50%, #071624 100%)',
          padding: '20px 20px 18px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background orbs */}
        <div
          className="absolute -top-10 -right-10 w-36 h-36 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)' }}
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <div
              className="p-2 rounded-xl"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 4px 14px rgba(124,58,237,0.5)' }}
            >
              <Timer className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Countdown to</p>
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
            <p className="text-[9px] text-white/40 font-medium">Exam Date</p>
            <p className="text-[11px] font-bold text-white/80">2 May 2027</p>
          </div>
        </div>

        {/* Flip units */}
        <div className="flex items-end justify-center gap-2 relative z-10 mb-4">
          <FlipUnit value={time.days} label="Days" />
          <span className="text-white/40 text-2xl font-bold mb-3.5">:</span>
          <FlipUnit value={time.hours} label="Hours" />
          <span className="text-white/40 text-2xl font-bold mb-3.5">:</span>
          <FlipUnit value={time.minutes} label="Mins" />
          <span className="text-white/40 text-2xl font-bold mb-3.5">:</span>
          <FlipUnit value={time.seconds} label="Secs" />
        </div>

        {/* Progress bar showing days remaining vs total */}
        <div className="relative z-10">
          <div className="flex justify-between text-[9px] text-white/40 font-semibold mb-1.5">
            <span>Time remaining</span>
            <span>{time.days} days left</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }}
              initial={{ width: 0 }}
              animate={{ width: `${remainPct}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
