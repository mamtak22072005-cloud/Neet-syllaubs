import React, { useState } from 'react';
import { useRoute, Link, useLocation } from 'wouter';
import { useStore } from '@/hooks/use-store';
import { ChevronLeft, Trash2, Edit2, Save, X, Calendar, CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export const TodoDetail: React.FC = () => {
  const [, params] = useRoute('/todos/:id');
  const [, setLocation] = useLocation();
  const taskId = params?.id;
  const { todos, updateTodo, deleteTodo, toggleTodo } = useStore();
  
  const task = todos.find(t => t.id === taskId);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task?.title || '');
  const [editDesc, setEditDesc] = useState(task?.description || '');

  if (!task) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">Task not found</h2>
        <Link href="/todos" className="text-primary mt-4 inline-block hover:underline">Go back</Link>
      </div>
    );
  }

  const handleSave = () => {
    if (!editTitle.trim()) return;
    updateTodo(task.id, { title: editTitle, description: editDesc });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Delete this task?')) {
      deleteTodo(task.id);
      setLocation('/todos');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/todos" className="p-3 glass-panel-interactive rounded-xl hover:bg-white/10 text-foreground">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Task Details</span>
        </div>
        
        {!isEditing && (
          <div className="flex gap-2">
            <button 
              onClick={() => setIsEditing(true)}
              className="p-3 glass-panel-interactive rounded-xl hover:text-primary transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button 
              onClick={handleDelete}
              className="p-3 glass-panel-interactive rounded-xl text-destructive hover:bg-destructive/10 transition-colors border-destructive/20"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="glass-panel p-6 space-y-6">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-black/5 dark:bg-white/5 border border-border/50 rounded-xl p-3 text-foreground font-semibold focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Description</label>
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="w-full bg-black/5 dark:bg-white/5 border border-border/50 rounded-xl p-3 text-foreground min-h-[120px] focus:outline-none focus:border-primary resize-none"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button 
                onClick={handleSave}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:opacity-90"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(task.title);
                  setEditDesc(task.description);
                }}
                className="flex-1 py-3 bg-black/10 dark:bg-white/10 text-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black/20 dark:hover:bg-white/20"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-4">
              <button 
                onClick={() => toggleTodo(task.id)}
                className={`mt-1 flex-shrink-0 transition-transform hover:scale-110 ${task.completed ? 'text-emerald-500' : 'text-muted-foreground hover:text-primary'}`}
              >
                {task.completed ? <CheckCircle2 className="w-8 h-8" /> : <Circle className="w-8 h-8" />}
              </button>
              <div>
                <h1 className={`text-2xl font-display font-bold leading-tight ${task.completed ? 'text-muted-foreground line-through' : 'text-foreground text-glow'}`}>
                  {task.title}
                </h1>
                
                <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground font-medium">
                  <Calendar className="w-4 h-4" />
                  Created {format(new Date(task.createdAt), 'MMM d, yyyy')}
                </div>
              </div>
            </div>

            {task.description && (
              <div className="pt-6 border-t border-border/50">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Description</h3>
                <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">{task.description}</p>
              </div>
            )}
          </>
        )}
      </div>

    </motion.div>
  );
};
