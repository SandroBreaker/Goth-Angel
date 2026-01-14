
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Cpu, Database, Activity, Clock, 
  Wifi, ShieldAlert, Code, X, ChevronRight,
  Lock, Zap, Play, Pause, Globe, Users,
  Layers, MessageSquare, BarChart2, Bot
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext.tsx';
import { supabase } from '../services/supabaseClient.ts';
import { DashboardView } from './DashboardView.tsx';

interface LogEntry {
  id: number;
  text: string;
  type: 'info' | 'error' | 'success' | 'warning' | 'bot';
  timestamp: string;
}

interface TerminalViewProps {
  onClose: () => void;
}

const isBotUA = (ua?: string) => {
  if (!ua) return false;
  const botPatterns = ['bot', 'spider', 'crawl', 'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 'yandexbot', 'applebot', 'facebot', 'twitterbot', 'discordbot'];
  return botPatterns.some(pattern => ua.toLowerCase().includes(pattern));
};

const TypewriterLine: React.FC<{ 
  text: string; 
  index: number; 
  isActive: boolean; 
  isPast: boolean;
}> = ({ text, index, isActive, isPast }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);
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
    }, 35);
    return () => clearInterval(interval);
  }, [isActive, isPast, text]);

  return (
    <MotionDiv
      initial={{ opacity: 0, x: -5 }}
      animate={{ 
        opacity: isPast ? 0.3 : isActive ? 1 : 0.6, 
        x: 0,
        scale: isActive ? 1.01 : 1
      }}
      className={`flex gap-2 md:gap-4 font-mono text-[9px] md:text-[12px] leading-relaxed transition-all ${isActive ? 'text-white' : ''}`}
    >
      <span className="text-neutral-800 shrink-0 select-none">
        [{index.toString().padStart(3, '0')}]
      </span>
      <span className={`${isActive ? 'text-[#FF007F]' : 'text-[#7000FF]'} shrink-0 font-bold tracking-tighter`}>
        SIG:
      </span>
      <span className="uppercase tracking-wide break-all">
        {displayedText}
        {isActive && !isDone && (
          <MotionSpan 
            animate={{ opacity: [1, 0] }} 
            transition={{ repeat: Infinity, duration: 0.4 }}
            className="inline-block ml-1 bg-[#FF007F] w-1.5 h-2.5 md:w-2 md:h-3 align-middle"
          />
        )}
      </span>
    </MotionDiv>
  );
};

export const TerminalView: React.FC<TerminalViewProps> = ({ onClose }) => {
  const { currentSong, isPlaying, progress, duration, togglePlay } = usePlayer();
  const [time, setTime] = useState(new Date().toISOString());
  const [trafficCount, setTrafficCount] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [lastConnection, setLastConnection] = useState<string>("SEARCHING...");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [commandInput, setCommandInput] = useState('');
  const [fetchedLyrics, setFetchedLyrics] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'decoder' | 'console' | 'stats'>('decoder');
  
  const lyricsScrollRef = useRef<HTMLDivElement>(null);
  const MotionDiv = motion.div as any;

  useEffect(() => {
    const fetchAccessStats = async () => {
      try {
        const { count: totalCount } = await supabase.from('access_logs_goth').select('*', { count: 'exact', head: true });
        if (totalCount !== null) setTrafficCount(totalCount);
        const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
        const { count: recentCount } = await supabase.from('access_logs_goth').select('id', { count: 'exact', head: true }).gt('created_at', fiveMinsAgo);
        if (recentCount !== null) setActiveUsers(recentCount);
        
        const { data: recentLogs } = await supabase
          .from('access_logs_goth')
          .select('platform, timezone, path, created_at, user_agent')
          .order('created_at', { ascending: false })
          .limit(5);

        if (recentLogs && recentLogs.length > 0) {
          const main = recentLogs[0];
          const loc = main.timezone ? main.timezone.split('/')[1] || main.timezone : 'UNKNOWN';
          setLastConnection(`${loc.toUpperCase()} [${main.platform?.toUpperCase().slice(0, 3) || 'WEB'}]`);

          const newEntries: LogEntry[] = recentLogs.map(l => {
            const bot = isBotUA(l.user_agent);
            return {
              id: Math.random(),
              text: `${bot ? '[BOT_SCAN]' : 'REQ_NODE'} FROM ${l.timezone?.split('/')[1] || 'UNK'} -> /${l.path.toUpperCase()}`,
              type: bot ? 'bot' : 'info',
              timestamp: new Date(l.created_at).toLocaleTimeString('en-GB', { hour12: false })
            };
          });
          
          setLogs(prev => {
            const existingIds = new Set(prev.map(e => e.text + e.timestamp));
            const uniqueNew = newEntries.filter(e => !existingIds.has(e.text + e.timestamp));
            return [...prev, ...uniqueNew].slice(-40);
          });
        }
      } catch (err) { console.warn('Telemetry sync error'); }
    };
    fetchAccessStats();
    const interval = setInterval(fetchAccessStats, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadLyrics = async () => {
      if (currentSong && !currentSong.lyrics && !fetchedLyrics && !isFetching) {
        setIsFetching(true);
        const { data } = await supabase.from('songs').select('lyrics').eq('id', currentSong.id).single();
        if (data?.lyrics) setFetchedLyrics(data.lyrics);
        setIsFetching(false);
      }
    };
    if (currentSong) loadLyrics();
    else setFetchedLyrics(null);
  }, [currentSong]);

  const addLog = (text: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev, { id: Date.now() + Math.random(), text, type, timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }) }].slice(-40));
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString('en-GB', { hour12: false })), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    const cmd = commandInput.toLowerCase().trim();
    addLog(`USR_CMD: ${cmd.toUpperCase()}`, 'success');
    if (cmd === 'clear') setLogs([]);
    if (cmd === 'dashboard') setIsDashboardOpen(true);
    if (cmd === 'exit') onClose();
    if (cmd === 'play' && !isPlaying) togglePlay();
    if (cmd === 'pause' && isPlaying) togglePlay();
    setCommandInput('');
  };

  const lyricLines = useMemo(() => {
    const raw = currentSong?.lyrics || fetchedLyrics;
    if (!currentSong) return ["SYSTEM_IDLE: AWAITING_SIGNAL", "---------------------------"];
    if (!raw) return isFetching ? ["DECRYPTING_SIGNAL..."] : ["WAITING_FOR_DATA_STREAM..."];
    return raw.split('\n').filter(l => l.trim() !== "");
  }, [currentSong, fetchedLyrics, isFetching]);

  const activeLineIndex = useMemo(() => {
    if (!currentSong || duration <= 0) return -1;
    return Math.floor((progress / duration) * lyricLines.length);
  }, [progress, duration, lyricLines.length]);

  return (
    <div className="fixed inset-0 z-[200] bg-black text-neutral-400 font-mono selection:bg-[#FF007F]/30 overflow-hidden flex flex-col p-1.5 md:p-4 gap-1.5">
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] z-[210]"></div>

      <header className="h-12 md:h-14 shrink-0 border border-neutral-800 bg-neutral-900/20 backdrop-blur-md flex items-center justify-between px-3 md:px-6">
        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-[#00FF41] animate-pulse shadow-[0_0_8px_#00FF41]' : 'bg-red-600'}`}></div>
            <span className="text-[8px] md:text-[10px] font-bold tracking-widest uppercase truncate max-w-[60px] md:max-w-none">
              {isPlaying ? 'LINKED' : 'IDLE'}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
             <div className="flex items-center gap-1.5 text-neutral-500">
               <Users size={12} />
               <span className="text-[8px] font-bold uppercase tracking-widest">{activeUsers} NODES</span>
             </div>
             <div className="flex items-center gap-1.5 text-neutral-500">
               <Clock size={12} />
               <span className="text-[8px] font-bold uppercase tracking-widest">{time}</span>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <span className="hidden md:block text-[8px] text-[#FF007F] font-bold tracking-[0.4em] uppercase">Security: Active</span>
          <button onClick={onClose} className="p-2 border border-neutral-800 hover:border-[#FF007F] text-neutral-500 hover:text-white transition-all">
            <X size={16} />
          </button>
        </div>
      </header>

      <nav className="flex md:hidden h-10 border border-neutral-800 bg-neutral-950/40">
        <MobileTab active={activeSection === 'decoder'} onClick={() => setActiveSection('decoder')} icon={<MessageSquare size={14}/>} label="Dec" />
        <MobileTab active={activeSection === 'console'} onClick={() => setActiveSection('console')} icon={<Terminal size={14}/>} label="Con" />
        <MobileTab active={activeSection === 'stats'} onClick={() => setActiveSection('stats')} icon={<BarChart2 size={14}/>} label="Sys" />
      </nav>

      <div className="flex-grow flex flex-col md:flex-row gap-1.5 overflow-hidden">
        <section className={`${activeSection === 'decoder' ? 'flex' : 'hidden'} md:flex flex-[6] border border-neutral-800 bg-[#050505] flex-col overflow-hidden relative`}>
          <div className="h-9 border-b border-neutral-800 flex items-center px-4 justify-between bg-neutral-950/50">
            <div className="flex items-center gap-2">
              <Terminal size={12} className="text-[#FF007F]" />
              <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-[#FF007F]">SIGNAL_DECODER</span>
            </div>
          </div>

          <div ref={lyricsScrollRef} className="flex-grow p-4 md:p-6 overflow-y-auto space-y-2 md:space-y-3 scrollbar-hide">
            {lyricLines.map((line, idx) => (
              <TypewriterLine 
                key={currentSong ? `${currentSong.id}-${idx}` : `idle-${idx}`}
                text={line}
                index={idx}
                isActive={idx === activeLineIndex}
                isPast={idx < activeLineIndex}
              />
            ))}
          </div>

          <form onSubmit={handleCommandSubmit} className="h-10 md:h-12 border-t border-neutral-800 bg-neutral-950/50 flex items-center px-4 gap-3">
             <ChevronRight size={14} className="text-[#FF007F]" />
             <input 
               type="text" 
               value={commandInput}
               onChange={(e) => setCommandInput(e.target.value)}
               placeholder="SYS_COMMAND..."
               className="bg-transparent border-none outline-none text-[9px] md:text-[10px] tracking-widest font-bold w-full text-[#FF007F] placeholder:text-neutral-800"
             />
          </form>
        </section>

        <section className={`${activeSection !== 'decoder' ? 'flex' : 'hidden'} md:flex flex-[4] flex-col gap-1.5 overflow-hidden`}>
          <div className={`${activeSection === 'console' ? 'flex' : 'hidden md:flex'} flex-[3] border border-neutral-800 bg-[#080808] flex-col overflow-hidden`}>
            <div className="h-9 p-4 border-b border-neutral-900 flex items-center gap-2 bg-neutral-950/40">
              <Activity size={12} className="text-[#00FF41]" />
              <span className="text-[8px] font-bold tracking-widest uppercase text-[#00FF41]">SYSTEM_CONSOLE</span>
            </div>
            <div className="flex-grow p-3 overflow-y-auto font-mono text-[8px] space-y-1.5 scrollbar-hide">
              {logs.map(log => (
                <div key={log.id} className="flex gap-2 items-start">
                  <span className="text-neutral-700 shrink-0">[{log.timestamp}]</span>
                  <div className="flex items-center gap-1.5">
                    {log.type === 'bot' && <Bot size={10} className="text-[#FFB800] shrink-0" />}
                    <span className={`uppercase tracking-tighter leading-none ${log.type === 'error' ? 'text-red-500' : log.type === 'success' ? 'text-green-500' : log.type === 'bot' ? 'text-[#FFB800]' : 'text-[#00FF41]/60'}`}>
                      {log.text}
                    </span>
                  </div>
                </div>
              ))}
              {logs.length === 0 && <p className="text-neutral-800 text-[8px] uppercase tracking-widest italic mt-2">No terminal data recorded...</p>}
            </div>
          </div>

          <div className={`${activeSection === 'stats' ? 'flex' : 'hidden md:flex'} flex-[2] flex-col gap-1.5 overflow-hidden`}>
            <div className="flex-grow border border-neutral-800 bg-[#080808] p-4 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-3 border-b border-neutral-900 pb-2">
                <Database size={12} className="text-[#7000FF]" />
                <span className="text-[8px] font-bold tracking-widest uppercase text-[#7000FF]">TELEMETRY_NODE</span>
              </div>
              
              <div className="space-y-1.5">
                 <StatRow label="Title" value={currentSong?.title || "IDLE"} />
                 <StatRow label="Traffic" value={trafficCount.toLocaleString()} />
                 <StatRow label="Nodes" value={activeUsers.toString()} />
                 <StatRow label="Loc" value={lastConnection} />
              </div>
            </div>

            <div className="h-12 border border-neutral-800 bg-neutral-950 flex items-center justify-around px-4">
               <button onClick={togglePlay} className={`p-2 transition-colors ${currentSong ? 'text-neutral-500 hover:text-white' : 'text-neutral-800 cursor-not-allowed'}`}>
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
               </button>
               <button onClick={() => setIsDashboardOpen(true)} className="p-2 text-neutral-500 hover:text-[#7000FF] transition-colors">
                  <Globe size={16} />
               </button>
               <div className="flex items-center gap-1">
                  <Zap size={12} className="text-[#FF007F]" />
                  <span className="text-[7px] font-bold tracking-widest text-neutral-600">G.A.S_OS</span>
               </div>
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
    </div>
  );
};

const MobileTab = ({ active, onClick, icon, label }: any) => {
  const MotionDiv = motion.div as any;
  return (
    <button onClick={onClick} className={`flex-1 flex items-center justify-center gap-2 border-r last:border-0 border-neutral-800 transition-all ${active ? 'bg-[#FF007F]/10 text-[#FF007F]' : 'text-neutral-600'}`}>
      {icon}
      <span className="text-[8px] font-bold uppercase tracking-widest">{label}</span>
      {active && <MotionDiv layoutId="activeMobileTab" className="absolute bottom-0 h-0.5 bg-[#FF007F] w-full max-w-[40px]" />}
    </button>
  );
};

const StatRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center text-[7px] uppercase font-bold tracking-widest">
    <span className="text-neutral-700">{label}:</span>
    <span className="text-neutral-400 truncate max-w-[100px] text-right">{value}</span>
  </div>
);
