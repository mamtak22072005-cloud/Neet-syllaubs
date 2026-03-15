import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, BookOpen, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

type Mode = 'login' | 'signup';

const FIREBASE_ERRORS: Record<string, string> = {
  'auth/user-not-found': 'Email not found. Please sign up first.',
  'auth/wrong-password': 'Wrong password. Try again.',
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/email-already-in-use': 'Email already registered. Please log in.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/invalid-email': 'Invalid email address.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
};

export const Auth: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError('');
    try {
      if (mode === 'login') {
        await signIn(email.trim(), password);
      } else {
        await signUp(email.trim(), password);
      }
    } catch (err: any) {
      const code = err?.code as string;
      setError(FIREBASE_ERRORS[code] || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setError('');
    setPassword('');
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 py-10"
      style={{ background: 'linear-gradient(160deg, #0e0b1e 0%, #0f172a 60%, #0b1120 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              boxShadow: '0 12px 36px rgba(124,58,237,0.45)',
            }}
          >
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1
            className="text-2xl font-black"
            style={{
              background: 'linear-gradient(90deg, #a78bfa, #22d3ee)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            NEET 2027 Tracker
          </h1>
          <p className="text-sm text-slate-400 mt-1">Track your journey to success</p>
        </div>

        {/* Tab switcher */}
        <div
          className="flex rounded-2xl p-1 gap-1 mb-6"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {(['login', 'signup'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
              style={{
                background: mode === m ? 'linear-gradient(135deg, #7c3aed, #06b6d4)' : 'transparent',
                color: mode === m ? '#fff' : 'rgba(255,255,255,0.4)',
                boxShadow: mode === m ? '0 4px 14px rgba(124,58,237,0.35)' : undefined,
              }}
            >
              {m === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-medium text-white placeholder:text-slate-600 outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type={showPass ? 'text' : 'password'}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'signup' ? 'Password (min 6 chars)' : 'Password'}
              required
              minLength={mode === 'signup' ? 6 : undefined}
              className="w-full pl-11 pr-12 py-3.5 rounded-2xl text-sm font-medium text-white placeholder:text-slate-600 outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
            <button
              type="button"
              onClick={() => setShowPass((p) => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-2 px-3 py-2.5 rounded-xl text-xs text-red-400"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 rounded-2xl font-bold text-sm text-white mt-1 flex items-center justify-center gap-2"
            style={{
              background: loading ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              boxShadow: loading ? 'none' : '0 6px 20px rgba(124,58,237,0.4)',
            }}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : mode === 'login' ? (
              'Log In'
            ) : (
              'Create Account'
            )}
          </motion.button>
        </form>

        <p className="text-center text-xs text-slate-600 mt-6">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
            className="font-bold"
            style={{ color: '#a78bfa' }}
          >
            {mode === 'login' ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};
