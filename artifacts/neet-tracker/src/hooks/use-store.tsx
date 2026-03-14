import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { SubjectId, TaskId, SYLLABUS, TASKS } from '@/lib/syllabus';
import { isToday, isYesterday } from 'date-fns';
import { generateId } from '@/lib/utils';

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

export interface GroupMember {
  id: string;
  name: string;
  avatar: string | null;
  progress: number;
  updatedAt: string;
  isMe?: boolean;
}

export interface Profile {
  name: string;
  avatar: string | null;
}

export interface StudyGroup {
  code: string;
  members: GroupMember[];
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
  profile: Profile;
  updateProfile: (name: string, avatar: string | null) => void;
  studyGroup: StudyGroup | null;
  joinGroup: (code: string) => void;
  leaveGroup: () => void;
  importGroupMember: (shareCode: string) => boolean;
  removeGroupMember: (id: string) => void;
  generateShareCode: () => string;
  syncMyProgress: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const safeParse = (data: string | null, fallback: any) => {
  if (!data) return fallback;
  try { return JSON.parse(data); } catch { return fallback; }
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [progress, setProgress] = useState<ProgressMap>({} as ProgressMap);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [streak, setStreak] = useState<Streak>({ currentStreak: 0, lastActiveDate: null });
  const [profile, setProfile] = useState<Profile>({ name: '', avatar: null });
  const [studyGroup, setStudyGroup] = useState<StudyGroup | null>(null);

  useEffect(() => {
    setIsClient(true);
    const savedTheme = localStorage.getItem('neet_theme') as 'dark' | 'light';
    const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    setProgress(safeParse(localStorage.getItem('neet_progress'), {}));
    setTodos(safeParse(localStorage.getItem('neet_todos'), []));
    const savedStreak = safeParse(localStorage.getItem('neet_streak'), { currentStreak: 0, lastActiveDate: null });
    if (savedStreak.lastActiveDate) {
      const lastDate = new Date(savedStreak.lastActiveDate);
      if (!isToday(lastDate) && !isYesterday(lastDate)) savedStreak.currentStreak = 0;
    }
    setStreak(savedStreak);
    setProfile(safeParse(localStorage.getItem('neet_profile'), { name: '', avatar: null }));
    const savedGroup = safeParse(localStorage.getItem('neet_study_group'), null);
    if (savedGroup) setStudyGroup(savedGroup);
  }, []);

  const updateStreak = useCallback(() => {
    setStreak(prev => {
      const today = new Date();
      let newStreak = prev.currentStreak;
      if (!prev.lastActiveDate) {
        newStreak = 1;
      } else {
        const lastDate = new Date(prev.lastActiveDate);
        if (isYesterday(lastDate)) newStreak += 1;
        else if (!isToday(lastDate)) newStreak = 1;
      }
      const updated = { currentStreak: newStreak, lastActiveDate: today.toISOString() };
      localStorage.setItem('neet_streak', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('neet_theme', next);
      document.documentElement.classList.toggle('dark', next === 'dark');
      return next;
    });
  };

  const toggleTask = (subject: SubjectId, chapter: string, task: TaskId) => {
    setProgress(prev => {
      const subProg = prev[subject] || {};
      const chapProg = subProg[chapter] || {};
      const newProg = {
        ...prev,
        [subject]: { ...subProg, [chapter]: { ...chapProg, [task]: !chapProg[task] } }
      };
      localStorage.setItem('neet_progress', JSON.stringify(newProg));
      return newProg;
    });
    updateStreak();
  };

  const addTodo = (title: string, description: string = '') => {
    const newTodo: Todo = { id: generateId(), title, description, completed: false, createdAt: new Date().toISOString() };
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

  const getChapterProgress = useCallback((subject: SubjectId, chapter: string) => {
    const chapProg = progress[subject]?.[chapter] || {};
    const completed = TASKS.filter(t => chapProg[t]).length;
    return (completed / TASKS.length) * 100;
  }, [progress]);

  const getSubjectProgress = useCallback((subject: SubjectId) => {
    const chaps = [...SYLLABUS[subject].class11, ...SYLLABUS[subject].class12];
    if (chaps.length === 0) return 0;
    let totalPct = 0;
    chaps.forEach(c => { totalPct += getChapterProgress(subject, c); });
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

  const updateProfile = useCallback((name: string, avatar: string | null) => {
    const updated: Profile = { name, avatar };
    setProfile(updated);
    localStorage.setItem('neet_profile', JSON.stringify(updated));
  }, []);

  const getMyProgressValue = useCallback(() => {
    const subjects: SubjectId[] = ['physics', 'chemistry', 'botany', 'zoology'];
    let total = 0;
    subjects.forEach(s => total += getSubjectProgress(s));
    return Math.round(total / subjects.length);
  }, [getSubjectProgress]);

  const joinGroup = useCallback((code: string) => {
    const normalCode = code.trim().toUpperCase();
    const existingRaw = localStorage.getItem(`neet_group_${normalCode}`);
    const existing: StudyGroup = existingRaw ? JSON.parse(existingRaw) : { code: normalCode, members: [] };
    const myId = localStorage.getItem('neet_my_id') || (() => {
      const id = generateId();
      localStorage.setItem('neet_my_id', id);
      return id;
    })();
    const myPct = getMyProgressValue();
    const savedProfile = safeParse(localStorage.getItem('neet_profile'), { name: '', avatar: null });
    const myMember: GroupMember = {
      id: myId,
      name: savedProfile.name || 'You',
      avatar: savedProfile.avatar,
      progress: myPct,
      updatedAt: new Date().toISOString(),
      isMe: true,
    };
    const others = existing.members.filter(m => m.id !== myId);
    const updated: StudyGroup = { code: normalCode, members: [myMember, ...others] };
    localStorage.setItem(`neet_group_${normalCode}`, JSON.stringify(updated));
    localStorage.setItem('neet_study_group', JSON.stringify(updated));
    setStudyGroup(updated);
  }, [getMyProgressValue]);

  const leaveGroup = useCallback(() => {
    localStorage.removeItem('neet_study_group');
    setStudyGroup(null);
  }, []);

  const syncMyProgress = useCallback(() => {
    setStudyGroup(prev => {
      if (!prev) return prev;
      const myId = localStorage.getItem('neet_my_id');
      const myPct = getMyProgressValue();
      const savedProfile = safeParse(localStorage.getItem('neet_profile'), { name: '', avatar: null });
      const updated: StudyGroup = {
        ...prev,
        members: prev.members.map(m =>
          m.id === myId
            ? { ...m, name: savedProfile.name || m.name, avatar: savedProfile.avatar, progress: myPct, updatedAt: new Date().toISOString() }
            : m
        ),
      };
      localStorage.setItem(`neet_group_${prev.code}`, JSON.stringify(updated));
      localStorage.setItem('neet_study_group', JSON.stringify(updated));
      return updated;
    });
  }, [getMyProgressValue]);

  const generateShareCode = useCallback((): string => {
    const myId = localStorage.getItem('neet_my_id') || generateId();
    localStorage.setItem('neet_my_id', myId);
    const savedProfile = safeParse(localStorage.getItem('neet_profile'), { name: '', avatar: null });
    const payload: GroupMember = {
      id: myId,
      name: savedProfile.name || 'Friend',
      avatar: savedProfile.avatar,
      progress: getMyProgressValue(),
      updatedAt: new Date().toISOString(),
    };
    return btoa(JSON.stringify(payload));
  }, [getMyProgressValue]);

  const importGroupMember = useCallback((shareCode: string): boolean => {
    try {
      const member: GroupMember = JSON.parse(atob(shareCode.trim()));
      if (!member.id || typeof member.progress !== 'number') return false;
      setStudyGroup(prev => {
        if (!prev) return prev;
        const others = prev.members.filter(m => m.id !== member.id);
        const updated: StudyGroup = { ...prev, members: [...others, { ...member, isMe: false }] };
        localStorage.setItem(`neet_group_${prev.code}`, JSON.stringify(updated));
        localStorage.setItem('neet_study_group', JSON.stringify(updated));
        return updated;
      });
      return true;
    } catch { return false; }
  }, []);

  const removeGroupMember = useCallback((id: string) => {
    setStudyGroup(prev => {
      if (!prev) return prev;
      const updated: StudyGroup = { ...prev, members: prev.members.filter(m => m.id !== id) };
      localStorage.setItem(`neet_group_${prev.code}`, JSON.stringify(updated));
      localStorage.setItem('neet_study_group', JSON.stringify(updated));
      return updated;
    });
  }, []);

  if (!isClient) return null;

  return (
    <StoreContext.Provider value={{
      theme, toggleTheme,
      progress, toggleTask,
      todos, addTodo, updateTodo, deleteTodo, toggleTodo,
      streak,
      getChapterProgress, getSubjectProgress, getTotalProgress,
      getCompletedChapters, getTotalChapters,
      profile, updateProfile,
      studyGroup, joinGroup, leaveGroup, importGroupMember, removeGroupMember, generateShareCode, syncMyProgress,
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
