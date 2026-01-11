
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Cpu, Database, Activity, Clock, 
  Wifi, ShieldAlert, Code, X, ChevronRight,
  Lock, Zap, Play, Pause
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext.tsx';
import { parseTrackMetadata } from '../utils/metadataParser.ts';
import { supabase } from '../services/supabaseClient.ts';

interface LogEntry {
  id: number;
  text: string;
  type: 'info' | 'error' | 'success' | 'warning';
  timestamp: string;
}

interface TerminalViewProps {
  onClose: () => void;
}

const stringToHex = (str: string) => {
  return str
    .split('')
    .map(c => c.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0'))
    .join(' ')
    .match(/.{1,24}/g)
    ?.join('\n') || '0x00';
};

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

const SYSTEM_MESSAGES = [
  "BUFFERING_AUDIO_STREAM...",
  "NEURAL_LINK_ESTABLISHED",
  "DECRYPTING_VIRTUAL_MEMORY...",
  "CALIBRATING_SENSORS",
  "PROTOCOL_GAS_v4_ACTIVE",
  "SYNCING_WITH_VAULT_NODE_01"
];

export const TerminalView: React.FC<TerminalViewProps> = ({ onClose }) => {
  const { currentSong, isPlaying, progress, duration, togglePlay } = usePlayer();
  const [time, setTime] = useState(new Date().toISOString());
  const [heap, setHeap] = useState(randomInt(40, 52));
  const [visualizerBars, setVisualizerBars] = useState(Array(12).fill(2));
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [commandInput, setCommandInput] = useState('');
  const [fetchedLyrics, setFetchedLyrics] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const lyricsScrollRef = useRef<HTMLDivElement>(null);

  // Fetch lyrics if not present
  useEffect(() => {
    const loadLyrics = async () => {
      if (currentSong && !currentSong.lyrics && !fetchedLyrics && !isFetching) {
        setIsFetching(true);
        const { data } = await supabase
          .from('songs')
          .select('lyrics')
          .eq('id', currentSong.id)
          .single();
        
        if (data?.lyrics) {
          setFetchedLyrics(data.lyrics);
          addLog(`DATA_FETCH_SUCCESS: LYRICS_RETRIEVED_FOR_${currentSong.id}`, 'success');
        } else {
          addLog(`DATA_FETCH_ERROR: NO_LYRICS_FOUND_IN_VAULT`, 'error');
        }
        setIsFetching(false);
      }
    };
    loadLyrics();
  }, [currentSong]);

  const addLog = (text: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev.slice(-49), {
      id: Date.now() + Math.random(),
      text,
      type,
      timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false })
    }]);
  };

  // Background activity simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));
      if (Math.random() > 0.8) setHeap(randomInt(40, 55));
      if (Math.random() > 0.95) {
        addLog(SYSTEM_MESSAGES[randomInt(0, SYSTEM_MESSAGES.length - 1)]);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setVisualizerBars(prev => prev.map(() => randomInt(1, 8)));
    }, 150);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  useEffect(() => {
    if (lyricsScrollRef.current) lyricsScrollRef.current.scrollTop = lyricsScrollRef.current.scrollHeight;
  }, [currentSong?.lyrics, fetchedLyrics, progress]);

  const handleCommandSubmit = (e: React.FormEvent | React.KeyboardEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!commandInput.trim()) return;

    addLog(`USR_CMD: ${commandInput.toUpperCase()}`, 'success');
    
    // Easter eggs / Basic commands
    const cmd = commandInput.toLowerCase().trim();
    if (cmd === 'clear') setLogs([]);
    if (cmd === 'help') addLog("AVAILABLE: CLEAR, STATUS, INFO, EXIT", "warning");
    if (cmd === 'exit') onClose();
    if (cmd === 'play') if (!isPlaying) togglePlay();
    if (cmd === 'pause') if (isPlaying) togglePlay();

    setCommandInput('');
  };

  const techData = useMemo(() => currentSong ? parseTrackMetadata(currentSong) : null, [currentSong]);
  const hexTitle = useMemo(() => currentSong ? stringToHex(currentSong.title) : 'NULL', [currentSong]);
  
  const lyricLines = useMemo(() => {
    const raw = currentSong?.lyrics || fetchedLyrics;
    if (!raw) return isFetching ? ["DECRYPTING_SIGNAL..."] : ["WAITING_FOR_DATA_STREAM..."];
    return raw.split('\n').filter(l => l.trim() !== "");
  }, [currentSong, fetchedLyrics, isFetching]);

  // Lyric highlighting logic based on duration
  const activeLineIndex = useMemo(() => {
    if (duration <= 0) return -1;
    const ratio = progress / duration;
    return Math.floor(ratio * lyricLines.length);
  }, [progress, duration, lyricLines.length]);

  if (!currentSong) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black text-neutral-400 font-mono selection:bg-[#FF007F]/30 overflow-hidden flex flex-col p-2 md:p-4 gap-2">
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-[210]"></div>

      <header className="h-14 shrink-0 border border-neutral-800 bg-neutral-900/20 backdrop-blur-md flex items-center justify-between px-6 relative overflow-hidden">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#00FF41] animate-pulse shadow-[0_0_8px_#00FF41]' : 'bg-red-600'}`}></div>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase">
              STATUS: <span className={isPlaying ? 'text-[#00FF41]' : 'text-red-600'}>{isPlaying ? 'CONNECTED' : 'STANDBY'}</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-neutral-600">
            <Cpu size={14} />
            <span className="text-[9px] font-bold uppercase tracking-widest">HEAP: {heap}MB</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-neutral-500">
            <Clock size={14} />
            <span className="text-[10px] font-bold tabular-nums">{time} UTC</span>
          </div>
          <button 
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-1.5 border border-neutral-800 hover:border-[#FF007F] hover:text-[#FF007F] transition-all group/btn"
          >
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase">[ SYS_EXIT ]</span>
            <X size={14} className="group-hover/btn:rotate-90 transition-transform" />
          </button>
        </div>
      </header>

      <div className="flex-grow flex flex-col md:flex-row gap-2 overflow-hidden">
        <section className="flex-[6] border border-neutral-800 bg-[#050505] flex flex-col overflow-hidden relative">
          <div className="h-10 border-b border-neutral-800 flex items-center px-4 justify-between bg-neutral-950/50">
            <div className="flex items-center gap-3">
              <Terminal size={14} className="text-[#FF007F]" />
              <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-[#FF007F]">FRAGMENT_LYRIC_DECODER</span>
            </div>
            <span className="text-[8px] text-neutral-700 font-bold uppercase tracking-[0.2em]">Buffer: 256kbps</span>
          </div>

          <div 
            ref={lyricsScrollRef}
            className="flex-grow p-6 overflow-y-auto space-y-3 scrollbar-hide"
          >
            <AnimatePresence initial={false}>
              {lyricLines.map((line, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ 
                    opacity: idx < activeLineIndex ? 0.3 : idx === activeLineIndex ? 1 : 0.6, 
                    x: 0,
                    scale: idx === activeLineIndex ? 1.02 : 1
                  }}
                  className={`flex gap-4 font-mono text-[10px] md:text-[12px] leading-relaxed transition-colors ${idx === activeLineIndex ? 'text-white' : ''}`}
                >
                  <span className="text-neutral-700 shrink-0 select-none">
                    [{idx.toString().padStart(3, '0')}]
                  </span>
                  <span className={`${idx === activeLineIndex ? 'text-[#FF007F]' : 'text-[#7000FF]'} shrink-0 font-bold tracking-tighter`}>
                    SIGNAL_RX:
                  </span>
                  <span className="uppercase tracking-wide">
                    {line}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <form onSubmit={handleCommandSubmit} className="h-12 border-t border-neutral-800 bg-neutral-950/50 flex items-center px-4 gap-4">
             <ChevronRight size={14} className="text-[#FF007F] animate-pulse" />
             <input 
               type="text" 
               value={commandInput}
               onChange={(e) => setCommandInput(e.target.value)}
               placeholder="ENTER COMMAND..."
               className="bg-transparent border-none outline-none text-[10px] tracking-[0.2em] font-bold w-full placeholder:text-neutral-800 text-[#FF007F]"
               autoFocus
             />
          </form>
        </section>

        <section className="flex-[4] flex flex-col gap-2 overflow-hidden">
          <div className="flex-[3] border border-neutral-800 bg-[#080808] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-neutral-900 flex items-center gap-3">
              <Activity size={14} className="text-[#00FF41]" />
              <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-[#00FF41]">SYSTEM_LOGS</span>
            </div>
            <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto font-mono text-[9px] space-y-1.5 scrollbar-hide">
              {logs.map(log => (
                <div key={log.id} className="flex gap-3">
                  <span className="text-neutral-700">[{log.timestamp}]</span>
                  <span className={`
                    ${log.type === 'error' ? 'text-red-500' : ''}
                    ${log.type === 'warning' ? 'text-yellow-500' : ''}
                    ${log.type === 'success' ? 'text-green-500' : ''}
                    ${log.type === 'info' ? 'text-[#00FF41]/60' : ''}
                  `}>
                    {log.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-[2] border border-neutral-800 bg-[#080808] p-4 flex flex-col">
            <div className="flex items-center gap-3 mb-4 border-b border-neutral-900 pb-2">
              <Database size={14} className="text-[#7000FF]" />
              <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-[#7000FF]">ARTIFACT_METADATA</span>
            </div>
            
            <div className="space-y-3">
               {[
                 { k: "Title", v: currentSong.title },
                 { k: "Engineers", v: techData?.producers.value || "UNKNOWN" },
                 { k: "Tempo", v: techData?.tempo.value || "AUTO" },
                 { k: "Memory_Node", v: currentSong.id.slice(0, 8) }
               ].map(item => (
                 <div key={item.k} className="flex justify-between border-b border-neutral-900/50 pb-1">
                   <span className="text-[9px] uppercase font-bold text-neutral-600">{item.k}:</span>
                   <span className="text-[10px] uppercase font-bold text-neutral-300 truncate max-w-[150px]">{item.v}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="flex-1 border border-neutral-800 bg-[#080808] p-4 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-4">
               <span className="text-[8px] font-bold text-neutral-600 tracking-[0.3em]">WAVE_SIGNAL</span>
               <Activity size={12} className="text-[#FF007F]" />
            </div>
            <div className="flex items-end justify-center gap-1 h-12 md:h-16">
              {visualizerBars.map((v, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                  {Array(8).fill(0).map((_, idx) => (
                    <span 
                      key={idx}
                      className={`text-[12px] leading-[6px] transition-colors duration-200 ${8 - idx <= v ? 'text-[#FF007F]' : 'text-neutral-900'}`}
                    >
                      {8 - idx <= v ? '█' : '▒'}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="h-14 border border-neutral-800 bg-neutral-950 flex items-center justify-around">
             <button onClick={() => togglePlay()} className="p-3 text-neutral-500 hover:text-white transition-colors">
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
             </button>
             <div className="h-4 w-px bg-neutral-800"></div>
             <div className="flex items-center gap-2">
                <Zap size={14} className="text-[#7000FF]" fill="currentColor" />
                <span className="text-[9px] font-bold tracking-widest text-[#7000FF]">GAS_OS_ACTIVE</span>
             </div>
          </div>
        </section>
      </div>

      <footer className="h-8 shrink-0 flex items-center justify-between px-4 bg-neutral-950 border border-neutral-800">
         <div className="flex gap-6">
            <span className="text-[7px] font-mono text-neutral-700 tracking-[0.4em] uppercase">Protocol: Goth-Angel-Sinner-V4</span>
            <span className="text-[7px] font-mono text-neutral-700 tracking-[0.4em] uppercase">Node: SB-ARCHIVE-01</span>
         </div>
         <div className="flex items-center gap-2">
            <ShieldAlert size={10} className="text-[#FF007F]" />
            <span className="text-[7px] text-[#FF007F] font-bold uppercase tracking-widest">Auth: SandroBreaker</span>
         </div>
      </footer>
    </div>
  );
};
