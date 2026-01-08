
import React from 'react';
import { motion } from 'framer-motion';
import { Play, film, ExternalLink, Info, Youtube } from 'lucide-react';

const videos = [
  { id: '3rkJ3L5Ce80', title: 'Benz Truck', type: 'Legacy Visual', duration: '3:48' },
  { id: 'T19S6z9jGhw', title: 'BeamerBoy', type: 'Lo-Fi Archive', duration: '3:12' },
  { id: '776zM7li_lI', title: 'Spotlight', type: 'Remastered Fragment', duration: '2:57' },
  { id: 'Y8-Gis3E9tY', title: 'Star Shopping', type: 'Vocal Track', duration: '2:22' },
  { id: 'v9Xp5X-lPGA', title: 'Life is Beautiful', type: 'Digital Memorial', duration: '3:27' },
  { id: 'v-lY4r69Eeo', title: 'Gym Class', type: 'Original Upload', duration: '3:40' }
];

export const Theater: React.FC = () => {
  const MotionDiv = motion.div as any;

  return (
    <div className="max-w-6xl mx-auto py-24 px-6 min-h-screen">
      <div className="text-center mb-24">
        <MotionDiv 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 mb-4 px-4 py-1 border border-[#FF007F]/20 bg-[#FF007F]/5"
        >
          <span className="w-2 h-2 rounded-full bg-[#FF007F] animate-pulse"></span>
          <span className="font-mono text-[9px] text-[#FF007F] tracking-[0.4em] uppercase">Visual Signal Active</span>
        </MotionDiv>
        <h2 className="font-serif-classic text-5xl md:text-7xl mb-6 tracking-tighter text-white">THEATER</h2>
        <p className="font-mono text-[10px] text-neutral-600 uppercase tracking-[0.5em] max-w-xl mx-auto leading-relaxed">
          Visual archives sourced from high-availability nodes to ensure permanent digital preservation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
        {videos.map((vid, idx) => (
          <MotionDiv
            key={vid.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: idx * 0.1 }}
            className="group relative"
          >
            <div className="aspect-video bg-neutral-950 border border-neutral-900 group-hover:border-[#FF007F]/40 transition-all duration-700 overflow-hidden relative shadow-2xl">
              {/* Decorative Frame Elements */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 opacity-30 mix-blend-overlay grain"></div>
              
              <div className="absolute inset-0 flex items-center justify-center bg-black pointer-events-none opacity-50 z-0">
                 <Youtube size={40} className="text-neutral-900" />
              </div>
              
              <iframe
                className="w-full h-full grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-[1.01] relative z-1"
                src={`https://www.youtube.com/embed/${vid.id}?controls=1&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&theme=dark`}
                title={vid.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>

              {/* Status Bar */}
              <div className="absolute bottom-0 left-0 w-full p-2 bg-black/80 backdrop-blur-sm border-t border-white/5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                   <span className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest">Signal Locked</span>
                </div>
                <span className="font-mono text-[8px] text-neutral-500 tabular-nums uppercase tracking-widest">{vid.duration}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-start px-1">
              <div>
                <h3 className="font-serif-classic text-lg text-neutral-300 group-hover:text-white group-hover:neon-text-pink transition-all duration-500 tracking-widest uppercase mb-1">
                  {vid.title}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[9px] text-neutral-600 uppercase tracking-widest flex items-center gap-1.5">
                    <Info size={10} className="text-[#7000FF]" />
                    {vid.type}
                  </span>
                </div>
              </div>
              
              <a 
                href={`https://youtube.com/watch?v=${vid.id}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 border border-neutral-900 text-neutral-700 hover:text-[#FF007F] hover:border-[#FF007F]/40 transition-all group/link"
              >
                <ExternalLink size={14} className="group-hover/link:scale-110 transition-transform" />
              </a>
            </div>
            
            {/* Background Aesthetic Numbering */}
            <div className="absolute -bottom-10 -right-4 font-gothic text-8xl text-white opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-1000">
              0{idx + 1}
            </div>
          </MotionDiv>
        ))}
      </div>

      <div className="mt-40 pt-20 border-t border-neutral-900 text-center">
        <p className="font-mono text-[8px] text-neutral-800 uppercase tracking-[0.8em] mb-4">End of visual transmissions</p>
        <div className="w-12 h-px bg-neutral-900 mx-auto"></div>
      </div>
    </div>
  );
};
