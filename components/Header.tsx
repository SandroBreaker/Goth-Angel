
import React from 'react';
import { Search, Archive, Clock, Lock, PlayCircle } from 'lucide-react';
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
    <header className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-xl border-b border-neutral-900/50 px-6 py-4 flex flex-col lg:flex-row items-center justify-between gap-6 transition-all">
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => onNavigate('archive')}
      >
        <span className="font-gothic text-4xl neon-text-pink group-hover:scale-105 transition-transform duration-700">G.A.S</span>
        <div className="hidden sm:block">
          <h1 className="font-serif-classic text-[10px] tracking-[0.4em] font-bold text-neutral-500 group-hover:text-white transition-colors uppercase">
            Goth-Angel-Sinner
          </h1>
          <p className="text-[8px] font-mono text-neutral-700 tracking-[0.2em]">DIGITAL SANCTUARY</p>
        </div>
      </div>

      <nav className="flex items-center gap-4 md:gap-8 order-3 lg:order-2">
        <NavButton 
          active={currentView === 'archive'} 
          onClick={() => onNavigate('archive')}
          icon={<Archive className="w-3.5 h-3.5" />}
          label="THE ARCHIVE"
        />
        <NavButton 
          active={currentView === 'timeline'} 
          onClick={() => onNavigate('timeline')}
          icon={<Clock className="w-3.5 h-3.5" />}
          label="TIMELINE"
        />
        <NavButton 
          active={currentView === 'vault'} 
          onClick={() => onNavigate('vault')}
          icon={<Lock className="w-3.5 h-3.5" />}
          label="THE VAULT"
        />
        <NavButton 
          active={currentView === 'theater'} 
          onClick={() => onNavigate('theater')}
          icon={<PlayCircle className="w-3.5 h-3.5" />}
          label="THEATER"
        />
      </nav>

      <div className="relative w-full max-w-xs group order-2 lg:order-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-700 group-focus-within:text-[#FF007F] transition-colors" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="SEARCH THE MEMORY..."
          className="w-full bg-neutral-950/50 border border-neutral-900 py-2 pl-9 pr-4 text-[10px] font-mono tracking-widest focus:outline-none focus:border-[#FF007F]/50 focus:ring-1 focus:ring-[#FF007F]/10 transition-all placeholder:text-neutral-800 text-neutral-400"
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
    className={`flex items-center gap-2 text-[9px] font-mono tracking-[0.3em] transition-all duration-500 hover:text-white group ${
      active ? 'text-[#FF007F]' : 'text-neutral-600'
    }`}
  >
    <span className={`${active ? 'text-[#FF007F]' : 'text-neutral-700 group-hover:text-neutral-400'} transition-colors`}>
      {icon}
    </span>
    <span className="hidden sm:inline">{label}</span>
  </button>
);
