
import { useState, Suspense, lazy } from 'react';
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
import { supabase } from './services/supabaseClient.ts';
import { Song, ViewState } from './types.ts';
import { AlertCircle } from 'lucide-react';

const LyricView = lazy(() => import('./components/LyricView.tsx').then(m => ({ default: m.LyricView })));

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('archive');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<string | null>(null);

  const { songs, loading, error, hasMore, loadMore } = useSongs(searchQuery, sentimentFilter);

  const handleSongClick = async (song: Song) => {
    if (!song.lyrics) {
      try {
        // FIX: Removed columns that likely don't exist as top-level fields.
        // These are typically inside the 'metadata' JSONB column in the provided dataset.
        const { data, error: fetchError } = await supabase
          .from('songs')
          .select('lyrics, metadata, release_date')
          .eq('id', song.id)
          .single();
        
        if (fetchError) throw fetchError;

        if (data) {
          const fullSong = { 
            ...song, 
            ...data,
            album: data.metadata?.album || song.album || 'Single'
          };
          setSelectedSong(fullSong);
        } else {
          setSelectedSong(song);
        }
      } catch (err) {
        console.warn('Archive: Could not fetch full artifact details, using partial data.', err);
        setSelectedSong(song);
      }
    } else {
      setSelectedSong(song);
    }
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
                hasMore={hasMore}
                onLoadMore={loadMore}
                onSongClick={handleSongClick} 
              />
            )}
          </>
        )}

        {currentView === 'timeline' && <Timeline />}
        {currentView === 'theater' && <Theater />}
        {currentView === 'vault' && <TheVault />}
      </main>

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
