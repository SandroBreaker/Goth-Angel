
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, Layers, AlertTriangle } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext.tsx';

export const GlobalPlayer: React.FC = () => {
  const { isPlaying, currentSong, togglePlay, progress, duration, seek } = usePlayer();
  const MotionDiv = motion.div as any;

  // Show player if there is a song loaded (even if not playing yet)
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
        initial={{ y: 150, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 150, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 w-full z-[120] p-4 md:p-6 pointer-events-none"
      >
        <div className="max-w-6xl mx-auto bg-[#050505]/80 backdrop-blur-3xl border border-white/5 p-4 md:p-6 rounded-none flex flex-col md:flex-row items-center gap-6 shadow-[0_-30px_60px_rgba(0,0,0,0.9)] pointer-events-auto overflow-hidden">
          
          {/* Subtle Progress Bar atop the player */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-neutral-900 overflow-hidden">
            <motion.div 
              className="h-full bg-[#FF007F]"
              style={{ width: `${duration > 0 ? (progress / duration) * 100 : 0}%` }}
              transition={{ ease: "linear" }}
            />
          </div>

          {/* Track Info */}
          <div className="flex items-center gap-4 w-full md:w-1/4 overflow-hidden">
            <motion.img 
              key={currentSong.id}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={currentSong.image_url} 
              alt="" 
              className="w-12 h-12 border border-white/10 shrink-0 object-cover" 
            />
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-white tracking-widest uppercase truncate">{currentSong.title}</p>
              <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest truncate">{currentSong.album || 'Single Artifact'}</p>
            </div>
          </div>

          {/* Controls & Progress */}
          <div className="flex-grow w-full md:w-1/2 flex flex-col items-center gap-3">
            <div className="flex items-center gap-8 text-neutral-400">
              <SkipBack size={20} className="opacity-20 cursor-not-allowed hover:text-white transition-colors" />
              
              {!currentSong.video_url ? (
                <div className="group relative flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-600 bg-neutral-950/50">
                    <AlertTriangle size={18} />
                  </div>
                  <div className="absolute -top-12 scale-0 group-hover:scale-100 transition-transform bg-neutral-900 border border-[#FF007F]/30 text-[9px] px-4 py-2 whitespace-nowrap uppercase tracking-widest text-[#FF007F] z-50">
                    Áudio não catalogado
                  </div>
                </div>
              ) : (
                <button 
                  className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-black hover:scale-110 active:scale-90 transition-all cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,0,127,0.4)]"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                </button>
              )}

              <SkipForward size={20} className="opacity-20 cursor-not-allowed hover:text-white transition-colors" />
            </div>

            <div className="w-full flex items-center gap-4">
              <span className="text-[9px] font-mono text-neutral-500 w-10 text-right tabular-nums">{formatTime(progress)}</span>
              <div 
                className="flex-grow h-1.5 bg-white/5 relative overflow-hidden group cursor-pointer"
                onClick={handleProgressClick}
              >
                <motion.div 
                  className="absolute inset-0 h-full bg-[#FF007F] shadow-[0_0_10px_rgba(255,0,127,0.5)]"
                  style={{ width: `${duration > 0 ? (progress / duration) * 100 : 0}%` }}
                />
                <div className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 bg-white/10 transition-opacity"></div>
              </div>
              <span className="text-[9px] font-mono text-neutral-500 w-10 tabular-nums">{formatTime(duration || 0)}</span>
            </div>
          </div>

          {/* Volume/Meta Tools */}
          <div className="hidden md:flex items-center justify-end gap-6 w-1/4 text-neutral-500">
            <Volume2 size={18} className="hover:text-white cursor-pointer transition-colors" />
            <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
               <div className="w-2/3 h-full bg-neutral-500"></div>
            </div>
            <button className="hover:text-[#FF007F] transition-colors">
              <Layers size={18} />
            </button>
          </div>
        </div>
      </MotionDiv>
    </AnimatePresence>
  );
};
