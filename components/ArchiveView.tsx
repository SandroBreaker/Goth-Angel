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
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] } }
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
    } else if (songs.length === 0) {
      setFeaturedSong(null);
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
    });

    const soundcloud = songs.filter(s => {
      const album = getAlbum(s);
      return album.includes("hellboy") || 
             album.includes("crybaby") || 
             album.includes("live forever") || 
             album.includes("lil peep part one") ||
             album.includes("vertigo") ||
             album.includes("california girls");
    });

    const rare = songs.filter(s => {
      const album = getAlbum(s);
      const isClassic = classics.some(c => c.id === s.id);
      const isSoundcloud = soundcloud.some(sc => sc.id === s.id);
      
      return (!album || album === "single" || album.includes("unreleased") || album === "") && 
             !isClassic && !isSoundcloud;
    });
    
    return [
      { id: 'classics', title: 'Os Clássicos', icon: <Disc size={18} />, data: classics },
      { id: 'soundcloud', title: 'Era Soundcloud', icon: <Ghost size={18} />, data: soundcloud },
      { id: 'rare', title: 'Raros & Não Lançados', icon: <Layers size={18} />, data: rare }
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
    <div className="pb-32 px-4 md:px-0">
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
              <Loader2 className="w-16 h-16 md:w-20 md:h-20 text-[#FF007F] animate-spin opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Cpu className="w-6 h-6 md:w-8 md:h-8 text-[#FF007F] animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 px-6 text-center">
              <span className="font-mono text-[12px] md:text-[14px] text-[#FF007F] tracking-[0.4em] uppercase animate-pulse font-bold">Iniciando Protocolo</span>
              <span className="font-mono text-[8px] md:text-[10px] text-neutral-600 tracking-[0.2em] uppercase">Sincronizando com o Cofre...</span>
            </div>
          </MotionDiv>
        ) : (
          <MotionDiv 
            key="archive-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <AnimatePresence mode="wait">
              {loading && songs.length === 0 ? (
                <div key="top-skeleton-container" className="space-y-12">
                   <SkeletonCard variant="featured" />
                   <div className="px-4 md:px-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                      {[...Array(12)].map((_, i) => <SkeletonCard key={i} />)}
                   </div>
                </div>
              ) : featuredSong && (
                <MotionDiv
                  key={featuredSong.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative min-h-[60vh] md:h-[90vh] w-full overflow-hidden flex items-center justify-center py-12 md:py-0"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center scale-110 blur-[30px] md:blur-[60px] opacity-30 will-change-[filter,opacity]"
                    style={{ backgroundImage: `url(${featuredSong.image_url})` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-[#050505]"></div>

                  <div className="relative z-10 max-w-7xl w-full px-4 md:px-12 flex flex-col md:flex-row items-center gap-8 md:gap-24">
                    <MotionDiv 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                      className="relative group shrink-0"
                    >
                      <div className="absolute inset-0 bg-[#FF007F]/20 blur-[50px] rounded-full opacity-40 transition-opacity duration-1000 group-hover:opacity-60" />
                      <img 
                        src={featuredSong.image_url} 
                        alt={featuredSong.title}
                        className={`w-40 h-40 md:w-64 md:h-64 lg:w-[420px] lg:h-[420px] object-cover rounded-lg border border-white/5 shadow-2xl relative z-10 transition-transform duration-1000 ${isFeaturedPlaying ? 'scale-105' : 'scale-100'}`}
                      />
                    </MotionDiv>

                    <div className="flex-1 text-center md:text-left">
                      <MotionDiv initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                        <div className="inline-block px-3 py-1 border border-[#FF007F]/30 bg-[#FF007F]/5 mb-6">
                           <span className="font-mono text-[8px] md:text-[10px] text-[#FF007F] tracking-[0.4em] uppercase font-bold">Fragmento em Destaque</span>
                        </div>
                        <h2 className="font-gothic text-4xl sm:text-5xl md:text-7xl mb-6 md:mb-10 neon-text-pink leading-tight tracking-tighter">
                          {featuredSong.title}
                        </h2>
                        
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-5">
                          <button 
                            onClick={() => onSongClick(featuredSong)}
                            className="group relative inline-flex items-center gap-3 px-6 md:px-10 py-3 md:py-4 bg-white text-black hover:bg-[#FF007F] hover:text-white transition-all font-mono text-[10px] md:text-[12px] font-bold tracking-widest uppercase rounded-sm"
                          >
                            Explorar <Sparkles size={14} />
                          </button>

                          <button 
                            onClick={handleFeaturedPlay}
                            disabled={!isFeaturedPlayable}
                            className={`group relative inline-flex items-center gap-3 px-6 md:px-10 py-3 md:py-4 border border-white/20 hover:border-white transition-all font-mono text-[10px] md:text-[12px] font-bold tracking-widest uppercase rounded-sm ${!isFeaturedPlayable ? 'opacity-30 cursor-not-allowed' : 'text-white'}`}
                          >
                            {isFeaturedPlaying ? 'Pausar' : 'Ouvir'}
                            {isFeaturedPlayable ? <Play size={14} fill="currentColor" /> : <Lock size={14} />}
                          </button>
                        </div>
                      </MotionDiv>
                    </div>
                  </div>
                </MotionDiv>
              )}
            </AnimatePresence>

            <div className="mt-8 md:mt-16 space-y-16 md:space-y-24">
              {categories.map((cat, idx) => (
                <div key={cat.id} className="relative overflow-hidden">
                  <div className="px-4 md:px-12 mb-6 flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-neutral-600 mb-2">
                        <span className="font-mono text-[9px] font-bold tracking-[0.4em] uppercase">Era {idx + 1}</span>
                      </div>
                      <h3 className="font-serif-classic text-2xl md:text-4xl text-white tracking-widest uppercase">
                        {cat.title}
                      </h3>
                    </div>
                  </div>

                  <MotionDiv 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    className="flex gap-4 md:gap-6 overflow-x-auto px-4 md:px-12 pb-8 snap-x scrollbar-hide"
                  >
                    {cat.data.map((song) => (
                      <MotionDiv key={`cat-${cat.id}-${song.id}`} variants={itemVariants} className="w-40 md:w-56 lg:w-64 shrink-0 snap-start">
                        <SongCard song={song} onClick={() => handleSongSelect(song, cat.data)} />
                      </MotionDiv>
                    ))}
                  </MotionDiv>
                </div>
              ))}
            </div>
            
            <div className="mt-20 md:mt-32 px-4 md:px-12 pt-16 border-t border-white/5">
              <div className="flex items-center gap-4 mb-10">
                 <div className="h-px flex-grow bg-neutral-900" />
                 <h3 className="font-serif-classic text-lg md:text-2xl text-neutral-500 tracking-[0.3em] uppercase font-bold">Arquivo Completo</h3>
                 <div className="h-px flex-grow bg-neutral-900" />
              </div>
              
              <MotionDiv 
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6"
              >
                {songs.map((song) => (
                  <MotionDiv key={`archive-${song.id}`} variants={itemVariants}>
                    <SongCard song={song} onClick={() => handleSongSelect(song, songs)} />
                  </MotionDiv>
                ))}
                
                {loading && songs.length > 0 && [...Array(6)].map((_, i) => (
                  <MotionDiv key={`skeleton-more-${i}`} variants={itemVariants}>
                    <SkeletonCard />
                  </MotionDiv>
                ))}
              </MotionDiv>

              {hasMore && !loading && (
                <div className="mt-16 md:mt-24 flex justify-center">
                  <button 
                    onClick={onLoadMore}
                    className="group flex flex-col items-center gap-4 text-neutral-600 hover:text-white transition-all"
                  >
                    <span className="font-mono text-[9px] md:text-[11px] font-bold tracking-[0.5em] uppercase">Sincronizar Mais Dados</span>
                    <div className="p-4 border border-neutral-900 rounded-full group-hover:border-[#FF007F] animate-bounce">
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