import React, { useState } from 'react';
import { Link, useParams } from 'wouter';
import { SYLLABUS, SubjectId } from '@/lib/syllabus';
import { useStore } from '@/hooks/use-store';
import { ProgressBar } from '@/components/ProgressBar';
import { ChevronLeft, ChevronDown, ChevronRight, BookOpen } from 'lucide-react';
import { slugify, cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const Subject: React.FC = () => {
  const params = useParams();
  const subjectId = params.id as SubjectId;
  const { getSubjectProgress, getChapterProgress } = useStore();
  
  const [openSection, setOpenSection] = useState<'class11' | 'class12' | null>('class11');

  if (!SYLLABUS[subjectId]) {
    return <div>Subject not found</div>;
  }

  const subject = SYLLABUS[subjectId];
  const overallProgress = getSubjectProgress(subjectId);

  const toggleSection = (section: 'class11' | 'class12') => {
    setOpenSection(prev => prev === section ? null : section);
  };

  const renderChapterList = (chapters: readonly string[], classLabel: string) => (
    <div className="space-y-3 mt-4">
      {chapters.map((chapter) => {
        const prog = getChapterProgress(subjectId, chapter);
        const completedTasks = Math.round((prog / 100) * 9);
        
        return (
          <Link key={chapter} href={`/subject/${subjectId}/chapter/${slugify(chapter)}`}>
            <div className="glass-panel-interactive p-4 rounded-xl flex items-center gap-4 cursor-pointer group">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm sm:text-base truncate group-hover:text-primary transition-colors">
                  {chapter}
                </h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">{completedTasks}/9 Tasks</span>
                  <span className="text-xs font-medium text-primary">{Math.round(prog)}%</span>
                </div>
                <ProgressBar progress={prog} height="h-1.5" className="mt-1.5" colorClass={`bg-gradient-to-r ${subject.color}`} />
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            </div>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <Link href="/">
          <div className="p-2 rounded-full hover:bg-white/10 glass-panel cursor-pointer">
            <ChevronLeft className="w-6 h-6" />
          </div>
        </Link>
        <h2 className="text-2xl font-display font-bold">{subject.name}</h2>
      </div>

      {/* Progress Card */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
        <div className={cn("absolute right-0 top-0 w-32 h-32 rounded-full blur-3xl -mr-10 -mt-10 opacity-20", subject.color.split(' ')[0].replace('from-', 'bg-'))} />
        
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <BookOpen className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-semibold">Subject Progress</h3>
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-2">
            <span className="text-3xl font-display font-bold">{Math.round(overallProgress)}%</span>
            <span className="text-sm text-muted-foreground mb-1">Completed</span>
          </div>
          <ProgressBar progress={overallProgress} height="h-3" colorClass={`bg-gradient-to-r ${subject.color}`} />
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {/* Class 11 */}
        <div className="glass-panel rounded-2xl overflow-hidden">
          <button 
            className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors"
            onClick={() => toggleSection('class11')}
          >
            <h3 className="font-display font-semibold text-lg">Class 11 Syllabus</h3>
            <ChevronDown className={cn("w-5 h-5 transition-transform duration-300", openSection === 'class11' ? "rotate-180" : "")} />
          </button>
          
          <AnimatePresence>
            {openSection === 'class11' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-0 border-t border-white/5">
                  {renderChapterList(subject.class11, "Class 11")}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Class 12 */}
        <div className="glass-panel rounded-2xl overflow-hidden">
          <button 
            className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors"
            onClick={() => toggleSection('class12')}
          >
            <h3 className="font-display font-semibold text-lg">Class 12 Syllabus</h3>
            <ChevronDown className={cn("w-5 h-5 transition-transform duration-300", openSection === 'class12' ? "rotate-180" : "")} />
          </button>
          
          <AnimatePresence>
            {openSection === 'class12' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-0 border-t border-white/5">
                  {renderChapterList(subject.class12, "Class 12")}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
