import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Share, Plus } from 'lucide-react';

type Platform = 'android' | 'ios' | 'other';

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'other';
}

function isInStandaloneMode(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true)
  );
}

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [show, setShow] = useState(false);
  const [platform] = useState<Platform>(detectPlatform);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    if (isInStandaloneMode()) return;
    const dismissed = sessionStorage.getItem('install_dismissed');
    if (dismissed) return;

    if (platform === 'android') {
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setTimeout(() => setShow(true), 2500);
      };
      window.addEventListener('beforeinstallprompt', handler);
      return () => window.removeEventListener('beforeinstallprompt', handler);
    } else if (platform === 'ios') {
      setTimeout(() => setShow(true), 2500);
    }
  }, [platform]);

  const handleInstall = useCallback(async () => {
    if (platform === 'ios') {
      setShowIOSGuide(true);
      return;
    }
    if (!deferredPrompt) return;
    const prompt = deferredPrompt as BeforeInstallPromptEvent;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') {
      setShow(false);
      setDeferredPrompt(null);
    }
  }, [deferredPrompt, platform]);

  const handleDismiss = useCallback(() => {
    setShow(false);
    setShowIOSGuide(false);
    sessionStorage.setItem('install_dismissed', '1');
  }, []);

  if (isInStandaloneMode()) return null;

  return (
    <AnimatePresence>
      {show && !showIOSGuide && (
        <motion.div
          key="install-banner"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 340, damping: 32 }}
          className="fixed bottom-5 left-0 right-0 z-[9999] flex justify-center px-4 pointer-events-none"
        >
          <div
            className="pointer-events-auto w-full max-w-[420px] rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(79,31,191,0.96) 0%, rgba(124,58,237,0.96) 50%, rgba(14,127,163,0.96) 100%)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 24px 64px rgba(124,58,237,0.5), 0 0 0 1px rgba(255,255,255,0.12)',
            }}
          >
            {/* Orbs */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.4) 0%, transparent 70%)' }} />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.3) 0%, transparent 70%)' }} />

            <div className="relative flex items-center gap-4 p-4">
              {/* Icon */}
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Smartphone className="w-6 h-6 text-white" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="font-display font-extrabold text-white text-sm leading-tight">
                  Install NEET 2027 Tracker
                </p>
                <p className="text-white/65 text-[11px] mt-0.5 leading-tight">
                  {platform === 'ios'
                    ? 'Add to Home Screen for app experience'
                    : 'Install for offline access & app experience'}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={handleInstall}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-bold text-xs text-primary"
                  style={{ background: 'rgba(255,255,255,0.95)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
                >
                  <Download className="w-3.5 h-3.5" />
                  Install
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDismiss}
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.15)' }}
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* iOS step-by-step guide */}
      {showIOSGuide && (
        <motion.div
          key="ios-guide"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          className="fixed inset-x-0 bottom-0 z-[9999] px-4 pb-8"
        >
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #1a0a3e 0%, #0e1a2e 100%)',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: '0 -20px 60px rgba(124,58,237,0.35)',
            }}
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="font-display font-extrabold text-white text-base">Add to Home Screen</p>
                <button onClick={handleDismiss}
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.12)' }}>
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              {[
                { icon: <Share className="w-4 h-4" />, text: 'Tap the Share button at the bottom of Safari' },
                { icon: <Plus className="w-4 h-4" />, text: 'Scroll down and tap "Add to Home Screen"' },
                { icon: <Smartphone className="w-4 h-4" />, text: 'Tap "Add" — the app icon will appear on your home screen' },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
                  <div className="w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 text-white"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
                    {step.icon}
                  </div>
                  <div className="flex-1 pt-1.5">
                    <p className="text-white/80 text-[13px] leading-snug">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
