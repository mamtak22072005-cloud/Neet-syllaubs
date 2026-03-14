import React, { useState } from 'react';
import { Link } from 'wouter';
import { useStore } from '@/hooks/use-store';
import { SYLLABUS, SubjectId } from '@/lib/syllabus';
import { ProgressCircle } from '@/components/ProgressCircle';
import { motion, AnimatePresence } from 'framer-motion';
import { Atom, FlaskConical, Leaf, Dna, ChevronDown, CheckCircle2, Circle } from 'lucide-react';

const SUBJECTS: { id: SubjectId; label: string; icon: React.ReactNode; from: string; to: string }[] = [
  { id: 'physics', label: 'Physics', icon: <Atom className="w-4 h-4" />, from: '#3b82f6', to: '#8b5cf6' },
  { id: 'chemistry', label: 'Chemistry', icon: <FlaskConical className="w-4 h-4" />, from: '#10b981', to: '#06b6d4' },
  { id: 'botany', label: 'Botany', icon: <Leaf className="w-4 h-4" />, from: '#22c55e', to: '#84cc16' },
  { id: 'zoology', label: 'Zoology', icon: <Dna className="w-4 h-4" />, from: '#f59e0b', to: '#ef4444' },
];

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export const Progress: React.FC = () => {
  const { getSubjectProgress, getChapterProgress, getTotalProgress } = useStore();
  const [expanded, setExpanded] = useState<string | null>(null);
  const total = Math.round(getTotalProgress());

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="space-y-4">

      {/* ── Hero Progress Circle ── */}
      <div
        className="relative overflow-hidden rounded-3xl px-5 py-7 flex flex-col items-center text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(79,31,191,0.15) 0%, rgba(6,182,212,0.08) 100%)',
          border: '1px solid rgba(124,58,237,0.15)',
        }}
      >
        <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)' }} />

        <p
          className="text-xs font-black uppercase tracking-widest mb-4"
          style={{ background: 'linear-gradient(90deg, #a78bfa, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
        >
          Overall Progress
        </p>
        <ProgressCircle progress={total} size={160} strokeWidth={14} />
        <p className="text-xs text-muted-foreground mt-3 font-medium">Track Your Entire NEET 2027 Preparation</p>

        {/* Subject mini row */}
        <div className="flex gap-5 justify-center mt-4 pt-4 w-full border-t border-white/8">
          {SUBJECTS.map(s => {
            const pct = Math.round(getSubjectProgress(s.id));
            return (
              <div key={s.id} className="text-center">
                <div className="text-sm font-black" style={{ background: `linear-gradient(90deg, ${s.from}, ${s.to})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{pct}%</div>
                <div className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wide mt-0.5">{s.label.slice(0, 4)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Per-subject expandable ── */}
      {SUBJECTS.map((subject, idx) => {
        const subPct = Math.round(getSubjectProgress(subject.id));
        const allChaps = [...SYLLABUS[subject.id].class11, ...SYLLABUS[subject.id].class12];
        const completedChaps = allChaps.filter(c => getChapterProgress(subject.id, c) === 100).length;
        const isOpen = expanded === subject.id;

        return (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            className="glass-panel overflow-hidden"
          >
            <button
              className="w-full p-4 flex items-center gap-3 text-left"
              onClick={() => setExpanded(isOpen ? null : subject.id)}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${subject.from}, ${subject.to})`, boxShadow: `0 4px 12px ${subject.from}40` }}
              >
                {subject.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-bold text-foreground">{subject.label}</p>
                  <span className="text-sm font-black text-foreground/80">{subPct}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden bg-foreground/8">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${subject.from}, ${subject.to})` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${subPct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.05 }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{completedChaps}/{allChaps.length} chapters complete</p>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="flex-shrink-0 text-muted-foreground"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  {['class11', 'class12'].map(cls => {
                    const chapters = SYLLABUS[subject.id][cls as 'class11' | 'class12'];
                    if (chapters.length === 0) return null;
                    return (
                      <div key={cls} className="px-4 pb-3">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2 pl-1">
                          Class {cls === 'class11' ? '11' : '12'}
                        </p>
                        <div className="space-y-1.5">
                          {chapters.map(chapter => {
                            const pct = Math.round(getChapterProgress(subject.id, chapter));
                            const done = pct === 100;
                            return (
                              <Link key={chapter} href={`/subject/${subject.id}/chapter/${encodeURIComponent(chapter)}`}>
                                <div className="flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer hover:bg-foreground/5 transition-colors">
                                  {done
                                    ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: subject.from }} />
                                    : <Circle className="w-4 h-4 flex-shrink-0 text-muted-foreground/40" />
                                  }
                                  <span className="flex-1 text-xs text-foreground/80 font-medium truncate">{chapter}</span>
                                  <div className="flex items-center gap-2">
                                    <div className="w-14 h-1 rounded-full overflow-hidden bg-foreground/8">
                                      <div
                                        className="h-full rounded-full"
                                        style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${subject.from}, ${subject.to})` }}
                                      />
                                    </div>
                                    <span className="text-[10px] text-muted-foreground w-7 text-right font-semibold">{pct}%</span>
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
