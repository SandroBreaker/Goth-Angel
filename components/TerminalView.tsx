
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Cpu, Database, Activity, Clock, 
  Wifi, ShieldAlert, Code, X, ChevronRight,
  Lock, Zap, Play, Pause, Globe, Users,
  Layers, MessageSquare, BarChart2, Bot,
  Heart, Radio, Server
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
    }, 25);
    return () => clearInterval(interval);
  }, [isActive, isPast, text]);

  return (
    <MotionDiv
      initial={{ opacity: 0, x: -5 }}
      animate={{ 
        opacity: isPast ? 0.2 : isActive ? 1 : 0.4, 
        x: 0,
        scale: isActive ? 1.02 : 1
      }}
      className={`flex gap-3 md:gap-5 font-mono text-[10px] md:text-[13px] leading-relaxed transition-all ${isActive ? 'text-white' : ''}`}
    >
      <span className="text-neutral-800 shrink-0 select-none font-bold">
        {index.toString().padStart(2, '0')}
      </span>
      <span className={`${isActive ? 'text-[#FF007F]' : 'text-[#7000FF]/40'} shrink-0 font-bold tracking-tighter`}>
        {isActive ? '●' : '○'}
      </span>
      <span className={`uppercase tracking-wide break-all ${isActive ? 'drop-shadow-[0_0_8px_rgba(255,0,127,0.5)]' : ''}`}>
        {displayedText}
        {isActive && !isDone && (
          <MotionSpan 
            animate={{ opacity: [1, 0] }} 
            transition={{ repeat: Infinity, duration: 0.4 }}
            className="inline-block ml-1 bg-[#FF007F] w-2 h-3.5 align-middle"
          />
        )}
      </span>
    </MotionDiv>
  );
};

export const TerminalView: React.FC<TerminalViewProps> = ({ onClose }) => {
  const { currentSong, isPlaying, progress, duration, togglePlay } = usePlayer();
  const [time, setTime] = useState(new Date().toLocaleTimeString('pt-BR'));
  const [trafficCount, setTrafficCount] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [lastConnection, setLastConnection] = useState<string>("BUSCANDO...");
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
          .limit(10);

        if (recentLogs && recentLogs.length > 0) {
          const main = recentLogs[0];
          const loc = main.timezone ? main.timezone.split('/')[1] || main.timezone : 'DESCONHECIDO';
          setLastConnection(`${loc.toUpperCase()} via ${main.platform?.toUpperCase() || 'WEB'}`);

          const newEntries: LogEntry[] = recentLogs.map(l => {
            const bot = isBotUA(l.user_agent);
            return {
              id: Math.random(),
              text: `${bot ? 'SONDA_BOT' : 'SINAL'} RECUPERADO EM ${l.timezone?.split('/')[1] || 'UNK'} • /${l.path.toUpperCase()}`,
              type: bot ? 'bot' : 'info',
              timestamp: new Date(l.created_at).toLocaleTimeString('pt-BR', { hour12: false })
            };
          });
          
          setLogs(prev => {
            const existingIds = new Set(prev.map(e => e.text + e.timestamp));
            const uniqueNew = newEntries.filter(e => !existingIds.has(e.text + e.timestamp));
            return [...prev, ...uniqueNew].slice(-50);
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
    setLogs(prev => [...prev, { id: Date.now() + Math.random(), text, type, timestamp: new Date().toLocaleTimeString('pt-BR', { hour12: false }) }].slice(-50));
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString('pt-BR', { hour12: false })), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    const cmd = commandInput.toLowerCase().trim();
    addLog(`REQUISIÇÃO_USUÁRIO: ${cmd.toUpperCase()}`, 'success');
    if (cmd === 'limpar' || cmd === 'clear') setLogs([]);
    if (cmd === 'dashboard' || cmd === 'painel') setIsDashboardOpen(true);
    if (cmd === 'sair' || cmd === 'exit') onClose();
    if (cmd === 'play' && !isPlaying) togglePlay();
    if (cmd === 'pause' && isPlaying) togglePlay();
    setCommandInput('');
  };

  const lyricLines = useMemo(() => {
    const raw = currentSong?.lyrics || fetchedLyrics;
    if (!currentSong) return ["NÚCLEO_OCIOSO: AGUARDANDO_CONEXÃO", "POR_FAVOR_SELECIONE_UM_ARTEFATO"];
    if (!raw) return isFetching ? ["DECRIPTANDO_SINAL_VOCAL..."] : ["NENHUMA_TRANSCRIÇÃO_LOCALIZADA_NO_COFRE"];
    return raw.split('\n').filter(l => l.trim() !== "");
  }, [currentSong, fetchedLyrics, isFetching]);

  const activeLineIndex = useMemo(() => {
    if (!currentSong || duration <= 0) return -1;
    return Math.floor((progress / duration) * lyricLines.length);
  }, [progress, duration, lyricLines.length]);

  return (
    <div className="fixed inset-0 z-[200] bg-black text-neutral-400 font-mono selection:bg-[#FF007F]/30 overflow-hidden flex flex-col p-2 md:p-6 gap-2">
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] z-[210]"></div>

      <header className="h-14 md:h-16 shrink-0 border border-neutral-800 bg-neutral-900/20 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 shadow-2xl">
        <div className="flex items-center gap-6 md:gap-12">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#FF007F] animate-pulse shadow-[0_0_12px_#FF007F]' : 'bg-neutral-800'}`}></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-white">Núcleo G.A.S</span>
              <span className="text-[7px] text-neutral-600 font-bold uppercase tracking-widest">{isPlaying ? 'TRANSMITINDO' : 'ESCUTANDO'}</span>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-8 border-l border-neutral-800 pl-8">
             <div className="flex flex-col">
               <span className="text-[7px] text-neutral-500 font-bold uppercase tracking-widest mb-0.5">Nós Ativos</span>
               <span className="text-[10px] text-white font-bold">{activeUsers} TERMINAIS</span>
             </div>
             <div className="flex flex-col">
               <span className="text-[7px] text-neutral-500 font-bold uppercase tracking-widest mb-0.5">Tempo Mestre</span>
               <span className="text-[10px] text-white font-bold">{time}</span>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 px-3 py-1 bg-[#FF007F]/5 border border-[#FF007F]/20">
             <ShieldAlert size={12} className="text-[#FF007F]" />
             <span className="text-[8px] text-[#FF007F] font-bold tracking-[0.2em] uppercase">Integridade Segura</span>
          </div>
          <button onClick={onClose} className="p-3 bg-neutral-900/50 hover:bg-[#FF007F]/20 text-neutral-500 hover:text-white transition-all rounded-full group">
            <X size={20} className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>
      </header>

      <nav className="flex md:hidden h-12 border border-neutral-800 bg-neutral-950/40 divide-x divide-neutral-800">
        <MobileTab active={activeSection === 'decoder'} onClick={() => setActiveSection('decoder')} icon={<MessageSquare size={16}/>} label="Vocal" />
        <MobileTab active={activeSection === 'console'} onClick={() => setActiveSection('console')} icon={<Radio size={16}/>} label="Ecos" />
        <MobileTab active={activeSection === 'stats'} onClick={() => setActiveSection('stats')} icon={<Activity size={16}/>} label="Pulso" />
      </nav>

      <div className="flex-grow flex flex-col md:flex-row gap-2 overflow-hidden">
        {/* Fragmentos Vocais (Letras) */}
        <section className={`${activeSection === 'decoder' ? 'flex' : 'hidden'} md:flex flex-[6] border border-neutral-800 bg-[#050505] flex-col overflow-hidden relative shadow-inner`}>
          <div className="h-10 border-b border-neutral-800 flex items-center px-6 justify-between bg-neutral-950/80">
            <div className="flex items-center gap-3">
              <span className="font-gothic text-lg text-[#FF007F]">V</span>
              <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-white">Fragmentos_Vocais</span>
            </div>
            {currentSong && (
               <div className="flex items-center gap-3">
                  <span className="text-[8px] text-neutral-600 font-bold uppercase tracking-widest truncate max-w-[100px]">{currentSong.title}</span>
                  <div className="h-1 w-12 bg-neutral-900 rounded-full overflow-hidden">
                     <div className="h-full bg-[#FF007F]" style={{ width: `${(progress/duration)*100}%` }} />
                  </div>
               </div>
            )}
          </div>

          <div ref={lyricsScrollRef} className="flex-grow p-6 md:p-10 overflow-y-auto space-y-4 md:space-y-6 scrollbar-hide">
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

          <form onSubmit={handleCommandSubmit} className="h-14 border-t border-neutral-800 bg-neutral-950/80 flex items-center px-6 gap-4 group">
             <ChevronRight size={18} className="text-[#FF007F] group-focus-within:translate-x-1 transition-transform" />
             <input 
               type="text" 
               value={commandInput}
               onChange={(e) => setCommandInput(e.target.value)}
               placeholder="DECIFRAR SINAL DA MEMÓRIA..."
               className="bg-transparent border-none outline-none text-[10px] md:text-[12px] tracking-[0.2em] font-bold w-full text-[#FF007F] placeholder:text-neutral-800 uppercase"
             />
          </form>
        </section>

        {/* Setores Laterais */}
        <section className={`${activeSection !== 'decoder' ? 'flex' : 'hidden'} md:flex flex-[4] flex-col gap-2 overflow-hidden`}>
          {/* Ecos de Conexão (Console) */}
          <div className={`${activeSection === 'console' ? 'flex' : 'hidden md:flex'} flex-[3] border border-neutral-800 bg-[#080808] flex-col overflow-hidden`}>
            <div className="h-10 p-4 border-b border-neutral-900 flex items-center gap-3 bg-neutral-950/80">
              <Radio size={14} className="text-[#00FF41]" />
              <span className="font-gothic text-sm text-[#00FF41] mr-1">E</span>
              <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-[#00FF41]">Ecos_de_Conexão</span>
            </div>
            <div className="flex-grow p-4 overflow-y-auto font-mono text-[9px] space-y-2.5 scrollbar-hide">
              {logs.map(log => (
                <div key={log.id} className="flex gap-3 items-start group">
                  <span className="text-neutral-800 shrink-0 font-bold">[{log.timestamp}]</span>
                  <div className="flex items-center gap-2">
                    {log.type === 'bot' ? <Bot size={12} className="text-[#FFB800] shrink-0" /> : <div className="w-1 h-1 rounded-full bg-neutral-800 mt-1" />}
                    <span className={`uppercase tracking-tighter leading-tight ${log.type === 'error' ? 'text-red-500' : log.type === 'success' ? 'text-green-500' : log.type === 'bot' ? 'text-[#FFB800]' : 'text-neutral-400 group-hover:text-white transition-colors'}`}>
                      {log.text}
                    </span>
                  </div>
                </div>
              ))}
              {logs.length === 0 && <p className="text-neutral-800 text-[9px] uppercase tracking-widest italic mt-4 text-center">Escaneando frequências neurais...</p>}
            </div>
          </div>

          {/* Pulso do Arquivo (Stats) */}
          <div className={`${activeSection === 'stats' ? 'flex' : 'hidden md:flex'} flex-[2] flex-col gap-2 overflow-hidden`}>
            <div className="flex-grow border border-neutral-800 bg-[#080808] p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-white">
                <Database size={120} />
              </div>

              <div className="flex items-center gap-3 mb-6 border-b border-neutral-900 pb-3">
                <Server size={14} className="text-[#7000FF]" />
                <span className="font-gothic text-sm text-[#7000FF] mr-1">P</span>
                <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-[#7000FF]">Pulso_do_Arquivo</span>
              </div>
              
              <div className="space-y-3 relative z-10">
                 <StatRow label="Artefato" value={currentSong?.title || "OCIOSO"} />
                 <StatRow label="Alcance Total" value={`${trafficCount.toLocaleString()} SINAIS`} />
                 <StatRow label="Nós ao Vivo" value={`${activeUsers} TERMINAIS`} />
                 <StatRow label="Fonte" value={lastConnection} />
              </div>
            </div>

            <div className="h-14 border border-neutral-800 bg-neutral-950 flex items-center justify-around px-6">
               <button onClick={togglePlay} className={`p-3 transition-all ${currentSong ? 'text-neutral-500 hover:text-[#FF007F] hover:scale-110' : 'text-neutral-800 cursor-not-allowed'}`}>
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
               </button>
               <button onClick={() => setIsDashboardOpen(true)} className="p-3 text-neutral-500 hover:text-[#7000FF] transition-all hover:scale-110">
                  <Globe size={18} />
               </button>
               <div className="flex items-center gap-2 border-l border-neutral-800 pl-6 ml-2">
                  <Zap size={14} className="text-[#FF007F]" />
                  <span className="text-[8px] font-bold tracking-[0.3em] text-neutral-500 uppercase">G.A.S_v4</span>
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
    <button onClick={onClick} className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all relative ${active ? 'bg-[#FF007F]/5 text-[#FF007F]' : 'text-neutral-600'}`}>
      {icon}
      <span className="text-[8px] font-bold uppercase tracking-widest">{label}</span>
      {active && <MotionDiv layoutId="activeMobileTab" className="absolute bottom-0 h-0.5 bg-[#FF007F] w-full" />}
    </button>
  );
};

const StatRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center text-[8px] md:text-[9px] uppercase font-bold tracking-widest border-b border-neutral-900/50 pb-1.5">
    <span className="text-neutral-600">{label}</span>
    <span className="text-neutral-300 truncate max-w-[140px] text-right">{value}</span>
  </div>
);
