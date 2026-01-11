
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Film, ExternalLink, Info, Youtube, Loader2, Search, Cpu, Globe } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

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
  const [videoList, setVideoList] = useState<VideoFragment[]>(verifiedOfficialVideos);
  const [isSearching, setIsSearching] = useState(false);
  const [discoveries, setDiscoveries] = useState<any[]>([]);
  const MotionDiv = motion.div as any;

  const fetchOfficialArchives = useCallback(async () => {
    setIsSearching(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Find the latest and top official music video links from the YouTube channel @LilPeepofficial. List the names and full URLs. Ensure they are only from the official @LilPeepofficial channel.",
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        setDiscoveries(chunks);
      }
    } catch (err) {
      console.warn("Legacy search interrupted:", err);
    } finally {
      setIsSearching(false);
    }
  }, []);

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
          
          <button 
            onClick={fetchOfficialArchives}
            disabled={isSearching}
            className="group relative flex items-center gap-4 px-8 py-3 bg-neutral-900 border border-neutral-800 hover:border-[#FF007F]/50 transition-all overflow-hidden"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 text-[#FF007F] animate-spin" />
            ) : (
              <Globe className="w-4 h-4 text-[#7000FF] group-hover:text-[#FF007F] transition-colors" />
            )}
            <span className="font-mono text-[11px] text-neutral-300 group-hover:text-white tracking-[0.3em] uppercase font-bold">
              {isSearching ? 'Synchronizing Legacy...' : 'Deep Sync @Official Channel'}
            </span>
            <div className="absolute inset-0 bg-[#FF007F]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {discoveries.length > 0 && (
          <MotionDiv
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-24 p-8 border border-[#7000FF]/20 bg-neutral-950/50 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-[#7000FF]/50" />
            <div className="flex items-center gap-3 mb-8">
              <Search size={14} className="text-[#7000FF]" />
              <span className="font-mono text-[10px] text-neutral-400 tracking-[0.4em] uppercase font-bold">External Fragments Located:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {discoveries.map((chunk, i) => (
                chunk.web && (
                  <a 
                    key={i} 
                    href={chunk.web.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-black border border-neutral-900 hover:border-[#FF007F]/40 hover:bg-neutral-900 transition-all group/link"
                  >
                    <div className="flex flex-col gap-1 overflow-hidden">
                      <span className="font-mono text-[9px] text-[#FF007F] tracking-widest uppercase font-bold">SOURCE_LINK_{i+1}</span>
                      <span className="font-serif-classic text-[11px] text-neutral-300 truncate">{chunk.web.title || 'Official Video Link'}</span>
                    </div>
                    <ExternalLink size={14} className="text-neutral-700 group-hover/link:text-white group-hover/link:scale-110 transition-all" />
                  </a>
                )
              ))}
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>

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
            
            <div className="absolute -bottom-10 -right-6 font-gothic text-8xl text-white opacity-[0.01] pointer-events-none group-hover:opacity-[0.03] transition-opacity duration-1000 select-none">
              {(idx + 1).toString().padStart(2, '0')}
            </div>
          </MotionDiv>
        ))}
      </div>

      <div className="mt-40 pt-20 border-t border-neutral-900 text-center flex flex-col items-center gap-6">
        <Loader2 className="w-8 h-8 text-neutral-800 animate-[spin_10s_linear_infinite]" />
        <p className="font-mono text-[10px] text-neutral-700 uppercase tracking-[0.8em]">End of Transmission Cycle</p>
        <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-neutral-900 to-transparent"></div>
      </div>
    </div>
  );
};
