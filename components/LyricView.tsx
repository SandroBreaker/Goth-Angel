
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Calendar, User, Activity, Play, Pause, Lock } from 'lucide-react';
import { Song } from '../types.ts';
import { usePlayer } from '../context/PlayerContext.tsx';

interface LyricViewProps {
  song: Song;
  onClose: () => void;
}

export const LyricView: React.FC<LyricViewProps> = ({ song, onClose }) => {
  const { playSong, currentSong, isPlaying, togglePlay } = usePlayer();
  
  const MotionDiv = motion.div as any;

  const isCurrentActive = currentSong?.id === song.id;
  const hasDirectAudio = !!song.storage_url;

  const metadata = useMemo(() => {
    const m = song.metadata || {};
    
    const sanitize = (val: any): string => {
      if (val === null || val === undefined || val === "" || val === "null") return "N/A";
      if (typeof val === 'string') return val;
      if (typeof val === 'number') return String(val);
      if (typeof val === 'object') {
        return val.name || val.title || val.full_title || String(val);
      }
      return String(val);
    };

    // Deep lookup for metadata fields to handle various scraper formats
    const findField = (keys: string[], rootVal?: any) => {
      if (rootVal && rootVal !== "null") return rootVal;
      for (const key of keys) {
        if (m[key]) return m[key];
        if ((song as any)[key]) return (song as any)[key];
      }
      return null;
    };

    const producer = sanitize(findField(['producer', 'produced_by', 'prod', 'producer_name', 'credits'], song.producer));
    const bpm = sanitize(findField(['bpm', 'tempo', 'beats_per_minute', 'frequency'], song.bpm));
    
    // Timeline/Year logic
    let year = "UNKNOWN";
    const rawDate = song.release_date || (m as any).release_date || (m as any).year;
    if (rawDate && rawDate !== "null") {
      const yearMatch = String(rawDate).match(/\d{4}/);
      year = yearMatch ? yearMatch[0] : sanitize(rawDate);
    }

    const album = sanitize(song.album || m.album || (m as any).collection || "Single Artifact");

    return { producer, bpm, year, album };
  }, [song]);

  const lyricLines = useMemo(() => {
    if (!song.lyrics) return ["ARQUIVO DE TEXTO NÃO LOCALIZADO"];
    return song.lyrics.split('\n');
  }, [song.lyrics]);

  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] bg-black overflow-hidden flex flex-col"
    >
      <AnimatePresence mode="wait">
        <MotionDiv 
          key={song.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 pointer-events-none overflow-hidden" 
          style={{ transform: 'translateZ(0)' }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ 
              backgroundImage: `url(${song.image_url})`,
              filter: 'blur(50px)',
              willChange: 'transform'
            }}
          ></div>
        </MotionDiv>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#050505]/98 to-black pointer-events-none z-[1]"></div>

      <header className="relative z-20 p-6 md:p-8 flex justify-between items-center border-b border-neutral-800 bg-black/40 backdrop-blur-3xl">
        <button 
          onClick={onClose}
          className="group p-4 bg-neutral-900/50 hover:bg-[#FF007F]/20 border border-neutral-800 rounded-full transition-all duration-300"
        >
          <X className="w-6 h-6 text-neutral-200 group-hover:text-[#FF007F]" />
        </button>
        
        <div className="flex flex-col items-center">
          <span className="font-mono text-[10px] text-neutral-600 tracking-[0.5em] uppercase mb-2 font-bold">Preserving Archive</span>
          <div className="flex items-center gap-4">
             <div className="w-8 h-px bg-[#FF007F]/40"></div>
             <span className="font-serif-classic text-[14px] text-white tracking-[0.2em] uppercase truncate max-w-[200px] font-bold">
               {metadata.album}
             </span>
             <div className="w-8 h-px bg-[#FF007F]/40"></div>
          </div>
        </div>

        <button 
          className="p-4 bg-neutral-900/50 hover:bg-[#7000FF]/20 border border-neutral-800 rounded-full transition-all duration-300 text-neutral-200 hover:text-[#7000FF]"
          onClick={() => {
            const url = window.location.href;
            navigator.clipboard.writeText(url);
            alert('Fragment location secured in clipboard.');
          }}
        >
          <Share2 className="w-6 h-6" />
        </button>
      </header>

      <div className="relative z-10 flex-grow overflow-y-auto overflow-x-hidden scroll-smooth flex flex-col items-center pt-20 pb-48 px-6">
        <AnimatePresence mode="wait">
          <MotionDiv 
            key={song.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-5xl flex flex-col items-center"
          >
            <div className="text-center mb-24 px-6">
              <h1 className="font-gothic text-7xl md:text-8xl lg:text-[10rem] mb-12 neon-text-pink drop-shadow-[0_0_30px_rgba(255,0,127,0.4)] px-4 leading-[0.8] tracking-tighter">
                {String(song.title)}
              </h1>

              <div className="flex flex-col items-center gap-8 mb-20">
                {hasDirectAudio ? (
                  <button 
                    onClick={() => isCurrentActive ? togglePlay() : playSong(song)}
                    className="group relative flex items-center gap-8 px-16 py-6 bg-white text-black font-mono text-[16px] font-bold tracking-[0.4em] hover:bg-[#FF007F] hover:text-white transition-all duration-300 shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
                  >
                    <div className="absolute inset-0 border border-white group-hover:border-[#FF007F] scale-105 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all" />
                    {isCurrentActive && isPlaying ? (
                      <><Pause size={24} fill="currentColor" /> PAUSE SIGNAL</>
                    ) : (
                      <><Play size={24} fill="currentColor" className="ml-1" /> IGNITE FREQUENCY</>
                    )}
                  </button>
                ) : (
                  <div className="flex items-center gap-5 px-12 py-6 border-2 border-dashed border-neutral-800 text-neutral-600 font-mono text-[13px] uppercase tracking-[0.5em] font-bold">
                    <Lock size={20} />
                    Signal Restricted
                  </div>
                )}
              </div>

              <div className="flex flex-wrap justify-center gap-6">
                <GlassTag icon={<User size={18}/>} label="Producer" value={metadata.producer} color="pink" />
                <GlassTag icon={<Activity size={18}/>} label="Frequency" value={metadata.bpm === "N/A" ? "?? BPM" : `${metadata.bpm} BPM`} color="purple" />
                <GlassTag icon={<Calendar size={18}/>} label="Timeline" value={metadata.year} color="pink" />
              </div>
            </div>

            <div className="max-w-4xl w-full px-8 mb-40 border-l-2 border-[#FF007F]/20 pl-16">
              <div className="flex flex-col gap-10">
                {lyricLines.map((line, i) => (
                  <p 
                    key={i} 
                    className={`text-2xl md:text-4xl font-light leading-relaxed tracking-tight transition-all duration-500 select-all ${
                      line.trim() 
                        ? 'text-neutral-400 hover:text-white hover:pl-6 border-l-4 border-transparent hover:border-[#FF007F] cursor-text' 
                        : 'h-12'
                    }`}
                  >
                    {String(line)}
                  </p>
                ))}
              </div>
            </div>
          </MotionDiv>
        </AnimatePresence>
      </div>
    </MotionDiv>
  );
};

const GlassTag: React.FC<{ icon: React.ReactNode; label: string; value: string; color: 'pink' | 'purple' }> = ({ 
  icon, label, value, color 
}) => {
  const accent = color === 'pink' ? '#FF007F' : '#7000FF';
  return (
    <div className="flex items-center gap-6 bg-neutral-900/60 border border-neutral-800 px-8 py-5 transition-all hover:bg-neutral-800 group min-w-[200px] shadow-xl backdrop-blur-md">
      <div style={{ color: accent }} className="group-hover:scale-125 transition-transform duration-500 drop-shadow-[0_0_8px_currentColor]">{icon}</div>
      <div className="text-left border-l border-neutral-800 pl-6">
        <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-[0.2em] mb-1.5 font-bold">{label}</p>
        <p className="text-[14px] font-mono text-neutral-100 uppercase tracking-widest font-bold group-hover:text-white transition-colors">{value}</p>
      </div>
    </div>
  );
};
