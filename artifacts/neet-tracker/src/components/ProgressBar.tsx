import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  height?: number;
  colorClass?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  height = 6,
  colorClass = "bg-primary"
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="w-full bg-muted/30 rounded-full overflow-hidden" style={{ height }}>
      <motion.div
        className={`h-full rounded-full ${colorClass}`}
        initial={{ width: 0 }}
        animate={{ width: mounted ? `${progress}%` : 0 }}
        transition={{ duration: 1, type: "spring", bounce: 0.1 }}
      />
    </div>
  );
};
