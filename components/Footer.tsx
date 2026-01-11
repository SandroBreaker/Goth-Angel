
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-16 px-6 border-t border-neutral-900/30 flex flex-col items-center gap-4 bg-black/40">
      <div className="flex flex-col items-center gap-2">
        <span className="font-gothic text-2xl text-neutral-800 select-none">Lil Peep Memorial</span>
        <span className="text-[9px] font-mono text-neutral-900 uppercase tracking-[0.5em]">The Eternal Sanctuary</span>
      </div>
      <div className="text-[8px] font-mono text-neutral-800 tracking-widest uppercase mt-8 opacity-40 hover:opacity-100 transition-opacity">
        Curated by SandroBreaker &bull; Digital Preservation Archive &copy; 2025
      </div>
    </footer>
  );
};
