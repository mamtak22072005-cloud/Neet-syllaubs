import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, BookOpen, Share2, Check, Bell, BellOff } from 'lucide-react';
import { useStore } from '@/hooks/use-store';

type Mode = 'focus' | 'break';

const DURATIONS: Record<Mode, number> = {
  focus: 25 * 60,
  break: 5 * 60,
};

const TIMER_STORAGE_KEY = 'neet_timer_bg';

interface BgTimerState {
  startEpoch: number;
  alreadyElapsed: number;
  totalSecs: number;
  mode: Mode;
  running: boolean;
}

function fmt(s: number) {
  const m = Math.floor(Math.max(0, s) / 60);
  const sec = Math.max(0, s) % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function fmtTotal(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function loadBgState(): BgTimerState | null {
  try {
    const raw = localStorage.getItem(TIMER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveBgState(state: BgTimerState | null) {
  if (state) {
    localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(state));
  } else {
    localStorage.removeItem(TIMER_STORAGE_KEY);
  }
}

function getElapsedFromBg(state: BgTimerState): number {
  if (!state.running) return state.alreadyElapsed;
  return state.alreadyElapsed + Math.floor((Date.now() - state.startEpoch) / 1000);
}

export const StudyTimer: React.FC = () => {
  const { theme, studyTimeToday, addStudyTime, profile, getTotalProgress } = useStore();
  const isDark = theme === 'dark';

  const [mode, setMode] = useState<Mode>('focus');
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DURATIONS['focus']);
  const [sessionSecs, setSessionSecs] = useState(0);
  const [shared, setShared] = useState(false);
  const [notifGranted, setNotifGranted] = useState(false);
  const [completedMsg, setCompletedMsg] = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingStudyRef = useRef(0);

  // Check notification permission
  useEffect(() => {
    if ('Notification' in window) {
      setNotifGranted(Notification.permission === 'granted');
    }
  }, []);

  // On mount: restore timer state from localStorage (background tracking)
  useEffect(() => {
    const state = loadBgState();
    if (!state) return;

    const elapsed = getElapsedFromBg(state);
    const remaining = state.totalSecs - elapsed;

    setMode(state.mode);

    if (remaining <= 0) {
      // Timer completed while away
      setTimeLeft(0);
      setRunning(false);
      setSessionSecs(state.totalSecs);
      if (state.mode === 'focus') {
        addStudyTime(Math.min(elapsed, state.totalSecs));
        setCompletedMsg('Session completed while you were away! 🎉');
        setTimeout(() => setCompletedMsg(null), 4000);
      }
      saveBgState(null);
    } else if (state.running) {
      setTimeLeft(remaining);
      setSessionSecs(elapsed);
      pendingStudyRef.current = elapsed;
      setRunning(true);
    } else {
      setTimeLeft(remaining);
      setSessionSecs(elapsed);
      pendingStudyRef.current = elapsed;
    }
  }, []);

  // Page visibility change: recalculate elapsed time
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        const state = loadBgState();
        if (!state || !state.running) return;
        const elapsed = getElapsedFromBg(state);
        const remaining = state.totalSecs - elapsed;
        if (remaining <= 0) {
          setRunning(false);
          setTimeLeft(0);
          if (state.mode === 'focus') {
            addStudyTime(Math.min(elapsed, state.totalSecs));
            setCompletedMsg('Focus session done! Great work 🎉');
            setTimeout(() => setCompletedMsg(null), 4000);
          }
          saveBgState(null);
        } else {
          setTimeLeft(remaining);
          setSessionSecs(elapsed);
          pendingStudyRef.current = elapsed;
        }
      } else {
        // Going away: save state to localStorage
        const state = loadBgState();
        if (state && state.running) {
          const elapsed = getElapsedFromBg(state);
          saveBgState({ ...state, startEpoch: Date.now(), alreadyElapsed: elapsed });
        }
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [addStudyTime]);

  // Ticker
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setRunning(false);
            if (mode === 'focus') {
              addStudyTime(pendingStudyRef.current + 1);
              pendingStudyRef.current = 0;
              setSessionSecs(0);
              setCompletedMsg('Focus session done! Great work 🎉');
              setTimeout(() => setCompletedMsg(null), 4000);
              // Notification
              if (Notification.permission === 'granted') {
                new Notification('NEET Tracker', {
                  body: '25-min focus session complete! Take a break 🧠',
                  icon: '/icon-192.png',
                });
              }
            }
            saveBgState(null);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 0;
          }
          pendingStudyRef.current = mode === 'focus' ? pendingStudyRef.current + 1 : pendingStudyRef.current;
          setSessionSecs(s => mode === 'focus' ? s + 1 : s);
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, mode, addStudyTime]);

  const handleStart = () => {
    if (timeLeft === 0) {
      setTimeLeft(DURATIONS[mode]);
      setSessionSecs(0);
      pendingStudyRef.current = 0;
    }
    const nowRunning = !running;
    setRunning(nowRunning);
    const elapsed = sessionSecs;
    const bgState: BgTimerState = {
      startEpoch: Date.now(),
      alreadyElapsed: elapsed,
      totalSecs: DURATIONS[mode],
      mode,
      running: nowRunning,
    };
    saveBgState(nowRunning ? bgState : { ...bgState, running: false });
  };

  const handleReset = () => {
    setRunning(false);
    if (mode === 'focus' && pendingStudyRef.current > 0) {
      addStudyTime(pendingStudyRef.current);
    }
    pendingStudyRef.current = 0;
    setSessionSecs(0);
    setTimeLeft(DURATIONS[mode]);
    saveBgState(null);
  };

  const handleModeChange = (m: Mode) => {
    if (running && mode === 'focus' && pendingStudyRef.current > 0) {
      addStudyTime(pendingStudyRef.current);
    }
    pendingStudyRef.current = 0;
    setSessionSecs(0);
    setRunning(false);
    setMode(m);
    setTimeLeft(DURATIONS[m]);
    saveBgState(null);
  };

  const requestNotifications = async () => {
    if (!('Notification' in window)) return;
    const perm = await Notification.requestPermission();
    setNotifGranted(perm === 'granted');
  };

  const pct = Math.min(100, ((DURATIONS[mode] - timeLeft) / DURATIONS[mode]) * 100);
  const totalPct = Math.round(getTotalProgress());
  const name = profile.name?.trim() || 'NEET Aspirant';

  const handleShare = async () => {
    const todayHrs = fmtTotal(studyTimeToday);
    const msg = `╔═══════════════════╗
║  📚 STUDY REPORT   ║
╠═══════════════════╣
║  👤 ${name.padEnd(15)}║
║  ⏱️ Today: ${todayHrs.padEnd(9)}║
║  📊 Progress: ${String(totalPct + '%').padEnd(5)}║
╚═══════════════════╝
💪 Grinding for NEET 2027!
#NEET2027 #Pomodoro`;

    if (navigator.share) {
      await navigator.share({ title: 'My Study Report', text: msg }).catch(() => {});
    } else {
      navigator.clipboard.writeText(msg).catch(() => {});
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    }
  };

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = circumference - (pct / 100) * circumference;
  const modeColor = mode === 'focus' ? '#7c3aed' : '#06b6d4';
  const modeColor2 = mode === 'focus' ? '#a855f7' : '#38bdf8';

  return (
    <div className="relative overflow-hidden rounded-[22px] p-4"
      style={{
        background: isDark
          ? 'linear-gradient(145deg, rgba(26,14,60,0.95) 0%, rgba(8,20,42,0.95) 100%)'
          : 'linear-gradient(145deg, rgba(245,243,255,0.95) 0%, rgba(236,252,255,0.95) 100%)',
        border: isDark ? '1px solid rgba(124,58,237,0.20)' : '1px solid rgba(124,58,237,0.18)',
        boxShadow: isDark
          ? '0 8px 32px rgba(124,58,237,0.15), inset 0 1px 0 rgba(255,255,255,0.05)'
          : '0 8px 32px rgba(124,58,237,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
      }}
    >
      {/* Ambient orbs */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none opacity-25"
        style={{ background: `radial-gradient(circle, ${modeColor}80 0%, transparent 70%)` }} />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full pointer-events-none opacity-20"
        style={{ background: `radial-gradient(circle, ${modeColor2}80 0%, transparent 70%)` }} />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl"
            style={{ background: `linear-gradient(135deg, ${modeColor}, ${modeColor2})`, boxShadow: `0 3px 10px ${modeColor}60` }}>
            {mode === 'focus'
              ? <BookOpen className="w-3.5 h-3.5 text-white" />
              : <Coffee className="w-3.5 h-3.5 text-white" />}
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Pomodoro Timer</p>
            <p className="text-xs font-bold text-foreground">{mode === 'focus' ? '25 min Focus' : '5 min Break'}</p>
          </div>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-1 rounded-xl p-0.5"
          style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(124,58,237,0.08)' }}>
          {(['focus', 'break'] as Mode[]).map(m => (
            <button key={m} onClick={() => handleModeChange(m)}
              className="px-3 py-1 rounded-[10px] text-[10px] font-bold capitalize transition-all"
              style={{
                background: mode === m ? (m === 'focus' ? '#7c3aed' : '#06b6d4') : 'transparent',
                color: mode === m ? '#fff' : isDark ? 'rgba(255,255,255,0.4)' : 'rgba(80,60,120,0.5)',
              }}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex items-center gap-4 relative z-10">
        {/* Ring timer */}
        <div className="relative flex-shrink-0" style={{ width: 120, height: 120 }}>
          <svg width={120} height={120} className="rotate-[-90deg]">
            <circle cx={60} cy={60} r={radius} fill="none"
              stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(124,58,237,0.08)'}
              strokeWidth={8} />
            <motion.circle
              cx={60} cy={60} r={radius} fill="none"
              stroke={`url(#ring-grad)`}
              strokeWidth={8}
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: strokeDash }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={modeColor} />
                <stop offset="100%" stopColor={modeColor2} />
              </linearGradient>
            </defs>
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.p
              key={fmt(timeLeft)}
              animate={{ scale: running && timeLeft < 60 ? [1, 1.05, 1] : 1 }}
              transition={{ repeat: running && timeLeft < 60 ? Infinity : 0, duration: 1 }}
              className="font-display font-black tabular-nums leading-none"
              style={{
                fontSize: 22,
                background: `linear-gradient(135deg, ${modeColor}, ${modeColor2})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {fmt(timeLeft)}
            </motion.p>
            {running && (
              <motion.div
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
                className="w-1.5 h-1.5 rounded-full mt-1"
                style={{ background: modeColor }}
              />
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Today stat */}
          <div className="rounded-2xl px-3 py-2"
            style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(124,58,237,0.06)' }}>
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Today studied</p>
            <p className="text-lg font-display font-black leading-tight"
              style={{
                background: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
              {studyTimeToday > 0 ? fmtTotal(studyTimeToday) : '—'}
            </p>
          </div>

          {/* Controls */}
          <div className="flex gap-1.5">
            <motion.button whileTap={{ scale: 0.9 }} onClick={handleStart}
              className="flex-1 h-9 rounded-xl flex items-center justify-center gap-1.5 text-white text-xs font-bold"
              style={{
                background: running
                  ? 'linear-gradient(135deg, #f97316, #ef4444)'
                  : `linear-gradient(135deg, ${modeColor}, ${modeColor2})`,
                boxShadow: running ? '0 3px 12px rgba(249,115,22,0.45)' : `0 3px 12px ${modeColor}55`,
                transition: 'background 0.25s',
              }}>
              {running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {running ? 'Pause' : timeLeft === 0 ? 'Restart' : 'Start'}
            </motion.button>

            <motion.button whileTap={{ scale: 0.9 }} onClick={handleReset}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(124,58,237,0.07)' }}>
              <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
            </motion.button>

            <motion.button whileTap={{ scale: 0.9 }} onClick={handleShare}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: shared ? 'rgba(34,197,94,0.15)' : (isDark ? 'rgba(255,255,255,0.07)' : 'rgba(124,58,237,0.07)') }}>
              {shared ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5 text-muted-foreground" />}
            </motion.button>
          </div>

          {/* Notification toggle */}
          <button onClick={requestNotifications}
            className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
            {notifGranted
              ? <><Bell className="w-3 h-3 text-emerald-500" /><span className="text-emerald-500">Alerts on</span></>
              : <><BellOff className="w-3 h-3" /><span>Enable alerts</span></>}
          </button>
        </div>
      </div>

      {/* Completed toast */}
      <AnimatePresence>
        {completedMsg && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className="absolute bottom-3 left-3 right-3 z-20 rounded-2xl px-4 py-2.5 flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 4px 16px rgba(34,197,94,0.4)' }}
          >
            <Check className="w-4 h-4 text-white flex-shrink-0" />
            <p className="text-xs font-bold text-white">{completedMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
