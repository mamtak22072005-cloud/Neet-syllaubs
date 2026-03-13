import React from 'react';
import { Link } from 'wouter';
import { useStore } from '@/hooks/use-store';
import { SYLLABUS, SubjectId } from '@/lib/syllabus';
import { ProgressCircle } from '@/components/ProgressCircle';
import { ProgressBar } from '@/components/ProgressBar';
import { Flame, CheckCircle2, ChevronRight, ListTodo, Atom, FlaskConical, Leaf, Dna } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const subjectIcons: Record<SubjectId, React.ReactNode> = {
  physics: <Atom className="w-6 h-6 text-white" />,
  chemistry: <FlaskConical className="w-6 h-6 text-white" />,
  botany: <Leaf className="w-6 h-6 text-white" />,
  zoology: <Dna className="w-6 h-6 text-white" />
};

export const Home: React.FC = () => {
  const { getTotalProgress, getSubjectProgress, getCompletedChapters, getTotalChapters, streak, todos } = useStore();
  const overallProgress = getTotalProgress();

  const subjects: SubjectId[] = ['physics', 'chemistry', 'botany', 'zoology'];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      
      {/* Top Banner - Overall Progress */}
      <motion.div variants={itemVariants} className="glass-panel p-8 flex flex-col items-center justify-center text-center space-y-6">
        <div>
          <h2 className="text-xl font-display font-semibold text-foreground">Total NEET Progress</h2>
          <p className="text-sm text-muted-foreground mt-1">Track Your Entire NEET Preparation</p>
        </div>
        <ProgressCircle progress={overallProgress} size={160} strokeWidth={16} />
      </motion.div>

      {/* Streak Banner */}
      <motion.div variants={itemVariants} className="glass-panel p-5 flex items-center justify-between overflow-hidden group relative">
        <div className="absolute right-0 top-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl shadow-lg shadow-orange-500/30">
            <Flame className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg">Study Streak</h3>
            <p className="text-muted-foreground text-sm">Keep the momentum!</p>
          </div>
        </div>
        <div className="relative z-10 text-right">
          <motion.span 
            key={streak.currentStreak}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-display font-bold text-foreground text-glow"
          >
            {streak.currentStreak}
          </motion.span>
          <span className="text-sm text-muted-foreground ml-1">Days</span>
        </div>
      </motion.div>

      {/* Subject Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
        {subjects.map((sub, i) => {
          const s = SYLLABUS[sub];
          const prog = getSubjectProgress(sub);
          const completed = getCompletedChapters(sub);
          const total = getTotalChapters(sub);

          return (
            <Link key={sub} href={`/subject/${sub}`} className="block h-full outline-none">
              <motion.div 
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass-panel-interactive p-5 flex flex-col h-full cursor-pointer relative overflow-hidden"
              >
                <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${s.color} opacity-20 rounded-full blur-2xl pointer-events-none`} />
                
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} ${s.shadow} flex items-center justify-center mb-4 shadow-lg`}>
                  {subjectIcons[sub]}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-display font-bold text-lg mb-1 tracking-tight">{s.name}</h3>
                  <p className="text-xs font-medium text-muted-foreground mb-4">
                    {completed} / {total} Chapters
                  </p>
                </div>
                
                <div className="space-y-2 mt-auto">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Progress</span>
                    <span>{Math.round(prog)}%</span>
                  </div>
                  <ProgressBar progress={prog} colorClass={`bg-gradient-to-r ${s.color}`} height={8} />
                </div>
              </motion.div>
            </Link>
          );
        })}
      </motion.div>

      {/* Today's Tasks Preview */}
      <motion.div variants={itemVariants} className="glass-panel p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg text-primary">
              <ListTodo className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg">Today's Tasks</h3>
          </div>
          <Link href="/todos" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center transition-colors">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {todos.length === 0 ? (
          <div className="text-center py-8 bg-black/5 dark:bg-white/5 rounded-2xl border border-white/5">
            <p className="text-sm text-muted-foreground">No tasks scheduled.</p>
            <Link href="/todos" className="text-primary font-medium text-sm mt-2 inline-block hover:underline">Create a task +</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {todos.slice(0, 3).map((task) => (
              <Link key={task.id} href={`/todos/${task.id}`} className="block outline-none">
                <motion.div 
                  whileHover={{ x: 4 }}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-white/5 cursor-pointer transition-colors hover:bg-black/10 dark:hover:bg-white/10",
                    task.completed && "opacity-60 bg-black/5"
                  )}
                >
                  <div className={cn(
                    "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                    task.completed ? "bg-emerald-500 border-emerald-500" : "border-muted-foreground/50"
                  )}>
                    {task.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={cn("text-sm font-medium truncate", task.completed && "line-through text-muted-foreground")}>
                      {task.title}
                    </h4>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>

    </motion.div>
  );
};
