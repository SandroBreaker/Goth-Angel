
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-24 px-8 border-t border-neutral-900 flex flex-col items-center gap-6 bg-black/60 relative z-10">
      <div className="flex flex-col items-center gap-3">
        <span className="font-gothic text-4xl text-neutral-600 select-none opacity-50">Lil Peep Memorial</span>
        <span className="text-[12px] font-mono text-[#FF007F]/40 uppercase tracking-[0.6em] font-bold">The Eternal Sanctuary</span>
      </div>
      <div className="h-px w-20 bg-neutral-900"></div>
      <div className="text-[11px] font-mono text-neutral-500 tracking-[0.3em] uppercase opacity-60 hover:opacity-100 transition-opacity flex flex-col items-center gap-2">
        <span>Curated by SandroBreaker &bull; Digital Preservation Archive</span>
        <span className="text-[9px] text-neutral-700 font-bold">&copy; 2025 ALL FRAGMENTS PRESERVED</span>
      </div>
    </footer>
  );
};
