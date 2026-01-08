
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, Layers, Lock, Zap, Youtube, Shuffle } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext.tsx';

const ensureString = (val: any): string => {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') return val.title || val.name || "Artifact";
  return String(val);
};

const ProgressSlider: React.FC = () => {
  const { progress, duration, seek, currentSong } = usePlayer();
  const hasDirectAudio = !!currentSong?.storage_url;
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hasDirectAudio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickedProgress = x / rect.width;
    seek(clickedProgress * duration);
  };

  const percent = duration > 0 ? (progress / duration) * 100 : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full flex items-center gap-5">
      <span className="text-[11px] font-mono text-neutral-400 w-12 text-right tabular-nums font-bold">{formatTime(progress)}</span>
      <div 
        className={`flex-grow h-1.5 bg-neutral-800 relative overflow-hidden group ${hasDirectAudio ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        onClick={handleProgressClick}
      >
        <div 
          className="absolute inset-0 h-full bg-[#FF007F] shadow-[0_0_20px_rgba(255,0,127,0.8)] transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-[11px] font-mono text-neutral-400 w-12 tabular-nums font-bold">{formatTime(duration || 0)}</span>
    </div>
  );
};

export const GlobalPlayer: React.FC = () => {
  const { 
    isPlaying, 
    currentSong, 
    togglePlay, 
    nextTrack, 
    prevTrack, 
    isShuffle, 
    toggleShuffle,
    queue 
  } = usePlayer();
  const MotionDiv = motion.div as any;

  if (!currentSong) return null;

  const isDirect = !!currentSong.storage_url;
  const safeTitle = ensureString(currentSong.title);
  const safeAlbum = ensureString(currentSong.album || currentSong.metadata?.album || 'Single Artifact');

  return (
    <AnimatePresence>
      <MotionDiv
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 200, opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        className="fixed bottom-0 left-0 w-full z-[120] p-4 md:p-8 pointer-events-none"
      >
        <div className="max-w-7xl mx-auto bg-[#080808]/98 backdrop-blur-3xl border border-neutral-800 p-6 md:p-8 rounded-none flex flex-col md:flex-row items-center gap-8 shadow-[0_-40px_80px_rgba(0,0,0,0.8)] pointer-events-auto">
          
          <div className="flex items-center gap-6 w-full md:w-1/4 overflow-hidden">
            <div className="relative shrink-0">
              <img 
                src={currentSong.image_url} 
                alt={safeTitle} 
                className={`w-16 h-16 border-2 border-neutral-800 object-cover transition-all ${isPlaying ? 'brightness-110 shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'brightness-40'}`} 
              />
              {isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <div className="flex gap-1.5 items-end h-4">
                      <MotionDiv animate={{ height: [6, 16, 8] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-[#FF007F]" />
                      <MotionDiv animate={{ height: [12, 6, 18] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-[#FF007F]" />
                      <MotionDiv animate={{ height: [10, 14, 6] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-1 bg-[#FF007F]" />
                   </div>
                </div>
              )}
            </div>
            <div className="min-w-0 flex-grow">
              <div className="flex items-center gap-3 mb-1.5">
                <p className="text-[14px] font-bold text-white tracking-widest uppercase truncate">{safeTitle}</p>
                {isDirect ? (
                  <Zap size={10} className="text-[#7000FF] shrink-0" fill="currentColor" />
                ) : (
                  <Youtube size={14} className="text-neutral-700 shrink-0" />
                )}
              </div>
              <p className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest truncate font-bold">{safeAlbum}</p>
            </div>
          </div>

          <div className="flex-grow w-full md:w-1/2 flex flex-col items-center gap-4 px-4">
            <div className="flex items-center gap-10 text-neutral-400">
              <button 
                onClick={prevTrack}
                className="hover:text-white transition-colors cursor-pointer disabled:opacity-20 p-2"
                disabled={queue.length <= 1 || !isDirect}
              >
                <SkipBack size={22} fill="currentColor" />
              </button>
              
              {!isDirect ? (
                <div className="w-14 h-14 rounded-full border-2 border-neutral-800 flex items-center justify-center text-neutral-600 cursor-not-allowed">
                  <Lock size={20} />
                </div>
              ) : (
                <button 
                  className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                </button>
              )}

              <button 
                onClick={nextTrack}
                className="hover:text-white transition-colors cursor-pointer disabled:opacity-20 p-2"
                disabled={queue.length <= 1 || !isDirect}
              >
                <SkipForward size={22} fill="currentColor" />
              </button>
            </div>

            <ProgressSlider />
          </div>

          <div className="hidden md:flex items-center justify-end gap-8 w-1/4 text-neutral-400">
            <button 
              onClick={toggleShuffle}
              disabled={!isDirect}
              className={`transition-all duration-300 ${isShuffle ? 'text-[#FF007F] drop-shadow-[0_0_8px_#FF007F]' : 'text-neutral-500 hover:text-white disabled:opacity-20'}`}
            >
              <Shuffle size={20} />
            </button>
            
            <div className="flex flex-col items-end pr-4 border-r border-neutral-800">
               <span className="text-[9px] font-mono uppercase tracking-[0.2em] mb-1 opacity-50 font-bold">Signal</span>
               <span className={`text-[10px] font-mono uppercase tracking-widest font-bold ${isDirect ? 'text-[#7000FF]' : 'text-neutral-700'}`}>
                 {isDirect ? 'DIRECT' : 'RESTRICTED'}
               </span>
            </div>
            <Volume2 size={20} className="hover:text-white transition-colors cursor-pointer" />
          </div>
        </div>
      </MotionDiv>
    </AnimatePresence>
  );
};
