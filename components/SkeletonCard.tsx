
import React from 'react';
import { motion } from 'framer-motion';

export const SkeletonCard: React.FC = () => {
  const MotionDiv = motion.div as any;
  
  return (
    <div className="relative bg-[#0a0a0a] aspect-square rounded-none border border-neutral-900 flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Pulse */}
      <MotionDiv
        animate={{ 
          opacity: [0.05, 0.1, 0.05],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute inset-0 bg-[#FF007F]/10 rounded-full blur-[60px]"
      />

      {/* Center Icon Proxy */}
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 bg-neutral-900/50 rounded-full"></div>
        <MotionDiv
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-2 border border-neutral-800 rounded-full"
        />
      </div>

      {/* Text Lines */}
      <div className="w-full space-y-3 relative z-10 flex flex-col items-center">
        <div className="w-3/4 h-3 bg-neutral-900/80 rounded-sm relative overflow-hidden">
          <MotionDiv 
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          />
        </div>
        <div className="w-1/2 h-2 bg-neutral-900/40 rounded-sm relative overflow-hidden">
          <MotionDiv 
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.2 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          />
        </div>
      </div>

      {/* Scanline Effect Proxy */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-[#FF007F]/10 animate-[scanline_2s_linear_infinite]"></div>
    </div>
  );
};
