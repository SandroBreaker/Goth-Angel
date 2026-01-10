
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Calendar, User, Activity, Play, Pause, Lock, ChevronDown, Cpu, Music } from 'lucide-react';
import { Song } from '../types.ts';
import { usePlayer } from '../context/PlayerContext.tsx';

interface LyricViewProps {
  song: Song;
  onClose: () => void;
}

export const LyricView: React.FC<LyricViewProps> = ({ song, onClose }) => {
  const { playSong, currentSong, isPlaying, togglePlay, progress, duration, seek } = usePlayer();
  const [isSyncing, setIsSyncing] = useState(true);
  
  const MotionDiv = motion.div as any;

  const isCurrentActive = currentSong?.id === song.id;
  const hasDirectAudio = !!song.storage_url;

  // Efeito para simular/aguardar o carregamento dos detalhes (lyrics/metadata)
  useEffect(() => {
    if (song.lyrics) {
      setIsSyncing(false);
    } else {
      const timer = setTimeout(() => setIsSyncing(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [song.lyrics]);

  const metadata = useMemo(() => {
    const m = song.metadata || {};
    const sanitize = (val: any): string => {
      if (!val || val === "null") return "N/A";
      return typeof val === 'object' ? (val.name || val.title || String(val)) : String(val);
    };

    const findField = (keys: string[], rootVal?: any) => {
      if (rootVal && rootVal !== "null") return rootVal;
      for (const key of keys) {
        if (m[key]) return m[key];
        if ((song as any)[key]) return (song as any)[key];
      }
      return null;
    };

    return {
      producer: sanitize(findField(['producer', 'produced_by', 'prod'], song.producer)),
      bpm: sanitize(findField(['bpm', 'tempo', 'beats_per_minute'], song.bpm)),
      year: song.release_date?.split('-')[0] || "ARCHIVED",
      album: sanitize(song.album || m.album || "Single Artifact")
    };
  }, [song]);

  const lyricLines = useMemo(() => {
    if (!song.lyrics) return [];
    return song.lyrics.split('\n');
  }, [song.lyrics]);

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <MotionDiv
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: "circOut" }}
      className="fixed inset-0 z-[150] bg-[#050505] overflow-y-auto overflow-x-hidden selection:bg-[#FF007F]/30"
    >
      {/* Immersive Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 scale-110 blur-[80px] transition-all duration-1000"
          style={{ backgroundImage: `url(${song.image_url})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#050505] to-black" />
      </div>

      {/* Persistent Header */}
      <header className="sticky top-0 z-[160] p-6 md:p-10 flex justify-between items-center bg-transparent">
        <button 
          onClick={onClose}
          className="group p-4 bg-black/40 hover:bg-[#FF007F]/20 border border-neutral-800 rounded-full transition-all duration-300 backdrop-blur-xl"
        >
          <X className="w-6 h-6 text-neutral-200 group-hover:text-[#FF007F] group-hover:rotate-90 transition-transform" />
        </button>
        
        <div className="hidden md:flex flex-col items-center">
          <span className="font-mono text-[9px] text-[#FF007F] tracking-[0.6em] uppercase mb-1 font-bold animate-pulse">System Active</span>
          <span className="font-serif-classic text-[12px] text-neutral-500 tracking-[0.2em] uppercase">{metadata.album}</span>
        </div>

        <button 
          className="p-4 bg-black/40 hover:bg-neutral-800 border border-neutral-800 rounded-full transition-all duration-300 text-neutral-200"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert('Signal link secured.');
          }}
        >
          <Share2 className="w-6 h-6" />
        </button>
      </header>

      {/* Content Layout */}
      <div className="relative z-[155] w-full max-w-6xl mx-auto px-6 pb-40">
        
        {/* HERO SECTION: The Core Visual */}
        <section className="flex flex-col items-center pt-10 md:pt-20 mb-32">
          <MotionDiv 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative mb-16 group"
          >
            <div className="absolute inset-0 bg-[#FF007F]/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative z-10 w-64 h-64 md:w-[480px] md:h-[480px] border border-neutral-800 shadow-2xl overflow-hidden">
              <img 
                src={song.image_url} 
                alt={song.title} 
                className={`w-full h-full object-cover transition-transform duration-[3000ms] ease-out ${isPlaying && isCurrentActive ? 'scale-110' : 'scale-100 grayscale'}`} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </MotionDiv>

          <div className="text-center max-w-4xl">
            <h1 className="font-gothic text-6xl md:text-8xl lg:text-[9rem] mb-10 neon-text-pink leading-[0.85] tracking-tighter drop-shadow-[0_0_40px_rgba(255,0,127,0.4)]">
              {song.title}
            </h1>

            {/* Immersive Controls */}
            <div className="flex flex-col items-center gap-10">
               <div className="flex items-center gap-12">
                  {hasDirectAudio ? (
                    <button 
                      onClick={() => isCurrentActive ? togglePlay() : playSong(song)}
                      className="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#FF007F] hover:text-white hover:scale-110 transition-all duration-500 shadow-[0_0_50px_rgba(255,255,255,0.1)] active:scale-95 group"
                    >
                      {isCurrentActive && isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-2" />}
                    </button>
                  ) : (
                    <div className="flex items-center gap-4 px-8 py-4 border border-dashed border-neutral-800 text-neutral-600 font-mono text-[11px] uppercase tracking-[0.4em]">
                      <Lock size={16} /> Restricted
                    </div>
                  )}
               </div>

               {/* Large Progress Bar */}
               {isCurrentActive && hasDirectAudio && (
                 <div className="w-full max-w-2xl px-4 flex flex-col gap-3">
                    <div 
                      className="h-1.5 bg-neutral-900 relative cursor-pointer group/progress overflow-hidden"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        seek(( (e.clientX - rect.left) / rect.width ) * duration);
                      }}
                    >
                      <div 
                        className="absolute h-full bg-[#FF007F] shadow-[0_0_15px_#FF007F] transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between font-mono text-[10px] text-neutral-600 tracking-widest font-bold">
                       <span>{Math.floor(progress/60)}:{(progress%60).toFixed(0).padStart(2,'0')}</span>
                       <span>{Math.floor(duration/60)}:{(duration%60).toFixed(0).padStart(2,'0')}</span>
                    </div>
                 </div>
               )}
            </div>
          </div>
        </section>

        {/* METADATA GRID */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-40">
          <GlassBox icon={<User size={20}/>} label="Producer" value={metadata.producer} />
          <GlassBox icon={<Activity size={20}/>} label="BPM / Frequency" value={metadata.bpm} />
          <GlassBox icon={<Calendar size={20}/>} label="Archive Year" value={metadata.year} />
        </section>

        {/* LYRICS SECTION: The Scroll */}
        <section className="max-w-3xl mx-auto border-t border-neutral-900 pt-24">
          <div className="flex items-center gap-4 mb-20 text-neutral-700">
            <Cpu size={18} className="animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.5em] font-bold">Encrypted Lyric Scroll</span>
            <div className="h-px flex-grow bg-neutral-900" />
          </div>

          <div className="space-y-12">
            {isSyncing ? (
              <div className="py-20 flex flex-col items-center gap-6">
                 <LoaderAnimation />
                 <p className="font-mono text-[11px] text-[#FF007F] uppercase tracking-[0.5em] animate-pulse">Decrypting Data Stream...</p>
              </div>
            ) : lyricLines.length > 0 ? (
              lyricLines.map((line, i) => (
                <p 
                  key={i} 
                  className={`text-2xl md:text-5xl font-light leading-snug tracking-tight transition-all duration-700 hover:text-white border-l-2 border-transparent hover:border-[#FF007F] hover:pl-8 ${line.trim() ? 'text-neutral-500' : 'h-16'}`}
                >
                  {line}
                </p>
              ))
            ) : (
              <div className="py-20 border border-neutral-900 bg-neutral-950/40 p-10 text-center">
                 <p className="font-mono text-[11px] text-neutral-600 uppercase tracking-[0.4em]">Historical transcription not located in primary vault.</p>
                 <p className="mt-4 text-[10px] text-neutral-800 font-bold uppercase tracking-[0.2em]">Contact archivist for verification.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Floating Scroll Indicator */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30 animate-bounce pointer-events-none">
         <span className="font-mono text-[8px] text-white tracking-[0.4em] uppercase">Scroll to read</span>
         <ChevronDown size={14} className="text-[#FF007F]" />
      </div>
    </MotionDiv>
  );
};

const GlassBox: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-6 bg-neutral-900/30 border border-neutral-900 p-8 hover:bg-neutral-800 transition-all group backdrop-blur-md">
    <div className="text-[#7000FF] group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_8px_#7000FF]">{icon}</div>
    <div className="border-l border-neutral-800 pl-6">
      <p className="text-[10px] font-mono text-neutral-600 uppercase tracking-[0.3em] mb-1.5 font-bold">{label}</p>
      <p className="text-[14px] font-mono text-neutral-200 uppercase tracking-widest font-bold group-hover:text-white">{value}</p>
    </div>
  </div>
);

const LoaderAnimation = () => (
  <div className="flex gap-2">
    {[0, 1, 2].map(i => (
      <motion.div 
        key={i}
        animate={{ height: [10, 30, 10], opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
        className="w-1 bg-[#FF007F] shadow-[0_0_10px_#FF007F]"
      />
    ))}
  </div>
);
