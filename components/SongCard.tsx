
import React from 'react';
import { motion } from 'framer-motion';
import { Song } from '../types';

interface SongCardProps {
  song: Song;
  onClick: (song: Song) => void;
}

export const SongCard: React.FC<SongCardProps> = ({ song, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative group cursor-pointer overflow-hidden border border-neutral-800 aspect-square bg-black transition-all duration-500 hover:border-[#FF007F]"
      onClick={() => onClick(song)}
    >
      {/* Background Image with lazy loading */}
      <img
        src={song.image_url || `https://picsum.photos/seed/${song.id}/400/400`}
        alt={song.title}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:blur-md group-hover:scale-110 opacity-70 group-hover:opacity-40"
        loading="lazy"
      />

      {/* Hover Content: Lyrics Snippet */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <p className="font-mono text-[10px] text-[#FF007F] mb-4 uppercase tracking-[0.2em]">Excerpt</p>
        <p className="text-center italic text-neutral-200 text-sm leading-relaxed line-clamp-4">
          "{song.lyrics?.substring(0, 150)}..."
        </p>
      </div>

      {/* Fixed Footer: Title & Album */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
        <h3 className="font-serif-classic text-sm font-bold tracking-wider group-hover:neon-text-pink transition-colors">
          {song.title}
        </h3>
        <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest mt-1">
          {song.album}
        </p>
      </div>
      
      {/* Glitch Overlay (Pseudo) */}
      <div className="absolute inset-0 bg-[#FF007F]/5 mix-blend-screen opacity-0 group-hover:opacity-100 animate-pulse pointer-events-none"></div>
    </motion.div>
  );
};
