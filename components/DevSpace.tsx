
import React from 'react';
import { motion } from 'framer-motion';
import { Github, Code, Database, Zap, ExternalLink } from 'lucide-react';

export const DevSpace: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#7000FF] font-mono text-xs tracking-[0.5em] mb-4 block uppercase font-bold">The Architect</span>
          <h2 className="text-6xl font-serif-classic mb-8 tracking-tighter">Sandro<br/><span className="neon-text-pink">Breaker</span></h2>
          
          <div className="prose prose-invert max-w-none text-neutral-400 leading-relaxed font-light space-y-6">
            <p className="text-lg">
              Lead Frontend Engineer and UI/UX Designer specialized in high-performance data visualization and lo-fi digital aesthetics.
            </p>
            <p>
              "This archive is more than a database—it's an engineering challenge met with emotional intent. Converting <span className="text-white font-mono">21MB of raw JSON</span> scrapings into a highly indexed, lightning-fast PostgreSQL API required precision, debounced search vectors, and strategic caching."
            </p>
            <p>
              The goal was to create a sanctuary where technology disappears, leaving only the raw feeling of the lyrics, protected by robust code and elegant design.
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
            <div className="text-[10px] font-mono text-neutral-600">
              Stack: NODE.JS / SUPABASE / REACT / D3
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-neutral-950 border border-neutral-900 p-8 relative"
        >
          <div className="absolute -top-4 -right-4 bg-[#FF007F] text-black text-[10px] font-mono font-bold px-3 py-1">
            STATS.LOG
          </div>
          
          <h3 className="font-mono text-xs text-[#7000FF] mb-6 uppercase tracking-widest">Pipeline Highlights</h3>
          <div className="space-y-6">
            <SkillBar icon={<Code size={16} />} label="React Engine" progress={98} color="#FF007F" />
            <SkillBar icon={<Database size={16} />} label="Supabase Indexing" progress={92} color="#7000FF" />
            <SkillBar icon={<Zap size={16} />} label="UI/UX Performance" progress={95} color="#FF007F" />
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4">
            <div className="p-4 border border-neutral-900 bg-black/40">
              <p className="text-xs font-mono text-neutral-600 mb-1">TOTAL DATASET</p>
              <p className="text-xl font-serif-classic text-white tracking-widest">21.4 MB</p>
            </div>
            <div className="p-4 border border-neutral-900 bg-black/40">
              <p className="text-xs font-mono text-neutral-600 mb-1">SEARCH SPEED</p>
              <p className="text-xl font-serif-classic text-white tracking-widest">~12ms</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-24 pt-24 border-t border-neutral-900 text-center">
        <p className="font-gothic text-4xl text-neutral-800 mb-4 opacity-30 select-none">Legacy Section</p>
        <p className="max-w-2xl mx-auto text-sm text-neutral-500 italic">
          Dedicated to the memory of Gus Ahr. Technology serves to imortalize feelings through structured data. 
          A tribute to the pioneer of Emo-Trap.
        </p>
      </div>
    </div>
  );
};

const SkillBar: React.FC<{ icon: React.ReactNode; label: string; progress: number; color: string }> = ({ icon, label, progress, color }) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center gap-2 text-neutral-400">
        {icon}
        <span className="text-[10px] font-mono tracking-widest">{label}</span>
      </div>
      <span className="text-[10px] font-mono" style={{ color }}>{progress}%</span>
    </div>
    <div className="h-[2px] w-full bg-neutral-900">
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: `${progress}%` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="h-full" 
        style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
      ></motion.div>
    </div>
  </div>
);
