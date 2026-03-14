import React, { useMemo } from 'react';
import { Link } from 'wouter';
import { useStore } from '@/hooks/use-store';
import { SYLLABUS, SubjectId } from '@/lib/syllabus';
import { ProgressBar } from '@/components/ProgressBar';
import { Countdown } from '@/components/Countdown';
import { StudyTimer } from '@/components/StudyTimer';
import {
  Flame, Atom, FlaskConical, Leaf, Dna, Quote, ChevronRight,
  CheckCircle2, Circle, Plus, ArrowRight, ListTodo
} from 'lucide-react';
import { motion } from 'framer-motion';

const DOCTOR_QUOTES = [
  { quote: "Every page you study today is a life you'll save tomorrow.", author: "Anonymous" },
  { quote: "The good physician treats the disease; the great physician treats the patient.", author: "William Osler" },
  { quote: "Your stethoscope awaits. Keep going.", author: "Anonymous" },
  { quote: "MBBS is not just a degree — it is a commitment to humanity.", author: "Anonymous" },
  { quote: "Believe in yourself. You are one NEET score away from changing lives.", author: "Anonymous" },
  { quote: "Hard work beats talent when talent doesn't work hard. Especially in NEET.", author: "Anonymous" },
  { quote: "Discipline is the bridge between NEET goals and NEET achievement.", author: "Anonymous" },
  { quote: "Medicine is a science of uncertainty and an art of probability.", author: "William Osler" },
  { quote: "The greatest medicine of all is to teach people how not to need it.", author: "Hippocrates" },
  { quote: "Every human being is the author of his own health or disease.", author: "Buddha" },
  { quote: "It is health that is real wealth and not pieces of gold and silver.", author: "Mahatma Gandhi" },
  { quote: "Success in NEET is not luck. It is the result of daily consistency.", author: "Anonymous" },
  { quote: "One day, a patient will thank you for not giving up on your dream.", author: "Anonymous" },
  { quote: "The white coat is earned through sleepless nights and relentless dedication.", author: "Anonymous" },
  { quote: "Wherever the art of medicine is loved, there is also a love of humanity.", author: "Hippocrates" },
];

const subjectConfig: Record<SubjectId, { icon: React.ReactNode; color: string; grad: string }> = {
  physics: { icon: <Atom className="w-5 h-5 text-white" />, color: 'from-blue-500 to-violet-500', grad: '#3b82f6' },
  chemistry: { icon: <FlaskConical className="w-5 h-5 text-white" />, color: 'from-emerald-500 to-cyan-500', grad: '#10b981' },
  botany: { icon: <Leaf className="w-5 h-5 text-white" />, color: 'from-green-500 to-lime-500', grad: '#22c55e' },
  zoology: { icon: <Dna className="w-5 h-5 text-white" />, color: 'from-amber-500 to-red-500', grad: '#f59e0b' },
};

function getDailyQuote() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return DOCTOR_QUOTES[dayOfYear % DOCTOR_QUOTES.length];
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export const Home: React.FC = () => {
  const { getTotalProgress, getSubjectProgress, getCompletedChapters, getTotalChapters, streak, profile, todos, toggleTodo, theme } = useStore();
  const overallProgress = getTotalProgress();
  const dailyQuote = useMemo(() => getDailyQuote(), []);
  const subjects: SubjectId[] = ['physics', 'chemistry', 'botany', 'zoology'];
  const displayName = profile.name?.trim() || null;
  const isDark = theme === 'dark';

  const pendingTodos = todos.filter(t => !t.completed).slice(0, 3);
  const totalPending = todos.filter(t => !t.completed).length;

  const sectionLabel = (text: string) => (
    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 px-1">{text}</p>
  );

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-2.5">

      {/* ── Welcome Banner ── */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl px-4 py-3.5"
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(6,182,212,0.10) 100%)',
          border: '1px solid rgba(124,58,237,0.15)',
        }}
      >
        <div className="absolute -top-5 -right-5 w-16 h-16 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)' }} />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">{getGreeting()}</p>
            {displayName ? (
              <p
                className="text-base font-display font-black mt-0.5 leading-tight"
                style={{
                  background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 8px hsl(var(--primary)/0.4))',
                }}
              >
                {displayName} 👋
              </p>
            ) : (
              <Link href="/profile">
                <p className="text-sm font-bold text-primary/80 mt-0.5">Set your name →</p>
              </Link>
            )}
          </div>
          <div className="text-right">
            <div
              className="text-2xl font-display font-black"
              style={{
                background: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {Math.round(overallProgress)}%
            </div>
            <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground/60">Overall</p>
          </div>
        </div>
        <div className="mt-2.5 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(124,58,237,0.12)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }}
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          />
        </div>
      </motion.div>

      {/* ── Daily Motivation ── */}
      <motion.div variants={itemVariants} className="glass-panel relative overflow-hidden px-4 py-3">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 pointer-events-none" />
        <div className="relative z-10 flex items-start gap-2.5">
          <Quote className="w-3.5 h-3.5 text-primary/60 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-foreground/85 italic leading-relaxed line-clamp-2">
              {dailyQuote.quote}
            </p>
            <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">— {dailyQuote.author}</p>
          </div>
        </div>
      </motion.div>

      {/* ── Streak + Progress row ── */}
      <motion.div variants={itemVariants} className="flex gap-2.5">
        <div className="flex-1 glass-panel px-3.5 py-2.5 flex items-center gap-2.5 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-12 h-12 bg-orange-500/10 rounded-full blur-xl pointer-events-none" />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="p-1.5 rounded-xl flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #fb923c, #ef4444)', boxShadow: '0 3px 10px rgba(251,146,60,0.4)' }}
          >
            <Flame className="w-4 h-4 text-white" />
          </motion.div>
          <div className="min-w-0">
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wide">Streak</p>
            <p
              className="text-lg font-display font-black leading-tight"
              style={{ background: 'linear-gradient(135deg, #fb923c, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              {streak.currentStreak} <span className="text-[11px] text-muted-foreground font-normal" style={{ WebkitTextFillColor: 'initial' }}>days</span>
            </p>
          </div>
        </div>

        <Link href="/progress" className="flex-1 block">
          <div className="glass-panel px-3.5 py-2.5 h-full flex items-center gap-2.5 relative overflow-hidden cursor-pointer">
            <div className="absolute left-0 top-0 w-12 h-12 bg-violet-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="p-1.5 rounded-xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 3px 10px rgba(124,58,237,0.4)' }}>
              <ChevronRight className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wide">Detailed</p>
              <p className="text-sm font-display font-black leading-tight"
                style={{ background: 'linear-gradient(135deg, #a78bfa, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Progress →
              </p>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* ── Subjects ── */}
      <motion.div variants={itemVariants}>
        {sectionLabel('Subjects')}
        <div className="grid grid-cols-2 gap-2">
          {subjects.map(sub => {
            const s = SYLLABUS[sub];
            const prog = getSubjectProgress(sub);
            const completed = getCompletedChapters(sub);
            const total = getTotalChapters(sub);
            const cfg = subjectConfig[sub];

            return (
              <Link key={sub} href={`/subject/${sub}`} className="block outline-none">
                <motion.div
                  whileTap={{ scale: 0.96 }}
                  className="glass-panel-interactive p-3.5 flex flex-col cursor-pointer relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${cfg.color} opacity-[0.07] pointer-events-none`} />
                  <div className="absolute -right-3 -top-3 w-12 h-12 rounded-full opacity-20 pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${cfg.grad}, transparent)` }} />

                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${cfg.color} flex items-center justify-center mb-2.5 shadow-lg relative z-10`}>
                    {cfg.icon}
                  </div>

                  <div className="relative z-10">
                    <h3 className="font-display font-extrabold text-sm tracking-tight text-foreground">{s.name}</h3>
                    <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">{completed}/{total}</p>
                  </div>

                  <div className="mt-2 relative z-10">
                    <div className="flex justify-between text-[10px] font-bold mb-1">
                      <span className="text-muted-foreground/70">Progress</span>
                      <span className={`bg-gradient-to-r ${cfg.color} bg-clip-text text-transparent`}>{Math.round(prog)}%</span>
                    </div>
                    <ProgressBar progress={prog} colorClass={`bg-gradient-to-r ${cfg.color}`} height={4} />
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* ── To-Do Mini Section ── */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-2 px-1">
          {sectionLabel('To-Do')}
          <Link href="/todos">
            <span className="text-[10px] font-black text-primary flex items-center gap-0.5 -mt-2">
              See All <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        </div>
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.70)',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(124,58,237,0.12)',
            backdropFilter: isDark ? undefined : 'blur(16px)',
          }}
        >
          {pendingTodos.length === 0 ? (
            <Link href="/todos">
              <div className="px-4 py-3.5 flex items-center gap-3 cursor-pointer">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
                  <ListTodo className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">No pending tasks</p>
                  <p className="text-[10px] text-muted-foreground">Tap to add tasks for today</p>
                </div>
                <Plus className="w-4 h-4 text-primary ml-auto" />
              </div>
            </Link>
          ) : (
            <>
              {pendingTodos.map((task, i) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 px-4 py-2.5"
                  style={{
                    borderBottom: i < pendingTodos.length - 1
                      ? isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(124,58,237,0.07)'
                      : undefined
                  }}
                >
                  <button
                    onClick={() => toggleTodo(task.id)}
                    className="flex-shrink-0 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Circle className="w-5 h-5" />
                  </button>
                  <Link href={`/todos/${task.id}`} className="flex-1 min-w-0 block">
                    <p className="text-sm font-semibold text-foreground truncate">{task.title}</p>
                    {task.description ? (
                      <p className="text-[10px] text-muted-foreground truncate">{task.description}</p>
                    ) : null}
                  </Link>
                </div>
              ))}
              {totalPending > 3 && (
                <Link href="/todos">
                  <div className="px-4 py-2.5 flex items-center justify-center gap-1"
                    style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(124,58,237,0.07)' }}>
                    <span className="text-[11px] font-bold text-primary">+{totalPending - 3} more tasks</span>
                    <ArrowRight className="w-3 h-3 text-primary" />
                  </div>
                </Link>
              )}
            </>
          )}
        </div>
      </motion.div>

      {/* ── Study Timer Section ── */}
      <motion.div variants={itemVariants}>
        {sectionLabel('Study Timer')}
        <StudyTimer />
      </motion.div>

      {/* ── Countdown ── */}
      <motion.div variants={itemVariants}>
        {sectionLabel('Exam Countdown')}
        <Countdown />
      </motion.div>

    </motion.div>
  );
};
