import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, BookOpen, Share2, Check } from 'lucide-react';
import { useStore } from '@/hooks/use-store';

type Mode = 'focus' | 'break';

const MODES: { id: Mode; label: string; secs: number; icon: React.ReactNode; color: string }[] = [
  { id: 'focus', label: 'Focus', secs: 25 * 60, icon: <BookOpen className="w-3.5 h-3.5" />, color: '#7c3aed' },
  { id: 'break', label: 'Break', secs: 5 * 60, icon: <Coffee className="w-3.5 h-3.5" />, color: '#06b6d4' },
];

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function fmtTotal(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export const StudyTimer: React.FC = () => {
  const { theme, studyTimeToday, addStudyTime, profile, getTotalProgress } = useStore();
  const isDark = theme === 'dark';

  const [mode, setMode] = useState<Mode>('focus');
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(MODES[0].secs);
  const [sessionSecs, setSessionSecs] = useState(0);
  const [shared, setShared] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  const currentMode = MODES.find(m => m.id === mode)!;

  const tick = useCallback(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        setRunning(false);
        if (mode === 'focus') {
          const elapsed = sessionRef.current;
          if (elapsed > 0) addStudyTime(elapsed);
          sessionRef.current = 0;
          setSessionSecs(0);
        }
        if (intervalRef.current) clearInterval(intervalRef.current);
        return 0;
      }
      return prev - 1;
    });
    if (mode === 'focus') {
      sessionRef.current += 1;
      setSessionSecs(s => s + 1);
    }
  }, [mode, addStudyTime]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, tick]);

  const handleToggle = () => {
    if (!running && timeLeft === 0) {
      setTimeLeft(currentMode.secs);
      setSessionSecs(0);
      sessionRef.current = 0;
    }
    setRunning(r => !r);
  };

  const handleReset = () => {
    setRunning(false);
    if (mode === 'focus' && sessionRef.current > 0) {
      addStudyTime(sessionRef.current);
    }
    sessionRef.current = 0;
    setSessionSecs(0);
    setTimeLeft(currentMode.secs);
  };

  const handleModeChange = (m: Mode) => {
    if (running && mode === 'focus' && sessionRef.current > 0) {
      addStudyTime(sessionRef.current);
    }
    sessionRef.current = 0;
    setSessionSecs(0);
    setRunning(false);
    setMode(m);
    setTimeLeft(MODES.find(md => md.id === m)!.secs);
  };

  const pct = ((currentMode.secs - timeLeft) / currentMode.secs) * 100;
  const totalPct = Math.round(getTotalProgress());
  const name = profile.name?.trim() || 'NEET Aspirant';

  const handleShare = async () => {
    const todayHrs = fmtTotal(studyTimeToday);
    const msg = `📚 Today's Study Report
━━━━━━━━━━━━━━━━━━━
👤 ${name}
⏱️ Studied: ${todayHrs}
📊 NEET Progress: ${totalPct}%
🔥 Pomodoro sessions completed

💪 Consistency is the key to NEET success!
#NEET2027 #StudyWithMe`;

    if (navigator.share) {
      await navigator.share({ title: 'My Study Report', text: msg }).catch(() => {});
    } else {
      navigator.clipboard.writeText(msg).catch(() => {});
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    }
  };

  const panelStyle: React.CSSProperties = isDark
    ? {
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
      }
    : {
        background: 'rgba(255,255,255,0.70)',
        border: '1px solid rgba(124,58,237,0.12)',
        borderRadius: 20,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      };

  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = circumference - (pct / 100) * circumference;

  return (
    <div style={panelStyle} className="p-4 relative overflow-hidden">
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none opacity-30"
        style={{ background: `radial-gradient(circle, ${currentMode.color}60 0%, transparent 70%)` }} />

      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl text-white"
            style={{ background: `linear-gradient(135deg, ${currentMode.color}, #06b6d4)`, boxShadow: `0 3px 10px ${currentMode.color}55` }}>
            {currentMode.icon}
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Study Timer</p>
            <p className="text-[11px] font-bold text-foreground">Pomodoro</p>
          </div>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-1 rounded-xl overflow-hidden"
          style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(124,58,237,0.07)', padding: 3 }}>
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => handleModeChange(m.id)}
              className="px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all"
              style={{
                background: mode === m.id ? m.color : 'transparent',
                color: mode === m.id ? '#fff' : isDark ? 'rgba(255,255,255,0.4)' : 'rgba(80,60,120,0.5)',
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timer display */}
      <div className="flex items-center gap-4">
        {/* Circle progress */}
        <div className="relative flex-shrink-0" style={{ width: 100, height: 100 }}>
          <svg width={100} height={100} className="rotate-[-90deg]">
            <circle cx={50} cy={50} r={radius} fill="none"
              stroke={isDark ? 'rgba(255,255,255,0.07)' : 'rgba(124,58,237,0.10)'}
              strokeWidth={7} />
            <motion.circle
              cx={50} cy={50} r={radius} fill="none"
              stroke={`url(#timer-grad-${mode})`}
              strokeWidth={7}
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: strokeDash }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id={`timer-grad-${mode}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={currentMode.color} />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="popLayout">
              <motion.p
                key={timeLeft}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-display font-black tabular-nums leading-none"
                style={{
                  fontSize: 18,
                  background: `linear-gradient(135deg, ${currentMode.color}, #06b6d4)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {fmt(timeLeft)}
              </motion.p>
            </AnimatePresence>
            <p className="text-[9px] font-bold text-muted-foreground mt-0.5">{currentMode.label}</p>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex flex-col gap-2.5">
          {/* Today's total */}
          <div className="rounded-xl px-3 py-2"
            style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(124,58,237,0.06)' }}>
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Today studied</p>
            <p className="text-base font-display font-black"
              style={{
                background: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
              {studyTimeToday > 0 ? fmtTotal(studyTimeToday) : '0m'}
            </p>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleToggle}
              className="flex-1 h-9 rounded-xl flex items-center justify-center gap-1.5 text-white text-xs font-bold"
              style={{
                background: running
                  ? 'linear-gradient(135deg, #f97316, #ef4444)'
                  : `linear-gradient(135deg, ${currentMode.color}, #06b6d4)`,
                boxShadow: running ? '0 3px 12px rgba(249,115,22,0.4)' : `0 3px 12px ${currentMode.color}55`,
                transition: 'background 0.2s',
              }}
            >
              {running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {running ? 'Pause' : timeLeft === 0 ? 'Restart' : 'Start'}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleReset}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(124,58,237,0.08)' }}
            >
              <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: shared ? 'rgba(34,197,94,0.15)' : (isDark ? 'rgba(255,255,255,0.07)' : 'rgba(124,58,237,0.08)'),
              }}
            >
              {shared
                ? <Check className="w-3.5 h-3.5 text-emerald-500" />
                : <Share2 className="w-3.5 h-3.5 text-muted-foreground" />}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
