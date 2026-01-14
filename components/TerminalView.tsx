
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Cpu, Database, Activity, Clock, 
  Wifi, ShieldAlert, Code, X, ChevronRight,
  Lock, Zap, Play, Pause, Globe, Users
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext.tsx';
import { parseTrackMetadata } from '../utils/metadataParser.ts';
import { supabase } from '../services/supabaseClient.ts';
import { DashboardView } from './DashboardView.tsx';

interface LogEntry {
  id: number;
  text: string;
  type: 'info' | 'error' | 'success' | 'warning';
  timestamp: string;
}

interface TerminalViewProps {
  onClose: () => void;
}

// Componente para a linha com efeito de digitação/decodificação
const TypewriterLine: React.FC<{ 
  text: string; 
  index: number; 
  isActive: boolean; 
  isPast: boolean;
}> = ({ text, index, isActive, isPast }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);
  // Fix: Casting motion components to any to resolve React 19 type incompatibilities
  const MotionDiv = motion.div as any;
  const MotionSpan = motion.span as any;

  useEffect(() => {
    if (isPast) {
      setDisplayedText(text);
      setIsDone(true);
      return;
    }

    if (!isActive) {
      setDisplayedText('');
      setIsDone(false);
      return;
    }

    // Lógica de digitação para a linha ativa
    let currentIdx = 0;
    setIsDone(false);
    
    const interval = setInterval(() => {
      if (currentIdx < text.length) {
        setDisplayedText(text.substring(0, currentIdx + 1));
        currentIdx++;
      } else {
        setIsDone(true);
        clearInterval(interval);
      }
    }, 45); // Velocidade de digitação (slow terminal feel)

    return () => clearInterval(interval);
  }, [isActive, isPast, text]);

  return (
    // Fix: Using MotionDiv (casted to any) to resolve React 19 type incompatibilities
    <MotionDiv
      initial={{ opacity: 0, x: -5 }}
      animate={{ 
        opacity: isPast ? 0.3 : isActive ? 1 : 0.6, 
        x: 0,
        scale: isActive ? 1.01 : 1
      }}
      className={`flex gap-4 font-mono text-[10px] md:text-[12px] leading-relaxed transition-all ${isActive ? 'text-white' : ''}`}
    >
      <span className="text-neutral-700 shrink-0 select-none">
        [{index.toString().padStart(3, '0')}]
      </span>
      <span className={`${isActive ? 'text-[#FF007F]' : 'text-[#7000FF]'} shrink-0 font-bold tracking-tighter`}>
        SIGNAL_RX:
      </span>
      <span className="uppercase tracking-wide break-all">
        {displayedText}
        {isActive && !isDone && (
          // Fix: Using MotionSpan (casted to any) to resolve React 19 type incompatibilities
          <MotionSpan 
            animate={{ opacity: [1, 0] }} 
            transition={{ repeat: Infinity, duration: 0.4 }}
            className="inline-block ml-1 bg-[#FF007F] w-2 h-3 align-middle"
          />
        )}
      </span>
    </MotionDiv>
  );
};

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

const SYSTEM_MESSAGES = [
  "BUFFERING_AUDIO_STREAM...",
  "NEURAL_LINK_ESTABLISHED",
  "DECRYPTING_VIRTUAL_MEMORY...",
  "CALIBRATING_SENSORS",
  "PROTOCOL_GAS_v4_ACTIVE",
  "SYNCING_WITH_VAULT_NODE_01",
  "HEARTBEAT_STABLE",
  "ARCHIVE_INTEGRITY_VERIFIED"
];

export const TerminalView: React.FC<TerminalViewProps> = ({ onClose }) => {
  const { currentSong, isPlaying, progress, duration, togglePlay, playSong } = usePlayer();
  const [time, setTime] = useState(new Date().toISOString());
  const [trafficCount, setTrafficCount] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [lastConnection, setLastConnection] = useState<string>("SEARCHING...");
  const [visualizerBars, setVisualizerBars] = useState(Array(12).fill(2));
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [commandInput, setCommandInput] = useState('');
  const [fetchedLyrics, setFetchedLyrics] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const lyricsScrollRef = useRef<HTMLDivElement>(null);

  // Monitor Access Logs
  useEffect(() => {
    const fetchAccessStats = async () => {
      try {
        const { count: totalCount } = await supabase
          .from('access_logs_goth')
          .select('*', { count: 'exact', head: true });
        
        if (totalCount !== null) setTrafficCount(totalCount);

        const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
        const { count: recentCount } = await supabase
           .from('access_logs_goth')
           .select('id', { count: 'exact', head: true })
           .gt('created_at', fiveMinsAgo);

        if (recentCount !== null) setActiveUsers(recentCount);

        const { data } = await supabase
          .from('access_logs_goth')
          .select('platform, timezone, path, created_at')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (data) {
          const loc = data.timezone ? data.timezone.split('/')[1] || data.timezone : 'UNKNOWN';
          setLastConnection(`${loc.toUpperCase()} [${data.platform?.toUpperCase().slice(0, 3) || 'WEB'}]`);
          
          if (Math.random() > 0.8) {
             addLog(`INCOMING_CX: ${data.platform?.toUpperCase() || 'USR'} @ ${loc.toUpperCase()} -> ${data.path}`, 'success');
          }
        }
      } catch (err) {
        console.warn('Telemetry sync failed');
      }
    };

    fetchAccessStats();
    const interval = setInterval(fetchAccessStats, 10000);
    return () => clearInterval(interval);
  }, []);

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
    if (currentSong) loadLyrics();
    else setFetchedLyrics(null);
  }, [currentSong]);

  const addLog = (text: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => {
      const newLogs = [...prev, {
        id: Date.now() + Math.random(),
        text,
        type,
        timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false })
      }];
      return newLogs.slice(-49);
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));
      if (Math.random() > 0.95) {
        addLog(SYSTEM_MESSAGES[randomInt(0, SYSTEM_MESSAGES.length - 1)]);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisualizerBars(prev => prev.map(() => isPlaying ? randomInt(1, 8) : randomInt(1, 2)));
    }, 150);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  useEffect(() => {
    if (lyricsScrollRef.current) {
      const activeEl = lyricsScrollRef.current.querySelector('.text-white');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [progress]);

  const handleCommandSubmit = async (e: React.FormEvent | React.KeyboardEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!commandInput.trim()) return;

    addLog(`USR_CMD: ${commandInput.toUpperCase()}`, 'success');
    
    const cmd = commandInput.toLowerCase().trim();
    if (cmd === 'clear') setLogs([]);
    if (cmd === 'help') addLog("AVAILABLE: DASHBOARD, CLEAR, STATUS, PLAY, PAUSE, EXIT", "warning");
    if (cmd === 'exit') onClose();
    
    if (cmd === 'play') {
      if (!currentSong) {
        addLog("ERROR: NO_SOURCE_SELECTED. PLEASE SELECT A TRACK FROM THE ARCHIVE.", "error");
      } else if (!isPlaying) {
        togglePlay();
        addLog("PROTOCOL: IGNITING_AUDIO_CORE", "success");
      }
    }
    
    if (cmd === 'pause') {
      if (isPlaying) {
        togglePlay();
        addLog("PROTOCOL: CORE_SUSPENDED", "warning");
      }
    }
    
    if (cmd === 'dashboard' || cmd === 'status') {
      addLog("INITIATING_DEEP_ANALYTICS_OVERLAY...", "info");
      setIsDashboardOpen(true);
    }

    setCommandInput('');
  };

  const techData = useMemo(() => currentSong ? parseTrackMetadata(currentSong) : null, [currentSong]);
  
  const lyricLines = useMemo(() => {
    const raw = currentSong?.lyrics || fetchedLyrics;
    if (!currentSong) return ["SYSTEM_IDLE: AWAITING_DATA_SOURCE", "AWAITING_SIGNAL...", "---------------------------"];
    if (!raw) return isFetching ? ["DECRYPTING_SIGNAL..."] : ["WAITING_FOR_DATA_STREAM..."];
    return raw.split('\n').filter(l => l.trim() !== "");
  }, [currentSong, fetchedLyrics, isFetching]);

  const activeLineIndex = useMemo(() => {
    if (!currentSong || duration <= 0) return -1;
    const ratio = progress / duration;
    return Math.floor(ratio * lyricLines.length);
  }, [currentSong, progress, duration, lyricLines.length]);

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
          
          <div className="hidden md:flex items-center gap-6">
            <div 
              onClick={() => setIsDashboardOpen(true)}
              className="flex items-center gap-2 text-neutral-500 hover:text-[#00FF41] transition-colors cursor-pointer group" 
              title="Click for detailed dashboard"
            >
              <Users size={14} className={activeUsers > 0 ? "text-[#00FF41] animate-pulse" : ""} />
              <span className="text-[9px] font-bold uppercase tracking-widest group-hover:underline">NODES_ONLINE: {activeUsers}</span>
            </div>
            <div 
              onClick={() => setIsDashboardOpen(true)}
              className="flex items-center gap-2 text-neutral-500 hover:text-[#FF007F] transition-colors cursor-pointer group" 
              title="Click for deep analytics"
            >
              <Globe size={14} />
              <span className="text-[9px] font-bold uppercase tracking-widest group-hover:underline">NET_TRAFFIC: {trafficCount.toLocaleString()}</span>
            </div>
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
            {lyricLines.map((line, idx) => (
              <TypewriterLine 
                key={currentSong ? `${currentSong.id}-${idx}` : `idle-${idx}`}
                text={line}
                index={idx}
                isActive={idx === activeLineIndex || (!currentSong && idx === 0)}
                isPast={idx < activeLineIndex}
              />
            ))}
          </div>

          <form onSubmit={handleCommandSubmit} className="h-12 border-t border-neutral-800 bg-neutral-950/50 flex items-center px-4 gap-4">
             <ChevronRight size={14} className="text-[#FF007F] animate-pulse" />
             <input 
               type="text" 
               value={commandInput}
               onChange={(e) => setCommandInput(e.target.value)}
               placeholder="ENTER COMMAND (TRY 'DASHBOARD')..."
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
                 { k: "Title", v: currentSong?.title || "VOID" },
                 { k: "Memory_Node", v: currentSong?.id.slice(0, 8) || "PENDING" },
                 { k: "Last_Signal", v: lastConnection },
                 { k: "Nodes_Active", v: activeUsers.toString() },
                 { k: "Global_Hits", v: trafficCount.toLocaleString() }
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
             <button 
               onClick={() => {
                 if (currentSong) togglePlay();
                 else addLog("ERROR: NO_SOURCE_SELECTED", "error");
               }} 
               className={`p-3 transition-colors ${currentSong ? 'text-neutral-500 hover:text-white' : 'text-neutral-800 cursor-not-allowed'}`}
             >
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

      <AnimatePresence>
        {isDashboardOpen && (
          <DashboardView 
            onClose={() => setIsDashboardOpen(false)} 
            totalHits={trafficCount}
            activeNodes={activeUsers}
          />
        )}
      </AnimatePresence>

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
