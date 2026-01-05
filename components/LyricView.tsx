
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Calendar, User, Activity } from 'lucide-react';
import { Song } from '../types.ts';
import { usePlayer } from '../context/PlayerContext.tsx';

interface LyricViewProps {
  song: Song;
  onClose: () => void;
}

export const LyricView: React.FC<LyricViewProps> = ({ song, onClose }) => {
  const [selectedText, setSelectedText] = useState('');
  const { playSong, currentSong } = usePlayer();
  
  // Auto-play song when entering lyric view if it's not already playing
  useEffect(() => {
    if (song.video_url && currentSong?.id !== song.id) {
      playSong(song);
    }
  }, [song, currentSong, playSong]);

  const MotionDiv = motion.div as any;

  const handleTextSelect = () => {
    const selection = window.getSelection()?.toString();
    if (selection) setSelectedText(selection);
  };

  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black overflow-hidden flex flex-col"
    >
      {/* 1. DYNAMIC AMBIENT BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center scale-110 blur-[120px] opacity-40 transition-all duration-1000"
          style={{ backgroundImage: `url(${song.image_url})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#050505]/90 to-black"></div>
      </div>

      {/* STICKY HEADER */}
      <header className="relative z-20 p-6 flex justify-between items-center backdrop-blur-sm border-b border-white/5">
        <button 
          onClick={onClose}
          className="group p-3 bg-white/5 hover:bg-[#FF007F]/20 border border-white/10 rounded-full transition-all duration-500"
        >
          <X className="w-5 h-5 text-neutral-400 group-hover:text-[#FF007F] group-hover:scale-110" />
        </button>
        
        <div className="flex flex-col items-center">
          <span className="font-mono text-[8px] text-neutral-500 tracking-[0.5em] uppercase mb-1">Now Preserving</span>
          <div className="flex items-center gap-3">
             <div className="w-6 h-px bg-gradient-to-r from-transparent to-[#FF007F]"></div>
             <span className="font-serif-classic text-[10px] text-white tracking-[0.3em] uppercase">{song.album || 'Single'}</span>
             <div className="w-6 h-px bg-gradient-to-l from-transparent to-[#FF007F]"></div>
          </div>
        </div>

        <button 
          className="p-3 bg-white/5 hover:bg-[#7000FF]/20 border border-white/10 rounded-full transition-all duration-500 text-neutral-400 hover:text-[#7000FF]"
          onClick={() => alert('Artifact metadata synced with browser context.')}
        >
          <Share2 className="w-5 h-5" />
        </button>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="relative z-10 flex-grow overflow-y-auto scrollbar-hide flex flex-col items-center pt-20 pb-48">
        
        {/* TITULAR SECTION */}
        <MotionDiv 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-24 px-6"
        >
          <h1 className="font-gothic text-6xl md:text-8xl lg:text-9xl mb-4 neon-text-pink drop-shadow-[0_0_15px_rgba(255,0,127,0.3)]">
            {song.title}
          </h1>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <GlassTag icon={<User size={12}/>} label="Produced by" value={song.metadata?.producer || "N/A"} color="pink" />
            <GlassTag icon={<Activity size={12}/>} label="Frequency" value={`${song.metadata?.bpm || '??'} BPM`} color="purple" />
            <GlassTag icon={<Calendar size={12}/>} label="Dated" value={song.release_date?.split('-')[0] || 'Unknown'} color="pink" />
          </div>
        </MotionDiv>

        {/* LYRICS: THE FLOATING MANUSCRIPT */}
        <div 
          className="max-w-3xl w-full px-8 md:px-12"
          onMouseUp={handleTextSelect}
        >
          <MotionDiv 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1.2 }}
            className="space-y-8 text-center"
          >
            {song.lyrics?.split('\n').map((line, i) => (
              <p 
                key={i} 
                className={`text-xl md:text-3xl font-light leading-relaxed tracking-tight transition-all duration-700 select-all ${
                  line.trim() 
                    ? 'text-zinc-300 hover:text-white hover:scale-[1.02] cursor-default' 
                    : 'h-12'
                }`}
              >
                {line}
              </p>
            ))}
          </MotionDiv>
        </div>
      </div>

      {/* SHARE CARD FLOATER */}
      <AnimatePresence>
        {selectedText && (
          <MotionDiv
            initial={{ y: 100, x: "-50%", opacity: 0 }}
            animate={{ y: 0, x: "-50%", opacity: 1 }}
            exit={{ y: 100, x: "-50%", opacity: 0 }}
            className="fixed bottom-32 left-1/2 bg-black/80 backdrop-blur-xl border border-[#FF007F]/50 px-8 py-4 flex items-center gap-6 z-[110] shadow-[0_0_40px_rgba(255,0,127,0.2)]"
          >
            <div className="flex flex-col">
               <span className="text-[8px] font-mono text-[#FF007F] uppercase tracking-[0.3em] mb-1">Selected Verse</span>
               <p className="text-xs font-mono text-white max-w-[200px] truncate italic">"{selectedText}"</p>
            </div>
            <button 
              className="flex items-center gap-2 bg-[#FF007F] text-white px-6 py-2 text-[10px] font-bold hover:brightness-125 transition-all uppercase tracking-[0.2em]"
              onClick={() => {
                alert('Sentiment Card Generated for: ' + selectedText);
                setSelectedText('');
              }}
            >
              Share Card
            </button>
            <button onClick={() => setSelectedText('')} className="text-neutral-500 hover:text-white transition-colors">
              <X size={16} />
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
    <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 hover:border-white/20 transition-colors">
      <div style={{ color: accent }}>{icon}</div>
      <div className="text-left">
        <p className="text-[7px] font-mono text-neutral-500 uppercase tracking-widest">{label}</p>
        <p className="text-[10px] font-mono text-white uppercase tracking-wider">{value}</p>
      </div>
    </div>
  );
};
