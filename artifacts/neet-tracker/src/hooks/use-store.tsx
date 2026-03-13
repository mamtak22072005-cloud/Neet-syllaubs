import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { SubjectId, TaskId, SYLLABUS, TASKS } from '@/lib/syllabus';
import { isToday, isYesterday, format } from 'date-fns';
import { generateId } from '@/lib/utils';

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

export type ProgressMap = Record<SubjectId, Record<string, Record<TaskId, boolean>>>;

interface Streak {
  currentStreak: number;
  lastActiveDate: string | null;
}

interface StoreContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  progress: ProgressMap;
  toggleTask: (subject: SubjectId, chapter: string, task: TaskId) => void;
  todos: Todo[];
  addTodo: (title: string, description?: string) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  streak: Streak;
  getChapterProgress: (subject: SubjectId, chapter: string) => number;
  getSubjectProgress: (subject: SubjectId) => number;
  getTotalProgress: () => number;
  getCompletedChapters: (subject: SubjectId) => number;
  getTotalChapters: (subject: SubjectId) => number;
}

const StoreContext = createContext<StoreContextType | null>(null);

const safeParse = (data: string | null, fallback: any) => {
  if (!data) return fallback;
  try {
    return JSON.parse(data);
  } catch {
    return fallback;
  }
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [progress, setProgress] = useState<ProgressMap>({} as ProgressMap);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [streak, setStreak] = useState<Streak>({ currentStreak: 0, lastActiveDate: null });

  // Initialize from LocalStorage
  useEffect(() => {
    setIsClient(true);
    
    // Theme
    const savedTheme = localStorage.getItem('neet_theme') as 'dark' | 'light';
    const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');

    // Progress
    const savedProgress = safeParse(localStorage.getItem('neet_progress'), {});
    setProgress(savedProgress);

    // Todos
    const savedTodos = safeParse(localStorage.getItem('neet_todos'), []);
    setTodos(savedTodos);

    // Streak
    const savedStreak = safeParse(localStorage.getItem('neet_streak'), { currentStreak: 0, lastActiveDate: null });
    
    // Recalculate streak based on current date
    if (savedStreak.lastActiveDate) {
      const lastDate = new Date(savedStreak.lastActiveDate);
      if (!isToday(lastDate) && !isYesterday(lastDate)) {
        savedStreak.currentStreak = 0; // Streak broken
      }
    }
    setStreak(savedStreak);
  }, []);

  const updateStreak = useCallback(() => {
    setStreak(prev => {
      const today = new Date();
      let newStreak = prev.currentStreak;
      
      if (!prev.lastActiveDate) {
        newStreak = 1;
      } else {
        const lastDate = new Date(prev.lastActiveDate);
        if (isYesterday(lastDate)) {
          newStreak += 1;
        } else if (!isToday(lastDate)) {
          newStreak = 1;
        }
      }

      const updated = { currentStreak: newStreak, lastActiveDate: today.toISOString() };
      localStorage.setItem('neet_streak', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Theme Action
  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('neet_theme', next);
      document.documentElement.classList.toggle('dark', next === 'dark');
      return next;
    });
  };

  // Progress Actions
  const toggleTask = (subject: SubjectId, chapter: string, task: TaskId) => {
    setProgress(prev => {
      const subProg = prev[subject] || {};
      const chapProg = subProg[chapter] || {};
      
      const newProg = {
        ...prev,
        [subject]: {
          ...subProg,
          [chapter]: {
            ...chapProg,
            [task]: !chapProg[task]
          }
        }
      };
      
      localStorage.setItem('neet_progress', JSON.stringify(newProg));
      return newProg;
    });
    updateStreak();
  };

  // Todo Actions
  const addTodo = (title: string, description: string = '') => {
    const newTodo: Todo = {
      id: generateId(),
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTodos(prev => {
      const next = [newTodo, ...prev];
      localStorage.setItem('neet_todos', JSON.stringify(next));
      return next;
    });
    updateStreak();
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(prev => {
      const next = prev.map(t => t.id === id ? { ...t, ...updates } : t);
      localStorage.setItem('neet_todos', JSON.stringify(next));
      return next;
    });
    updateStreak();
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => {
      const next = prev.filter(t => t.id !== id);
      localStorage.setItem('neet_todos', JSON.stringify(next));
      return next;
    });
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => {
      const next = prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      localStorage.setItem('neet_todos', JSON.stringify(next));
      return next;
    });
    updateStreak();
  };

  // Derived State Helpers
  const getChapterProgress = useCallback((subject: SubjectId, chapter: string) => {
    const chapProg = progress[subject]?.[chapter] || {};
    const completed = TASKS.filter(t => chapProg[t]).length;
    return (completed / TASKS.length) * 100;
  }, [progress]);

  const getSubjectProgress = useCallback((subject: SubjectId) => {
    const chaps = [...SYLLABUS[subject].class11, ...SYLLABUS[subject].class12];
    if (chaps.length === 0) return 0;
    
    let totalPct = 0;
    chaps.forEach(c => {
      totalPct += getChapterProgress(subject, c);
    });
    
    return totalPct / chaps.length;
  }, [getChapterProgress]);

  const getTotalProgress = useCallback(() => {
    const subjects: SubjectId[] = ['physics', 'chemistry', 'botany', 'zoology'];
    let total = 0;
    subjects.forEach(s => total += getSubjectProgress(s));
    return total / subjects.length;
  }, [getSubjectProgress]);

  const getCompletedChapters = useCallback((subject: SubjectId) => {
    const chaps = [...SYLLABUS[subject].class11, ...SYLLABUS[subject].class12];
    return chaps.filter(c => getChapterProgress(subject, c) === 100).length;
  }, [getChapterProgress]);

  const getTotalChapters = useCallback((subject: SubjectId) => {
    return SYLLABUS[subject].class11.length + SYLLABUS[subject].class12.length;
  }, []);

  if (!isClient) return null; // Avoid hydration mismatch

  return (
    <StoreContext.Provider value={{
      theme, toggleTheme,
      progress, toggleTask,
      todos, addTodo, updateTodo, deleteTodo, toggleTodo,
      streak,
      getChapterProgress, getSubjectProgress, getTotalProgress,
      getCompletedChapters, getTotalChapters
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
