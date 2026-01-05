
import React, { useState } from 'react';
import { Header } from './components/Header.tsx';
import { ArchiveView } from './components/ArchiveView.tsx';
import { LyricView } from './components/LyricView.tsx';
import { Timeline } from './components/Timeline.tsx';
import { Theater } from './components/Theater.tsx';
import { TheVault } from './components/TheVault.tsx';
import { Footer } from './components/Footer.tsx';
import { GlobalAudioEngine } from './components/GlobalAudioEngine.tsx';
import { GlobalPlayer } from './components/GlobalPlayer.tsx';
import { PlayerProvider } from './context/PlayerContext.tsx';
import { useSongs } from './hooks/useSongs.ts';
import { Song, ViewState } from './types.ts';
import { AlertCircle } from 'lucide-react';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('archive');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<string | null>(null);

  const { songs, loading, error } = useSongs(searchQuery, sentimentFilter);

  const handleSongClick = (song: Song) => {
    setSelectedSong(song);
    setCurrentView('lyrics');
  };

  const navigateTo = (view: ViewState) => {
    setCurrentView(view);
    if (view !== 'lyrics') {
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen relative z-10 flex flex-col selection:bg-[#FF007F]/30">
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        currentView={currentView}
        onNavigate={navigateTo}
      />

      <main className="flex-grow">
        {currentView === 'archive' && (
          <>
            {error && (
              <div className="flex flex-col items-center justify-center py-40 text-neutral-600">
                <AlertCircle className="w-10 h-10 mb-6 text-red-950/40" />
                <p className="font-mono text-[10px] uppercase tracking-[0.5em]">The Archive is currently unreachable</p>
                <p className="text-[8px] mt-4 opacity-30 font-mono">{error}</p>
              </div>
            )}
            
            {!error && (
              <ArchiveView 
                songs={songs} 
                loading={loading} 
                onSongClick={handleSongClick} 
              />
            )}
          </>
        )}

        {currentView === 'timeline' && <Timeline />}
        {currentView === 'theater' && <Theater />}
        {currentView === 'vault' && <TheVault />}
      </main>

      {/* Lyrics Immersive View */}
      {currentView === 'lyrics' && selectedSong && (
        <LyricView 
          song={selectedSong} 
          onClose={() => navigateTo('archive')} 
        />
      )}

      <Footer />
      <GlobalPlayer />
      <GlobalAudioEngine />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <PlayerProvider>
      <AppContent />
    </PlayerProvider>
  );
};

export default App;
