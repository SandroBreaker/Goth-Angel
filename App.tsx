
import React, { useState, Suspense, lazy } from 'react';
import { Header } from './components/Header.tsx';
import { ArchiveView } from './components/ArchiveView.tsx';
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

// Using dynamic import for LyricView to improve initial load and prevent blocking if dependencies have issues
const LyricView = lazy(() => import('./components/LyricView.tsx').then(m => ({ default: m.LyricView })));

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
                <p className="text-[8px] mt-4 opacity-30 font-mono text-center max-w-md">{error}</p>
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

      {/* Lyrics Immersive View with Suspense for better error boundaries */}
      {currentView === 'lyrics' && selectedSong && (
        <Suspense fallback={
          <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center font-mono text-[10px] uppercase tracking-widest text-[#FF007F]">
            Opening Artifact...
          </div>
        }>
          <LyricView 
            song={selectedSong} 
            onClose={() => navigateTo('archive')} 
          />
        </Suspense>
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
