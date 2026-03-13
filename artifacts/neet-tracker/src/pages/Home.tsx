import React from 'react';
import { Link } from 'wouter';
import { useStore } from '@/hooks/use-store';
import { SYLLABUS, SubjectId } from '@/lib/syllabus';
import { ProgressCircle } from '@/components/ProgressCircle';
import { ProgressBar } from '@/components/ProgressBar';
import { Flame, CheckCircle2, ChevronRight, ListTodo } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Home: React.FC = () => {
  const { getTotalProgress, getSubjectProgress, getCompletedChapters, getTotalChapters, streak, todos } = useStore();
  const overallProgress = getTotalProgress();

  const subjects: SubjectId[] = ['physics', 'chemistry', 'botany', 'zoology'];

  return (
    <div className="space-y-6">
      
      {/* Top Banner - Overall Progress */}
      <div className="glass-panel rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4">
        <div>
          <h2 className="text-lg font-medium text-muted-foreground">Total NEET Progress</h2>
          <p className="text-sm opacity-70">Keep pushing, you're doing great!</p>
        </div>
        <ProgressCircle progress={overallProgress} size={140} strokeWidth={14} colorClass="text-primary" />
      </div>

      {/* Streak Banner */}
      <div className="glass-panel rounded-2xl p-4 flex items-center justify-between overflow-hidden relative group">
        <div className="absolute right-0 top-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-orange-500/20 rounded-xl">
            <Flame className="w-8 h-8 text-orange-500 drop-shadow-[0_0_12px_rgba(249,115,22,0.6)]" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg">Study Streak</h3>
            <p className="text-muted-foreground text-sm">Consistency is key!</p>
          </div>
        </div>
        <div className="relative z-10 text-right">
          <span className="text-3xl font-display font-bold text-foreground">{streak.currentStreak}</span>
          <span className="text-sm text-muted-foreground ml-1">Days</span>
        </div>
      </div>

      {/* Subject Cards */}
      <div className="grid grid-cols-2 gap-4">
        {subjects.map(sub => {
          const s = SYLLABUS[sub];
          const prog = getSubjectProgress(sub);
          const completed = getCompletedChapters(sub);
          const total = getTotalChapters(sub);

          return (
            <Link key={sub} href={`/subject/${sub}`}>
              <div className="glass-panel-interactive rounded-2xl p-4 flex flex-col h-full cursor-pointer group">
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-lg mb-1">{s.name}</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    {completed} / {total} Chapters
                  </p>
                </div>
                
                <div className="space-y-2 mt-auto">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Progress</span>
                    <span>{Math.round(prog)}%</span>
                  </div>
                  <ProgressBar progress={prog} colorClass={`bg-gradient-to-r ${s.color}`} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Today's Tasks Preview */}
      <div className="glass-panel rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-secondary" />
            <h3 className="font-display font-semibold text-lg">Today's Tasks</h3>
          </div>
          <Link href="/todos" className="text-sm text-primary hover:underline flex items-center">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {todos.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p className="text-sm">No tasks for today.</p>
            <Link href="/todos" className="text-primary text-sm mt-2 inline-block">Add a task +</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {todos.slice(0, 3).map((task, i) => (
              <div key={task.id} className={cn(
                "flex items-center gap-3 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-white/5",
                task.completed && "opacity-50"
              )}>
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-muted text-xs font-bold">
                  {i + 1}
                </div>
                <span className={cn("text-sm flex-1 truncate", task.completed && "line-through")}>
                  {task.title}
                </span>
                {task.completed && <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
