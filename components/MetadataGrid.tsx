
import React from 'react';
import { Music, Activity, Cpu, Layers, MapPin, Zap } from 'lucide-react';
import { Song } from '../types.ts';
import { parseTrackMetadata } from '../utils/metadataParser.ts';

interface MetadataGridProps {
  song: Song;
  className?: string;
}

export const MetadataGrid: React.FC<MetadataGridProps> = ({ song, className = "" }) => {
  const data = parseTrackMetadata(song);

  return (
    <div className={`grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3 w-full ${className}`}>
      <TechCard 
        icon={<Activity size={10} />} 
        label={data.tempo.label} 
        value={data.tempo.value} 
      />
      <TechCard 
        icon={<Music size={10} />} 
        label={data.key.label} 
        value={data.key.value} 
      />
      <TechCard 
        icon={<Cpu size={10} />} 
        label={data.producers.label} 
        value={data.producers.value} 
      />
      <TechCard 
        icon={<Layers size={10} />} 
        label={data.sample.label} 
        value={data.sample.value} 
      />
      <TechCard 
        icon={<MapPin size={10} />} 
        label={data.location.label} 
        value={data.location.value} 
        className="hidden md:flex"
      />
    </div>
  );
};

interface TechCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}

const TechCard: React.FC<TechCardProps> = ({ icon, label, value, className = "" }) => (
  <div className={`flex flex-col gap-0.5 px-3 py-2 border border-neutral-900 bg-black/60 hover:border-neutral-800 transition-all duration-300 group cursor-default relative overflow-hidden ${className}`}>
    {/* Efeito de scanline sutil interno */}
    <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    
    <div className="flex items-center gap-1.5 mb-0.5 relative z-10">
      <span className="text-[#FF007F]/40 group-hover:text-[#FF007F] transition-colors duration-500">{icon}</span>
      <span className="font-mono text-[7px] md:text-[8px] text-neutral-600 uppercase tracking-[0.3em] font-bold group-hover:text-neutral-500 transition-colors">
        {label}
      </span>
    </div>
    
    <div className="font-mono text-[9px] md:text-[10px] text-neutral-300 uppercase tracking-widest truncate font-bold group-hover:text-white transition-colors relative z-10">
      {value}
    </div>
  </div>
);
