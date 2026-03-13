import React, { useMemo } from 'react';
import { Link } from 'wouter';
import { useStore } from '@/hooks/use-store';
import { SYLLABUS, SubjectId } from '@/lib/syllabus';
import { ProgressCircle } from '@/components/ProgressCircle';
import { ProgressBar } from '@/components/ProgressBar';
import { Countdown } from '@/components/Countdown';
import { Flame, CheckCircle2, ChevronRight, ListTodo, Atom, FlaskConical, Leaf, Dna, Stethoscope, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const DOCTOR_QUOTES = [
  { quote: "The good physician treats the disease; the great physician treats the patient who has the disease.", author: "William Osler" },
  { quote: "Wherever the art of medicine is loved, there is also a love of humanity.", author: "Hippocrates" },
  { quote: "Medicine is not only a science; it is also an art. It does not consist of compounding pills and plasters; it deals with the very processes of life.", author: "Paracelsus" },
  { quote: "The doctor of the future will give no medicine, but will instruct his patients in care of the human frame, in diet and in the cause and prevention of disease.", author: "Thomas Edison" },
  { quote: "To study the phenomena of disease without books is to sail an uncharted sea, while to study books without patients is not to go to sea at all.", author: "William Osler" },
  { quote: "The art of medicine consists of amusing the patient while nature cures the disease.", author: "Voltaire" },
  { quote: "One of the first duties of the physician is to educate the masses not to take medicine.", author: "William Osler" },
  { quote: "Medicine is a science of uncertainty and an art of probability.", author: "William Osler" },
  { quote: "Diagnosis is not the end, but the beginning of practice.", author: "Martin H. Fischer" },
  { quote: "The greatest medicine of all is to teach people how not to need it.", author: "Hippocrates" },
  { quote: "A doctor who cannot take a good history and a patient who cannot give one are in danger with each other.", author: "Paul Dudley White" },
  { quote: "The best doctor gives the least medicines.", author: "Benjamin Franklin" },
  { quote: "Every human being is the author of his own health or disease.", author: "Buddha" },
  { quote: "It is health that is real wealth and not pieces of gold and silver.", author: "Mahatma Gandhi" },
  { quote: "A physician is obligated to consider more than a diseased organ, more even than the whole man — he must view the man in his world.", author: "Harvey Cushing" },
  { quote: "The secret of the care of the patient is in caring for the patient.", author: "Francis Peabody" },
  { quote: "In nothing do men more nearly approach the gods than in giving health to men.", author: "Marcus Tullius Cicero" },
  { quote: "The aim of medicine is to prevent disease and prolong life; the ideal of medicine is to eliminate the need of a physician.", author: "William J. Mayo" },
  { quote: "Your dreams of becoming a doctor will save countless lives. Study hard, stay focused.", author: "Anonymous" },
  { quote: "Every page you study today is a life you'll save tomorrow.", author: "Anonymous" },
  { quote: "MBBS is not just a degree — it is a commitment to humanity.", author: "Anonymous" },
  { quote: "The white coat is earned through sleepless nights and relentless dedication.", author: "Anonymous" },
  { quote: "One day, a patient will thank you for not giving up on your dream of medicine.", author: "Anonymous" },
  { quote: "Hard work beats talent when talent doesn't work hard. Especially in NEET.", author: "Anonymous" },
  { quote: "The road to medicine is long, but every step forward heals the world a little more.", author: "Anonymous" },
  { quote: "Believe in yourself. You are one NEET score away from changing lives.", author: "Anonymous" },
  { quote: "Discipline is the bridge between NEET goals and NEET achievement.", author: "Anonymous" },
  { quote: "Your stethoscope awaits. Keep going.", author: "Anonymous" },
  { quote: "Sleep less, dream more — and study in between.", author: "Anonymous" },
  { quote: "Success in NEET is not luck. It is the result of daily consistency.", author: "Anonymous" },
];

const subjectIcons: Record<SubjectId, React.ReactNode> = {
  physics: <Atom className="w-6 h-6 text-white" />,
  chemistry: <FlaskConical className="w-6 h-6 text-white" />,
  botany: <Leaf className="w-6 h-6 text-white" />,
  zoology: <Dna className="w-6 h-6 text-white" />
};

const subjectGlows: Record<SubjectId, string> = {
  physics: "from-blue-500/20 to-cyan-500/20",
  chemistry: "from-purple-500/20 to-pink-500/20",
  botany: "from-emerald-500/20 to-teal-500/20",
  zoology: "from-amber-500/20 to-red-500/20",
};

function getDailyQuote() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return DOCTOR_QUOTES[dayOfYear % DOCTOR_QUOTES.length];
}

export const Home: React.FC = () => {
  const { getTotalProgress, getSubjectProgress, getCompletedChapters, getTotalChapters, streak, todos } = useStore();
  const overallProgress = getTotalProgress();
  const dailyQuote = useMemo(() => getDailyQuote(), []);

  const subjects: SubjectId[] = ['physics', 'chemistry', 'botany', 'zoology'];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.09 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 26 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">

      {/* ── Hero: NEET 2027 + Total Progress ── */}
      <motion.div variants={itemVariants} className="glass-panel p-7 flex flex-col items-center text-center space-y-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <h2
            className="text-3xl font-display font-black"
            style={{
              background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            NEET 2027
          </h2>
          <p className="text-xs text-muted-foreground mt-1 font-semibold tracking-wide">Ultimate Tracker</p>
          <p className="text-[11px] text-muted-foreground/60 mt-0.5">Track Your Entire NEET Preparation in One Place</p>
        </div>

        <div className="relative z-10">
          <ProgressCircle progress={overallProgress} size={162} strokeWidth={14} />
        </div>

        {/* Mini per-subject row */}
        <div className="relative z-10 flex gap-5 w-full justify-center pt-1">
          {subjects.map(sub => (
            <div key={sub} className="flex flex-col items-center gap-0.5">
              <span className="text-sm font-display font-extrabold text-foreground">
                {Math.round(getSubjectProgress(sub))}%
              </span>
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">
                {SYLLABUS[sub].name.slice(0, 4)}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Daily Motivation ── */}
      <motion.div variants={itemVariants} className="glass-panel relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/15 via-purple-500/8 to-cyan-500/15 pointer-events-none" />
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="p-5 relative z-10">
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="p-2 rounded-xl shadow-lg"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 4px 14px rgba(124,58,237,0.4)' }}
            >
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Daily Motivation</p>
              <p className="text-[11px] text-primary font-bold">Doctor's Wisdom of the Day</p>
            </div>
          </div>
          <div className="relative pl-4">
            <Quote className="absolute left-0 top-0.5 w-3 h-3 text-primary/50" />
            <p className="text-sm font-medium leading-relaxed text-foreground/90 italic">
              {dailyQuote.quote}
            </p>
          </div>
          <p className="text-right text-xs text-muted-foreground font-semibold mt-2.5">— {dailyQuote.author}</p>
        </div>
      </motion.div>

      {/* ── Study Streak ── */}
      <motion.div variants={itemVariants} className="glass-panel p-5 flex items-center justify-between overflow-hidden relative">
        <div className="absolute right-0 top-0 w-36 h-36 bg-orange-500/10 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <motion.div
            animate={{ scale: [1, 1.18, 1] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="p-3 rounded-2xl shadow-lg"
            style={{ background: 'linear-gradient(135deg, #fb923c, #ef4444)', boxShadow: '0 6px 20px rgba(251,146,60,0.4)' }}
          >
            <Flame className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="font-display font-bold text-base">Study Streak</h3>
            <p className="text-muted-foreground text-xs">Keep the momentum!</p>
          </div>
        </div>
        <div className="relative z-10 text-right">
          <motion.span
            key={streak.currentStreak}
            initial={{ scale: 1.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-display font-extrabold"
            style={{
              background: 'linear-gradient(135deg, #fb923c, #ef4444)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {streak.currentStreak}
          </motion.span>
          <span className="text-xs text-muted-foreground ml-1 block">Days</span>
        </div>
      </motion.div>

      {/* ── Subject Cards ── */}
      <motion.div variants={itemVariants}>
        <h3 className="text-[11px] font-display font-black uppercase tracking-widest text-muted-foreground mb-3 px-1">
          Subjects
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {subjects.map((sub) => {
            const s = SYLLABUS[sub];
            const prog = getSubjectProgress(sub);
            const completed = getCompletedChapters(sub);
            const total = getTotalChapters(sub);
            const remaining = total - completed;

            return (
              <Link key={sub} href={`/subject/${sub}`} className="block h-full outline-none">
                <motion.div
                  whileHover={{ y: -5, scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  className="glass-panel-interactive p-5 flex flex-col h-full cursor-pointer relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${subjectGlows[sub]} pointer-events-none`} />
                  <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${s.color} opacity-15 rounded-full blur-2xl pointer-events-none`} />

                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 shadow-lg relative z-10`}
                    style={{ boxShadow: `0 6px 20px rgba(0,0,0,0.25)` }}>
                    {subjectIcons[sub]}
                  </div>

                  <div className="flex-1 relative z-10">
                    <h3 className="font-display font-extrabold text-base mb-1 tracking-tight">{s.name}</h3>
                    <p className="text-xs text-muted-foreground mb-0.5 font-semibold">
                      {completed}/{total} Done
                    </p>
                    <p className="text-[10px] text-muted-foreground/55 font-medium">
                      {remaining} remaining
                    </p>
                  </div>

                  <div className="space-y-1.5 mt-4 relative z-10">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-muted-foreground">Progress</span>
                      <span
                        style={{
                          background: `linear-gradient(90deg, var(--tw-gradient-from), var(--tw-gradient-to))`,
                        }}
                        className={`bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}
                      >
                        {Math.round(prog)}%
                      </span>
                    </div>
                    <ProgressBar progress={prog} colorClass={`bg-gradient-to-r ${s.color}`} height={7} />
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* ── NEET 2027 Countdown ── */}
      <motion.div variants={itemVariants}>
        <Countdown />
      </motion.div>

      {/* ── Today's Tasks Preview ── */}
      <motion.div variants={itemVariants} className="glass-panel p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-xl text-primary">
              <ListTodo className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base">Today's Tasks</h3>
          </div>
          <Link
            href="/todos"
            className="text-[11px] font-bold text-primary hover:text-primary/80 flex items-center gap-0.5 transition-colors bg-primary/10 px-3 py-1.5 rounded-full"
          >
            View All <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {todos.length === 0 ? (
          <div className="text-center py-7 rounded-2xl border border-white/5" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <p className="text-sm text-muted-foreground">No tasks yet.</p>
            <Link href="/todos" className="text-primary font-bold text-sm mt-1 inline-block hover:underline">
              + Add a task
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {todos.slice(0, 3).map((task) => (
              <Link key={task.id} href={`/todos/${task.id}`} className="block outline-none">
                <motion.div
                  whileHover={{ x: 5 }}
                  className={cn(
                    "flex items-center gap-3 p-3.5 rounded-2xl border border-white/5 cursor-pointer transition-colors",
                    task.completed ? "opacity-50" : "hover:bg-white/5",
                  )}
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <div className={cn(
                    "flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                    task.completed ? "bg-emerald-500 border-emerald-500" : "border-muted-foreground/40"
                  )}>
                    {task.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <span className={cn("text-sm font-medium truncate flex-1", task.completed && "line-through text-muted-foreground")}>
                    {task.title}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0" />
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>

    </motion.div>
  );
};
