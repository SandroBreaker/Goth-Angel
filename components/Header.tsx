import React from 'react';
import { Search, Archive, Clock, Lock, Terminal as TerminalIcon } from 'lucide-react';
import { ViewState } from '../types.ts';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  currentView, 
  onNavigate 
}) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#050505]/90 backdrop-blur-2xl border-b border-white/5 px-4 md:px-8 py-3 md:py-5 flex flex-col lg:flex-row items-center justify-between gap-3 md:gap-6 transition-all shadow-2xl">
      <div 
        className="flex items-center gap-4 cursor-pointer group w-full lg:w-auto justify-between lg:justify-start"
        onClick={() => onNavigate('archive')}
      >
        <div className="flex items-center gap-3">
          <span className="font-gothic text-3xl md:text-5xl neon-text-pink group-hover:scale-105 transition-transform duration-700">G.A.S</span>
          <div className="hidden xs:block border-l border-neutral-800 pl-4 h-8 md:h-10 flex flex-col justify-center">
            <h1 className="font-serif-classic text-[10px] md:text-[13px] tracking-[0.2em] md:tracking-[0.3em] font-bold text-neutral-300 group-hover:text-white transition-colors uppercase leading-none">
              Goth-Angel-Sinner
            </h1>
            <p className="text-[7px] md:text-[9px] font-mono text-[#FF007F]/60 tracking-[0.2em] font-bold mt-1">SANTUÁRIO DIGITAL</p>
          </div>
        </div>
        
        {/* Mobile Search Toggle or Indicator could go here */}
      </div>

      <nav className="flex items-center justify-around md:justify-center gap-1 md:gap-8 order-3 lg:order-2 w-full lg:w-auto border-t border-white/5 lg:border-none pt-2 lg:pt-0">
        <NavButton 
          active={currentView === 'archive'} 
          onClick={() => onNavigate('archive')}
          icon={<Archive className="w-4 h-4" />}
          label="ARQUIVO"
        />
        <NavButton 
          active={currentView === 'timeline'} 
          onClick={() => onNavigate('timeline')}
          icon={<Clock className="w-4 h-4" />}
          label="LINHA"
        />
        <NavButton 
          active={currentView === 'vault'} 
          onClick={() => onNavigate('vault')}
          icon={<Lock className="w-4 h-4" />}
          label="COFRE"
        />
        <NavButton 
          active={currentView === 'terminal'} 
          onClick={() => onNavigate('terminal')}
          icon={<TerminalIcon className="w-4 h-4" />}
          label="SHELL"
        />
      </nav>

      <div className="relative w-full max-w-sm group order-2 lg:order-3">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-[#FF007F] transition-colors" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="BUSCAR MEMÓRIA..."
          className="w-full bg-neutral-900/30 border border-neutral-800 py-2.5 md:py-3 pl-10 md:pl-12 pr-4 text-[10px] md:text-[12px] font-mono tracking-widest focus:outline-none focus:border-[#FF007F]/40 focus:ring-1 focus:ring-[#FF007F]/10 transition-all placeholder:text-neutral-700 text-neutral-200 rounded-sm"
        />
      </div>
    </header>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ 
  active, onClick, icon, label 
}) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center py-2 px-3 md:px-0 md:flex-row gap-1 md:gap-2 text-[7px] md:text-[10px] font-mono font-bold tracking-[0.2em] transition-all duration-300 hover:text-white group shrink-0 rounded-lg ${
      active ? 'text-[#FF007F] bg-[#FF007F]/5 lg:bg-transparent' : 'text-neutral-500'
    }`}
  >
    <span className={`${active ? 'text-[#FF007F]' : 'text-neutral-600 group-hover:text-neutral-300'} transition-colors`}>
      {icon}
    </span>
    <span className="uppercase">{label}</span>
  </button>
);