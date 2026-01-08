
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Song } from '../types.ts';
import { SongCard } from './SongCard.tsx';
import { SkeletonCard } from './SkeletonCard.tsx';
import { Sparkles, Disc, Ghost, Layers, Play, ArrowDown, Lock, Loader2, Cpu } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext.tsx';

interface ArchiveViewProps {
  songs: Song[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onSongClick: (song: Song) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export const ArchiveView: React.FC<ArchiveViewProps> = ({ songs, loading, hasMore, onLoadMore, onSongClick }) => {
  const [featuredSong, setFeaturedSong] = useState<Song | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { playSong, currentSong, isPlaying } = usePlayer();
  const MotionDiv = motion.div as any;

  useEffect(() => {
    if (!loading && songs.length > 0) {
      setIsInitialLoad(false);
    }
  }, [loading, songs]);

  useEffect(() => {
    if (songs.length > 0 && !featuredSong) {
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
      { id: 'classics', title: 'The Classics', icon: <Disc size={18} />, data: classics },
      { id: 'soundcloud', title: 'Soundcloud Era', icon: <Ghost size={18} />, data: soundcloud },
      { id: 'rare', title: 'Rare & Unreleased', icon: <Layers size={18} />, data: rare }
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
    <div className="pb-32">
      <AnimatePresence mode="wait">
        {loading && isInitialLoad ? (
          <MotionDiv
            key="initial-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#050505]"
          >
            <div className="relative mb-8">
              <Loader2 className="w-20 h-20 text-[#FF007F] animate-spin opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Cpu className="w-8 h-8 text-[#FF007F] animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <span className="font-mono text-[14px] text-[#FF007F] tracking-[0.8em] uppercase animate-pulse font-bold">Scanning Archive</span>
              <span className="font-mono text-[10px] text-neutral-500 tracking-[0.4em] uppercase">Reconstructing Digital Memory...</span>
            </div>
          </MotionDiv>
        ) : (
          <MotionDiv 
            key="archive-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <AnimatePresence mode="wait">
              {featuredSong && (
                <MotionDiv
                  key={featuredSong.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center scale-110 blur-[100px] opacity-40"
                    style={{ backgroundImage: `url(${featuredSong.image_url})` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#050505]"></div>

                  <div className="relative z-10 max-w-7xl w-full px-8 flex flex-col md:flex-row items-center gap-16 lg:gap-32">
                    <MotionDiv 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 1.2 }}
                      className="relative group shrink-0"
                    >
                      <div className="absolute inset-0 bg-[#FF007F]/30 blur-[60px] rounded-full opacity-50 transition-opacity duration-1000 group-hover:opacity-80"></div>
                      <img 
                        src={featuredSong.image_url} 
                        alt={featuredSong.title}
                        className={`w-72 h-72 lg:w-[450px] lg:h-[450px] object-cover border-2 border-neutral-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10 transition-transform duration-1000 ${isFeaturedPlaying ? 'animate-[spin_30s_linear_infinite]' : ''}`}
                      />
                    </MotionDiv>

                    <div className="flex-1 text-center md:text-left">
                      <MotionDiv initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                        <div className="inline-block px-4 py-1.5 border border-[#FF007F]/40 bg-[#FF007F]/10 mb-8">
                           <span className="font-mono text-[12px] text-[#FF007F] tracking-[0.5em] uppercase font-bold">Artifact Spotlight</span>
                        </div>
                        <h2 className="font-gothic text-7xl lg:text-[10rem] mb-10 neon-text-pink leading-none tracking-tighter drop-shadow-[0_10px_30px_rgba(255,0,127,0.3)]">
                          {featuredSong.title}
                        </h2>
                        
                        <div className="flex flex-wrap justify-center md:justify-start gap-6">
                          <button 
                            onClick={() => onSongClick(featuredSong)}
                            className="group relative inline-flex items-center gap-5 px-10 py-5 bg-neutral-950 border-2 border-neutral-800 text-white hover:border-[#FF007F] transition-all overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-[#FF007F]/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                            <span className="relative z-10 font-mono text-[13px] font-bold tracking-[0.3em] uppercase">Explore Artifact</span>
                            <Sparkles size={18} className="relative z-10 text-[#FF007F]" />
                          </button>

                          <button 
                            onClick={handleFeaturedPlay}
                            disabled={!isFeaturedPlayable}
                            className={`group relative inline-flex items-center gap-5 px-10 py-5 transition-all border-2 overflow-hidden ${isFeaturedPlayable ? 'bg-white text-black border-white hover:bg-black hover:text-white' : 'bg-neutral-900 text-neutral-600 border-neutral-800 cursor-not-allowed'}`}
                          >
                            <span className="relative z-10 font-mono text-[13px] font-bold tracking-[0.3em] uppercase">
                              {!isFeaturedPlayable ? 'Restricted Access' : isFeaturedPlaying ? 'Now Playing' : 'Ignite Frequency'}
                            </span>
                            {isFeaturedPlayable ? (
                              <Play size={18} className="relative z-10" fill="currentColor" />
                            ) : (
                              <Lock size={18} className="relative z-10" />
                            )}
                          </button>
                        </div>
                      </MotionDiv>
                    </div>
                  </div>
                </MotionDiv>
              )}
            </AnimatePresence>

            <div className="mt-20 space-y-32">
              {categories.length > 0 ? (
                categories.map((cat, idx) => (
                  <div key={cat.id} className="relative">
                    <div className="px-8 mb-10 flex items-end justify-between border-b border-neutral-900 pb-6 mx-8">
                      <div>
                        <div className="flex items-center gap-3 text-[#7000FF] mb-3">
                          {cat.icon}
                          <span className="font-mono text-[12px] font-bold tracking-[0.4em] uppercase">Chapter {idx + 1}</span>
                        </div>
                        <h3 className="font-serif-classic text-4xl text-white tracking-widest uppercase">{cat.title}</h3>
                      </div>
                    </div>

                    <MotionDiv 
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, amount: 0.1 }}
                      className="flex gap-6 overflow-x-auto px-8 pb-10 snap-x scrollbar-hide"
                    >
                      {cat.data.map((song) => (
                        <MotionDiv key={song.id} variants={itemVariants} className="w-56 lg:w-72 shrink-0 snap-start">
                          <SongCard song={song} onClick={() => handleSongSelect(song, cat.data)} />
                        </MotionDiv>
                      ))}
                    </MotionDiv>
                  </div>
                ))
              ) : (
                !loading && (
                  <div className="px-8 py-20 border-y border-neutral-900/50 bg-neutral-950/20 text-center">
                    <p className="font-mono text-[12px] text-neutral-600 tracking-[0.5em] uppercase">No specific eras identified in this data segment.</p>
                  </div>
                )
              )}
            </div>

            <div className="mt-40 px-8 pt-24 border-t border-neutral-800">
              <div className="flex items-center gap-6 mb-16">
                 <div className="h-px flex-grow bg-neutral-900"></div>
                 <h3 className="font-serif-classic text-3xl text-neutral-300 tracking-[0.3em] uppercase">THE COMPLETE ARCHIVE</h3>
                 <div className="h-px flex-grow bg-neutral-900"></div>
              </div>
              <MotionDiv 
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.05 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
              >
                {songs.map((song) => (
                  <MotionDiv key={song.id} variants={itemVariants}>
                    <SongCard song={song} onClick={() => handleSongSelect(song, songs)} />
                  </MotionDiv>
                ))}
                {loading && Array.from({ length: 12 }).map((_, i) => (
                  <MotionDiv key={`skel-${i}`} variants={itemVariants}>
                    <SkeletonCard />
                  </MotionDiv>
                ))}
              </MotionDiv>

              {hasMore && !loading && (
                <div className="mt-24 flex justify-center">
                  <button 
                    onClick={onLoadMore}
                    className="group flex flex-col items-center gap-6 text-neutral-500 hover:text-[#FF007F] transition-all"
                  >
                    <span className="font-mono text-[13px] font-bold tracking-[0.5em] uppercase">Load More Artifacts</span>
                    <div className="p-5 border-2 border-neutral-900 rounded-full group-hover:border-[#FF007F]/40 animate-bounce transition-colors">
                      <ArrowDown size={20} />
                    </div>
                  </button>
                </div>
              )}
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};
