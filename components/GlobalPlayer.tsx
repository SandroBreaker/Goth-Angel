
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, Layers, AlertTriangle } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext.tsx';

export const GlobalPlayer: React.FC = () => {
  const { isPlaying, currentSong, togglePlay, progress, duration, seek } = usePlayer();
  const MotionDiv = motion.div as any;

  if (!currentSong) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickedProgress = x / rect.width;
    seek(clickedProgress * duration);
  };

  return (
    <AnimatePresence>
      <MotionDiv
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 w-full z-[120] p-4 md:p-6 pointer-events-none"
      >
        <div className="max-w-5xl mx-auto bg-black/60 backdrop-blur-3xl border border-white/5 p-4 md:p-6 rounded-none flex flex-col md:flex-row items-center gap-6 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] pointer-events-auto">
          
          {/* Track Info */}
          <div className="flex items-center gap-4 w-full md:w-1/4 overflow-hidden">
            <img src={currentSong.image_url} alt="" className="w-10 h-10 md:w-12 md:h-12 border border-white/10 shrink-0 object-cover" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-white tracking-widest uppercase truncate">{currentSong.title}</p>
              <p className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest truncate">{currentSong.album || 'Single'}</p>
            </div>
          </div>

          {/* Controls & Progress */}
          <div className="flex-grow w-full md:w-1/2 flex flex-col items-center gap-2">
            <div className="flex items-center gap-8 text-neutral-400">
              <SkipBack size={18} className="opacity-20 cursor-not-allowed" />
              
              {!currentSong.video_url ? (
                <div className="group relative flex items-center justify-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-600">
                    <AlertTriangle size={16} />
                  </div>
                  <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-neutral-900 border border-[#FF007F]/30 text-[8px] px-3 py-1 whitespace-nowrap uppercase tracking-widest text-[#FF007F] z-50">
                    Collecting from Vault...
                  </div>
                </div>
              ) : (
                <div 
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                </div>
              )}

              <SkipForward size={18} className="opacity-20 cursor-not-allowed" />
            </div>

            <div className="w-full flex items-center gap-3">
              <span className="text-[8px] font-mono text-neutral-500 w-8 text-right">{formatTime(progress)}</span>
              <div 
                className="flex-grow h-1 bg-white/5 relative overflow-hidden group cursor-pointer"
                onClick={handleProgressClick}
              >
                <motion.div 
                  className="absolute inset-0 h-full bg-[#FF007F]"
                  style={{ width: `${duration > 0 ? (progress / duration) * 100 : 0}%` }}
                />
                <div className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 bg-white/5 transition-opacity"></div>
              </div>
              <span className="text-[8px] font-mono text-neutral-500 w-8">{formatTime(duration || 0)}</span>
            </div>
          </div>

          {/* Volume/Meta Tools */}
          <div className="hidden md:flex items-center justify-end gap-6 w-1/4 text-neutral-500">
            <Volume2 size={16} className="hover:text-white cursor-pointer transition-colors" />
            <div className="w-20 h-1 bg-white/5">
               <div className="w-2/3 h-full bg-neutral-600"></div>
            </div>
            <Layers size={16} className="hover:text-[#7000FF] cursor-pointer transition-colors" />
          </div>
        </div>
      </MotionDiv>
    </AnimatePresence>
  );
};
