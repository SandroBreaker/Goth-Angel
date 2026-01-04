
import React from 'react';
import { motion } from 'framer-motion';
import { Song } from '../types.ts';

interface SongCardProps {
  song: Song;
  onClick: (song: Song) => void;
}

export const SongCard: React.FC<SongCardProps> = ({ song, onClick }) => {
  const MotionDiv = motion.div as any;

  return (
    <MotionDiv
      whileHover={{ y: -4 }}
      className="relative group cursor-pointer overflow-hidden border border-neutral-900/50 aspect-[4/5] bg-[#080808] transition-all duration-700 hover:border-[#FF007F]/30"
      onClick={() => onClick(song)}
    >
      <img
        src={song.image_url || `https://picsum.photos/seed/${song.id}/600/800`}
        alt={song.title}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 grayscale-[40%] group-hover:grayscale-0 opacity-40 group-hover:opacity-60 scale-100 group-hover:scale-105"
        loading="lazy"
      />

      {/* Ethereal Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-1000"></div>
      <div className="absolute inset-0 bg-[#FF007F]/0 group-hover:bg-[#FF007F]/5 transition-colors duration-1000"></div>

      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 opacity-0 group-hover:opacity-100 transition-all duration-1000 translate-y-4 group-hover:translate-y-0">
        <p className="font-mono text-[8px] text-white/40 mb-4 uppercase tracking-[0.4em]">Lyric Resonance</p>
        <p className="text-center font-light text-neutral-300 text-xs leading-relaxed italic line-clamp-3 px-2">
          "{song.lyrics?.split('\n')[0]}..."
        </p>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6">
        <h3 className="font-serif-classic text-xs font-bold tracking-[0.2em] text-neutral-400 group-hover:text-white transition-colors duration-700">
          {song.title}
        </h3>
        <p className="font-mono text-[8px] text-neutral-700 group-hover:text-[#FF007F]/60 uppercase tracking-widest mt-2 transition-colors duration-700">
          {song.album}
        </p>
      </div>
      
      {/* Museum Frame Effect */}
      <div className="absolute inset-0 border border-white/0 group-hover:border-white/5 transition-all duration-1000 pointer-events-none"></div>
    </MotionDiv>
  );
};
