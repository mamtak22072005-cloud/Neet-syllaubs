import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, CalendarDays, X, Check } from 'lucide-react';
import { useStore } from '@/hooks/use-store';

const DEFAULT_DATE = '2027-05-02';
const START_REF = new Date('2026-01-01');

function parseDate(dateStr: string | null): Date {
  if (!dateStr) return new Date(DEFAULT_DATE + 'T00:00:00');
  return new Date(dateStr + 'T00:00:00');
}

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
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
          className="min-w-[46px] h-[50px] flex items-center justify-center rounded-2xl text-[20px] font-display font-black tabular-nums relative"
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
  const { theme, testDate, setTestDate } = useStore();
  const isDark = theme === 'dark';

  const targetDate = useMemo(() => parseDate(testDate), [testDate]);
  const totalDays = useMemo(() => Math.ceil(
    (targetDate.getTime() - START_REF.getTime()) / (1000 * 60 * 60 * 24)
  ), [targetDate]);

  const [time, setTime] = useState(() => getTimeLeft(targetDate));
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(testDate || DEFAULT_DATE);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  useEffect(() => {
    setInputVal(testDate || DEFAULT_DATE);
  }, [testDate]);

  const handleSaveDate = () => {
    if (inputVal) setTestDate(inputVal);
    setEditing(false);
  };

  const remainPct = useMemo(
    () => Math.min(100, Math.max(0, (time.days / totalDays) * 100)),
    [time.days, totalDays]
  );

  const displayDateStr = useMemo(() => {
    const d = parseDate(testDate);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }, [testDate]);

  const wrapStyle: React.CSSProperties = isDark
    ? {
        borderRadius: 20,
        background: 'linear-gradient(135deg, #3b1fa3 0%, #6d28d9 45%, #0d6f92 100%)',
        boxShadow: '0 12px 40px rgba(109,40,217,0.40), 0 0 0 1px rgba(255,255,255,0.07)',
        padding: '1px',
      }
    : {
        borderRadius: 20,
        background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #06b6d4 100%)',
        boxShadow: '0 8px 32px rgba(124,58,237,0.25), 0 0 0 1px rgba(255,255,255,0.6)',
        padding: '1px',
      };

  const innerStyle: React.CSSProperties = isDark
    ? {
        borderRadius: 19,
        background: 'linear-gradient(145deg, #130c30 0%, #0e1a2e 60%, #060f1e 100%)',
        padding: '16px 16px 14px',
        position: 'relative',
        overflow: 'hidden',
      }
    : {
        borderRadius: 19,
        background: 'linear-gradient(145deg, rgba(245,243,255,0.92) 0%, rgba(236,252,255,0.88) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '16px 16px 14px',
        position: 'relative',
        overflow: 'hidden',
      };

  const labelColor = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(109,40,217,0.55)';
  const dateColor = isDark ? 'rgba(255,255,255,0.75)' : 'rgba(109,40,217,0.85)';
  const sepColor = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(109,40,217,0.35)';
  const trackColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(124,58,237,0.12)';

  return (
    <motion.div style={wrapStyle} className="relative overflow-hidden">
      <div style={innerStyle}>
        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none"
          style={{ background: isDark ? 'radial-gradient(circle, rgba(109,40,217,0.4) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full pointer-events-none"
          style={{ background: isDark ? 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)' }} />

        {/* Header */}
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl shadow-lg"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 3px 10px rgba(124,58,237,0.45)' }}>
              <Timer className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: labelColor }}>Countdown to</p>
              <p className="text-[13px] font-display font-extrabold"
                style={{ background: 'linear-gradient(90deg, #a78bfa, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {testDate ? 'Your Exam' : 'NEET 2027'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setEditing(e => !e)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all"
            style={{
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(124,58,237,0.08)',
              color: dateColor,
              border: isDark ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(124,58,237,0.15)',
            }}
          >
            <CalendarDays className="w-3 h-3" />
            {displayDateStr}
          </button>
        </div>

        {/* Date picker */}
        <AnimatePresence>
          {editing && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-3 relative z-10"
            >
              <div className="flex gap-2 items-center rounded-2xl p-2"
                style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(124,58,237,0.07)' }}>
                <input
                  type="date"
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  className="flex-1 bg-transparent text-sm font-bold outline-none"
                  style={{ color: isDark ? '#fff' : 'hsl(260 85% 40%)' }}
                  min={new Date().toISOString().split('T')[0]}
                />
                <button onClick={handleSaveDate}
                  className="p-1.5 rounded-xl text-white"
                  style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setEditing(false)}
                  className="p-1.5 rounded-xl"
                  style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
                  <X className="w-3.5 h-3.5" style={{ color: labelColor }} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Flip units */}
        <div className="flex items-end justify-center gap-1 relative z-10 mb-3">
          <FlipUnit value={time.days} label="Days" isDark={isDark} />
          <span className="text-lg font-black mb-3 select-none" style={{ color: sepColor }}>:</span>
          <FlipUnit value={time.hours} label="Hrs" isDark={isDark} />
          <span className="text-lg font-black mb-3 select-none" style={{ color: sepColor }}>:</span>
          <FlipUnit value={time.minutes} label="Mins" isDark={isDark} />
          <span className="text-lg font-black mb-3 select-none" style={{ color: sepColor }}>:</span>
          <FlipUnit value={time.seconds} label="Secs" isDark={isDark} />
        </div>

        {/* Progress bar */}
        <div className="relative z-10">
          <div className="flex justify-between text-[9px] font-bold mb-1" style={{ color: labelColor }}>
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
