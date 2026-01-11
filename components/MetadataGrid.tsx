
import React from 'react';
import { Music, Activity, Cpu, Layers, MapPin } from 'lucide-react';
import { SongMetadata } from '../types.ts';
import { parseTrackMetadata } from '../utils/metadataParser.ts';

interface MetadataGridProps {
  metadata?: SongMetadata;
  className?: string;
}

export const MetadataGrid: React.FC<MetadataGridProps> = ({ metadata, className = "" }) => {
  const data = parseTrackMetadata(metadata);

  return (
    <div className={`grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 w-full ${className}`}>
      <TechCard 
        icon={<Activity size={10} />} 
        label="Tempo" 
        value={`${data.bpm} BPM`} 
      />
      <TechCard 
        icon={<Music size={10} />} 
        label="Key" 
        value={data.key} 
      />
      <TechCard 
        icon={<Cpu size={10} />} 
        label="Engineers" 
        value={data.producers} 
      />
      <TechCard 
        icon={<Layers size={10} />} 
        label="Genetic Sample" 
        value={data.sample} 
      />
      <TechCard 
        icon={<MapPin size={10} />} 
        label="Node" 
        value={data.location} 
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
  <div className={`flex flex-col gap-0.5 px-2 py-1.5 border border-neutral-900 bg-black/40 hover:border-neutral-800 transition-colors group ${className}`}>
    <div className="flex items-center gap-1.5 mb-0.5">
      <span className="text-[#FF007F]/60 group-hover:text-[#FF007F] transition-colors">{icon}</span>
      <span className="font-mono text-[7px] md:text-[8px] text-neutral-600 uppercase tracking-widest font-bold">{label}</span>
    </div>
    <div className="font-mono text-[9px] md:text-[10px] text-neutral-300 uppercase tracking-wider truncate font-bold group-hover:text-white transition-colors">
      {value}
    </div>
  </div>
);
