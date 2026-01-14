
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, Calendar, Award, Disc, Skull, Heart, Star, TrendingUp } from 'lucide-react';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  intensity: number; // 0-100 para o gráfico de sinal
  tags: string[];
}

const timelineData: TimelineEvent[] = [
  {
    year: "1996",
    title: "Initial Node Boot",
    description: "Gustav Elijah Åhr nasce em Allentown, PA. O sinal original é detectado.",
    icon: <Heart size={14} />,
    intensity: 20,
    tags: ["BIRTH", "ORIGIN"]
  },
  {
    year: "2013",
    title: "Trap Goose Protocol",
    description: "Início dos primeiros uploads no SoundCloud. Estética lo-fi experimental.",
    icon: <Activity size={14} />,
    intensity: 35,
    tags: ["SOUNDCLOUD", "EARLY_DATA"]
  },
  {
    year: "2015",
    title: "Lil Peep; Part One",
    description: "Lançamento da primeira mixtape seminal. O som 'emo-trap' é codificado.",
    icon: <Disc size={14} />,
    intensity: 60,
    tags: ["MIXTAPE", "BREAKTHROUGH"]
  },
  {
    year: "2016",
    title: "Crybaby & Hellboy Sync",
    description: "Dualidade criativa. Gus se torna o rosto global do rap alternativo.",
    icon: <Zap size={14} />,
    intensity: 85,
    tags: ["GBC", "GLOBAL_IMPACT"]
  },
  {
    year: "2017",
    title: "Peak Frequency / Signal Cut",
    description: "COWYS Pt. 1 e turnê mundial. O sinal físico é interrompido em Tucson.",
    icon: <Skull size={14} />,
    intensity: 100,
    tags: ["FINITE", "LEGACY_START"]
  },
  {
    year: "2018-2023",
    title: "Posthumous Preservation",
    description: "Recuperação de arquivos perdidos (COWYS 2, Diamonds). O mito se torna imortal.",
    icon: <Star size={14} />,
    intensity: 75,
    tags: ["ARCHIVE", "ETERNAL"]
  }
];

export const TimelineHistory: React.FC = () => {
  const MotionDiv = motion.div as any;

  // Gerar coordenadas para o gráfico de linha SVG
  const generatePath = () => {
    const width = 1000;
    const height = 150;
    const padding = 50;
    const step = (width - padding * 2) / (timelineData.length - 1);
    
    return timelineData.map((event, i) => {
      const x = padding + i * step;
      const y = height - (event.intensity / 100) * (height - padding);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      {/* SIGNAL FREQUENCY LINE CHART */}
      <section className="mb-24 md:mb-32">
        <div className="flex items-center gap-4 mb-8">
           <TrendingUp size={16} className="text-[#FF007F]" />
           <span className="font-mono text-[10px] text-[#FF007F] uppercase tracking-[0.5em] font-bold">Signal_Frequency_Mapping</span>
           <div className="h-px flex-grow bg-neutral-900" />
        </div>
        
        <div className="relative w-full aspect-[10/3] md:aspect-[10/2] bg-neutral-950/40 border border-neutral-900 overflow-hidden">
           {/* Grid Lines */}
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
           
           <svg viewBox="0 0 1000 150" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,0,127,0.5)]">
             <motion.path 
               initial={{ pathLength: 0 }}
               animate={{ pathLength: 1 }}
               transition={{ duration: 3, ease: "easeInOut" }}
               d={generatePath()} 
               fill="none" 
               stroke="#FF007F" 
               strokeWidth="2" 
             />
             {/* Data Points on Line */}
             {timelineData.map((event, i) => {
               const width = 1000;
               const height = 150;
               const padding = 50;
               const step = (width - padding * 2) / (timelineData.length - 1);
               const x = padding + i * step;
               const y = height - (event.intensity / 100) * (height - padding);
               return (
                 <circle 
                   key={i} 
                   cx={x} 
                   cy={y} 
                   r="3" 
                   fill="#FF007F" 
                   className="animate-pulse"
                 />
               );
             })}
           </svg>
           
           <div className="absolute bottom-2 left-6 right-6 flex justify-between font-mono text-[7px] text-neutral-600 uppercase tracking-widest font-bold">
              <span>Origin_Node</span>
              <span>Legacy_Peak</span>
              <span>Immortal_Persistence</span>
           </div>
        </div>
      </section>

      <div className="relative">
        {/* Central Signal Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#FF007F]/0 via-[#FF007F]/30 to-transparent md:-translate-x-1/2" />
        
        <div className="space-y-24 md:space-y-32">
          {timelineData.map((event, idx) => (
            <MotionDiv
              key={event.year}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              {/* Year Marker */}
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-20">
                <div className="w-8 h-8 rounded-full bg-black border border-[#FF007F] flex items-center justify-center shadow-[0_0_15px_rgba(255,0,127,0.4)]">
                   <div className="w-2 h-2 bg-[#FF007F] rounded-full animate-pulse" />
                </div>
              </div>

              {/* Content Card */}
              <div className={`w-full md:w-[45%] bg-neutral-950 border border-neutral-900 p-6 md:p-8 hover:border-[#FF007F]/40 transition-all duration-500 group relative overflow-hidden`}>
                <div className="absolute top-0 left-0 w-1 h-full bg-[#FF007F]/20 group-hover:bg-[#FF007F] transition-all" />
                
                <header className="flex justify-between items-center mb-4">
                  <span className="font-mono text-[14px] font-bold text-[#FF007F] tracking-[0.3em]">{event.year}</span>
                  <div className="text-neutral-700">{event.icon}</div>
                </header>

                <h3 className="font-serif-classic text-lg md:text-xl text-white uppercase tracking-wider mb-4 group-hover:neon-text-pink transition-all">
                  {event.title}
                </h3>

                <p className="font-mono text-[10px] md:text-[11px] text-neutral-500 uppercase leading-relaxed tracking-widest mb-6">
                  {event.description}
                </p>

                {/* Signal Intensity Chart */}
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-[8px] text-neutral-600 tracking-widest uppercase font-bold">
                    <span>Intensity_Log</span>
                    <span>{event.intensity}%</span>
                  </div>
                  <div className="h-1 bg-neutral-900 overflow-hidden">
                    <MotionDiv 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${event.intensity}%` }}
                      transition={{ duration: 1.5, delay: 0.3 }}
                      className="h-full bg-[#FF007F] shadow-[0_0_10px_#FF007F]"
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {event.tags.map(tag => (
                    <span key={tag} className="text-[7px] font-mono text-neutral-700 border border-neutral-900 px-2 py-0.5 rounded-none uppercase font-bold group-hover:border-[#FF007F]/20 group-hover:text-neutral-500 transition-colors">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Technical Backdrop (Year Background) */}
              <div className="hidden md:block absolute left-1/2 -translate-x-1/2 text-[120px] font-gothic text-white/[0.02] select-none pointer-events-none z-0">
                {event.year}
              </div>
            </MotionDiv>
          ))}
        </div>
      </div>

      <div className="mt-32 text-center">
         <div className="inline-flex items-center gap-4 px-6 py-3 border border-dashed border-neutral-900">
           <Activity size={16} className="text-neutral-800" />
           <span className="font-mono text-[9px] text-neutral-700 uppercase tracking-[0.4em]">End of Recorded Timeline Stream</span>
         </div>
      </div>
    </div>
  );
};
