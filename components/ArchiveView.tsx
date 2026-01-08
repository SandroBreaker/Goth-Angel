
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Song } from '../types.ts';
import { SongCard } from './SongCard.tsx';
import { SkeletonCard } from './SkeletonCard.tsx';
import { Sparkles, Disc, Ghost, Layers, Play, ArrowDown, Lock } from 'lucide-react';
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

  useEffect(() => {
    if (songs.length > 0 && !featuredSong) {
      // Prioritize direct artifacts for the spotlight if possible
      const directOnly = songs.filter(s => !!s.storage_url);
      const sourceList = directOnly.length > 0 ? directOnly : songs;
      const random = sourceList[Math.floor(Math.random() * Math.min(sourceList.length, 10))];
      setFeaturedSong(random);
    }
  }, [songs, featuredSong]);

  const categories = useMemo(() => {
    const getAlbum = (s: Song) => {
      const albumValue = s.metadata?.album || s.album || "";
      return String(albumValue).toLowerCase();
    };
    
    const classics = songs.filter(s => {
      const album = getAlbum(s);
      return album.includes("sober") || 
             album.includes("cowys") || 
             album.includes("come over when you're sober") ||
             album.includes("everybody's everything");
    }).slice(0, 12);

    const soundcloud = songs.filter(s => {
      const album = getAlbum(s);
      return album.includes("hellboy") || 
             album.includes("crybaby") || 
             album.includes("live forever") || 
             album.includes("lil peep part one") ||
             album.includes("vertigo") ||
             album.includes("california girls");
    }).slice(0, 12);

    const rare = songs.filter(s => {
      const album = getAlbum(s);
      const isClassic = classics.some(c => c.id === s.id);
      const isSoundcloud = soundcloud.some(sc => sc.id === s.id);
      
      return (!album || album === "single" || album.includes("unreleased") || album === "") && 
             !isClassic && !isSoundcloud;
    }).slice(0, 12);
    
    return [
      { id: 'classics', title: 'The Classics', icon: <Disc size={14} />, data: classics },
      { id: 'soundcloud', title: 'Soundcloud Era', icon: <Ghost size={14} />, data: soundcloud },
      { id: 'rare', title: 'Rare & Unreleased', icon: <Layers size={14} />, data: rare }
    ].filter(cat => cat.data.length > 0);
  }, [songs]);

  const handleFeaturedPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (featuredSong && featuredSong.storage_url) {
      playSong(featuredSong, songs);
    }
  };

  const handleSongSelect = useCallback((song: Song, categorySongs?: Song[]) => {
    if (song.storage_url) {
      playSong(song, categorySongs || songs);
    }
    onSongClick(song);
  }, [playSong, songs, onSongClick]);

  const isFeaturedPlaying = currentSong?.id === featuredSong?.id && isPlaying;
  const isFeaturedPlayable = !!featuredSong?.storage_url;

  return (
    <div className="pb-24">
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

                    <button 
                      onClick={handleFeaturedPlay}
                      disabled={!isFeaturedPlayable}
                      className={`group relative inline-flex items-center gap-4 px-8 py-4 transition-all overflow-hidden ${isFeaturedPlayable ? 'bg-white text-black border border-white hover:bg-transparent hover:text-white' : 'bg-neutral-900 text-neutral-600 border border-neutral-800 cursor-not-allowed'}`}
                    >
                      <span className="relative z-10 font-mono text-[10px] tracking-[0.4em] uppercase">
                        {!isFeaturedPlayable ? 'Restricted Access' : isFeaturedPlaying ? 'Now Playing' : 'Ignite Frequency'}
                      </span>
                      {isFeaturedPlayable ? (
                        <Play size={14} className="relative z-10" fill="currentColor" />
                      ) : (
                        <Lock size={14} className="relative z-10" />
                      )}
                    </button>
                  </div>
                </MotionDiv>
              </div>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>

      <div className="mt-12 space-y-24">
        {categories.length > 0 ? (
          categories.map((cat, idx) => (
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
                    <SongCard song={song} onClick={() => handleSongSelect(song, cat.data)} />
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          !loading && (
            <div className="px-6 py-12 border-y border-neutral-900/50 bg-neutral-950/20 text-center">
               <p className="font-mono text-[9px] text-neutral-700 tracking-[0.5em] uppercase">No specific eras identified in this data segment.</p>
            </div>
          )
        )}
      </div>

      <div className="mt-32 px-6 pt-20 border-t border-neutral-900">
        <h3 className="font-serif-classic text-2xl text-white tracking-widest mb-12">THE COMPLETE ARCHIVE</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} onClick={() => handleSongSelect(song, songs)} />
          ))}
          {loading && Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={`skel-${i}`} />)}
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
