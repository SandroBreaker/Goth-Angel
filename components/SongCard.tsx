
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
  const [showTooltip, setShowTooltip] = useState(false);
  const [showLyricsTooltip, setShowLyricsTooltip] = useState(false);
  const MotionDiv = motion.div as any;

  const isActive = currentSong?.id === song.id;
  const isCurrentlyPlaying = isActive && isPlaying;
  const hasDirectAudio = !!song.storage_url;

  const safeTitle = ensureString(song.title);
  // Ensure ID is a string before slicing to prevent "slice is not a function" error if ID is a number
  const safeId = String(song.id);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasDirectAudio) {
      playSong(song);
    }
  };

  return (
    <MotionDiv
      whileHover={{ scale: 0.98 }}
      className="relative group cursor-pointer overflow-hidden border border-neutral-800 bg-neutral-950 aspect-square transition-all duration-500 hover:border-[#FF007F]/60"
      onClick={() => onClick(song)}
    >
      <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${isCurrentlyPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <div className={`absolute inset-0 border-2 border-[#FF007F]/40 ${isCurrentlyPlaying ? 'animate-pulse' : ''}`}></div>
      </div>

      <img
        src={song.image_url || `https://picsum.photos/seed/${song.id}/400/400`}
        alt={safeTitle}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 grayscale-[40%] group-hover:grayscale-0 group-hover:scale-110 opacity-60 group-hover:opacity-30 ${isCurrentlyPlaying ? 'opacity-20 grayscale-0 scale-105' : ''}`}
        loading="lazy"
      />

      <div className={`absolute bottom-0 left-0 w-full p-5 z-10 transition-opacity duration-300 ${isCurrentlyPlaying ? 'opacity-0' : 'group-hover:opacity-0'}`}>
        <h3 className="font-serif-classic text-[12px] tracking-[0.1em] font-bold text-neutral-300 uppercase truncate mb-1">
          {safeTitle}
        </h3>
        <p className="font-mono text-[9px] text-neutral-600 tracking-widest font-bold">LOG #{safeId.slice(0, 4)}</p>
      </div>

      {hasDirectAudio && (
        <div className="absolute top-5 left-5 z-20 opacity-40 group-hover:opacity-100 transition-opacity">
          <Zap size={14} className="text-[#7000FF]" fill="#7000FF" />
        </div>
      )}

      <div 
        className="absolute top-5 right-5 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={handlePlayClick}
      >
        {!hasDirectAudio ? (
          <div 
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <div className="p-3 bg-neutral-900/90 text-neutral-500 rounded-full border border-neutral-800 cursor-not-allowed">
              <Lock size={16} />
            </div>
          </div>
        ) : (
          <div className={`p-3 rounded-full border-2 transition-all ${isCurrentlyPlaying ? 'bg-[#FF007F] border-[#FF007F] text-white shadow-[0_0_15px_#FF007F]' : 'bg-black/80 border-white/20 text-white hover:bg-[#FF007F] hover:border-[#FF007F]'}`}>
            {isCurrentlyPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
          </div>
        )}
      </div>

      <div className={`absolute inset-0 flex flex-col items-center justify-center p-8 transition-all duration-500 ${isCurrentlyPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0'}`}>
        <div className="flex items-center gap-3 mb-3">
          <Calendar size={14} className="text-[#FF007F]" />
          <span className="font-mono text-[12px] font-bold text-white tracking-[0.2em]">
            {song.release_date?.split('-')[0] || 'ARCHIVED'}
          </span>
        </div>
        <h3 className="font-serif-classic text-lg text-center font-bold tracking-[0.1em] text-white mb-6 px-2 leading-tight line-clamp-2">
          {safeTitle}
        </h3>
        
        <div 
          className="relative"
          onMouseEnter={() => setShowLyricsTooltip(true)}
          onMouseLeave={() => setShowLyricsTooltip(false)}
        >
          <div className="flex items-center gap-3 px-5 py-2.5 border-2 border-[#FF007F]/40 bg-[#FF007F]/10 transition-colors group-hover:border-[#FF007F]/80">
            <FileText size={16} className="text-[#FF007F]" />
            <span className="font-mono text-[11px] font-bold text-[#FF007F] uppercase tracking-[0.2em]">Read Lyrics</span>
          </div>
          
          <AnimatePresence>
            {showLyricsTooltip && (
              <MotionDiv
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 z-[100] pointer-events-none"
              >
                <div className="bg-black border border-[#FF007F]/50 px-4 py-2 shadow-2xl whitespace-nowrap">
                  <p className="font-mono text-[10px] text-[#FF007F] font-bold uppercase tracking-widest italic">View Artifact Text</p>
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
