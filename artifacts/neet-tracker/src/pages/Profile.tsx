import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@/hooks/use-store';
import { motion } from 'framer-motion';
import {
  Camera, User, Save, Flame, CheckSquare, BarChart3, Trophy, Copy, Check,
  Share2, Target, Star, BookOpen, Zap, Heart
} from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const RANKS = [
  { min: 0, max: 10, label: 'Beginner', icon: '🌱', color: '#22c55e' },
  { min: 10, max: 25, label: 'Explorer', icon: '🔭', color: '#06b6d4' },
  { min: 25, max: 50, label: 'Scholar', icon: '📚', color: '#3b82f6' },
  { min: 50, max: 70, label: 'Aspirant', icon: '⚡', color: '#8b5cf6' },
  { min: 70, max: 90, label: 'Champion', icon: '🏆', color: '#f59e0b' },
  { min: 90, max: 101, label: 'Legend', icon: '👑', color: '#ef4444' },
];

function getRank(pct: number) {
  return RANKS.find(r => pct >= r.min && pct < r.max) || RANKS[0];
}

export const Profile: React.FC = () => {
  const { profile, updateProfile, streak, getTotalProgress, todos, generateShareCode, getSubjectProgress } = useStore();
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState<string | null>(profile.avatar);
  const [targetScore, setTargetScore] = useState(() => localStorage.getItem('neet_target') || '650');
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const totalPct = Math.round(getTotalProgress());
  const doneTodos = todos.filter(t => t.completed).length;
  const rank = getRank(totalPct);
  const initials = (name.trim() || 'N').slice(0, 2).toUpperCase();

  const subjectsPct = {
    Physics: Math.round(getSubjectProgress('physics')),
    Chemistry: Math.round(getSubjectProgress('chemistry')),
    Botany: Math.round(getSubjectProgress('botany')),
    Zoology: Math.round(getSubjectProgress('zoology')),
  };

  useEffect(() => {
    setName(profile.name);
    setAvatar(profile.avatar);
  }, [profile]);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setAvatar(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateProfile(name.trim(), avatar);
    localStorage.setItem('neet_target', targetScore);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopyCode = () => {
    const code = generateShareCode();
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleReferApp = async () => {
    const msg = `🩺 I'm using NEET 2027 Tracker to prepare for NEET!\n📊 My progress: ${totalPct}%\n🏅 Rank: ${rank.icon} ${rank.label}\n\nDownload it at neerala.in — it's free! 🚀`;
    if (navigator.share) {
      await navigator.share({ title: 'NEET 2027 Tracker', text: msg }).catch(() => {});
    } else {
      navigator.clipboard.writeText(msg).catch(() => {});
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="space-y-4">

      {/* ── Hero Profile Card ── */}
      <div
        className="relative overflow-hidden rounded-3xl px-5 py-6"
        style={{
          background: 'linear-gradient(135deg, rgba(79,31,191,0.20) 0%, rgba(14,127,163,0.15) 100%)',
          border: '1px solid rgba(124,58,237,0.18)',
        }}
      >
        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)' }} />

        <div className="flex items-center gap-4 relative z-10">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className="w-20 h-20 rounded-3xl overflow-hidden flex items-center justify-center text-white text-xl font-black"
              style={{
                background: avatar ? 'transparent' : 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                boxShadow: '0 8px 24px rgba(124,58,237,0.45)',
              }}
            >
              {avatar ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" /> : initials}
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 3px 10px rgba(124,58,237,0.5)' }}
            >
              <Camera className="w-3 h-3" />
            </motion.button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div
              className="text-lg font-display font-black truncate"
              style={{
                background: 'linear-gradient(90deg, #a78bfa, #22d3ee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {name.trim() || 'NEET Aspirant'}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-base">{rank.icon}</span>
              <span className="text-xs font-bold" style={{ color: rank.color }}>{rank.label}</span>
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5 font-medium">NEET 2027 Aspirant</div>
          </div>

          {/* Progress donut mini */}
          <div className="flex-shrink-0 text-center">
            <div
              className="text-2xl font-display font-black"
              style={{ background: 'linear-gradient(135deg, #a78bfa, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              {totalPct}%
            </div>
            <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wide">Done</div>
          </div>
        </div>
      </div>

      {/* ── Name + Photo Edit ── */}
      <div className="glass-panel p-4 space-y-3">
        <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Edit Profile</p>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter your name"
            maxLength={30}
            className="w-full pl-9 pr-4 py-3 rounded-2xl text-sm font-medium text-foreground placeholder:text-muted-foreground/40 outline-none"
            style={{ background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.18)' }}
          />
        </div>
        {/* Target score */}
        <div className="relative">
          <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <input
            type="number"
            value={targetScore}
            onChange={e => setTargetScore(e.target.value)}
            placeholder="Target score (e.g. 680)"
            min={0} max={720}
            className="w-full pl-9 pr-4 py-3 rounded-2xl text-sm font-medium text-foreground placeholder:text-muted-foreground/40 outline-none"
            style={{ background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.18)' }}
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleSave}
          className="w-full py-3 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2"
          style={{
            background: saved ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            boxShadow: saved ? '0 4px 16px rgba(34,197,94,0.4)' : '0 4px 16px rgba(124,58,237,0.4)',
            transition: 'background 0.3s',
          }}
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Profile'}
        </motion.button>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { icon: <BarChart3 className="w-4 h-4" />, value: `${totalPct}%`, label: 'Total', color: '#7c3aed' },
          { icon: <Flame className="w-4 h-4" />, value: streak.currentStreak, label: 'Streak', color: '#f97316' },
          { icon: <CheckSquare className="w-4 h-4" />, value: doneTodos, label: 'Done', color: '#06b6d4' },
          { icon: <Target className="w-4 h-4" />, value: targetScore || '—', label: 'Target', color: '#22c55e' },
        ].map(({ icon, value, label, color }) => (
          <div key={label} className="glass-panel p-2.5 text-center">
            <div className="w-7 h-7 rounded-xl mx-auto mb-1.5 flex items-center justify-center text-white"
              style={{ background: color, boxShadow: `0 3px 10px ${color}50` }}>
              {icon}
            </div>
            <div className="text-sm font-black text-foreground">{value}</div>
            <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wide mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* ── Subject Stats ── */}
      <div className="glass-panel p-4">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-foreground">Subject Performance</span>
        </div>
        <div className="space-y-2.5">
          {Object.entries(subjectsPct).map(([subject, pct]) => (
            <div key={subject}>
              <div className="flex justify-between text-[11px] font-semibold mb-1">
                <span className="text-foreground/75">{subject}</span>
                <span className="text-foreground/80 font-bold">{pct}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(124,58,237,0.10)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Rank Badge ── */}
      <div
        className="relative overflow-hidden rounded-3xl p-4 flex items-center gap-4"
        style={{ background: `linear-gradient(135deg, ${rank.color}20, ${rank.color}08)`, border: `1px solid ${rank.color}30` }}
      >
        <div className="text-4xl">{rank.icon}</div>
        <div className="flex-1">
          <p className="font-display font-black text-base text-foreground">{rank.label}</p>
          <p className="text-[11px] text-muted-foreground">
            {totalPct < 90 ? `${RANKS.find(r => r.min > totalPct)?.min ?? 90}% to next rank` : 'Top rank achieved! 🎉'}
          </p>
          <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: `${rank.color}20` }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                background: rank.color,
                width: `${Math.min(100, ((totalPct - rank.min) / (rank.max - rank.min)) * 100)}%`
              }}
            />
          </div>
        </div>
        <div>
          <Star className="w-5 h-5" style={{ color: rank.color }} />
        </div>
      </div>

      {/* ── Progress Code + Referral ── */}
      <div className="glass-panel p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-foreground">Share & Connect</span>
        </div>

        {/* Progress code */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleCopyCode}
          className="w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
          style={{
            background: copied ? 'rgba(34,197,94,0.12)' : 'rgba(124,58,237,0.10)',
            border: copied ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(124,58,237,0.2)',
            color: copied ? '#22c55e' : 'hsl(var(--primary))',
          }}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Progress Code Copied!' : 'Copy Progress Code'}
        </motion.button>
        <p className="text-[10px] text-muted-foreground text-center">Paste this in Study Group so friends see your score on the leaderboard</p>

        {/* Refer app */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleReferApp}
          className="w-full py-3 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 4px 16px rgba(124,58,237,0.35)' }}
        >
          {shared ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          {shared ? 'Link Copied!' : 'Refer App to Friends'}
        </motion.button>
        <p className="text-[10px] text-muted-foreground text-center">
          <Heart className="w-3 h-3 inline text-red-400 mr-0.5" />
          Help a fellow aspirant prepare for NEET 2027!
        </p>
      </div>

    </motion.div>
  );
};
