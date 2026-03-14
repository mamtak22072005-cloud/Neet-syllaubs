import React, { useState } from 'react';
import { useStore } from '@/hooks/use-store';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Plus, LogIn, Trophy, Trash2, UserPlus, ClipboardPaste,
  Crown, X, RefreshCw, Timer, BookOpen
} from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
};

function generateGroupCode(): string {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `NEERAJ${digits}`;
}

function fmtStudyTime(secs: number) {
  if (!secs || secs === 0) return '—';
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function getRankMedal(rank: number): { color: string; medal: string } {
  if (rank === 1) return { color: '#f59e0b', medal: '🥇' };
  if (rank === 2) return { color: '#94a3b8', medal: '🥈' };
  if (rank === 3) return { color: '#d97706', medal: '🥉' };
  return { color: 'hsl(var(--muted-foreground))', medal: '' };
}

type LeaderTab = 'syllabus' | 'study';

export const StudyGroup: React.FC = () => {
  const { studyGroup, joinGroup, leaveGroup, importGroupMember, removeGroupMember, syncMyProgress, theme } = useStore();
  const [codeInput, setCodeInput] = useState('');
  const [importInput, setImportInput] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [importError, setImportError] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [joining, setJoining] = useState(false);
  const [synced, setSynced] = useState(false);
  const [activeTab, setActiveTab] = useState<LeaderTab>('syllabus');
  const isDark = theme === 'dark';

  const handleCreate = () => {
    const code = generateGroupCode();
    joinGroup(code);
    setJoining(false);
  };

  const handleJoin = () => {
    if (codeInput.trim().length < 4) return;
    joinGroup(codeInput.trim());
    setCodeInput('');
    setJoining(false);
  };

  const handleImport = () => {
    const ok = importGroupMember(importInput);
    if (ok) {
      setImportSuccess(true);
      setImportInput('');
      setImportError(false);
      setTimeout(() => { setImportSuccess(false); setShowImport(false); }, 2000);
    } else {
      setImportError(true);
    }
  };

  const handleSync = () => {
    syncMyProgress();
    setSynced(true);
    setTimeout(() => setSynced(false), 2000);
  };

  const syllabusSorted = studyGroup
    ? [...studyGroup.members].sort((a, b) => b.progress - a.progress)
    : [];

  const studySorted = studyGroup
    ? [...studyGroup.members].sort((a, b) => (b.studyTimeToday || 0) - (a.studyTimeToday || 0))
    : [];

  const displayList = activeTab === 'syllabus' ? syllabusSorted : studySorted;

  /* ── No group / joining ── */
  if (!studyGroup && !joining) {
    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" className="space-y-4">
        <div>
          <h2 className="text-xl font-display font-extrabold text-foreground">Study Group</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Compete with friends on the leaderboard</p>
        </div>

        <div
          className="relative overflow-hidden rounded-3xl p-6 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(79,31,191,0.15) 0%, rgba(6,182,212,0.10) 100%)',
            border: '1px solid rgba(124,58,237,0.15)',
          }}
        >
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
          <div className="w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center text-white"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 8px 24px rgba(124,58,237,0.4)' }}>
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-display font-extrabold text-foreground mb-1">Join a Study Group</h3>
          <p className="text-sm text-muted-foreground mb-5">
            Create or join a group. See who's ahead on syllabus and who studied most today!
          </p>
          <div className="flex gap-3">
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleCreate}
              className="flex-1 py-3 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 4px 16px rgba(124,58,237,0.4)' }}>
              <Plus className="w-4 h-4" /> Create Group
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setJoining(true)}
              className="flex-1 py-3 rounded-2xl font-bold text-sm"
              style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', color: 'hsl(var(--primary))' }}>
              <span className="flex items-center justify-center gap-2"><LogIn className="w-4 h-4" /> Join Group</span>
            </motion.button>
          </div>
        </div>

        <div className="glass-panel p-4 space-y-3">
          {[
            { step: '1', text: 'Create a group or enter a code to join' },
            { step: '2', text: 'Copy your progress code from Profile page' },
            { step: '3', text: 'Share it — friends paste it to join your leaderboard' },
            { step: '4', text: 'Leaderboard auto-shows syllabus % and daily study time!' },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>{step}</div>
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (joining) {
    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" className="space-y-4">
        <div>
          <h2 className="text-xl font-display font-extrabold text-foreground">Join a Group</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Enter the group code your friend shared</p>
        </div>
        <div className="glass-panel p-5 space-y-4">
          <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Group Code</label>
          <input
            value={codeInput}
            onChange={e => setCodeInput(e.target.value.toUpperCase())}
            placeholder="e.g. NEET4217"
            maxLength={12}
            className="w-full px-4 py-3.5 rounded-2xl text-center text-xl font-black text-foreground tracking-widest outline-none"
            style={{ background: 'rgba(124,58,237,0.08)', border: '1.5px solid rgba(124,58,237,0.25)', letterSpacing: '0.18em' }}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
          />
          <div className="flex gap-3">
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setJoining(false)}
              className="flex-1 py-3 rounded-2xl font-bold text-sm"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'hsl(var(--muted-foreground))' }}>
              Cancel
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleJoin}
              className="flex-1 py-3 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 4px 14px rgba(124,58,237,0.4)' }}>
              <LogIn className="w-4 h-4" /> Join
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  /* ── Group view ── */
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="space-y-3">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-extrabold text-foreground">Study Group</h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] font-black tracking-widest text-muted-foreground">CODE:</span>
            <span
              className="text-[12px] font-black"
              style={{
                background: 'linear-gradient(90deg, #a78bfa, #22d3ee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '0.12em',
              }}
            >
              {studyGroup?.code}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <motion.button whileTap={{ scale: 0.9 }} onClick={handleSync}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: synced ? 'rgba(34,197,94,0.15)' : 'rgba(124,58,237,0.12)',
              border: '1px solid rgba(124,58,237,0.2)',
              color: synced ? '#22c55e' : 'hsl(var(--primary))',
            }}>
            <RefreshCw className={`w-4 h-4 ${synced ? '' : ''}`} />
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} onClick={leaveGroup}
            className="w-9 h-9 rounded-full flex items-center justify-center text-red-400/70"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
            <X className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Leaderboard card */}
      <div className="glass-panel overflow-hidden">
        {/* Card header + tabs */}
        <div className="px-4 pt-4 pb-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-bold text-foreground">Leaderboard</span>
              <span className="text-[10px] font-bold text-muted-foreground">
                {displayList.length} member{displayList.length !== 1 ? 's' : ''}
              </span>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSync}
              className="text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1"
              style={{
                background: synced ? 'rgba(34,197,94,0.12)' : 'rgba(124,58,237,0.10)',
                color: synced ? '#22c55e' : 'hsl(var(--primary))',
              }}
            >
              <RefreshCw className="w-3 h-3" />
              {synced ? 'Synced!' : 'Sync'}
            </motion.button>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-2xl overflow-hidden mb-0 p-0.5 gap-1"
            style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(124,58,237,0.07)' }}>
            <button
              onClick={() => setActiveTab('syllabus')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[14px] text-[11px] font-bold transition-all"
              style={{
                background: activeTab === 'syllabus' ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'transparent',
                color: activeTab === 'syllabus' ? '#fff' : isDark ? 'rgba(255,255,255,0.45)' : 'rgba(80,60,120,0.5)',
              }}
            >
              <BookOpen className="w-3 h-3" />
              Syllabus %
            </button>
            <button
              onClick={() => setActiveTab('study')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[14px] text-[11px] font-bold transition-all"
              style={{
                background: activeTab === 'study' ? 'linear-gradient(135deg, #0891b2, #06b6d4)' : 'transparent',
                color: activeTab === 'study' ? '#fff' : isDark ? 'rgba(255,255,255,0.45)' : 'rgba(80,60,120,0.5)',
              }}
            >
              <Timer className="w-3 h-3" />
              Today's Study
            </button>
          </div>
        </div>

        {/* Members list */}
        {displayList.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground text-sm">No members yet. Add friends below!</p>
          </div>
        ) : (
          <div className="mt-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: activeTab === 'syllabus' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {displayList.map((member, idx) => {
                  const rank = idx + 1;
                  const { color, medal } = getRankMedal(rank);
                  const initials = (member.name || '?').slice(0, 2).toUpperCase();
                  const value = activeTab === 'syllabus'
                    ? `${member.progress}%`
                    : fmtStudyTime(member.studyTimeToday || 0);
                  const barPct = activeTab === 'syllabus'
                    ? member.progress
                    : Math.min(100, ((member.studyTimeToday || 0) / (8 * 3600)) * 100);
                  const barGrad = activeTab === 'syllabus'
                    ? 'linear-gradient(90deg, #7c3aed, #a855f7)'
                    : 'linear-gradient(90deg, #0891b2, #06b6d4)';

                  return (
                    <motion.div
                      key={member.id + activeTab}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="flex items-center gap-3 px-4 py-3"
                      style={{
                        background: member.isMe
                          ? isDark ? 'rgba(124,58,237,0.08)' : 'rgba(124,58,237,0.05)'
                          : 'transparent',
                        borderTop: idx > 0
                          ? isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(124,58,237,0.06)'
                          : undefined,
                      }}
                    >
                      {/* Rank badge */}
                      <div className="w-8 flex-shrink-0 flex flex-col items-center">
                        {rank <= 3 ? (
                          <span className="text-lg leading-none">{medal}</span>
                        ) : (
                          <span className="text-xs font-black" style={{ color }}>#{rank}</span>
                        )}
                      </div>

                      {/* Avatar */}
                      <div
                        className="w-9 h-9 rounded-2xl flex-shrink-0 flex items-center justify-center text-white text-xs font-black overflow-hidden"
                        style={{
                          background: member.avatar ? 'transparent' : 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                          boxShadow: member.isMe ? '0 0 0 2px rgba(124,58,237,0.5)' : undefined,
                        }}
                      >
                        {member.avatar
                          ? <img src={member.avatar} className="w-full h-full object-cover" alt="" />
                          : initials}
                      </div>

                      {/* Name + bar */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-bold text-foreground truncate">{member.name}</span>
                          {member.isMe && <Crown className="w-3 h-3 text-yellow-500 flex-shrink-0" />}
                        </div>
                        <div className="h-1.5 mt-1 rounded-full overflow-hidden"
                          style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(124,58,237,0.08)' }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: barGrad }}
                            initial={{ width: 0 }}
                            animate={{ width: `${barPct}%` }}
                            transition={{ duration: 0.7, ease: 'easeOut', delay: idx * 0.04 }}
                          />
                        </div>
                      </div>

                      {/* Value */}
                      <div className="text-right flex-shrink-0 flex items-center gap-2">
                        <span
                          className="text-sm font-black"
                          style={{
                            background: activeTab === 'syllabus'
                              ? 'linear-gradient(135deg, #a78bfa, #22d3ee)'
                              : 'linear-gradient(135deg, #38bdf8, #06b6d4)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          }}
                        >
                          {value}
                        </span>
                        {!member.isMe && (
                          <button onClick={() => removeGroupMember(member.id)}
                            className="text-muted-foreground/30 hover:text-red-400/70 transition-colors">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Bottom sync note */}
        <div className="px-4 py-3 border-t"
          style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(124,58,237,0.06)' }}>
          <p className="text-[10px] text-muted-foreground text-center">
            Daily study time auto-captures from your Pomodoro sessions • Tap Sync to update your score
          </p>
        </div>
      </div>

      {/* Add Friend */}
      <div className="glass-panel p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-foreground">Add Friend</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => { setShowImport(!showImport); setImportError(false); }}
            className="text-[11px] font-bold px-3 py-1.5 rounded-xl"
            style={{ background: 'rgba(124,58,237,0.10)', color: 'hsl(var(--primary))' }}
          >
            {showImport ? 'Cancel' : 'Paste Code'}
          </motion.button>
        </div>

        <AnimatePresence>
          {showImport && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <p className="text-[11px] text-muted-foreground mb-2">
                Ask your friend to copy their code from <span className="text-primary font-semibold">Profile → Copy progress code</span>
              </p>
              <textarea
                value={importInput}
                onChange={e => { setImportInput(e.target.value); setImportError(false); }}
                placeholder="Paste progress code here..."
                rows={3}
                className="w-full px-3 py-2.5 rounded-2xl text-xs font-mono text-foreground placeholder:text-muted-foreground/40 outline-none resize-none"
                style={{
                  background: 'rgba(124,58,237,0.06)',
                  border: importError ? '1.5px solid rgba(239,68,68,0.4)' : '1px solid rgba(124,58,237,0.18)',
                }}
              />
              {importError && <p className="text-[11px] text-red-400 mt-1">Invalid code. Check and try again.</p>}
              {importSuccess && <p className="text-[11px] text-emerald-400 mt-1">Friend added to leaderboard!</p>}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleImport}
                className="w-full mt-2 py-2.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
              >
                <ClipboardPaste className="w-4 h-4" /> Add to Leaderboard
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {!showImport && (
          <p className="text-[11px] text-muted-foreground">
            Ask friends to copy their code from{' '}
            <span className="text-primary font-semibold">Profile → Copy progress code</span>, then paste it here.
          </p>
        )}
      </div>
    </motion.div>
  );
};
