import React from 'react';
import { useRoute, Link } from 'wouter';
import { useStore } from '@/hooks/use-store';
import { SYLLABUS, SubjectId, TASKS, TASK_LABELS, TaskId } from '@/lib/syllabus';
import { ProgressCircle } from '@/components/ProgressCircle';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const Chapter: React.FC = () => {
  const [, params] = useRoute('/subject/:subId/chapter/:chapId');
  const subjectId = params?.subId as SubjectId;
  const chapterName = params?.chapId ? decodeURIComponent(params.chapId) : '';
  
  const { progress, toggleTask, getChapterProgress } = useStore();

  if (!subjectId || !SYLLABUS[subjectId] || !chapterName) return <div>Chapter not found</div>;

  const subject = SYLLABUS[subjectId];
  const chapProgress = getChapterProgress(subjectId, chapterName);
  const tasksData = progress[subjectId]?.[chapterName] || {};

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/subject/${subjectId}`} className="p-3 glass-panel-interactive rounded-xl hover:bg-white/10 text-foreground">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-primary uppercase tracking-widest font-bold truncate">{subject.name}</p>
          <h1 className="text-xl font-display font-bold text-glow truncate">{chapterName}</h1>
        </div>
      </div>

      {/* Big Progress Circle */}
      <div className="glass-panel p-8 flex flex-col items-center justify-center relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${subject.color} opacity-10 rounded-full blur-3xl -mr-16 -mt-16`} />
        <h2 className="font-medium text-muted-foreground mb-6 z-10">Chapter Completion</h2>
        <div className="z-10">
          <ProgressCircle progress={chapProgress} size={150} strokeWidth={12} colorClass={`text-primary`} />
        </div>
      </div>

      {/* Task List */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="glass-panel p-2 space-y-1"
      >
        {TASKS.map((taskId) => {
          const isCompleted = !!tasksData[taskId];
          return (
            <motion.button
              key={taskId}
              variants={itemVariants}
              whileTap={{ scale: 0.96 }}
              onClick={() => toggleTask(subjectId, chapterName, taskId)}
              className={`w-full p-4 flex items-center justify-between rounded-xl transition-all outline-none border border-transparent
                ${isCompleted ? 'bg-primary/10 border-primary/20 shadow-[inset_0_0_20px_rgba(0,0,0,0.02)]' : 'hover:bg-white/5'}`}
            >
              <span className={`font-medium text-sm md:text-base ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                {TASK_LABELS[taskId]}
              </span>
              
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                ${isCompleted ? 'bg-primary border-primary scale-110 shadow-lg shadow-primary/40' : 'border-muted-foreground/40'}`}
              >
                {isCompleted && (
                  <motion.svg 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-3.5 h-3.5 text-primary-foreground" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </motion.svg>
                )}
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
};
