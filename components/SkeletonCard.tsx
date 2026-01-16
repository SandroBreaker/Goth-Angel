import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  variant?: 'card' | 'featured' | 'inline';
}

export const SkeletonCard: React.FC<SkeletonProps> = ({ variant = 'card' }) => {
  const MotionDiv = motion.div as any;
  
  if (variant === 'featured') {
    return (
      <div className="relative min-h-[70vh] md:h-[90vh] w-full overflow-hidden flex items-center justify-center py-20 md:py-0 bg-neutral-950/20">
        <div className="relative z-10 max-w-7xl w-full px-6 md:px-8 flex flex-col md:flex-row items-center gap-10 lg:gap-24">
          <div className="relative shrink-0 w-48 h-48 md:w-64 md:h-64 lg:w-[380px] lg:h-[380px] bg-neutral-900 border border-neutral-800 overflow-hidden">
            <MotionDiv
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900"
            />
            <MotionDiv 
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            />
          </div>

          <div className="flex-1 text-center md:text-left px-4 w-full">
            <div className="inline-block w-24 h-6 bg-neutral-900 border border-neutral-800 mb-8 overflow-hidden relative">
              <MotionDiv 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              />
            </div>
            <div className="space-y-4 mb-10">
              <div className="h-12 md:h-16 lg:h-20 w-3/4 md:w-full bg-neutral-900 overflow-hidden relative mx-auto md:mx-0">
                <MotionDiv 
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.1 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                />
              </div>
              <div className="h-12 md:h-16 lg:h-20 w-1/2 md:w-2/3 bg-neutral-900 overflow-hidden relative mx-auto md:mx-0">
                <MotionDiv 
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.2 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                />
              </div>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="w-32 h-12 bg-neutral-900 border border-neutral-800" />
              <div className="w-32 h-12 bg-neutral-900 border border-neutral-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-[#080808] aspect-square rounded-sm border border-neutral-900 flex flex-col items-center justify-center p-4 overflow-hidden group">
      <MotionDiv
        animate={{ 
          opacity: [0.03, 0.08, 0.03],
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute inset-0 bg-[#FF007F]/10 rounded-full blur-[40px]"
      />

      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 bg-neutral-900/50 rounded-full border border-neutral-800"></div>
        <MotionDiv
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-3 border border-[#FF007F]/20 rounded-full"
        />
      </div>

      <div className="w-full space-y-2.5 relative z-10 flex flex-col items-center">
        <div className="w-3/4 h-2 bg-neutral-900/80 rounded-sm relative overflow-hidden">
          <MotionDiv 
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          />
        </div>
        <div className="w-1/2 h-1.5 bg-neutral-900/40 rounded-sm relative overflow-hidden">
          <MotionDiv 
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "linear", delay: 0.3 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          />
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-[1px] bg-[#FF007F]/5 animate-[scanline_3s_linear_infinite] pointer-events-none"></div>
    </div>
  );
};