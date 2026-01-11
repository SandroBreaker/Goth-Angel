
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Youtube, ExternalLink, Film, Cpu } from 'lucide-react';

interface VideoFragment {
  id: string;
  title: string;
  type: string;
  duration: string;
}

const verifiedOfficialVideos: VideoFragment[] = [
  { id: '3rkJ3L5Ce80', title: 'Benz Truck', type: 'Official Music Video', duration: '3:48' },
  { id: 'WvV5bbskP_4', title: 'Save That Shit', type: 'Official Music Video', duration: '3:52' },
  { id: 'zOutocnzuxg', title: 'Awful Things', type: 'Official Music Video', duration: '4:04' },
  { id: 'T19S6z9jGhw', title: 'BeamerBoy', type: 'Official Music Video', duration: '3:12' },
  { id: '776zM7li_lI', title: 'Spotlight', type: 'Official Music Video', duration: '2:57' },
  { id: 'Y8-Gis3E9tY', title: 'Star Shopping', type: 'Vocal Fragment', duration: '2:22' },
  { id: 'v9Xp5X-lPGA', title: 'Life is Beautiful', type: 'Official Music Video', duration: '3:27' },
  { id: 'v-lY4r69Eeo', title: 'Gym Class', type: 'Official Music Video', duration: '3:40' },
  { id: 'vDBC8vjrX_I', title: 'Cry Alone', type: 'Official Music Video', duration: '3:21' },
  { id: 'f_m70nO_034', title: 'Runaway', type: 'Official Music Video', duration: '3:12' },
  { id: 'v6X5-U-G9I0', title: '16 Lines', type: 'Official Music Video', duration: '4:05' },
  { id: 'z6V2E7z3p0A', title: 'Moving On', type: 'Official Music Video', duration: '3:23' },
  { id: 'jEcl9M9u76A', title: 'When I Lie', type: 'Official Music Video', duration: '3:57' },
  { id: 'p2hE3vD0Wq4', title: 'Keep My Coo', type: 'Official Music Video', duration: '3:44' },
  { id: '3rkJ3L5Ce80', title: 'The Brightside', type: 'Official Music Video', duration: '3:45' }
];

export const Theater: React.FC = () => {
  const [videoList] = useState<VideoFragment[]>(verifiedOfficialVideos);
  const MotionDiv = motion.div as any;

  return (
    <div className="max-w-7xl mx-auto py-24 px-6 min-h-screen">
      <div className="text-center mb-24">
        <MotionDiv 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 mb-6 px-4 py-1.5 border border-[#FF007F]/20 bg-[#FF007F]/5"
        >
          <div className="w-2 h-2 rounded-full bg-[#FF007F] animate-pulse"></div>
          <span className="font-mono text-[9px] text-[#FF007F] tracking-[0.4em] uppercase font-bold">Official YouTube Feed Connection</span>
        </MotionDiv>
        
        <h2 className="font-serif-classic text-5xl md:text-7xl mb-8 tracking-[0.2em] text-white uppercase drop-shadow-[0_0_30px_rgba(255,0,127,0.2)]">THEATER</h2>
        
        <div className="flex flex-col items-center gap-6">
          <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-[0.5em] max-w-2xl mx-auto leading-relaxed">
            Archives sourced exclusively from @LilPeepofficial nodes. Visual fragments preserved for digital immortality.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
        {videoList.map((vid, idx) => (
          <MotionDiv
            key={`${vid.id}-${idx}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: idx % 6 * 0.1 }}
            className="group relative"
          >
            <div className="aspect-video bg-neutral-950 border border-neutral-800 group-hover:border-[#FF007F]/40 transition-all duration-700 overflow-hidden relative shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 opacity-30 mix-blend-overlay grain"></div>
              
              <div className="absolute inset-0 flex items-center justify-center bg-black pointer-events-none opacity-50 z-0">
                 <Youtube size={48} className="text-neutral-900" />
              </div>
              
              <iframe
                className="w-full h-full grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-[1.02] relative z-1"
                src={`https://www.youtube.com/embed/${vid.id}?controls=1&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&theme=dark`}
                title={vid.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>

              <div className="absolute bottom-0 left-0 w-full p-3 bg-black/80 backdrop-blur-md border-t border-white/5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                   <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest font-bold">Signal Encrypted</span>
                </div>
                <span className="font-mono text-[9px] text-neutral-500 tabular-nums uppercase tracking-widest">{vid.duration}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-start">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-3 mb-2">
                   <Cpu size={12} className="text-[#FF007F]" />
                   <span className="font-mono text-[9px] text-neutral-600 uppercase tracking-widest font-bold">Node_{idx.toString().padStart(2, '0')}</span>
                </div>
                <h3 className="font-serif-classic text-xl md:text-2xl text-neutral-300 group-hover:text-white group-hover:neon-text-pink transition-all duration-500 tracking-wider uppercase truncate">
                  {vid.title}
                </h3>
                <div className="flex items-center gap-3 mt-3">
                  <span className="font-mono text-[9px] text-[#7000FF] uppercase tracking-widest flex items-center gap-2 font-bold px-2 py-1 bg-[#7000FF]/5 border border-[#7000FF]/10">
                    <Film size={12} />
                    {vid.type}
                  </span>
                </div>
              </div>
              
              <a 
                href={`https://youtube.com/watch?v=${vid.id}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="shrink-0 p-3 bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-[#FF007F] hover:border-[#FF007F]/40 transition-all group/link mt-2"
              >
                <ExternalLink size={16} className="group-hover/link:rotate-12 transition-transform" />
              </a>
            </div>
          </MotionDiv>
        ))}
      </div>
    </div>
  );
};
