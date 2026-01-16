import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Song } from '../types.ts';
import { FileText, Calendar, Play, Pause, Lock, Zap, Loader2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext.tsx';
import React from 'react';

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
  const [imageLoaded, setImageLoaded] = useState(false);
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
      whileHover={hasDirectAudio ? { y: -5 } : {}}
      whileTap={{ scale: 0.96 }}
      className={`relative group cursor-pointer overflow-hidden border transition-all duration-500 aspect-square rounded-sm ${
        !hasDirectAudio 
          ? 'bg-neutral-950 border-neutral-900 opacity-60' 
          : isActive 
            ? 'bg-neutral-950 border-[#FF007F] shadow-[0_0_20px_rgba(255,0,127,0.3)]' 
            : 'bg-neutral-950 border-white/5 hover:border-[#FF007F]/40'
      }`}
      onClick={() => onClick(song)}
    >
      <div className="absolute inset-0 overflow-hidden bg-neutral-900">
        <AnimatePresence>
          {!imageLoaded && (
            <MotionDiv
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#080808]"
            >
              <div className="relative">
                <Loader2 className="w-5 h-5 text-neutral-800 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <div className="w-8 h-8 rounded-full border border-[#FF007F] animate-ping" />
                </div>
              </div>
              <MotionDiv 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent pointer-events-none"
              />
            </MotionDiv>
          )}
        </AnimatePresence>
        
        <img
          src={song.image_url || `https://picsum.photos/seed/${song.id}/400/400`}
          alt={safeTitle}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
            !imageLoaded ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          } ${
            !hasDirectAudio
              ? 'grayscale brightness-25'
              : isCurrentlyPlaying 
                ? 'grayscale-0 scale-110 brightness-75' 
                : 'grayscale-[90%] group-hover:grayscale-0 group-hover:scale-105 brightness-50'
          }`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-3 md:p-5 z-10">
        <h3 className={`font-serif-classic text-[11px] md:text-[13px] tracking-widest font-bold uppercase truncate mb-1 ${!hasDirectAudio ? 'text-neutral-500' : 'text-white'}`}>
          {safeTitle}
        </h3>
        <p className={`font-mono text-[8px] md:text-[9px] tracking-[0.2em] font-bold ${!hasDirectAudio ? 'text-neutral-700' : 'text-[#FF007F]/60'}`}>
          {hasDirectAudio ? `CORE_LOG_${safeId.slice(0, 4)}` : 'SIGNAL_LOST'}
        </p>
      </div>

      <div className="absolute top-3 right-3 z-30 flex flex-col gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        {hasDirectAudio ? (
          <button 
            onClick={handlePlayClick}
            className={`p-3 md:p-4 rounded-full backdrop-blur-md border border-white/20 transition-all ${
              isCurrentlyPlaying ? 'bg-[#FF007F] text-white' : 'bg-black/50 text-white'
            }`}
          >
            {isCurrentlyPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
          </button>
        ) : (
          <div className="p-3 bg-black/80 text-neutral-800 rounded-full border border-neutral-900">
            <Lock size={14} />
          </div>
        )}
      </div>

      {hasDirectAudio && (
        <div className="absolute top-3 left-3 z-30">
          <Zap size={10} className={`${isCurrentlyPlaying ? 'text-[#FF007F] animate-pulse' : 'text-[#7000FF]'} drop-shadow-md`} fill="currentColor" />
        </div>
      )}

      <div className="absolute bottom-0 left-0 w-full h-1 bg-neutral-900">
        <MotionDiv 
          animate={isCurrentlyPlaying ? { x: ['-100%', '100%'] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-full h-full bg-[#FF007F] opacity-0 group-hover:opacity-100"
          style={{ opacity: isCurrentlyPlaying ? 1 : undefined }}
        />
      </div>
    </MotionDiv>
  );
}, (prevProps, nextProps) => {
  return prevProps.song.id === nextProps.song.id && 
         prevProps.song.title === nextProps.song.title &&
         prevProps.song.storage_url === nextProps.song.storage_url;
});