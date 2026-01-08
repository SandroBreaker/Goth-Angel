
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, Layers, Lock, Zap, Youtube, Shuffle } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext.tsx';

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
    <div className="w-full flex items-center gap-4">
      <span className="text-[9px] font-mono text-neutral-500 w-10 text-right tabular-nums">{formatTime(progress)}</span>
      <div 
        className={`flex-grow h-1 bg-white/5 relative overflow-hidden group ${hasDirectAudio ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        onClick={handleProgressClick}
      >
        <div 
          className="absolute inset-0 h-full bg-[#FF007F] shadow-[0_0_15px_rgba(255,0,127,0.7)] transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
        {hasDirectAudio && <div className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 bg-white/10 transition-opacity"></div>}
      </div>
      <span className="text-[9px] font-mono text-neutral-500 w-10 tabular-nums">{formatTime(duration || 0)}</span>
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

  return (
    <AnimatePresence>
      <MotionDiv
        initial={{ y: 150, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 150, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 w-full z-[120] p-4 md:p-6 pointer-events-none"
      >
        <div className="max-w-6xl mx-auto bg-[#050505]/95 backdrop-blur-3xl border border-white/5 p-4 md:p-6 rounded-none flex flex-col md:flex-row items-center gap-6 shadow-[0_-30px_60px_rgba(0,0,0,1)] pointer-events-auto overflow-hidden">
          
          <div className="flex items-center gap-4 w-full md:w-1/4 overflow-hidden">
            <div className="relative shrink-0">
              <img 
                src={currentSong.image_url} 
                alt="" 
                className={`w-14 h-14 border border-white/10 object-cover transition-all ${isPlaying ? 'brightness-125' : 'brightness-50'}`} 
              />
              {isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <div className="flex gap-1 items-end h-3">
                      <MotionDiv animate={{ height: [4, 12, 6] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-0.5 bg-[#FF007F]" />
                      <MotionDiv animate={{ height: [8, 4, 10] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-0.5 bg-[#FF007F]" />
                      <MotionDiv animate={{ height: [6, 10, 4] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-0.5 bg-[#FF007F]" />
                   </div>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[11px] font-bold text-white tracking-widest uppercase truncate">{currentSong.title}</p>
                {isDirect ? (
                  <Zap size={8} className="text-[#7000FF]" fill="currentColor" />
                ) : (
                  <Youtube size={10} className="text-neutral-700" />
                )}
              </div>
              <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest truncate">{currentSong.album || 'Single Artifact'}</p>
            </div>
          </div>

          <div className="flex-grow w-full md:w-1/2 flex flex-col items-center gap-3">
            <div className="flex items-center gap-8 text-neutral-400">
              <button 
                onClick={prevTrack}
                className="hover:text-white transition-colors cursor-pointer disabled:opacity-20"
                disabled={queue.length <= 1 || !isDirect}
              >
                <SkipBack size={18} fill="currentColor" />
              </button>
              
              {!isDirect ? (
                <div className="w-12 h-12 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-700 cursor-not-allowed" title="Apenas para fins de arquivamento">
                  <Lock size={18} />
                </div>
              ) : (
                <button 
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                </button>
              )}

              <button 
                onClick={nextTrack}
                className="hover:text-white transition-colors cursor-pointer disabled:opacity-20"
                disabled={queue.length <= 1 || !isDirect}
              >
                <SkipForward size={18} fill="currentColor" />
              </button>
            </div>

            <ProgressSlider />
          </div>

          <div className="hidden md:flex items-center justify-end gap-6 w-1/4 text-neutral-500">
            <button 
              onClick={toggleShuffle}
              disabled={!isDirect}
              className={`transition-all duration-300 ${isShuffle ? 'text-[#FF007F] drop-shadow-[0_0_5px_#FF007F]' : 'text-neutral-600 hover:text-neutral-400 disabled:opacity-20'}`}
            >
              <Shuffle size={16} />
            </button>
            
            <div className="flex flex-col items-end">
               <span className="text-[7px] font-mono uppercase tracking-[0.2em] mb-1 opacity-50">Signal Source</span>
               <span className={`text-[8px] font-mono uppercase tracking-widest ${isDirect ? 'text-[#7000FF]' : 'text-red-900/50'}`}>
                 {isDirect ? 'Direct (Supabase)' : 'Vault Restricted'}
               </span>
            </div>
            <Volume2 size={16} />
            <button className="hover:text-[#FF007F] transition-colors">
              <Layers size={16} />
            </button>
          </div>
        </div>
      </MotionDiv>
    </AnimatePresence>
  );
};
