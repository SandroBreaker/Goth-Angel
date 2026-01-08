
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
    return {
      producer: m.producer || (m as any).prod || song.producer || "N/A",
      bpm: m.bpm || (m as any).tempo || song.bpm || "??",
      year: song.release_date?.split('-')[0] || (m as any).year || "Unknown"
    };
  }, [song]);

  const lyricLines = useMemo(() => song.lyrics?.split('\n') || [], [song.lyrics]);

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
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 pointer-events-none overflow-hidden" 
          style={{ transform: 'translateZ(0)' }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ 
              backgroundImage: `url(${song.image_url})`,
              filter: 'blur(40px)',
              willChange: 'transform'
            }}
          ></div>
        </MotionDiv>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#050505]/95 to-black pointer-events-none z-[1]"></div>

      <header className="relative z-20 p-4 md:p-6 flex justify-between items-center border-b border-white/5 bg-black/20 backdrop-blur-md">
        <button 
          onClick={onClose}
          className="group p-2.5 bg-white/5 hover:bg-[#FF007F]/20 border border-white/10 rounded-full transition-all duration-300"
        >
          <X className="w-5 h-5 text-neutral-400 group-hover:text-[#FF007F]" />
        </button>
        
        <div className="flex flex-col items-center">
          <span className="font-mono text-[7px] text-neutral-500 tracking-[0.5em] uppercase mb-1">Preserving Archive</span>
          <div className="flex items-center gap-3">
             <div className="w-4 h-px bg-[#FF007F]/40"></div>
             <span className="font-serif-classic text-[9px] text-white tracking-[0.3em] uppercase truncate max-w-[150px]">{song.album || 'Single'}</span>
             <div className="w-4 h-px bg-[#FF007F]/40"></div>
          </div>
        </div>

        <button 
          className="p-2.5 bg-white/5 hover:bg-[#7000FF]/20 border border-white/10 rounded-full transition-all duration-300 text-neutral-400 hover:text-[#7000FF]"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert('Fragment location secured in clipboard.');
          }}
        >
          <Share2 className="w-5 h-5" />
        </button>
      </header>

      <div className="relative z-10 flex-grow overflow-y-auto overflow-x-hidden scroll-smooth flex flex-col items-center pt-16 pb-48" style={{ WebkitOverflowScrolling: 'touch' }}>
        
        <AnimatePresence mode="wait">
          <MotionDiv 
            key={song.id}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl flex flex-col items-center"
          >
            <div className="text-center mb-16 px-6">
              <h1 className="font-gothic text-5xl md:text-7xl lg:text-8xl mb-8 neon-text-pink drop-shadow-[0_0_10px_rgba(255,0,127,0.2)] px-4">
                {song.title}
              </h1>

              <div className="flex flex-col items-center gap-6 mb-12">
                {hasDirectAudio ? (
                  <button 
                    onClick={() => isCurrentActive ? togglePlay() : playSong(song)}
                    className="group relative flex items-center gap-4 px-8 py-4 bg-white text-black font-mono text-[10px] font-bold tracking-[0.3em] hover:bg-[#FF007F] hover:text-white transition-all duration-300 shadow-xl"
                  >
                    {isCurrentActive && isPlaying ? (
                      <><Pause size={16} fill="currentColor" /> PAUSAR</>
                    ) : (
                      <><Play size={16} fill="currentColor" /> OUVIR ARTEFATO</>
                    )}
                  </button>
                ) : (
                  <div className="flex items-center gap-3 px-8 py-4 border border-dashed border-neutral-900 text-neutral-600 font-mono text-[9px] uppercase tracking-widest cursor-not-allowed">
                    <Lock size={14} />
                    Frequência Restrita (Somente Texto)
                  </div>
                )}
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <GlassTag icon={<User size={10}/>} label="Produced by" value={metadata.producer} color="pink" />
                <GlassTag icon={<Activity size={10}/>} label="Frequency" value={`${metadata.bpm} BPM`} color="purple" />
                <GlassTag icon={<Calendar size={10}/>} label="Dated" value={metadata.year} color="pink" />
              </div>
            </div>

            <div 
              className="max-w-3xl w-full px-8 md:px-12 mb-20"
              onMouseUp={handleTextSelect}
              style={{ contentVisibility: 'auto' }}
            >
              <div className="flex flex-col gap-6 text-center">
                {lyricLines.map((line, i) => (
                  <p 
                    key={i} 
                    className={`text-lg md:text-2xl font-light leading-relaxed tracking-tight transition-colors duration-200 select-all ${
                      line.trim() 
                        ? 'text-zinc-400 hover:text-white' 
                        : 'h-8'
                    }`}
                    style={{ transform: 'translateZ(0)' }}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </MotionDiv>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedText && (
          <MotionDiv
            initial={{ y: 50, x: "-50%", opacity: 0 }}
            animate={{ y: 0, x: "-50%", opacity: 1 }}
            exit={{ y: 50, x: "-50%", opacity: 0 }}
            className="fixed bottom-24 left-1/2 bg-[#0a0a0a] border border-[#FF007F]/40 px-6 py-4 flex items-center gap-6 z-[110] shadow-2xl"
          >
            <div className="flex flex-col">
               <span className="text-[7px] font-mono text-[#FF007F] uppercase tracking-[0.3em] mb-1">Fragment</span>
               <p className="text-[10px] font-mono text-white max-w-[150px] truncate italic">"{selectedText}"</p>
            </div>
            <button 
              className="flex items-center gap-2 bg-[#FF007F] text-white px-4 py-2 text-[9px] font-bold hover:brightness-110 transition-all uppercase tracking-widest"
              onClick={() => {
                alert('Fragment Card Generated');
                setSelectedText('');
              }}
            >
              Capture
            </button>
            <button onClick={() => setSelectedText('')} className="text-neutral-600 hover:text-white transition-colors">
              <X size={14} />
            </button>
          </MotionDiv>
        )}
      </AnimatePresence>
    </MotionDiv>
  );
};

const GlassTag: React.FC<{ icon: React.ReactNode; label: string; value: string; color: 'pink' | 'purple' }> = ({ 
  icon, label, value, color 
}) => {
  const accent = color === 'pink' ? '#FF007F' : '#7000FF';
  return (
    <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-3 py-1.5 transition-colors hover:bg-white/10 group min-w-[120px]">
      <div style={{ color: accent }} className="group-hover:scale-110 transition-transform">{icon}</div>
      <div className="text-left">
        <p className="text-[6px] font-mono text-neutral-500 uppercase tracking-widest">{label}</p>
        <p className="text-[9px] font-mono text-white uppercase tracking-wider">{value}</p>
      </div>
    </div>
  );
};
