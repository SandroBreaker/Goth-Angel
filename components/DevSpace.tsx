
import React from 'react';
import { motion } from 'framer-motion';
import { Github, Code, Database, Zap, ExternalLink } from 'lucide-react';

export const DevSpace: React.FC = () => {
  const MotionDiv = motion.div as any;

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <MotionDiv
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#7000FF] font-mono text-xs tracking-[0.5em] mb-4 block uppercase font-bold">The Architect</span>
          {/* Ajuste de título monumental Sandro Breaker */}
          <h2 className="text-4xl md:text-5xl font-serif-classic mb-8 tracking-tighter uppercase leading-tight">Sandro<br/><span className="neon-text-pink">Breaker</span></h2>
          
          <div className="prose prose-invert max-w-none text-neutral-400 leading-relaxed font-light space-y-6">
            <p className="text-base md:text-lg">
              Lead Frontend Engineer and UI/UX Designer specialized in high-performance digital aesthetics.
            </p>
            <p className="text-sm md:text-base">
              "This archive is more than a database—it's an engineering challenge met with emotional intent. Converting <span className="text-white font-mono">raw JSON</span> into a lightning-fast PostgreSQL API required precision and strategic caching."
            </p>
            <p className="text-sm md:text-base">
              The goal was to create a sanctuary where technology disappears, leaving only the raw feeling of the lyrics.
            </p>
          </div>

          <div className="flex items-center gap-6 mt-12">
            <a 
              href="https://github.com/SandroBreaker/PeepSrapingsyrics" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-black px-6 py-3 text-xs font-mono font-bold hover:bg-[#FF007F] hover:text-white transition-all group"
            >
              <Github size={16} /> REPO: PEEPSRAPING <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <div className="text-[9px] font-mono text-neutral-600 font-bold tracking-widest uppercase">
              NODE.JS / SUPABASE / REACT / D3
            </div>
          </div>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-neutral-950 border border-neutral-900 p-8 relative"
        >
          <div className="absolute -top-4 -right-4 bg-[#FF007F] text-black text-[10px] font-mono font-bold px-3 py-1 uppercase">
            STATS.LOG
          </div>
          
          <h3 className="font-mono text-xs text-[#7000FF] mb-6 uppercase tracking-widest font-bold">Pipeline Highlights</h3>
          <div className="space-y-6">
            <SkillBar icon={<Code size={16} />} label="React Engine" progress={98} color="#FF007F" />
            <SkillBar icon={<Database size={16} />} label="Supabase Indexing" progress={92} color="#7000FF" />
            <SkillBar icon={<Zap size={16} />} label="UI/UX Performance" progress={95} color="#FF007F" />
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4">
            <div className="p-4 border border-neutral-900 bg-black/40">
              <p className="text-[10px] font-mono text-neutral-600 mb-1 uppercase font-bold tracking-widest">DATASET</p>
              <p className="text-lg font-serif-classic text-white tracking-widest uppercase">21.4 MB</p>
            </div>
            <div className="p-4 border border-neutral-900 bg-black/40">
              <p className="text-[10px] font-mono text-neutral-600 mb-1 uppercase font-bold tracking-widest">SEARCH</p>
              <p className="text-lg font-serif-classic text-white tracking-widest uppercase">~12ms</p>
            </div>
          </div>
        </MotionDiv>
      </div>

      <div className="mt-20 pt-20 border-t border-neutral-900 text-center">
        <p className="font-gothic text-3xl text-neutral-800 mb-4 opacity-30 select-none uppercase">Legacy Section</p>
        <p className="max-w-2xl mx-auto text-xs text-neutral-600 italic leading-relaxed">
          Technology serves to imortalize feelings. 
          A tribute to the pioneer of Emo-Trap.
        </p>
      </div>
    </div>
  );
};

const SkillBar: React.FC<{ icon: React.ReactNode; label: string; progress: number; color: string }> = ({ icon, label, progress, color }) => {
  const MotionDiv = motion.div as any;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2 text-neutral-400">
          {icon}
          <span className="text-[9px] font-mono tracking-widest uppercase font-bold">{label}</span>
        </div>
        <span className="text-[9px] font-mono font-bold" style={{ color }}>{progress}%</span>
      </div>
      <div className="h-[2px] w-full bg-neutral-900">
        <MotionDiv 
          initial={{ width: 0 }}
          whileInView={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full" 
          style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
        ></MotionDiv>
      </div>
    </div>
  );
};
