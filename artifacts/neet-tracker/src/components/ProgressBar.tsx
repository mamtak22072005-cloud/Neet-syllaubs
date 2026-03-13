import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  height?: string;
  className?: string;
  colorClass?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = "h-2",
  className,
  colorClass = "bg-gradient-to-r from-primary to-secondary"
}) => {
  return (
    <div className={cn("w-full bg-muted/40 rounded-full overflow-hidden", height, className)}>
      <motion.div
        className={cn("h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)]", colorClass)}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  );
};
