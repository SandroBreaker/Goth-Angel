
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Cpu, Activity, Layout, 
  MapPin, Monitor, Users,
  Layers, Zap, X, ChevronRight, BarChart3, Info, TrendingUp, HardDrive, Terminal as TerminalIcon, MousePointer2
} from 'lucide-react';
import { supabase } from '../services/supabaseClient.ts';

interface AccessData {
  timezone: string;
  platform: string;
  path: string;
  device_memory: number;
  hardware_concurrency: number;
  screen_resolution: string;
  created_at: string;
}

interface DashboardViewProps {
  onClose: () => void;
  totalHits: number;
  activeNodes: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onClose, totalHits, activeNodes }) => {
  const [activeTab, setActiveTab] = useState<'geo' | 'tech' | 'traffic' | 'history'>('geo');
  const [rawLogs, setRawLogs] = useState<AccessData[]>([]);
  const [loading, setLoading] = useState(true);
  const MotionDiv = motion.div as any;

  useEffect(() => {
    const fetchFullMetrics = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('access_logs_goth')
        .select('timezone, platform, path, device_memory, hardware_concurrency, screen_resolution, created_at')
        .order('created_at', { ascending: false })
        .limit(200);
      
      if (data) setRawLogs(data);
      setLoading(false);
    };
    fetchFullMetrics();
  }, []);

  const stats = useMemo(() => {
    const geo: Record<string, number> = {};
    const tech: Record<string, number> = {};
    const paths: Record<string, number> = {};
    const hardware: { cores: number[], memory: number[] } = { cores: [], memory: [] };

    rawLogs.forEach(log => {
      const tz = log.timezone?.split('/')[1] || log.timezone || 'Unknown';
      geo[tz] = (geo[tz] || 0) + 1;
      const plt = log.platform || 'Unknown';
      tech[plt] = (tech[plt] || 0) + 1;
      const p = log.path || 'home';
      paths[p] = (paths[p] || 0) + 1;
      if (log.hardware_concurrency) hardware.cores.push(log.hardware_concurrency);
      if (log.device_memory) hardware.memory.push(log.device_memory);
    });

    const avgCores = hardware.cores.length > 0 ? (hardware.cores.reduce((a, b) => a + b, 0) / hardware.cores.length).toFixed(1) : '---';
    const avgMemory = hardware.memory.length > 0 ? (hardware.memory.reduce((a, b) => a + b, 0) / hardware.memory.length).toFixed(1) : '---';

    return { 
      geo: Object.entries(geo).sort((a, b) => b[1] - a[1]).slice(0, 8),
      tech: Object.entries(tech).sort((a, b) => b[1] - a[1]).slice(0, 8),
      paths: Object.entries(paths).sort((a, b) => b[1] - a[1]).slice(0, 8),
      avgCores,
      avgMemory
    };
  }, [rawLogs]);

  // Simulated temporal data for the Signal History graph
  const trafficHistory = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      intensity: Math.floor(Math.random() * 60) + 20,
      label: `T-${(14 - i) * 5}m`
    }));
  }, [rawLogs]);

  const generatePath = () => {
    const width = 1000;
    const height = 150;
    const padding = 50;
    const step = (width - padding * 2) / (trafficHistory.length - 1);
    return trafficHistory.map((data, i) => {
      const x = padding + i * step;
      const y = height - (data.intensity / 100) * (height - padding);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  return (
    <MotionDiv 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="fixed inset-2 md:inset-6 lg:inset-10 z-[300] bg-black border border-neutral-800 shadow-[0_0_100px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden font-mono"
    >
      <header className="h-16 md:h-20 border-b border-neutral-800 flex items-center justify-between px-4 md:px-8 bg-neutral-900/50 backdrop-blur-3xl">
        <div className="flex items-center gap-3 md:gap-5">
          <div className="p-2 md:p-3 bg-[#FF007F]/10 border border-[#FF007F]/20 text-[#FF007F] shadow-[0_0_15px_rgba(255,0,127,0.2)]">
            <BarChart3 size={20} />
          </div>
          <div>
            <h2 className="text-[11px] md:text-[13px] font-bold tracking-[0.4em] text-white uppercase flex items-center gap-2">
              Neural_Network_Ops <span className="text-[#FF007F] animate-pulse">//</span> Access Intelligence
            </h2>
            <p className="text-[8px] md:text-[9px] text-neutral-500 uppercase tracking-widest mt-1 opacity-60">Monitoramento global em tempo real e telemetria de conexão.</p>
          </div>
        </div>
        <button onClick={onClose} className="p-3 hover:bg-neutral-800 text-neutral-500 hover:text-white transition-all rounded-full group">
          <X size={20} className="group-hover:rotate-90 transition-transform" />
        </button>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-neutral-800 bg-neutral-950/20">
         <MetricBox label="Global_Hits" sub="Total Requests" description="Volume total de acessos." value={totalHits.toLocaleString()} icon={<Globe size={14}/>} color="#FF007F" />
         <MetricBox label="Active_Nodes" sub="Real-time" description="Terminais ativos no sistema." value={activeNodes.toString()} icon={<Users size={14}/>} color="#00FF41" />
         <MetricBox label="Latency_Avg" sub="Response Time" description="Atraso médio do servidor." value="42ms" icon={<Zap size={14}/>} color="#7000FF" />
         <MetricBox label="Security_Lvl" sub="Encryption" description="Integridade dos logs." value="AES-256" icon={<TrendingUp size={14}/>} color="#FFB800" />
      </div>

      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
        <nav className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-neutral-800 bg-neutral-950/40 shrink-0">
          <TabButton active={activeTab === 'geo'} onClick={() => setActiveTab('geo')} icon={<MapPin size={16}/>} label="Geographics" sub="Node Origins" />
          <TabButton active={activeTab === 'tech'} onClick={() => setActiveTab('tech')} icon={<Cpu size={16}/>} label="Hardware Specs" sub="Tech Specs" />
          <TabButton active={activeTab === 'traffic'} onClick={() => setActiveTab('traffic')} icon={<Layout size={16}/>} label="Traffic Flow" sub="Sector Access" />
          <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<Activity size={16}/>} label="Signal History" sub="Telemetria Temporal" />
        </nav>

        <main className="flex-grow p-5 md:p-10 overflow-y-auto custom-scrollbar bg-[#050505] relative">
          <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]" />
          
          <AnimatePresence mode="wait">
            {activeTab === 'history' ? (
              <MotionDiv key="history" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <SectionTitle title="Temporal Signal History" subtitle="Monitoramento de Tráfego" explanation="Visualização da intensidade de requisições enviadas ao servidor nas últimas 2 horas." />
                
                <div className="mb-10 relative w-full aspect-[16/5] bg-neutral-950/40 border border-neutral-900 overflow-hidden">
                   <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                   <svg viewBox="0 0 1000 150" className="w-full h-full drop-shadow-[0_0_20px_rgba(255,0,127,0.4)]">
                     <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }} d={generatePath()} fill="none" stroke="#FF007F" strokeWidth="2" strokeLinecap="round" />
                     {trafficHistory.map((e, i) => (
                       <circle key={i} cx={50 + i * (900/(trafficHistory.length-1))} cy={150 - (e.intensity/100)*100} r="3" fill="#FF007F" className="animate-pulse" />
                     ))}
                   </svg>
                   <div className="absolute bottom-2 left-6 right-6 flex justify-between text-[7px] text-neutral-600 font-bold uppercase tracking-widest">
                      <span>{trafficHistory[0].label}</span>
                      <span>Signal_Flow_Live</span>
                      <span>Now</span>
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-5 border border-neutral-900 bg-neutral-950/50 flex flex-col gap-3">
                    <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">Request Rate</span>
                    <span className="text-xl text-[#FF007F] font-bold tracking-tighter">~{Math.floor(activeNodes * 1.5)} REQ/SEC</span>
                    <div className="h-1 w-full bg-neutral-900"><div className="h-full bg-[#FF007F] w-[45%]" /></div>
                  </div>
                  <div className="p-5 border border-neutral-900 bg-neutral-950/50 flex flex-col gap-3">
                    <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">Server Uptime</span>
                    <span className="text-xl text-[#00FF41] font-bold tracking-tighter">14d 06h 22m</span>
                    <div className="h-1 w-full bg-neutral-900"><div className="h-full bg-[#00FF41] w-[99%]" /></div>
                  </div>
                </div>
              </MotionDiv>
            ) : activeTab === 'geo' ? (
              <MotionDiv key="geo" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <SectionTitle title="Geographic Node Distribution" subtitle="Origem dos Sinais" explanation="Análise da localização geográfica dos usuários com base no Timezone do sistema local." />
                <div className="grid gap-5 mt-8 max-w-4xl">
                  {stats.geo.length > 0 ? stats.geo.map(([name, count]) => (
                    <BarStat key={name} label={name.replace('_', ' ')} value={count} total={rawLogs.length} color="#FF007F" icon={<MapPin size={10}/>} />
                  )) : (
                    <p className="text-[10px] text-neutral-600 uppercase tracking-widest">Scanning for incoming nodes...</p>
                  )}
                </div>
              </MotionDiv>
            ) : activeTab === 'tech' ? (
              <MotionDiv key="tech" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <SectionTitle title="Hardware Environment Audit" subtitle="Especificações Técnicas" explanation="Relatório agregado sobre o poder de processamento e recursos dos dispositivos conectados." />
                <div className="grid md:grid-cols-2 gap-10 mt-8">
                  <div className="space-y-5">
                    <div className="flex items-center gap-2 mb-4 text-[#7000FF]">
                      <TerminalIcon size={14} />
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Platform Distribution</span>
                    </div>
                    {stats.tech.map(([name, count]) => (
                      <BarStat key={name} label={name} value={count} total={rawLogs.length} color="#7000FF" icon={<Monitor size={10}/>} />
                    ))}
                  </div>
                  <div className="space-y-6">
                    <div className="p-6 border border-neutral-900 bg-neutral-950/30 space-y-8 relative">
                      <div className="absolute top-0 right-0 p-2 text-neutral-800"><HardDrive size={24} /></div>
                      <SimpleMetric label="Avg_Logical_Cores" value={`${stats.avgCores} Threads`} hint="Média de CPUs lógicas detectadas." icon={<Cpu size={12}/>} />
                      <SimpleMetric label="Avg_Memory_Bank" value={`${stats.avgMemory}GB RAM`} hint="Média de memória RAM reportada." icon={<Layers size={12}/>} />
                      <SimpleMetric label="Global_Resolution" value="1080p Avg" hint="Densidade de pixels dominante." icon={<Monitor size={12}/>} />
                    </div>

                    <div className="p-4 border border-[#FF007F]/20 bg-[#FF007F]/5">
                       <span className="text-[8px] text-[#FF007F] font-bold uppercase tracking-widest block mb-2">Live_Telemetria:</span>
                       <div className="font-mono text-[7px] text-neutral-500 uppercase leading-none space-y-1">
                          {rawLogs.slice(0, 4).map((l, idx) => (
                            <p key={idx}>{" >> "} REQ_FROM_{l.timezone.slice(-10)} // PLT:_{l.platform.slice(0, 8)} // CORES:_{l.hardware_concurrency}</p>
                          ))}
                       </div>
                    </div>
                  </div>
                </div>
              </MotionDiv>
            ) : (
              <MotionDiv key="traffic" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <SectionTitle title="Neural Sector Navigation" subtitle="Fluxo de Movimentação" explanation="Identificação das áreas mais acessadas da aplicação para otimização de cache e entrega." />
                <div className="grid gap-5 mt-8 max-w-4xl">
                  {stats.paths.map(([name, count]) => (
                    <BarStat key={name} label={`Sector_ID: /${name.toUpperCase()}`} value={count} total={rawLogs.length} color="#00FF41" icon={<MousePointer2 size={10}/>} />
                  ))}
                  
                  <div className="mt-12 p-6 border border-neutral-900 bg-neutral-900/10 grid grid-cols-2 md:grid-cols-3 gap-8">
                     <div className="flex flex-col gap-2">
                        <span className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest">Top Performance</span>
                        <span className="text-xs text-white font-bold tracking-widest uppercase">Archive_Sector</span>
                     </div>
                     <div className="flex flex-col gap-2">
                        <span className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest">Latency Floor</span>
                        <span className="text-xs text-white font-bold tracking-widest uppercase">Terminal_Sync</span>
                     </div>
                     <div className="flex flex-col gap-2">
                        <span className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest">Active Cache</span>
                        <span className="text-xs text-white font-bold tracking-widest uppercase">Metadata_Grid</span>
                     </div>
                  </div>
                </div>
              </MotionDiv>
            )}
          </AnimatePresence>
        </main>
      </div>
      
      <footer className="h-8 md:h-10 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between px-6 shrink-0">
         <span className="text-[7px] md:text-[8px] text-neutral-700 uppercase tracking-widest font-bold">End of Telemetry Stream // SB-ARCHIVE-MONITOR-01</span>
         <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-[#00FF41] rounded-full animate-pulse" />
            <span className="text-[7px] md:text-[8px] text-neutral-500 uppercase tracking-widest font-bold">Signal: Nominal</span>
         </div>
      </footer>
    </MotionDiv>
  );
};

const MetricBox = ({ label, sub, value, icon, color, description }: any) => (
  <div className="p-4 md:p-6 flex flex-col border-r border-neutral-800 last:border-0 hover:bg-white/[0.03] transition-colors group relative cursor-help">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2 text-neutral-600 group-hover:text-white transition-colors">
        {React.cloneElement(icon, { size: 12 })}
        <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em]">{label}</span>
      </div>
    </div>
    <span className="text-xl md:text-3xl font-bold tracking-tighter mb-1 transition-all group-hover:scale-105 origin-left" style={{ color, textShadow: `0 0 10px ${color}40` }}>{value}</span>
    <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest mb-2 opacity-60">{sub}</span>
    
    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-center pointer-events-none">
       <span className="text-[7px] text-white font-bold uppercase tracking-widest mb-1">{label} Info:</span>
       <p className="text-[7px] text-neutral-400 uppercase leading-none">{description}</p>
    </div>
  </div>
);

const TabButton = ({ active, onClick, icon, label, sub }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-5 text-left border-b border-neutral-900 transition-all group relative overflow-hidden ${active ? 'bg-[#FF007F]/10 text-white' : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.02]'}`}>
    {active && <motion.div layoutId="tabMarker" className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF007F] shadow-[0_0_15px_#FF007F]" />}
    <div className={active ? 'text-[#FF007F]' : 'text-neutral-700'}>{icon}</div>
    <div className="flex flex-col">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{label}</span>
      <span className="text-[8px] text-neutral-600 uppercase tracking-widest font-bold mt-0.5">{sub}</span>
    </div>
    <ChevronRight size={12} className={`ml-auto transition-transform ${active ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
  </button>
);

const SectionTitle = ({ title, subtitle, explanation }: any) => (
  <div className="mb-12 border-l-2 border-[#FF007F]/40 pl-6 md:pl-8">
    <h3 className="text-xl md:text-3xl font-bold text-white tracking-tighter uppercase mb-2">{title}</h3>
    <p className="text-[9px] md:text-[11px] text-[#FF007F] font-bold uppercase tracking-[0.3em] mb-4">{subtitle}</p>
    <p className="text-[9px] md:text-[10px] text-neutral-500 uppercase tracking-widest leading-relaxed max-w-2xl italic opacity-80">{explanation}</p>
  </div>
);

const BarStat = ({ label, value, total, color, icon }: any) => {
  const percentage = (value / total) * 100;
  const MotionDiv = motion.div as any;
  return (
    <div className="space-y-2 group">
      <div className="flex justify-between text-[9px] md:text-[10px] uppercase font-bold tracking-widest">
        <div className="flex items-center gap-2">
           <span className="text-neutral-700">{icon}</span>
           <span className="text-neutral-500 group-hover:text-white transition-colors">{label}</span>
        </div>
        <span className="text-neutral-400 group-hover:text-white transition-colors">{value} Sinais // {percentage.toFixed(1)}%</span>
      </div>
      <div className="h-2 bg-neutral-900 relative overflow-hidden">
        <MotionDiv initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full relative shadow-[0_0_15px_currentColor]" style={{ backgroundColor: color }} />
      </div>
    </div>
  );
};

const SimpleMetric = ({ label, value, hint, icon }: any) => (
  <div className="flex flex-col gap-2 pb-5 border-b border-neutral-900 last:border-0 group">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2 text-neutral-600 group-hover:text-white transition-colors">
        {icon}
        <span className="text-[9px] uppercase font-bold tracking-widest">{label}</span>
      </div>
      <span className="text-[12px] text-white font-bold tracking-tighter group-hover:text-[#FF007F] transition-colors">{value}</span>
    </div>
    <p className="text-[7px] text-neutral-700 uppercase tracking-wider font-bold">{hint}</p>
  </div>
);
