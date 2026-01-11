
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
    <header className="fixed top-0 left-0 w-full z-50 bg-[#050505]/95 backdrop-blur-xl border-b border-neutral-800 px-4 md:px-6 py-4 md:py-5 flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6 transition-all">
      <div 
        className="flex items-center gap-3 md:gap-4 cursor-pointer group w-full lg:w-auto justify-between lg:justify-start"
        onClick={() => onNavigate('archive')}
      >
        <div className="flex items-center gap-3">
          <span className="font-gothic text-4xl md:text-5xl neon-text-pink group-hover:scale-105 transition-transform duration-700">G.A.S</span>
          <div className="hidden xs:block border-l border-neutral-800 pl-4">
            <h1 className="font-serif-classic text-[11px] md:text-[13px] tracking-[0.3em] font-bold text-neutral-300 group-hover:text-white transition-colors uppercase">
              Goth-Angel-Sinner
            </h1>
            <p className="text-[8px] md:text-[10px] font-mono text-[#FF007F]/60 tracking-[0.2em] font-bold">DIGITAL SANCTUARY</p>
          </div>
        </div>
      </div>

      <nav className="flex items-center gap-4 md:gap-8 order-3 lg:order-2 w-full lg:w-auto overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide justify-between lg:justify-center">
        <NavButton 
          active={currentView === 'archive'} 
          onClick={() => onNavigate('archive')}
          icon={<Archive className="w-4 h-4" />}
          label="ARCHIVE"
        />
        <NavButton 
          active={currentView === 'timeline'} 
          onClick={() => onNavigate('timeline')}
          icon={<Clock className="w-4 h-4" />}
          label="TIMELINE"
        />
        <NavButton 
          active={currentView === 'vault'} 
          onClick={() => onNavigate('vault')}
          icon={<Lock className="w-4 h-4" />}
          label="VAULT"
        />
        <NavButton 
          active={currentView === 'terminal'} 
          onClick={() => onNavigate('terminal')}
          icon={<TerminalIcon className="w-4 h-4" />}
          label="TERMINAL"
        />
      </nav>

      <div className="relative w-full max-w-sm group order-2 lg:order-3">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-[#FF007F] transition-colors" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="SEARCH MEMORY..."
          className="w-full bg-neutral-900/50 border border-neutral-800 py-3 pl-12 pr-4 text-[10px] md:text-[12px] font-mono tracking-widest focus:outline-none focus:border-[#FF007F]/50 focus:ring-1 focus:ring-[#FF007F]/20 transition-all placeholder:text-neutral-600 text-neutral-200"
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
    className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 text-[8px] md:text-[10px] font-mono font-bold tracking-[0.2em] transition-all duration-500 hover:text-white group shrink-0 ${
      active ? 'text-[#FF007F]' : 'text-neutral-400'
    }`}
  >
    <span className={`${active ? 'text-[#FF007F]' : 'text-neutral-600 group-hover:text-neutral-300'} transition-colors`}>
      {icon}
    </span>
    <span className="uppercase">{label}</span>
  </button>
);
