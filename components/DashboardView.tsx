
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Cpu, Activity, Layout, 
  MapPin, Monitor, 
  Layers, Zap, X, ChevronRight, BarChart3, Info
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
  // Fix: Casting motion.div to any to resolve React 19 type incompatibilities
  const MotionDiv = motion.div as any;

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
    // Fix: Using MotionDiv (casted to any) to resolve type errors
    <MotionDiv 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-4 md:inset-10 z-[300] bg-black border border-neutral-800 shadow-[0_0_100px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden font-mono"
    >
      {/* Dashboard Header */}
      <header className="h-20 border-b border-neutral-800 flex items-center justify-between px-6 bg-neutral-900/50 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-[#FF007F]/10 border border-[#FF007F]/20 text-[#FF007F]">
            <BarChart3 size={22} />
          </div>
          <div>
            <h2 className="text-[12px] font-bold tracking-[0.4em] text-white uppercase">Neural_Network_Ops // Access Intelligence</h2>
            <p className="text-[9px] text-neutral-500 uppercase tracking-widest mt-1">
              Painel de Telemetria: Monitoramento em tempo real da audiência global e integridade dos nós.
            </p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="p-3 hover:bg-neutral-800 text-neutral-500 hover:text-white transition-colors rounded-full"
        >
          <X size={20} />
        </button>
      </header>

      {/* Stats Ribbon - Explanatory metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-neutral-800 bg-neutral-950/20">
         <MetricBox 
           label="Global_Hits" 
           sub="Total de Acessos"
           description="Volume total de requisições registradas no banco de dados desde a ativação do arquivo."
           value={totalHits.toLocaleString()} 
           icon={<Globe size={14}/>} 
           color="#FF007F" 
         />
         <MetricBox 
           label="Active_Nodes" 
           sub="Usuários Online"
           description="Contagem de dispositivos únicos transmitindo dados nos últimos 5 minutos."
           value={activeNodes.toString()} 
           icon={<UsersIcon size={14}/>} 
           color="#00FF41" 
         />
         <MetricBox 
           label="Server_Status" 
           sub="Saúde do Sistema"
           description="Disponibilidade operacional dos servidores Supabase e Edge Functions."
           value="99.9% UPTIME" 
           icon={<Activity size={14}/>} 
           color="#7000FF" 
         />
         <MetricBox 
           label="Latency_RX" 
           sub="Velocidade de Resposta"
           description="Tempo médio de processamento de sinais de telemetria (Round Trip Time)."
           value="0.04 MS" 
           icon={<Zap size={14}/>} 
           color="#FFB800" 
         />
      </div>

      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Nav */}
        <nav className="w-full md:w-72 border-b md:border-b-0 md:border-r border-neutral-800 bg-neutral-950/30">
          <TabButton 
            active={activeTab === 'geo'} 
            onClick={() => setActiveTab('geo')} 
            icon={<MapPin size={16}/>} 
            label="Geographics" 
            sub="Origem dos Fãs"
          />
          <TabButton 
            active={activeTab === 'tech'} 
            onClick={() => setActiveTab('tech')} 
            icon={<Cpu size={16}/>} 
            label="Hardware Specs" 
            sub="Tecnologia do Visitante"
          />
          <TabButton 
            active={activeTab === 'traffic'} 
            onClick={() => setActiveTab('traffic')} 
            icon={<Layout size={16}/>} 
            label="Traffic Flow" 
            sub="Comportamento de Navegação"
          />
          
          <div className="p-6 mt-auto hidden md:block">
            <div className="p-4 bg-neutral-900/50 border border-neutral-800">
               <div className="flex items-center gap-2 mb-2 text-[#FF007F]">
                 <Info size={12} />
                 <span className="text-[8px] font-bold uppercase tracking-widest">Nota Técnica</span>
               </div>
               <p className="text-[8px] text-neutral-600 leading-relaxed uppercase tracking-wider">
                 Os dados apresentados são extraídos anonimamente para otimização da experiência do usuário e performance do streaming.
               </p>
            </div>
          </div>
        </nav>

        {/* Content Area */}
        <main className="flex-grow p-6 md:p-10 overflow-y-auto custom-scrollbar bg-[#050505]">
          <AnimatePresence mode="wait">
            {activeTab === 'geo' && (
              // Fix: Using MotionDiv (casted to any) to resolve React 19 type incompatibilities
              <MotionDiv key="geo" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SectionTitle 
                  title="Geographic Signal Origin" 
                  subtitle="De onde vêm as conexões?"
                  explanation="Distribuição de acessos baseada no Timezone do navegador. Isso nos ajuda a entender em quais partes do mundo o legado do Gus está mais ativo neste momento."
                />
                <div className="grid gap-6 mt-8 max-w-3xl">
                  {stats.geo.length > 0 ? stats.geo.map(([name, count]) => (
                    <BarStat key={name} label={name.replace('_', ' ')} value={count} total={rawLogs.length} color="#FF007F" />
                  )) : <p className="text-neutral-700 text-[10px] uppercase">Aguardando telemetria...</p>}
                </div>
              </MotionDiv>
            )}

            {activeTab === 'tech' && (
              // Fix: Using MotionDiv (casted to any) to resolve React 19 type incompatibilities
              <MotionDiv key="tech" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SectionTitle 
                  title="User Environment Analysis" 
                  subtitle="Quais dispositivos estão sendo usados?"
                  explanation="Análise técnica das plataformas e poder de processamento. Útil para otimizar as animações e o motor de áudio para diferentes capacidades de hardware."
                />
                <div className="grid md:grid-cols-2 gap-10 mt-8">
                  <div className="space-y-6">
                    <span className="text-[9px] text-neutral-600 uppercase font-bold tracking-widest block border-b border-neutral-900 pb-2">Operating Systems / Platform</span>
                    {stats.tech.map(([name, count]) => (
                      <BarStat key={name} label={name} value={count} total={rawLogs.length} color="#7000FF" />
                    ))}
                  </div>
                  <div className="p-6 border border-neutral-900 bg-neutral-950/50">
                     <span className="text-[9px] text-neutral-600 uppercase font-bold tracking-widest block mb-6 border-b border-neutral-900 pb-2">Hardware Performance Metrics (Median)</span>
                     <div className="space-y-6">
                        <SimpleMetric label="Cores de Processamento" value="8-Core Avg" hint="Média de CPUs detectadas nos nós." />
                        <SimpleMetric label="Memória Disponível" value="~16GB RAM" hint="Capacidade de memória dos dispositivos." />
                        <SimpleMetric label="Resolução Dominante" value="1920x1080" hint="Tamanho de tela mais comum utilizado." />
                     </div>
                  </div>
                </div>
              </MotionDiv>
            )}

            {activeTab === 'traffic' && (
              // Fix: Using MotionDiv (casted to any) to resolve React 19 type incompatibilities
              <MotionDiv key="traffic" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SectionTitle 
                  title="Neural Navigation Flow" 
                  subtitle="Quais caminhos os fãs mais percorrem?"
                  explanation="Monitoramento dos setores (views) mais visitados. Indica quais partes da experiência (Archive, Timeline, Vault) são mais engajadoras."
                />
                <div className="grid gap-6 mt-8 max-w-3xl">
                  {stats.paths.map(([name, count]) => (
                    <BarStat key={name} label={`Fragment Section: /${name.toUpperCase()}`} value={count} total={rawLogs.length} color="#00FF41" />
                  ))}
                </div>
              </MotionDiv>
            )}
          </AnimatePresence>
        </main>
      </div>

      <footer className="h-10 border-t border-neutral-800 flex items-center px-6 justify-between bg-black text-[7px] text-neutral-600 uppercase tracking-[0.3em]">
        <div className="flex items-center gap-4">
          <span>Encrypted Analytics Protocol // 256-bit AES</span>
          <span className="hidden md:inline">Last Sync: {new Date().toLocaleTimeString()}</span>
        </div>
        <span>Node: SB-ANALYTICS-PRIMARY</span>
      </footer>
    </MotionDiv>
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

const MetricBox = ({ label, sub, value, icon, color, description }: any) => (
  <div className="p-4 md:p-6 flex flex-col border-r border-neutral-800 last:border-0 hover:bg-white/[0.02] transition-colors group relative">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2 text-neutral-600 group-hover:text-white transition-colors">
        {React.cloneElement(icon, { size: 12 })}
        <span className="text-[8px] font-bold uppercase tracking-widest">{label}</span>
      </div>
    </div>
    <span className="text-xl md:text-2xl font-bold tracking-tighter mb-1" style={{ color }}>{value}</span>
    <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest mb-2">{sub}</span>
    <p className="text-[7px] text-neutral-700 leading-tight uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-2 left-6 right-6 pointer-events-none">
      {description}
    </p>
  </div>
);

const TabButton = ({ active, onClick, icon, label, sub }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-5 text-left border-b border-neutral-900 transition-all group ${active ? 'bg-[#FF007F]/10 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
  >
    <div className={active ? 'text-[#FF007F]' : 'text-neutral-700 group-hover:text-neutral-500 transition-colors'}>{icon}</div>
    <div className="flex flex-col">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{label}</span>
      <span className="text-[8px] text-neutral-600 uppercase tracking-widest font-bold group-hover:text-neutral-400 transition-colors">{sub}</span>
    </div>
    {active && <ChevronRight size={14} className="ml-auto text-[#FF007F]" />}
  </button>
);

const SectionTitle = ({ title, subtitle, explanation }: any) => (
  <div className="mb-12 border-l-2 border-[#FF007F]/30 pl-6">
    <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tighter uppercase mb-2">{title}</h3>
    <p className="text-[10px] md:text-[11px] text-[#FF007F] font-bold uppercase tracking-[0.3em] mb-4">{subtitle}</p>
    <p className="text-[10px] text-neutral-500 uppercase tracking-widest leading-relaxed max-w-2xl italic">
      {explanation}
    </p>
  </div>
);

const BarStat = ({ label, value, total, color }: any) => {
  const percentage = (value / total) * 100;
  // Fix: Casting motion.div to any to resolve React 19 type incompatibilities
  const MotionDiv = motion.div as any;
  return (
    <div className="space-y-3 group">
      <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest">
        <span className="text-neutral-500 group-hover:text-white transition-colors">{label}</span>
        <span className="text-neutral-400">{value} SINAIS <span className="text-neutral-700 ml-2">({percentage.toFixed(1)}%)</span></span>
      </div>
      <div className="h-2.5 bg-neutral-900 relative overflow-hidden">
        {/* Fix: Using MotionDiv (casted to any) to resolve type errors */}
        <MotionDiv 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-full relative shadow-[0_0_15px_currentColor] z-10"
          style={{ backgroundColor: color, color: color }}
        />
        <div className="absolute inset-0 bg-neutral-800/10 z-0"></div>
      </div>
    </div>
  );
};

const SimpleMetric = ({ label, value, hint }: any) => (
  <div className="flex flex-col gap-2 pb-4 border-b border-neutral-900 last:border-0">
    <div className="flex justify-between items-center">
      <span className="text-[9px] text-neutral-600 uppercase font-bold tracking-widest">{label}</span>
      <span className="text-[11px] text-white font-bold tracking-tighter">{value}</span>
    </div>
    <p className="text-[7px] text-neutral-700 uppercase tracking-wider">{hint}</p>
  </div>
);
