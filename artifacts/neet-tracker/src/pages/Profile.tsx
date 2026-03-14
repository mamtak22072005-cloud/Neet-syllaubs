import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@/hooks/use-store';
import { motion } from 'framer-motion';
import { Camera, User, Save, Flame, CheckSquare, BarChart3, Trophy, Copy, Check } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export const Profile: React.FC = () => {
  const { profile, updateProfile, streak, getTotalProgress, todos, generateShareCode } = useStore();
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState<string | null>(profile.avatar);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const totalPct = Math.round(getTotalProgress());
  const doneTodos = todos.filter(t => t.completed).length;

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
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopyCode = () => {
    const code = generateShareCode();
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const initials = (name.trim() || 'N').slice(0, 2).toUpperCase();

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="space-y-4">
      <div>
        <h2 className="text-xl font-display font-extrabold text-foreground">My Profile</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Personalize your tracker</p>
      </div>

      {/* Avatar + name card */}
      <div className="glass-panel p-5">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3 mb-5">
          <div className="relative">
            <div
              className="w-24 h-24 rounded-3xl overflow-hidden flex items-center justify-center text-white text-2xl font-black"
              style={{
                background: avatar ? 'transparent' : 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                boxShadow: '0 8px 28px rgba(124,58,237,0.40)',
              }}
            >
              {avatar
                ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                : initials
              }
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 4px 12px rgba(124,58,237,0.5)' }}
            >
              <Camera className="w-3.5 h-3.5" />
            </motion.button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </div>
          <p className="text-[11px] text-muted-foreground">Tap camera to change photo</p>
        </div>

        {/* Name input */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Your Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={30}
              className="w-full pl-9 pr-4 py-3 rounded-2xl text-sm font-medium text-foreground placeholder:text-muted-foreground/40 outline-none"
              style={{
                background: 'var(--glass-bg, rgba(255,255,255,0.06))',
                border: '1px solid rgba(124,58,237,0.20)',
              }}
            />
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleSave}
          className="w-full mt-4 py-3 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2"
          style={{
            background: saved
              ? 'linear-gradient(135deg, #22c55e, #16a34a)'
              : 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            boxShadow: saved ? '0 4px 16px rgba(34,197,94,0.4)' : '0 4px 16px rgba(124,58,237,0.4)',
            transition: 'background 0.3s, box-shadow 0.3s',
          }}
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Profile'}
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <BarChart3 className="w-5 h-5" />, value: `${totalPct}%`, label: 'Total Progress', color: '#7c3aed' },
          { icon: <Flame className="w-5 h-5" />, value: streak.currentStreak, label: 'Day Streak', color: '#f97316' },
          { icon: <CheckSquare className="w-5 h-5" />, value: doneTodos, label: 'Tasks Done', color: '#06b6d4' },
        ].map(({ icon, value, label, color }) => (
          <div key={label} className="glass-panel p-3 text-center">
            <div className="w-8 h-8 rounded-xl mx-auto mb-2 flex items-center justify-center text-white" style={{ background: color, boxShadow: `0 4px 12px ${color}50` }}>
              {icon}
            </div>
            <div className="text-lg font-black text-foreground">{value}</div>
            <div className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wide mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Share code */}
      <div className="glass-panel p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white" style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Your Progress Code</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Share with friends to join leaderboard</p>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleCopyCode}
          className="w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
          style={{
            background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(124,58,237,0.10)',
            border: copied ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(124,58,237,0.2)',
            color: copied ? '#22c55e' : 'hsl(var(--primary))',
          }}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied to clipboard!' : 'Copy my progress code'}
        </motion.button>
        <p className="text-[10px] text-muted-foreground text-center mt-2">Friends paste this code in Study Group to see your progress</p>
      </div>
    </motion.div>
  );
};
