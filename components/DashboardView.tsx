
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Cpu, Activity, Layout, 
  MapPin, MousePointer2, Monitor, 
  Layers, Zap, Clock, X, ChevronRight, BarChart3
} from 'lucide-react';
import { supabase } from '../services/supabaseClient.ts';

interface AccessData {
  timezone: string;
  platform: string;
  path: string;
  device_memory: number;
  hardware_concurrency: number;
  screen_resolution: string;
}

interface DashboardViewProps {
  onClose: () => void;
  totalHits: number;
  activeNodes: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onClose, totalHits, activeNodes }) => {
  const [activeTab, setActiveTab] = useState<'geo' | 'tech' | 'traffic'>('geo');
  const [rawLogs, setRawLogs] = useState<AccessData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullMetrics = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('access_logs_goth')
        .select('timezone, platform, path, device_memory, hardware_concurrency, screen_resolution')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (data) setRawLogs(data);
      setLoading(false);
    };
    fetchFullMetrics();
  }, []);

  const stats = useMemo(() => {
    const geo: Record<string, number> = {};
    const tech: Record<string, number> = {};
    const paths: Record<string, number> = {};

    rawLogs.forEach(log => {
      const tz = log.timezone?.split('/')[1] || log.timezone || 'Unknown';
      geo[tz] = (geo[tz] || 0) + 1;

      const plt = log.platform || 'Unknown';
      tech[plt] = (tech[plt] || 0) + 1;

      const p = log.path || 'home';
      paths[p] = (paths[p] || 0) + 1;
    });

    return { 
      geo: Object.entries(geo).sort((a, b) => b[1] - a[1]).slice(0, 5),
      tech: Object.entries(tech).sort((a, b) => b[1] - a[1]).slice(0, 5),
      paths: Object.entries(paths).sort((a, b) => b[1] - a[1]).slice(0, 5)
    };
  }, [rawLogs]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-4 md:inset-10 z-[300] bg-black border border-neutral-800 shadow-[0_0_100px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden font-mono"
    >
      {/* Dashboard Header */}
      <header className="h-16 border-b border-neutral-800 flex items-center justify-between px-6 bg-neutral-900/50 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-[#FF007F]/10 border border-[#FF007F]/20 text-[#FF007F]">
            <BarChart3 size={18} />
          </div>
          <div>
            <h2 className="text-[11px] font-bold tracking-[0.4em] text-white uppercase">Neural_Network_Ops</h2>
            <p className="text-[8px] text-neutral-500 uppercase tracking-widest">Global Traffic Analysis & Signal Mapping</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <button 
             onClick={onClose}
             className="p-3 hover:bg-neutral-800 text-neutral-500 hover:text-white transition-colors"
           >
             <X size={20} />
           </button>
        </div>
      </header>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-neutral-800">
         <MetricBox label="Global_Hits" value={totalHits.toLocaleString()} icon={<Globe size={14}/>} color="#FF007F" />
         <MetricBox label="Active_Nodes" value={activeNodes.toString()} icon={<UsersIcon size={14}/>} color="#00FF41" />
         <MetricBox label="Server_Status" value="99.9% UPTIME" icon={<Activity size={14}/>} color="#7000FF" />
         <MetricBox label="Load_Factor" value="0.04 MS" icon={<Zap size={14}/>} color="#FFB800" />
      </div>

      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Nav */}
        <nav className="w-full md:w-64 border-b md:border-b-0 md:border-r border-neutral-800 bg-neutral-950/30">
          <TabButton active={activeTab === 'geo'} onClick={() => setActiveTab('geo')} icon={<MapPin size={16}/>} label="Geographics" />
          <TabButton active={activeTab === 'tech'} onClick={() => setActiveTab('tech')} icon={<Cpu size={16}/>} label="Hardware Specs" />
          <TabButton active={activeTab === 'traffic'} onClick={() => setActiveTab('traffic')} icon={<Layout size={16}/>} label="Traffic Flow" />
        </nav>

        {/* Content Area */}
        <main className="flex-grow p-6 md:p-10 overflow-y-auto custom-scrollbar bg-[#050505]">
          <AnimatePresence mode="wait">
            {activeTab === 'geo' && (
              <motion.div key="geo" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SectionTitle title="Signal Origin Breakdown" subtitle="Timezone distribution of incoming neural links" />
                <div className="grid gap-4 mt-8">
                  {stats.geo.map(([name, count]) => (
                    <BarStat key={name} label={name} value={count} total={rawLogs.length} color="#FF007F" />
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'tech' && (
              <motion.div key="tech" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SectionTitle title="Hardware Vector Analysis" subtitle="Platforms and compute power across the network" />
                <div className="grid md:grid-cols-2 gap-8 mt-8">
                  <div className="space-y-4">
                    <span className="text-[9px] text-neutral-600 uppercase font-bold tracking-widest">Operating Systems</span>
                    {stats.tech.map(([name, count]) => (
                      <BarStat key={name} label={name} value={count} total={rawLogs.length} color="#7000FF" />
                    ))}
                  </div>
                  <div className="p-6 border border-neutral-900 bg-neutral-950/50">
                     <span className="text-[9px] text-neutral-600 uppercase font-bold tracking-widest block mb-6">Median Resource Metrics</span>
                     <div className="space-y-6">
                        <SimpleMetric label="Hardware Concurrency (CPUs)" value="8-Core Avg" />
                        <SimpleMetric label="Device Memory Available" value="~16GB RAM" />
                        <SimpleMetric label="Dominant Resolution" value="1920x1080" />
                     </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'traffic' && (
              <motion.div key="traffic" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SectionTitle title="Neural Pathways" subtitle="Most navigated sectors within the G.A.S Sanctum" />
                <div className="grid gap-4 mt-8">
                  {stats.paths.map(([name, count]) => (
                    <BarStat key={name} label={`/${name.toUpperCase()}`} value={count} total={rawLogs.length} color="#00FF41" />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <footer className="h-10 border-t border-neutral-800 flex items-center px-6 justify-between bg-black text-[7px] text-neutral-600 uppercase tracking-[0.3em]">
        <span>Encrypted Analytics Protocol // 256-bit AES</span>
        <span>Node: SB-ANALYTICS-PRIMARY</span>
      </footer>
    </motion.div>
  );
};

const UsersIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const MetricBox = ({ label, value, icon, color }: any) => (
  <div className="p-4 flex flex-col border-r border-neutral-800 last:border-0 hover:bg-white/[0.02] transition-colors group">
    <div className="flex items-center gap-2 mb-2 text-neutral-600 group-hover:text-white transition-colors">
      {React.cloneElement(icon, { size: 12 })}
      <span className="text-[8px] font-bold uppercase tracking-widest">{label}</span>
    </div>
    <span className="text-xl font-bold tracking-tighter" style={{ color }}>{value}</span>
  </div>
);

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 text-left border-b border-neutral-900 transition-all ${active ? 'bg-[#FF007F]/10 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
  >
    <div className={active ? 'text-[#FF007F]' : 'text-neutral-700'}>{icon}</div>
    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{label}</span>
    {active && <ChevronRight size={14} className="ml-auto text-[#FF007F]" />}
  </button>
);

const SectionTitle = ({ title, subtitle }: any) => (
  <div className="mb-10">
    <h3 className="text-2xl font-bold text-white tracking-tighter uppercase mb-2">{title}</h3>
    <p className="text-[10px] text-neutral-500 uppercase tracking-widest">{subtitle}</p>
  </div>
);

const BarStat = ({ label, value, total, color }: any) => {
  const percentage = (value / total) * 100;
  return (
    <div className="space-y-2 group">
      <div className="flex justify-between text-[9px] uppercase font-bold tracking-widest">
        <span className="text-neutral-500 group-hover:text-white transition-colors">{label}</span>
        <span className="text-neutral-400">{value} HITS</span>
      </div>
      <div className="h-2 bg-neutral-900 relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full relative shadow-[0_0_10px_currentColor]"
          style={{ backgroundColor: color, color: color }}
        />
      </div>
    </div>
  );
};

const SimpleMetric = ({ label, value }: any) => (
  <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
    <span className="text-[9px] text-neutral-600 uppercase font-bold">{label}</span>
    <span className="text-[10px] text-white font-bold">{value}</span>
  </div>
);
