
import React from 'react';
import { motion } from 'framer-motion';
import { Song } from '../types.ts';
import { FileText, Calendar } from 'lucide-react';

interface SongCardProps {
  song: Song;
  onClick: (song: Song) => void;
}

export const SongCard: React.FC<SongCardProps> = ({ song, onClick }) => {
  const MotionDiv = motion.div as any;

  return (
    <MotionDiv
      whileHover={{ scale: 0.98 }}
      className="relative group cursor-pointer overflow-hidden border border-neutral-900 bg-neutral-950 aspect-square transition-all duration-500 hover:border-[#FF007F]/50"
      onClick={() => onClick(song)}
    >
      {/* Pulse Neon Border Effect on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 border border-[#FF007F]/30 animate-pulse"></div>
      </div>

      <img
        src={song.image_url || `https://picsum.photos/seed/${song.id}/400/400`}
        alt={song.title}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 opacity-60 group-hover:opacity-30"
        loading="lazy"
      />

      {/* Normal State: Minimalist Title */}
      <div className="absolute bottom-0 left-0 w-full p-4 z-10 group-hover:opacity-0 transition-opacity duration-300">
        <h3 className="font-serif-classic text-[10px] tracking-[0.2em] text-neutral-400 uppercase truncate">
          {song.title}
        </h3>
      </div>

      {/* Hover State: Metadata & Action */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
        <div className="flex items-center gap-2 mb-2">
          <Calendar size={10} className="text-[#FF007F]" />
          <span className="font-mono text-[9px] text-white tracking-[0.2em]">
            {song.release_date?.split('-')[0] || 'ARCHIVED'}
          </span>
        </div>
        <h3 className="font-serif-classic text-sm text-center font-bold tracking-[0.1em] text-white mb-4 px-2">
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
