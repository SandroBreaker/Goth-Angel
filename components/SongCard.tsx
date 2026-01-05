
import React from 'react';
import { motion } from 'framer-motion';
import { Song } from '../types.ts';
import { FileText, Calendar, Play, Pause, AlertTriangle } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext.tsx';

interface SongCardProps {
  song: Song;
  onClick: (song: Song) => void;
}

export const SongCard: React.FC<SongCardProps> = ({ song, onClick }) => {
  const { playSong, currentSong, isPlaying } = usePlayer();
  const MotionDiv = motion.div as any;

  const isActive = currentSong?.id === song.id;
  const isCurrentlyPlaying = isActive && isPlaying;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (song.video_url) {
      playSong(song);
    }
  };

  return (
    <MotionDiv
      whileHover={{ scale: 0.98 }}
      className="relative group cursor-pointer overflow-hidden border border-neutral-900 bg-neutral-950 aspect-square transition-all duration-500 hover:border-[#FF007F]/50"
      onClick={() => onClick(song)}
    >
      {/* Pulse Neon Border Effect on Hover */}
      <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${isCurrentlyPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <div className={`absolute inset-0 border border-[#FF007F]/30 ${isCurrentlyPlaying ? 'animate-pulse' : ''}`}></div>
      </div>

      <img
        src={song.image_url || `https://picsum.photos/seed/${song.id}/400/400`}
        alt={song.title}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 opacity-60 group-hover:opacity-30 ${isCurrentlyPlaying ? 'opacity-20 grayscale-0 scale-105' : ''}`}
        loading="lazy"
      />

      {/* Normal State: Minimalist Title */}
      <div className={`absolute bottom-0 left-0 w-full p-4 z-10 transition-opacity duration-300 ${isCurrentlyPlaying ? 'opacity-0' : 'group-hover:opacity-0'}`}>
        <h3 className="font-serif-classic text-[10px] tracking-[0.2em] text-neutral-400 uppercase truncate">
          {song.title}
        </h3>
      </div>

      {/* Play Icon Trigger (hover) */}
      <div 
        className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={handlePlayClick}
      >
        {!song.video_url ? (
          <div className="p-2 bg-neutral-900/80 text-neutral-600 rounded-full border border-neutral-800 cursor-help" title="Collecting from Vault...">
            <AlertTriangle size={12} />
          </div>
        ) : (
          <div className={`p-2 rounded-full border transition-all ${isCurrentlyPlaying ? 'bg-[#FF007F] border-[#FF007F] text-white' : 'bg-black/60 border-white/20 text-white hover:bg-[#FF007F] hover:border-[#FF007F]'}`}>
            {isCurrentlyPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
          </div>
        )}
      </div>

      {/* Hover State: Metadata & Action */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 transition-all duration-500 ${isCurrentlyPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'}`}>
        <div className="flex items-center gap-2 mb-2">
          <Calendar size={10} className="text-[#FF007F]" />
          <span className="font-mono text-[9px] text-white tracking-[0.2em]">
            {song.release_date?.split('-')[0] || 'ARCHIVED'}
          </span>
        </div>
        <h3 className="font-serif-classic text-sm text-center font-bold tracking-[0.1em] text-white mb-4 px-2 line-clamp-2">
          {song.title}
        </h3>
        <div className="flex items-center gap-2 px-3 py-1.5 border border-[#FF007F]/30 bg-[#FF007F]/10">
          <FileText size={10} className="text-[#FF007F]" />
          <span className="font-mono text-[8px] text-[#FF007F] uppercase tracking-widest">Read Lyrics</span>
        </div>
      </div>
    </MotionDiv>
  );
};
