
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, Share2, Music, UserCheck, Clock, Layers } from 'lucide-react';
import { Song } from '../types';

interface LyricViewProps {
  song: Song;
  onClose: () => void;
}

export const LyricView: React.FC<LyricViewProps> = ({ song, onClose }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  const handleTextSelect = () => {
    const selection = window.getSelection()?.toString();
    if (selection) setSelectedText(selection);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-[#050505] overflow-y-auto"
    >
      <div className="sticky top-0 p-6 flex justify-between items-center bg-black/50 backdrop-blur-md">
        <button 
          onClick={onClose}
          className="p-2 hover:bg-neutral-900 rounded-full transition-colors text-neutral-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="text-center flex-1">
          <h2 className="font-serif-classic text-xl tracking-widest neon-text-pink">{song.title}</h2>
          <p className="font-mono text-[10px] text-neutral-500 uppercase">{song.album}</p>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-neutral-900 rounded-full transition-colors text-neutral-400 hover:text-[#7000FF]"
        >
          <Info className="w-6 h-6" />
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 md:py-24 flex gap-12">
        <div className="flex-1" onMouseUp={handleTextSelect}>
          <div className="space-y-6">
            {song.lyrics?.split('\n').map((line, i) => (
              <p 
                key={i} 
                className={`text-2xl md:text-4xl font-light leading-relaxed tracking-tight transition-colors duration-500 ${
                  line.trim() ? 'hover:text-[#FF007F] text-neutral-300' : 'h-8'
                }`}
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Retractable Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="hidden lg:block w-80 h-[calc(100vh-100px)] sticky top-[100px] bg-neutral-950 border border-neutral-900 p-8 overflow-y-auto"
            >
              <h3 className="font-serif-classic text-xs tracking-[0.4em] mb-8 text-[#7000FF]">TECHNICAL_METADATA</h3>
              
              <div className="space-y-8">
                <MetaItem icon={<UserCheck size={14} />} label="PRODUCER" value={song.metadata?.producer || "N/A"} />
                <MetaItem icon={<Layers size={14} />} label="WRITER" value={song.metadata?.writer || "G. Ahr"} />
                <MetaItem icon={<Music size={14} />} label="BPM" value={song.metadata?.bpm?.toString() || "Unknown"} />
                <MetaItem icon={<Clock size={14} />} label="RELEASE" value={song.release_date || "Unknown"} />
              </div>

              <div className="mt-12 pt-12 border-t border-neutral-900">
                <p className="font-mono text-[10px] text-neutral-600 mb-4 uppercase">Sentiment Analysis</p>
                <div className="bg-neutral-900/50 p-4 border border-[#7000FF]/20">
                  <span className="inline-block px-2 py-1 bg-[#7000FF]/20 text-[#7000FF] text-[10px] font-mono rounded mb-2">
                    {song.metadata?.sentiment?.toUpperCase() || "MELANCHOLY"}
                  </span>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Aural density indicates high resonance in lower frequencies, characteristic of the Emo-trap subgenre.
                  </p>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Share Selection UI */}
      <AnimatePresence>
        {selectedText && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-neutral-900 border border-[#FF007F] px-6 py-3 flex items-center gap-4 rounded-none shadow-2xl z-[110]"
          >
            <p className="text-xs font-mono text-white max-w-[200px] truncate">"{selectedText}"</p>
            <button 
              className="flex items-center gap-2 bg-[#FF007F] text-white px-4 py-1 text-[10px] font-bold hover:brightness-110 transition-all uppercase tracking-widest"
              onClick={() => {
                alert('Sentiment Card Generated for: ' + selectedText);
                setSelectedText('');
              }}
            >
              <Share2 size={12} /> Share Card
            </button>
            <button onClick={() => setSelectedText('')} className="text-neutral-500 hover:text-white">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const MetaItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div>
    <div className="flex items-center gap-2 text-neutral-600 mb-1">
      {icon}
      <span className="text-[9px] font-mono tracking-widest uppercase">{label}</span>
    </div>
    <p className="text-sm font-light text-neutral-300 tracking-wide">{value}</p>
  </div>
);
