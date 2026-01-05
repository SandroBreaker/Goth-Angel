
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Song } from '../types.ts';
import { SongCard } from './SongCard.tsx';
import { SkeletonCard } from './SkeletonCard.tsx';
import { ChevronRight, Sparkles, Disc, Music, Ghost, Layers, Play, AlertTriangle, ArrowDown } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext.tsx';

interface ArchiveViewProps {
  songs: Song[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onSongClick: (song: Song) => void;
}

export const ArchiveView: React.FC<ArchiveViewProps> = ({ songs, loading, hasMore, onLoadMore, onSongClick }) => {
  const [featuredSong, setFeaturedSong] = useState<Song | null>(null);
  const { playSong, currentSong, isPlaying } = usePlayer();
  const MotionDiv = motion.div as any;

  // Select random featured song only from the initial batch
  useEffect(() => {
    if (songs.length > 0 && !featuredSong) {
      const random = songs[Math.floor(Math.random() * Math.min(songs.length, 20))];
      setFeaturedSong(random);
    }
  }, [songs]);

  const categories = useMemo(() => {
    const classics = songs.filter(s => s.album?.includes("Sober") || s.album?.includes("COWYS")).slice(0, 12);
    const soundcloud = songs.filter(s => s.album?.includes("Hellboy") || s.album?.includes("Crybaby") || s.album?.includes("Live Forever")).slice(0, 12);
    const rare = songs.filter(s => !s.album || s.album === "Single" || s.album.toLowerCase().includes("unreleased")).slice(0, 12);
    
    return [
      { id: 'classics', title: 'The Classics', icon: <Disc size={14} />, data: classics },
      { id: 'soundcloud', title: 'Soundcloud Era', icon: <Ghost size={14} />, data: soundcloud },
      { id: 'rare', title: 'Rare & Unreleased', icon: <Layers size={14} />, data: rare }
    ];
  }, [songs]);

  const isFeaturedPlaying = currentSong?.id === featuredSong?.id && isPlaying;

  return (
    <div className="pb-24">
      {/* HERO SECTION */}
      <AnimatePresence mode="wait">
        {featuredSong && (
          <MotionDiv
            key={featuredSong.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative h-[85vh] w-full overflow-hidden flex items-center justify-center"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center scale-110 blur-[80px] opacity-30 transition-all duration-1000"
              style={{ backgroundImage: `url(${featuredSong.image_url})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-[#050505]"></div>

            <div className="relative z-10 max-w-6xl w-full px-6 flex flex-col md:flex-row items-center gap-12 lg:gap-24">
              <MotionDiv 
                initial={{ rotate: -10, scale: 0.9, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative group shrink-0"
              >
                <div className="absolute inset-0 bg-[#FF007F]/20 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <img 
                  src={featuredSong.image_url} 
                  alt={featuredSong.title}
                  className={`w-64 h-64 lg:w-96 lg:h-96 object-cover border border-neutral-800 shadow-2xl relative z-10 transition-transform duration-1000 ${isFeaturedPlaying ? 'animate-[spin_20s_linear_infinite]' : ''}`}
                />
              </MotionDiv>

              <div className="flex-1 text-center md:text-left">
                <MotionDiv initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                  <span className="font-mono text-[10px] text-[#FF007F] tracking-[0.6em] uppercase mb-4 block">Artifact Spotlight</span>
                  <h2 className="font-gothic text-6xl lg:text-8xl mb-6 neon-text-pink leading-none tracking-tight">
                    {featuredSong.title}
                  </h2>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <button 
                      onClick={() => onSongClick(featuredSong)}
                      className="group relative inline-flex items-center gap-4 px-8 py-4 bg-neutral-950 border border-neutral-800 text-white hover:border-[#FF007F] transition-all overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-[#FF007F]/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                      <span className="relative z-10 font-mono text-[10px] tracking-[0.4em] uppercase">Explore Artifact</span>
                      <Sparkles size={14} className="relative z-10 text-[#FF007F]" />
                    </button>

                    {featuredSong.video_url && (
                      <button 
                        onClick={() => playSong(featuredSong)}
                        className="group relative inline-flex items-center gap-4 px-8 py-4 bg-white text-black border border-white hover:bg-transparent hover:text-white transition-all overflow-hidden"
                      >
                        <span className="relative z-10 font-mono text-[10px] tracking-[0.4em] uppercase">{isFeaturedPlaying ? 'Now Playing' : 'Ignite Frequency'}</span>
                        <Play size={14} className="relative z-10" fill="currentColor" />
                      </button>
                    )}
                  </div>
                </MotionDiv>
              </div>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* CAROUSELS */}
      <div className="mt-12 space-y-24">
        {categories.map((cat, idx) => (
          <div key={cat.id} className="relative">
            <div className="px-6 mb-8 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#7000FF] mb-2">
                  {cat.icon}
                  <span className="font-mono text-[9px] tracking-[0.4em] uppercase">Chapter {idx + 1}</span>
                </div>
                <h3 className="font-serif-classic text-2xl text-white tracking-widest">{cat.title}</h3>
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto px-6 pb-8 snap-x scrollbar-hide">
              {cat.data.map((song) => (
                <div key={song.id} className="w-48 lg:w-64 shrink-0 snap-start">
                  <SongCard song={song} onClick={onSongClick} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* MAIN GRID WITH PAGINATION */}
      <div className="mt-32 px-6 pt-20 border-t border-neutral-900">
        <h3 className="font-serif-classic text-2xl text-white tracking-widest mb-12">THE COMPLETE ARCHIVE</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} onClick={onSongClick} />
          ))}
          {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={`skel-${i}`} />)}
        </div>

        {hasMore && !loading && (
          <div className="mt-16 flex justify-center">
            <button 
              onClick={onLoadMore}
              className="group flex flex-col items-center gap-4 text-neutral-600 hover:text-[#FF007F] transition-all"
            >
              <span className="font-mono text-[10px] tracking-[0.5em] uppercase">Load More Artifacts</span>
              <div className="p-3 border border-neutral-900 rounded-full group-hover:border-[#FF007F]/30 animate-bounce">
                <ArrowDown size={14} />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
