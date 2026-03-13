import React, { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { useStore } from '@/hooks/use-store';
import { SYLLABUS, SubjectId } from '@/lib/syllabus';
import { ProgressCircle } from '@/components/ProgressCircle';
import { ProgressBar } from '@/components/ProgressBar';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Subject: React.FC = () => {
  const [, params] = useRoute('/subject/:id');
  const subjectId = params?.id as SubjectId;
  const { getSubjectProgress, getChapterProgress } = useStore();
  const [activeTab, setActiveTab] = useState<'11' | '12'>('11');

  if (!subjectId || !SYLLABUS[subjectId]) return <div>Subject not found</div>;

  const subject = SYLLABUS[subjectId];
  const progress = getSubjectProgress(subjectId);
  const chapters = activeTab === '11' ? subject.class11 : subject.class12;

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0, transition: { staggerChildren: 0.05, type: "spring" } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
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
        <Link href="/" className="p-3 glass-panel-interactive rounded-xl hover:bg-white/10 text-foreground">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-display font-bold text-glow">{subject.name}</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Syllabus Overview</p>
        </div>
      </div>

      {/* Progress Card */}
      <div className={`glass-panel p-6 flex items-center justify-between relative overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${subject.color} opacity-10 pointer-events-none`} />
        <div>
          <h2 className="font-semibold text-lg">Overall Progress</h2>
          <p className="text-sm text-muted-foreground mt-1">Stay focused!</p>
        </div>
        <ProgressCircle progress={progress} size={80} strokeWidth={8} colorClass={`text-${subjectId}-500`} gradientId={`${subjectId}-grad`} />
      </div>

      {/* Class Tabs */}
      <div className="glass-panel p-1 flex rounded-xl">
        <button 
          onClick={() => setActiveTab('11')}
          className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${activeTab === '11' ? 'bg-white/15 shadow-md text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Class 11
        </button>
        <button 
          onClick={() => setActiveTab('12')}
          className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${activeTab === '12' ? 'bg-white/15 shadow-md text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Class 12
        </button>
      </div>

      {/* Chapter List */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, scale: 0.95 }}
          className="space-y-3"
        >
          {chapters.map((chapter, index) => {
            const chapProgress = getChapterProgress(subjectId, chapter);
            const isCompleted = chapProgress === 100;
            
            return (
              <Link key={chapter} href={`/subject/${subjectId}/chapter/${encodeURIComponent(chapter)}`} className="block outline-none">
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`glass-panel-interactive p-4 flex flex-col gap-3 cursor-pointer ${isCompleted ? 'border-primary/50' : ''}`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-3">
                      <div className="mt-1 w-6 h-6 rounded bg-black/10 dark:bg-white/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-muted-foreground">{index + 1}</span>
                      </div>
                      <h3 className={`font-semibold leading-tight ${isCompleted ? 'text-primary text-glow' : 'text-foreground'}`}>
                        {chapter}
                      </h3>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                  
                  <div className="pl-9 flex items-center gap-3">
                    <div className="flex-1">
                      <ProgressBar progress={chapProgress} height={6} colorClass={isCompleted ? "bg-primary" : `bg-gradient-to-r ${subject.color}`} />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-black/10 dark:bg-white/10 text-muted-foreground whitespace-nowrap">
                      {Math.round(chapProgress)}%
                    </span>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>
      </AnimatePresence>
      
    </motion.div>
  );
};
