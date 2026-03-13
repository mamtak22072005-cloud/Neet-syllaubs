import React from 'react';
import { Link, useParams } from 'wouter';
import { SYLLABUS, SubjectId, TASKS, TASK_LABELS, TaskId } from '@/lib/syllabus';
import { useStore } from '@/hooks/use-store';
import { ProgressBar } from '@/components/ProgressBar';
import { ChevronLeft, Check } from 'lucide-react';
import { slugify, cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export const Chapter: React.FC = () => {
  const params = useParams();
  const subjectId = params.subId as SubjectId;
  const chapterSlug = params.chapId;
  const { progress, toggleTask, getChapterProgress } = useStore();

  if (!SYLLABUS[subjectId]) return <div>Subject not found</div>;

  const subject = SYLLABUS[subjectId];
  
  // Find real chapter name from slug
  const allChapters = [...subject.class11, ...subject.class12];
  const chapterName = allChapters.find(c => slugify(c) === chapterSlug);

  if (!chapterName) return <div>Chapter not found</div>;

  const chapProgress = getChapterProgress(subjectId, chapterName);
  const chapterState = progress[subjectId]?.[chapterName] || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <Link href={`/subject/${subjectId}`}>
          <div className="p-2 rounded-full hover:bg-white/10 glass-panel cursor-pointer">
            <ChevronLeft className="w-6 h-6" />
          </div>
        </Link>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">{subject.name}</span>
          <h2 className="text-xl font-display font-bold truncate leading-tight">{chapterName}</h2>
        </div>
      </div>

      {/* Progress Banner */}
      <div className="glass-panel rounded-2xl p-6 text-center">
        <h3 className="font-medium text-muted-foreground mb-4">Chapter Mastery</h3>
        <div className="flex justify-between items-end mb-2">
          <span className="text-4xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            {Math.round(chapProgress)}%
          </span>
        </div>
        <ProgressBar progress={chapProgress} height="h-3" colorClass={`bg-gradient-to-r ${subject.color}`} />
      </div>

      {/* Tasks List */}
      <div className="glass-panel rounded-2xl overflow-hidden p-2">
        <div className="grid gap-2">
          {TASKS.map((task, i) => {
            const isCompleted = !!chapterState[task];
            
            return (
              <motion.div
                key={task}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => toggleTask(subjectId, chapterName, task)}
                className={cn(
                  "p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-all duration-300",
                  isCompleted 
                    ? "bg-primary/10 border border-primary/20 shadow-[inset_0_0_20px_rgba(var(--primary),0.05)]" 
                    : "bg-white/5 border border-white/5 hover:bg-white/10"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-md flex items-center justify-center border transition-all duration-300 flex-shrink-0",
                  isCompleted 
                    ? "bg-primary border-primary text-primary-foreground" 
                    : "border-muted-foreground/40 bg-background/50"
                )}>
                  {isCompleted && <Check className="w-4 h-4" strokeWidth={3} />}
                </div>
                
                <span className={cn(
                  "font-medium transition-colors select-none",
                  isCompleted ? "text-foreground" : "text-muted-foreground"
                )}>
                  {TASK_LABELS[task]}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
