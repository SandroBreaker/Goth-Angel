
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Fixed: Added missing 'Lock' import from lucide-react to prevent TypeScript from falling back to native Web Lock API
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, X, Zap, Youtube, Shuffle, Lock } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext.tsx';

interface GlobalPlayerProps {
  onExpand?: () => void;
  onClose?: () => void;
}

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

export const GlobalPlayer: React.FC<GlobalPlayerProps> = ({ onExpand, onClose }) => {
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
        <div className="max-w-7xl mx-auto bg-[#080808]/98 backdrop-blur-3xl border border-neutral-800 p-6 md:p-8 rounded-none flex flex-col md:flex-row items-center gap-8 shadow-[0_-40px_80px_rgba(0,0,0,0.8)] pointer-events-auto relative overflow-hidden">
          
          {/* Subtle Aesthetic Accent */}
          <div className="absolute top-0 left-0 w-1 h-full bg-[#FF007F]/40" />

          <div className="flex items-center gap-6 w-full md:w-1/4 overflow-hidden group/info">
            <div className="relative shrink-0 cursor-pointer" onClick={onExpand}>
              <img 
                src={currentSong.image_url} 
                alt={safeTitle} 
                className={`w-16 h-16 border-2 border-neutral-800 object-cover transition-all duration-700 ${isPlaying ? 'brightness-110 shadow-[0_0_20px_rgba(255,0,127,0.2)]' : 'brightness-40 grayscale'}`} 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/info:opacity-100 transition-opacity flex items-center justify-center">
                <Maximize2 size={16} className="text-white" />
              </div>
              {isPlaying && (
                <div className="absolute -bottom-2 -right-2 bg-black border border-neutral-800 p-1 flex gap-1 items-end h-5 z-20">
                    <MotionDiv animate={{ height: [4, 12, 6] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-0.5 bg-[#FF007F]" />
                    <MotionDiv animate={{ height: [10, 4, 14] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-0.5 bg-[#FF007F]" />
                    <MotionDiv animate={{ height: [7, 11, 4] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-0.5 bg-[#FF007F]" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-grow">
              <div className="flex items-center gap-3 mb-1.5">
                <p 
                  className="text-[14px] font-bold text-white tracking-widest uppercase truncate cursor-pointer hover:text-[#FF007F] transition-colors"
                  onClick={onExpand}
                >
                  {safeTitle}
                </p>
                {isDirect ? (
                  <Zap size={10} className="text-[#7000FF] shrink-0" fill="currentColor" />
                ) : (
                  <Youtube size={14} className="text-neutral-700 shrink-0" />
                )}
              </div>
              <p className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest truncate font-bold opacity-60">{safeAlbum}</p>
            </div>
          </div>

          <div className="flex-grow w-full md:w-1/2 flex flex-col items-center gap-4 px-4">
            <div className="flex items-center gap-10 text-neutral-400">
              <button 
                onClick={prevTrack}
                className="hover:text-white transition-all duration-300 cursor-pointer disabled:opacity-20 p-2 hover:scale-110 active:scale-90"
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
                  className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-black hover:bg-[#FF007F] hover:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.1)] group"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                </button>
              )}

              <button 
                onClick={nextTrack}
                className="hover:text-white transition-all duration-300 cursor-pointer disabled:opacity-20 p-2 hover:scale-110 active:scale-90"
                disabled={queue.length <= 1 || !isDirect}
              >
                <SkipForward size={22} fill="currentColor" />
              </button>
            </div>

            <ProgressSlider />
          </div>

          <div className="hidden md:flex items-center justify-end gap-6 w-1/4 text-neutral-400">
            <button 
              onClick={toggleShuffle}
              disabled={!isDirect}
              className={`transition-all duration-300 p-2 hover:scale-110 ${isShuffle ? 'text-[#FF007F] drop-shadow-[0_0_8px_#FF007F]' : 'text-neutral-500 hover:text-white disabled:opacity-20'}`}
              title="Shuffle Protocol"
            >
              <Shuffle size={18} />
            </button>
            
            <button 
              onClick={onExpand}
              className="p-2 text-neutral-500 hover:text-white transition-all duration-300 hover:scale-110"
              title="Expand Archive Fragment"
            >
              <Maximize2 size={18} />
            </button>

            <div className="w-px h-8 bg-neutral-800 mx-2" />
            
            <button 
              onClick={onClose}
              className="p-2 text-neutral-500 hover:text-red-500 transition-all duration-300 hover:scale-110 group/close"
              title="Terminate Session"
            >
              <X size={20} className="group-hover/close:rotate-90 transition-transform duration-500" />
            </button>
          </div>

          {/* Mobile specific controls */}
          <div className="md:hidden absolute top-4 right-4 flex gap-4">
             <button onClick={onExpand} className="p-2 text-neutral-500"><Maximize2 size={18} /></button>
             <button onClick={onClose} className="p-2 text-neutral-500"><X size={18} /></button>
          </div>
        </div>
      </MotionDiv>
    </AnimatePresence>
  );
};
