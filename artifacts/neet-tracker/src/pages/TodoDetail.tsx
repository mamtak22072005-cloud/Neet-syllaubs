import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'wouter';
import { useStore } from '@/hooks/use-store';
import { ChevronLeft, Trash2, CheckCircle2, Circle, Calendar, Save, Edit3 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export const TodoDetail: React.FC = () => {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { todos, toggleTodo, deleteTodo, updateTodo } = useStore();
  
  const task = todos.find(t => t.id === params.id);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  useEffect(() => {
    if (task) {
      setEditTitle(task.title);
      setEditDesc(task.description || '');
    }
  }, [task]);

  if (!task) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl mb-4">Task not found</h2>
        <Link href="/todos" className="text-primary hover:underline">Return to To-Do List</Link>
      </div>
    );
  }

  const handleDelete = () => {
    deleteTodo(task.id);
    setLocation('/todos');
  };

  const handleSave = () => {
    if (!editTitle.trim()) return;
    updateTodo(task.id, { title: editTitle.trim(), description: editDesc.trim() });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <Link href="/todos">
            <div className="p-2 rounded-full hover:bg-white/10 glass-panel cursor-pointer">
              <ChevronLeft className="w-6 h-6" />
            </div>
          </Link>
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Task Details</span>
        </div>
        
        <div className="flex gap-2">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-full glass-panel hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Edit3 className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={handleSave}
              className="p-2 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
              <Save className="w-5 h-5" />
            </button>
          )}
          <button 
            onClick={handleDelete}
            className="p-2 rounded-full glass-panel hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors border-destructive/20"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        
        <div className="flex items-center gap-3 text-sm text-muted-foreground border-b border-white/10 pb-4">
          <Calendar className="w-4 h-4" />
          <span>Created on {format(new Date(task.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-transparent border-b border-primary/50 pb-2 text-2xl font-display font-bold focus:outline-none"
              placeholder="Task title"
              autoFocus
            />
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="w-full bg-black/5 dark:bg-white/5 border border-white/10 rounded-xl p-4 min-h-[150px] focus:outline-none focus:border-primary/50 resize-y"
              placeholder="Add description..."
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <button 
                onClick={() => toggleTodo(task.id)}
                className="mt-1 flex-shrink-0 transition-transform hover:scale-110 active:scale-95"
              >
                {task.completed ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                ) : (
                  <Circle className="w-8 h-8 text-muted-foreground" />
                )}
              </button>
              <div>
                <h1 className={cn(
                  "text-2xl font-display font-bold leading-tight break-words",
                  task.completed && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </h1>
                
                <div className="mt-4">
                  {task.completed ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">
                      COMPLETED
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold border border-orange-500/20">
                      PENDING
                    </span>
                  )}
                </div>
              </div>
            </div>

            {task.description && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Notes</h3>
                <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-white/5">
                  {task.description}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
