import React, { useState } from 'react';
import { Link } from 'wouter';
import { useStore, Todo } from '@/hooks/use-store';
import { ChevronLeft, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const Todos: React.FC = () => {
  const { todos, addTodo, toggleTodo, deleteTodo } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTodo(newTitle.trim(), newDesc.trim());
    setNewTitle('');
    setNewDesc('');
    setIsAdding(false);
  };

  const pendingTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);

  const TodoItem = ({ task }: { task: Todo }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
      className={cn(
        "glass-panel p-4 rounded-xl flex items-start gap-4 group transition-all",
        task.completed ? "opacity-60" : ""
      )}
    >
      <button 
        onClick={() => toggleTodo(task.id)}
        className="mt-0.5 flex-shrink-0 text-muted-foreground hover:text-primary transition-colors"
      >
        {task.completed ? (
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        ) : (
          <Circle className="w-6 h-6" />
        )}
      </button>
      
      <div className="flex-1 min-w-0">
        <Link href={`/todos/${task.id}`}>
          <h4 className={cn(
            "font-medium text-base cursor-pointer hover:text-primary transition-colors break-words",
            task.completed && "line-through"
          )}>
            {task.title}
          </h4>
        </Link>
        {task.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {task.description}
          </p>
        )}
      </div>

      <button 
        onClick={() => deleteTodo(task.id)}
        className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <Link href="/">
            <div className="p-2 rounded-full hover:bg-white/10 glass-panel cursor-pointer">
              <ChevronLeft className="w-6 h-6" />
            </div>
          </Link>
          <h2 className="text-2xl font-display font-bold">To-Do List</h2>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-primary text-primary-foreground p-2 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleAdd} className="glass-panel p-5 rounded-2xl space-y-4 mb-6">
              <div>
                <input
                  type="text"
                  placeholder="What needs to be done?"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 pb-2 text-lg focus:outline-none focus:border-primary placeholder:text-muted-foreground/50 transition-colors"
                  autoFocus
                />
              </div>
              <div>
                <textarea
                  placeholder="Details (optional)"
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full bg-black/10 dark:bg-black/20 border border-white/5 rounded-xl p-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 resize-none h-20 placeholder:text-muted-foreground/50"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-sm font-medium rounded-xl hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="px-6 py-2 text-sm font-bold bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none transition-all"
                >
                  Add Task
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Lists */}
      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-1">
            Pending Tasks ({pendingTodos.length})
          </h3>
          <div className="space-y-3">
            <AnimatePresence>
              {pendingTodos.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 text-muted-foreground italic glass-panel rounded-2xl">
                  All caught up! 🎉
                </motion.div>
              ) : (
                pendingTodos.map(task => <TodoItem key={task.id} task={task} />)
              )}
            </AnimatePresence>
          </div>
        </div>

        {completedTodos.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-1">
              Completed ({completedTodos.length})
            </h3>
            <div className="space-y-3">
              <AnimatePresence>
                {completedTodos.map(task => <TodoItem key={task.id} task={task} />)}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
