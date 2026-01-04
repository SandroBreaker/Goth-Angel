
import React from 'react';
import { Search, Archive, User, Zap } from 'lucide-react';
import { ViewState } from '../types';

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
    <header className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-md border-b border-neutral-900 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => onNavigate('archive')}
      >
        <span className="font-gothic text-3xl neon-text-pink group-hover:scale-110 transition-transform">G.A.S</span>
        <div className="hidden md:block">
          <h1 className="font-serif-classic text-xs tracking-[0.3em] font-bold text-neutral-400 group-hover:text-white transition-colors uppercase">
            Goth-Angel-Sinner
          </h1>
          <p className="text-[9px] font-mono text-neutral-600 tracking-wider">ARCHIVE & PORTFOLIO</p>
        </div>
      </div>

      <div className="relative w-full max-w-xl group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-[#FF007F] transition-colors" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="SEARCH THE VOID..."
          className="w-full bg-neutral-950 border border-neutral-800 py-2.5 pl-10 pr-4 text-xs font-mono tracking-widest focus:outline-none focus:border-[#FF007F] focus:ring-1 focus:ring-[#FF007F]/30 transition-all placeholder:text-neutral-700"
        />
        <div className="absolute inset-0 -z-10 bg-[#FF007F]/5 blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
      </div>

      <nav className="flex items-center gap-6">
        <NavButton 
          active={currentView === 'archive'} 
          onClick={() => onNavigate('archive')}
          icon={<Archive className="w-4 h-4" />}
          label="ARCHIVE"
        />
        <NavButton 
          active={currentView === 'developer'} 
          onClick={() => onNavigate('developer')}
          icon={<User className="w-4 h-4" />}
          label="THE DEV"
        />
      </nav>
    </header>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ 
  active, onClick, icon, label 
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] transition-all hover:text-[#FF007F] ${
      active ? 'text-[#FF007F]' : 'text-neutral-500'
    }`}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);
