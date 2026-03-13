import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ProgressCircleProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  colorClass?: string;
  gradientId?: string;
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({ 
  progress, 
  size = 120, 
  strokeWidth = 10,
  colorClass = "text-primary",
  gradientId = "progress-gradient"
}) => {
  const [mounted, setMounted] = useState(false);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - ((mounted ? progress : 0) / 100) * circumference;

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full drop-shadow-xl">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" />
          </linearGradient>
        </defs>
        
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="stroke-muted opacity-20"
          fill="transparent"
        />
        
        {/* Animated Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className={gradientId === 'progress-gradient' ? '' : colorClass}
          stroke={gradientId === 'progress-gradient' ? `url(#${gradientId})` : 'currentColor'}
          fill="transparent"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, type: "spring", bounce: 0.2 }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      
      <div className="absolute flex flex-col items-center justify-center">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-display font-bold text-foreground text-glow"
        >
          {Math.round(progress)}%
        </motion.span>
      </div>
    </div>
  );
};
