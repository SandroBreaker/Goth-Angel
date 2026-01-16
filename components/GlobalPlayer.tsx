import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Maximize2, X, Zap, Youtube, Shuffle, Lock } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext.tsx';
import { MetadataGrid } from './MetadataGrid.tsx';

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
    <div className="w-full flex items-center gap-3 md:gap-5 px-1">
      <span className="text-[8px] md:text-[10px] font-mono text-neutral-500 w-7 md:w-10 text-right tabular-nums">{formatTime(progress)}</span>
      <div 
        className={`flex-grow h-1.5 md:h-2 bg-neutral-900 rounded-full relative overflow-hidden group ${hasDirectAudio ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        onClick={handleProgressClick}
      >
        <div 
          className="absolute inset-0 h-full bg-[#FF007F] shadow-[0_0_15px_rgba(255,0,127,0.6)] transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-[8px] md:text-[10px] font-mono text-neutral-500 w-7 md:w-10 tabular-nums">{formatTime(duration || 0)}</span>
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
        className="fixed bottom-0 left-0 w-full z-[120] p-3 md:p-6 lg:p-8 pointer-events-none pb-[calc(1rem+env(safe-area-inset-bottom))]"
      >
        <div className="max-w-6xl mx-auto bg-[#080808]/95 backdrop-blur-3xl border border-white/10 p-4 md:p-6 rounded-xl flex flex-col items-center gap-4 md:gap-5 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] pointer-events-auto relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-1 h-full bg-[#FF007F]/40" />
          
          {/* Main Controls Row */}
          <div className="w-full flex items-center gap-4 md:gap-8">
            
            {/* Track Info */}
            <div className="flex items-center gap-3 md:gap-5 flex-1 min-w-0 group/info cursor-pointer" onClick={onExpand}>
              <div className="relative shrink-0">
                <img 
                  src={currentSong.image_url} 
                  alt={safeTitle} 
                  className={`w-12 h-12 md:w-16 md:h-16 rounded-md border border-neutral-800 object-cover transition-all duration-500 ${isPlaying ? 'brightness-110' : 'brightness-50 grayscale'}`} 
                />
                {isPlaying && (
                  <div className="absolute -bottom-1 -right-1 bg-black border border-neutral-800 p-0.5 flex gap-0.5 items-end h-3 z-20">
                      <MotionDiv animate={{ height: [2, 6, 3] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-0.5 bg-[#FF007F]" />
                      <MotionDiv animate={{ height: [6, 2, 8] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-0.5 bg-[#FF007F]" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[12px] md:text-[15px] font-bold text-white tracking-wide uppercase truncate">
                  {safeTitle}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-[8px] md:text-[10px] font-mono text-neutral-500 uppercase tracking-widest truncate font-medium">
                    {safeAlbum}
                  </p>
                  {isDirect && <Zap size={8} className="text-[#FF007F]" fill="currentColor" />}
                </div>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-2 md:gap-8">
              <button 
                onClick={prevTrack}
                className="hidden md:flex p-2 text-neutral-500 hover:text-white transition-colors disabled:opacity-10"
                disabled={queue.length <= 1 || !isDirect}
              >
                <SkipBack size={20} fill="currentColor" />
              </button>
              
              {!isDirect ? (
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-700">
                  <Lock size={16} />
                </div>
              ) : (
                <button 
                  className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-white flex items-center justify-center text-black hover:bg-[#FF007F] hover:text-white transition-all shadow-lg active:scale-90"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                </button>
              )}

              <button 
                onClick={nextTrack}
                className="p-2 text-neutral-500 hover:text-white transition-colors disabled:opacity-10"
                disabled={queue.length <= 1 || !isDirect}
              >
                <SkipForward size={20} fill="currentColor" />
              </button>
            </div>

            {/* desktop Options */}
            <div className="hidden lg:flex items-center gap-4 flex-1 justify-end">
              <button onClick={toggleShuffle} className={`p-2 transition-colors ${isShuffle ? 'text-[#FF007F]' : 'text-neutral-600 hover:text-white'}`}>
                <Shuffle size={16} />
              </button>
              <button onClick={onExpand} className="p-2 text-neutral-600 hover:text-white">
                <Maximize2 size={16} />
              </button>
              <div className="w-px h-6 bg-neutral-800" />
              <button onClick={onClose} className="p-2 text-neutral-600 hover:text-red-500">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Metadata & Progress */}
          <div className="w-full space-y-3">
            <div className="hidden md:block opacity-60">
              <MetadataGrid song={currentSong} />
            </div>
            <ProgressSlider />
          </div>

          {/* Mobile Top-Right Close/Expand */}
          <div className="md:hidden absolute top-2 right-2 flex gap-1">
             <button onClick={onExpand} className="p-2 text-neutral-600"><Maximize2 size={14} /></button>
             <button onClick={onClose} className="p-2 text-neutral-600"><X size={14} /></button>
          </div>
        </div>
      </MotionDiv>
    </AnimatePresence>
  );
};