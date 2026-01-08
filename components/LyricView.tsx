
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
  const [selectedText, setSelectedText] = useState('');
  const { playSong, currentSong, isPlaying, togglePlay } = usePlayer();
  
  const MotionDiv = motion.div as any;

  const handleTextSelect = () => {
    const selection = window.getSelection()?.toString();
    if (selection) setSelectedText(selection);
  };

  const isCurrentActive = currentSong?.id === song.id;
  const hasDirectAudio = !!song.storage_url;

  const metadata = useMemo(() => {
    const m = song.metadata || {};
    
    const sanitize = (val: any): string => {
      if (!val) return "N/A";
      if (typeof val === 'string') return val;
      if (typeof val === 'object') {
        return val.name || val.title || val.full_title || String(val);
      }
      return String(val);
    };

    return {
      producer: sanitize(m.producer || (m as any).prod || song.producer),
      bpm: sanitize(m.bpm || (m as any).tempo || song.bpm || "??"),
      year: sanitize(song.release_date?.split('-')[0] || (m as any).year || "Unknown"),
      album: sanitize(song.album || m.album || "Single")
    };
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#050505]/95 to-black pointer-events-none z-[1]"></div>

      <header className="relative z-20 p-6 md:p-8 flex justify-between items-center border-b border-neutral-800 bg-black/40 backdrop-blur-2xl">
        <button 
          onClick={onClose}
          className="group p-4 bg-neutral-900/50 hover:bg-[#FF007F]/20 border border-neutral-800 rounded-full transition-all duration-300"
        >
          <X className="w-6 h-6 text-neutral-200 group-hover:text-[#FF007F]" />
        </button>
        
        <div className="flex flex-col items-center">
          <span className="font-mono text-[10px] text-neutral-500 tracking-[0.5em] uppercase mb-2 font-bold">Preserving Archive</span>
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
            navigator.clipboard.writeText(window.location.href);
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
            <div className="text-center mb-20 px-6">
              <h1 className="font-gothic text-6xl md:text-8xl lg:text-9xl mb-12 neon-text-pink drop-shadow-[0_0_20px_rgba(255,0,127,0.3)] px-4 leading-[0.8]">
                {String(song.title)}
              </h1>

              <div className="flex flex-col items-center gap-8 mb-16">
                {hasDirectAudio ? (
                  <button 
                    onClick={() => isCurrentActive ? togglePlay() : playSong(song)}
                    className="group relative flex items-center gap-6 px-12 py-5 bg-white text-black font-mono text-[14px] font-bold tracking-[0.3em] hover:bg-[#FF007F] hover:text-white transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                  >
                    {isCurrentActive && isPlaying ? (
                      <><Pause size={20} fill="currentColor" /> PAUSE SIGNAL</>
                    ) : (
                      <><Play size={20} fill="currentColor" /> IGNITE FREQUENCY</>
                    )}
                  </button>
                ) : (
                  <div className="flex items-center gap-4 px-10 py-5 border-2 border-dashed border-neutral-800 text-neutral-500 font-mono text-[11px] uppercase tracking-[0.4em] font-bold">
                    <Lock size={18} />
                    Signal Restricted
                  </div>
                )}
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <GlassTag icon={<User size={14}/>} label="Producer" value={metadata.producer} color="pink" />
                <GlassTag icon={<Activity size={14}/>} label="Frequency" value={`${metadata.bpm} BPM`} color="purple" />
                <GlassTag icon={<Calendar size={14}/>} label="Timeline" value={metadata.year} color="pink" />
              </div>
            </div>

            <div className="max-w-4xl w-full px-8 mb-32 border-l border-white/5 pl-12">
              <div className="flex flex-col gap-8">
                {lyricLines.map((line, i) => (
                  <p 
                    key={i} 
                    className={`text-xl md:text-3xl font-light leading-relaxed tracking-tight transition-all duration-300 select-all ${
                      line.trim() 
                        ? 'text-neutral-400 hover:text-white hover:pl-4 border-l-2 border-transparent hover:border-[#FF007F]/40' 
                        : 'h-10'
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
    <div className="flex items-center gap-4 bg-neutral-900/50 border border-neutral-800 px-5 py-3 transition-colors hover:bg-neutral-800 group min-w-[160px]">
      <div style={{ color: accent }} className="group-hover:scale-110 transition-transform">{icon}</div>
      <div className="text-left border-l border-neutral-800 pl-4">
        <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1 font-bold">{label}</p>
        <p className="text-[12px] font-mono text-neutral-100 uppercase tracking-wider font-bold">{value}</p>
      </div>
    </div>
  );
};
