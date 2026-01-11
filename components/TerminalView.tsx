
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../context/PlayerContext.tsx';
import { Terminal, Cpu, Database, Wifi, ShieldAlert, Code, X } from 'lucide-react';

interface LogEntry {
  id: number;
  text: string;
  type: 'info' | 'error' | 'success' | 'warning';
  timestamp: string;
}

interface TerminalViewProps {
  onClose: () => void;
}

const LOG_MESSAGES = [
  "ACCESSING_MEMORY_ADDRESS_0x4F...",
  "BUFFERING_AUDIO_STREAM_LOCAL_NODE...",
  "DECRYPTING_LYRIC_FRAGMENTS...",
  "NEURAL_LINK_ESTABLISHED...",
  "PARSING_METADATA_HEADER...",
  "CALIBRATING_SENSORY_OUTPUT...",
  "SYNCHRONIZING_CORE_CLOCK...",
  "PROTOCOL_GAS_ACTIVE...",
  "FETCHING_ARTIFACT_FROM_VAULT...",
  "RECONSTRUCTING_DIGITAL_MEMORY...",
  "FILTERING_NIHLISTIC_SENTIMENT...",
  "BYPASSING_ANALOG_LIMITATIONS...",
];

export const TerminalView: React.FC<TerminalViewProps> = ({ onClose }) => {
  const { currentSong } = usePlayer();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const MotionDiv = motion.div as any;

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => {
        const nextId = prev.length > 0 ? prev[prev.length - 1].id + 1 : 0;
        const randomMsg = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
        const type = Math.random() > 0.9 ? 'error' : Math.random() > 0.8 ? 'warning' : 'info';
        
        const newEntry: LogEntry = {
          id: nextId,
          text: type === 'error' ? `ERROR: SEGMENTATION_FAULT_AT_${(Math.random() * 0xFFF).toString(16).toUpperCase()}` : randomMsg,
          type,
          timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false })
        };
        
        const updated = [...prev, newEntry];
        return updated.slice(-100); // Keep last 100 entries
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const jsonContent = useMemo(() => {
    if (!currentSong) return { status: "IDLE", signal: "NONE" };
    return {
      artifact: currentSong.title,
      album: currentSong.album || currentSong.metadata?.album || "Single",
      metadata: currentSong.metadata || {},
      release: currentSong.release_date,
      bpm: currentSong.bpm || currentSong.metadata?.bpm || 0,
      id: currentSong.id
    };
  }, [currentSong]);

  const formatJSON = (obj: any, indent = 0): React.ReactNode[] => {
    const elements: React.ReactNode[] = [];
    const spacing = "  ".repeat(indent);

    Object.entries(obj).forEach(([key, value], idx, arr) => {
      const isLast = idx === arr.length - 1;
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        elements.push(
          <div key={key}>
            <span className="text-neutral-500">{spacing}</span>
            <span className="text-[#FF007F]">"{key}"</span>: <span className="text-neutral-400">{'{'}</span>
            {formatJSON(value, indent + 1)}
            <span className="text-neutral-400">{spacing}{'}'}{!isLast ? ',' : ''}</span>
          </div>
        );
      } else {
        elements.push(
          <div key={key}>
            <span className="text-neutral-500">{spacing}</span>
            <span className="text-[#FF007F]">"{key}"</span>:{" "}
            <span className={typeof value === 'number' ? 'text-[#7000FF]' : 'text-[#00FF41]'}>
              {typeof value === 'string' ? `"${value}"` : String(value)}
            </span>
            {!isLast ? <span className="text-neutral-400">,</span> : ""}
          </div>
        );
      }
    });

    return elements;
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black text-[#00FF41] font-mono selection:bg-[#00FF41]/20 overflow-hidden flex flex-col md:flex-row animate-in fade-in duration-500">
      {/* Botão de Fechar Flutuante (Mobile/Geral) */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-[210] flex items-center gap-3 px-4 py-2 bg-neutral-900/80 border border-neutral-800 hover:border-[#FF007F] hover:text-[#FF007F] transition-all group"
      >
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase">[ SYS_EXIT ]</span>
        <X size={14} className="group-hover:rotate-90 transition-transform" />
      </button>

      {/* Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.07] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-50"></div>
      
      {/* Header Mobile Only */}
      <div className="md:hidden p-4 border-b border-neutral-900 bg-black flex items-center justify-between">
         <span className="text-[10px] tracking-widest font-bold text-neutral-500">TERMINAL_V1.0.4</span>
         <Wifi size={14} className="animate-pulse text-neutral-700" />
      </div>

      {/* Left Column: Live Logs */}
      <div className="flex-1 flex flex-col border-r border-neutral-900 overflow-hidden relative">
        <div className="p-4 bg-neutral-950 border-b border-neutral-900 flex items-center gap-3">
          <Terminal size={14} />
          <span className="text-[9px] font-bold tracking-[0.4em] uppercase">SYSTEM_EXECUTION_LOG</span>
        </div>
        <div 
          ref={scrollRef}
          className="flex-grow p-6 overflow-y-auto space-y-2 scrollbar-hide text-[10px] md:text-[11px]"
        >
          {logs.map((log) => (
            <div key={log.id} className="flex gap-4">
              <span className="text-neutral-700 shrink-0">[{log.timestamp}]</span>
              <span className={`
                ${log.type === 'error' ? 'text-red-500' : ''}
                ${log.type === 'warning' ? 'text-yellow-500' : ''}
                ${log.type === 'success' ? 'text-green-500' : ''}
                ${log.type === 'info' ? 'text-[#00FF41]' : ''}
              `}>
                {log.text}
              </span>
            </div>
          ))}
        </div>
        <div className="absolute bottom-4 left-4 pointer-events-none opacity-20">
          <Cpu size={120} className="text-neutral-900" />
        </div>
      </div>

      {/* Right Column: JSON Metadata */}
      <div className="w-full md:w-[450px] lg:w-[600px] flex flex-col bg-[#050505] overflow-hidden">
        <div className="p-4 bg-neutral-950 border-b border-neutral-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database size={14} className="text-[#FF007F]" />
            <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-[#FF007F]">ARTIFACT_DOSSIER_JSON</span>
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-red-900 opacity-50" />
            <div className="w-2 h-2 rounded-full bg-yellow-900 opacity-50" />
            <div className="w-2 h-2 rounded-full bg-green-900 opacity-50" />
          </div>
        </div>
        
        <div className="flex-grow p-6 md:p-10 overflow-y-auto scrollbar-hide text-[10px] md:text-[12px] leading-relaxed">
           <div className="text-neutral-400">
             <span>{'{'}</span>
             {formatJSON(jsonContent, 1)}
             <span>{'}'}</span>
           </div>

           <div className="mt-12 pt-12 border-t border-neutral-900 space-y-6">
              <div className="flex items-center gap-4 text-neutral-800">
                <Code size={14} className="text-[#7000FF]" />
                <span className="text-[8px] uppercase tracking-[0.5em] font-bold">Encrypted Streams</span>
              </div>
              <div className="p-4 border border-neutral-900 bg-black/40">
                <p className="text-[8px] text-neutral-600 mb-2 uppercase tracking-widest">Digital Signature</p>
                <p className="text-[9px] text-[#7000FF] break-all opacity-50">
                  {currentSong ? btoa(currentSong.id + currentSong.title).slice(0, 64) : "WAITING_FOR_HANDSHAKE..."}
                </p>
              </div>
           </div>
        </div>

        <div className="p-4 bg-neutral-950 border-t border-neutral-900 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <ShieldAlert size={12} className="text-neutral-700" />
              <span className="text-[8px] text-neutral-700 uppercase tracking-widest">Protocol GAS-v4 Operational</span>
           </div>
           <span className="text-[8px] text-neutral-800 uppercase tracking-widest">© 2025 SANDROBREAKER</span>
        </div>
      </div>
    </div>
  );
};
