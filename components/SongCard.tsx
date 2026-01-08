
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Song } from '../types.ts';
import { FileText, Calendar, Play, Pause, Lock, Zap } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext.tsx';

interface SongCardProps {
  song: Song;
  onClick: (song: Song) => void;
}

const ensureString = (val: any): string => {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') return val.title || val.name || "Artifact";
  return String(val);
};

export const SongCard = React.memo(({ song, onClick }: SongCardProps) => {
  const { playSong, currentSong, isPlaying } = usePlayer();
  const [showLyricsTooltip, setShowLyricsTooltip] = useState(false);
  const MotionDiv = motion.div as any;

  const isActive = currentSong?.id === song.id;
  const isCurrentlyPlaying = isActive && isPlaying;
  const hasDirectAudio = !!song.storage_url;

  const safeTitle = ensureString(song.title);
  const safeId = String(song.id);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasDirectAudio) {
      playSong(song);
    }
  };

  return (
    <MotionDiv
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`relative group cursor-pointer overflow-hidden border transition-all duration-500 aspect-square bg-neutral-950 ${
        isActive 
          ? 'border-[#FF007F] shadow-[0_0_30px_rgba(255,0,127,0.25)]' 
          : 'border-neutral-800 hover:border-[#FF007F]/60 shadow-xl'
      }`}
      onClick={() => onClick(song)}
    >
      {/* Dynamic Border Glow Overlay */}
      <AnimatePresence>
        {isCurrentlyPlaying && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 border-2 border-[#FF007F] z-30 pointer-events-none"
            style={{ boxShadow: 'inset 0 0 20px rgba(255, 0, 127, 0.4)' }}
          >
            <MotionDiv
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-[#FF007F]/5"
            />
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Image with Enhanced Transitions */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={song.image_url || `https://picsum.photos/seed/${song.id}/400/400`}
          alt={safeTitle}
          className={`w-full h-full object-cover transition-all duration-1000 ease-out transform ${
            isCurrentlyPlaying 
              ? 'grayscale-0 scale-110 brightness-75' 
              : 'grayscale-[80%] group-hover:grayscale-0 group-hover:scale-110 brightness-50 group-hover:brightness-75'
          }`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 opacity-60" />
      </div>

      {/* Info Overlay (Visible when not hovered/active) */}
      <div className={`absolute bottom-0 left-0 w-full p-5 z-10 transition-all duration-500 ${isCurrentlyPlaying ? 'opacity-0 translate-y-4' : 'group-hover:opacity-0 group-hover:translate-y-4'}`}>
        <h3 className="font-serif-classic text-[13px] tracking-widest font-bold text-white uppercase truncate mb-1 drop-shadow-md">
          {safeTitle}
        </h3>
        <p className="font-mono text-[9px] text-[#FF007F]/80 tracking-[0.2em] font-bold">LOG_#{safeId.slice(0, 4)}</p>
      </div>

      {/* Play/Audio Status Indicator */}
      {hasDirectAudio && (
        <div className="absolute top-5 left-5 z-20 transition-transform duration-500 group-hover:scale-110">
          <Zap size={14} className={`${isCurrentlyPlaying ? 'text-[#FF007F] animate-pulse' : 'text-[#7000FF]'} drop-shadow-[0_0_8px_currentColor]`} fill="currentColor" />
        </div>
      )}

      {/* Play Button Trigger */}
      <div 
        className={`absolute top-5 right-5 z-40 transition-all duration-500 ${isCurrentlyPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100'}`}
        onClick={handlePlayClick}
      >
        {!hasDirectAudio ? (
          <div className="p-3 bg-neutral-900/90 text-neutral-600 rounded-full border border-neutral-800 cursor-not-allowed">
            <Lock size={16} />
          </div>
        ) : (
          <button className={`p-4 rounded-full border-2 transition-all duration-300 shadow-2xl ${
            isCurrentlyPlaying 
              ? 'bg-[#FF007F] border-[#FF007F] text-white' 
              : 'bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-black'
          }`}>
            {isCurrentlyPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
          </button>
        )}
      </div>

      {/* Hover/Active Content View */}
      <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center p-8 transition-all duration-700 backdrop-blur-[2px] ${isCurrentlyPlaying ? 'opacity-100 bg-black/40' : 'opacity-0 group-hover:opacity-100 group-hover:bg-black/40 translate-y-4 group-hover:translate-y-0'}`}>
        <div className="flex items-center gap-3 mb-4">
          <Calendar size={14} className="text-[#FF007F]" />
          <span className="font-mono text-[12px] font-bold text-white tracking-[0.3em]">
            {song.release_date?.split('-')[0] || 'ARCHIVED'}
          </span>
        </div>
        
        <h3 className="font-serif-classic text-xl text-center font-bold tracking-tight text-white mb-8 px-2 leading-tight line-clamp-2 drop-shadow-2xl">
          {safeTitle}
        </h3>
        
        <div 
          className="relative"
          onMouseEnter={() => setShowLyricsTooltip(true)}
          onMouseLeave={() => setShowLyricsTooltip(false)}
        >
          <div className="flex items-center gap-3 px-6 py-3 border-2 border-[#FF007F] bg-[#FF007F]/10 hover:bg-[#FF007F] hover:text-white text-[#FF007F] transition-all duration-300 shadow-lg">
            <FileText size={18} />
            <span className="font-mono text-[12px] font-bold uppercase tracking-[0.2em]">View Fragment</span>
          </div>
          
          <AnimatePresence>
            {showLyricsTooltip && (
              <MotionDiv
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 z-[100] pointer-events-none"
              >
                <div className="bg-black border border-[#FF007F]/50 px-5 py-2 shadow-[0_0_20px_rgba(255,0,127,0.3)] whitespace-nowrap">
                  <p className="font-mono text-[10px] text-[#FF007F] font-bold uppercase tracking-[0.3em] italic">Accessing Lyrics...</p>
                </div>
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MotionDiv>
  );
}, (prevProps, nextProps) => {
  return prevProps.song.id === nextProps.song.id && prevProps.song.title === nextProps.song.title;
});
