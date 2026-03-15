import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { ref, get, update } from 'firebase/database';
import { db } from '@/lib/firebase';
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
  studyTimeToday: number;
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
  testDate: string | null;
  setTestDate: (date: string | null) => void;
  studyTimeToday: number;
  addStudyTime: (seconds: number) => void;
  targetScore: string;
  updateTargetScore: (score: string) => void;
  dataLoading: boolean;
}

const StoreContext = createContext<StoreContextType | null>(null);

const toArray = <T,>(val: any): T[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return Object.values(val);
};

export const StoreProvider: React.FC<{ children: React.ReactNode; userId: string }> = ({ children, userId }) => {
  const [dataLoading, setDataLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [progress, setProgress] = useState<ProgressMap>({} as ProgressMap);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [streak, setStreak] = useState<Streak>({ currentStreak: 0, lastActiveDate: null });
  const [profile, setProfile] = useState<Profile>({ name: '', avatar: null });
  const [studyGroup, setStudyGroup] = useState<StudyGroup | null>(null);
  const [testDate, setTestDateState] = useState<string | null>(null);
  const [studyTimeToday, setStudyTimeToday] = useState<number>(0);
  const [targetScore, setTargetScoreState] = useState<string>('650');

  const userRef = useMemo(() => ref(db, 'users/' + userId), [userId]);

  const saveField = useCallback(
    (field: string, value: any) => {
      update(userRef, { [field]: value ?? null }).catch(console.error);
    },
    [userRef]
  );

  useEffect(() => {
    setDataLoading(true);
    get(userRef)
      .then((snap) => {
        if (snap.exists()) {
          const data = snap.val() as Record<string, any>;

          const t = (data.theme as 'dark' | 'light') || 'dark';
          setTheme(t);
          document.documentElement.classList.toggle('dark', t === 'dark');
          localStorage.setItem('neet_theme', t);

          setProgress(data.progress || {});
          setTodos(toArray<Todo>(data.todos));

          const savedStreak = data.streak || { currentStreak: 0, lastActiveDate: null };
          if (savedStreak.lastActiveDate) {
            const lastDate = new Date(savedStreak.lastActiveDate);
            if (!isToday(lastDate) && !isYesterday(lastDate)) savedStreak.currentStreak = 0;
          }
          setStreak(savedStreak);

          setProfile({
            name: data.profile?.name || '',
            avatar: data.profile?.avatar || null,
          });

          if (data.studyGroup) {
            const sg = data.studyGroup;
            setStudyGroup({
              code: sg.code,
              members: toArray<GroupMember>(sg.members),
            });
          }

          setTestDateState(data.testDate || null);
          setTargetScoreState(data.targetScore || '650');

          const studyData = data.studyTime || { date: '', seconds: 0 };
          if (studyData.date === new Date().toDateString()) {
            setStudyTimeToday(studyData.seconds || 0);
          }
        } else {
          const initialTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          setTheme(initialTheme);
          document.documentElement.classList.toggle('dark', initialTheme === 'dark');
        }
      })
      .catch(console.error)
      .finally(() => setDataLoading(false));
  }, [userId]);

  const updateStreak = useCallback(() => {
    setStreak((prev) => {
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
      saveField('streak', updated);
      return updated;
    });
  }, [saveField]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('neet_theme', next);
      document.documentElement.classList.toggle('dark', next === 'dark');
      saveField('theme', next);
      return next;
    });
  };

  const toggleTask = (subject: SubjectId, chapter: string, task: TaskId) => {
    setProgress((prev) => {
      const subProg = prev[subject] || {};
      const chapProg = subProg[chapter] || {};
      const newProg = {
        ...prev,
        [subject]: { ...subProg, [chapter]: { ...chapProg, [task]: !chapProg[task] } },
      };
      saveField('progress', newProg);
      return newProg;
    });
    updateStreak();
  };

  const addTodo = (title: string, description: string = '') => {
    const newTodo: Todo = {
      id: generateId(),
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos((prev) => {
      const next = [newTodo, ...prev];
      saveField('todos', next);
      return next;
    });
    updateStreak();
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...updates } : t));
      saveField('todos', next);
      return next;
    });
    updateStreak();
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => {
      const next = prev.filter((t) => t.id !== id);
      saveField('todos', next);
      return next;
    });
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
      saveField('todos', next);
      return next;
    });
    updateStreak();
  };

  const getChapterProgress = useCallback(
    (subject: SubjectId, chapter: string) => {
      const chapProg = progress[subject]?.[chapter] || {};
      const completed = TASKS.filter((t) => chapProg[t]).length;
      return (completed / TASKS.length) * 100;
    },
    [progress]
  );

  const getSubjectProgress = useCallback(
    (subject: SubjectId) => {
      const chaps = [...SYLLABUS[subject].class11, ...SYLLABUS[subject].class12];
      if (chaps.length === 0) return 0;
      let totalPct = 0;
      chaps.forEach((c) => { totalPct += getChapterProgress(subject, c); });
      return totalPct / chaps.length;
    },
    [getChapterProgress]
  );

  const getTotalProgress = useCallback(() => {
    const subjects: SubjectId[] = ['physics', 'chemistry', 'botany', 'zoology'];
    let total = 0;
    subjects.forEach((s) => { total += getSubjectProgress(s); });
    return total / subjects.length;
  }, [getSubjectProgress]);

  const getCompletedChapters = useCallback(
    (subject: SubjectId) => {
      const chaps = [...SYLLABUS[subject].class11, ...SYLLABUS[subject].class12];
      return chaps.filter((c) => getChapterProgress(subject, c) === 100).length;
    },
    [getChapterProgress]
  );

  const getTotalChapters = useCallback((subject: SubjectId) => {
    return SYLLABUS[subject].class11.length + SYLLABUS[subject].class12.length;
  }, []);

  const updateProfile = useCallback(
    (name: string, avatar: string | null) => {
      const updated: Profile = { name, avatar: avatar || null };
      setProfile(updated);
      saveField('profile', updated);
    },
    [saveField]
  );

  const updateTargetScore = useCallback(
    (score: string) => {
      setTargetScoreState(score);
      saveField('targetScore', score);
    },
    [saveField]
  );

  const setTestDate = useCallback(
    (date: string | null) => {
      setTestDateState(date);
      saveField('testDate', date);
    },
    [saveField]
  );

  const addStudyTime = useCallback(
    (seconds: number) => {
      setStudyTimeToday((prev) => {
        const next = prev + seconds;
        const todayKey = new Date().toDateString();
        saveField('studyTime', { date: todayKey, seconds: next });
        return next;
      });
      updateStreak();
    },
    [updateStreak, saveField]
  );

  const getMyProgressValue = useCallback(() => {
    const subjects: SubjectId[] = ['physics', 'chemistry', 'botany', 'zoology'];
    let total = 0;
    subjects.forEach((s) => { total += getSubjectProgress(s); });
    return Math.round(total / subjects.length);
  }, [getSubjectProgress]);

  const joinGroup = useCallback(
    (code: string) => {
      const normalCode = code.trim().toUpperCase();
      const myPct = getMyProgressValue();
      const myMember: GroupMember = {
        id: userId,
        name: profile.name || 'You',
        avatar: profile.avatar,
        progress: myPct,
        studyTimeToday,
        updatedAt: new Date().toISOString(),
        isMe: true,
      };
      const newGroup: StudyGroup = { code: normalCode, members: [myMember] };
      setStudyGroup(newGroup);
      saveField('studyGroup', { code: normalCode, members: [myMember] });
    },
    [userId, profile, studyTimeToday, getMyProgressValue, saveField]
  );

  const leaveGroup = useCallback(() => {
    setStudyGroup(null);
    saveField('studyGroup', null);
  }, [saveField]);

  const syncMyProgress = useCallback(() => {
    setStudyGroup((prev) => {
      if (!prev) return prev;
      const myPct = getMyProgressValue();
      const updatedMembers = prev.members.map((m) =>
        m.id === userId
          ? {
              ...m,
              name: profile.name || m.name,
              avatar: profile.avatar,
              progress: myPct,
              studyTimeToday,
              updatedAt: new Date().toISOString(),
            }
          : m
      );
      const updated: StudyGroup = { ...prev, members: updatedMembers };
      saveField('studyGroup', { code: updated.code, members: updatedMembers });
      return updated;
    });
  }, [userId, profile, studyTimeToday, getMyProgressValue, saveField]);

  const generateShareCode = useCallback((): string => {
    const payload: GroupMember = {
      id: userId,
      name: profile.name || 'Friend',
      avatar: profile.avatar,
      progress: getMyProgressValue(),
      studyTimeToday,
      updatedAt: new Date().toISOString(),
    };
    return btoa(JSON.stringify(payload));
  }, [userId, profile, studyTimeToday, getMyProgressValue]);

  const importGroupMember = useCallback(
    (shareCode: string): boolean => {
      try {
        const member: GroupMember = JSON.parse(atob(shareCode.trim()));
        if (!member.id || typeof member.progress !== 'number') return false;
        setStudyGroup((prev) => {
          if (!prev) return prev;
          const others = prev.members.filter((m) => m.id !== member.id);
          const updatedMembers = [...others, { ...member, isMe: false }];
          const updated: StudyGroup = { ...prev, members: updatedMembers };
          saveField('studyGroup', { code: updated.code, members: updatedMembers });
          return updated;
        });
        return true;
      } catch {
        return false;
      }
    },
    [saveField]
  );

  const removeGroupMember = useCallback(
    (id: string) => {
      setStudyGroup((prev) => {
        if (!prev) return prev;
        const updatedMembers = prev.members.filter((m) => m.id !== id);
        const updated: StudyGroup = { ...prev, members: updatedMembers };
        saveField('studyGroup', { code: updated.code, members: updatedMembers });
        return updated;
      });
    },
    [saveField]
  );

  if (dataLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(160deg, #0e0b1e 0%, #0f172a 60%, #0b1120 100%)' }}
      >
        <div className="text-center space-y-4">
          <div
            className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 8px 24px rgba(124,58,237,0.4)' }}
          >
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin block" />
          </div>
          <p className="text-sm text-slate-400 font-medium">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <StoreContext.Provider
      value={{
        theme, toggleTheme,
        progress, toggleTask,
        todos, addTodo, updateTodo, deleteTodo, toggleTodo,
        streak,
        getChapterProgress, getSubjectProgress, getTotalProgress,
        getCompletedChapters, getTotalChapters,
        profile, updateProfile,
        studyGroup, joinGroup, leaveGroup, importGroupMember, removeGroupMember, generateShareCode, syncMyProgress,
        testDate, setTestDate,
        studyTimeToday, addStudyTime,
        targetScore, updateTargetScore,
        dataLoading,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
