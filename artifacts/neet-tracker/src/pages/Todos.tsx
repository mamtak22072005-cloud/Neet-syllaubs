import React, { useState } from 'react';
import { Link } from 'wouter';
import { useStore } from '@/hooks/use-store';
import { ChevronLeft, Plus, CheckCircle2, Circle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export const Todos: React.FC = () => {
  const { todos, addTodo, toggleTodo } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTodo(newTitle, newDesc);
    setNewTitle('');
    setNewDesc('');
    setIsAdding(false);
  };

  const pendingTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 relative min-h-full pb-20"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/" className="p-3 glass-panel-interactive rounded-xl hover:bg-white/10 text-foreground">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-display font-bold text-glow">My Tasks</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Organize your day</p>
        </div>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleAdd} className="glass-panel p-5 space-y-4 border-primary/30 shadow-[0_0_30px_rgba(var(--primary),0.15)]">
              <input
                autoFocus
                type="text"
                placeholder="What needs to be done?"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-transparent text-lg font-semibold text-foreground placeholder:text-muted-foreground/50 border-b border-border/50 pb-2 focus:outline-none focus:border-primary transition-colors"
              />
              <textarea
                placeholder="Description (optional)"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full bg-black/5 dark:bg-white/5 rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px] resize-none"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors text-muted-foreground"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50 disabled:opacity-50 disabled:shadow-none transition-all"
                >
                  Save Task
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lists */}
      <div className="space-y-6">
        {/* Pending */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-muted-foreground flex items-center gap-2 px-1">
            <Clock className="w-4 h-4" /> To Do ({pendingTodos.length})
          </h2>
          {pendingTodos.length === 0 && !isAdding && completedTodos.length === 0 && (
             <div className="text-center py-12 glass-panel rounded-2xl border-dashed">
               <p className="text-muted-foreground mb-4">No tasks yet. Create one to get started!</p>
               <button 
                onClick={() => setIsAdding(true)}
                className="text-primary font-semibold text-sm hover:underline"
               >
                 + Add your first task
               </button>
             </div>
          )}
          
          <AnimatePresence>
            {pendingTodos.map(task => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.01 }}
                className="glass-panel-interactive p-4 flex gap-4 group"
              >
                <button onClick={() => toggleTodo(task.id)} className="mt-0.5 flex-shrink-0 text-muted-foreground hover:text-primary transition-colors">
                  <Circle className="w-6 h-6" />
                </button>
                <Link href={`/todos/${task.id}`} className="flex-1 min-w-0 outline-none block cursor-pointer">
                  <h3 className="font-semibold text-foreground truncate">{task.title}</h3>
                  {task.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{task.description}</p>
                  )}
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Completed */}
        {completedTodos.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-border/30">
            <h2 className="text-sm font-bold text-emerald-500/80 flex items-center gap-2 px-1">
              <CheckCircle2 className="w-4 h-4" /> Completed ({completedTodos.length})
            </h2>
            <AnimatePresence>
              {completedTodos.map(task => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="glass-panel p-4 flex gap-4 opacity-60 hover:opacity-100 transition-opacity"
                >
                  <button onClick={() => toggleTodo(task.id)} className="mt-0.5 flex-shrink-0 text-emerald-500 hover:text-emerald-600 transition-colors">
                    <CheckCircle2 className="w-6 h-6" />
                  </button>
                  <Link href={`/todos/${task.id}`} className="flex-1 min-w-0 outline-none block cursor-pointer">
                    <h3 className="font-semibold text-muted-foreground line-through truncate">{task.title}</h3>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsAdding(true)}
        className={cn(
          "fixed bottom-8 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-[0_8px_30px_rgba(var(--primary),0.5)] flex items-center justify-center z-50 transition-transform",
          isAdding ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
        )}
      >
        <Plus className="w-7 h-7" />
      </motion.button>
    </motion.div>
  );
};
