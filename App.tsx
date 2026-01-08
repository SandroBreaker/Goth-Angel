
import { useState, Suspense, lazy, useCallback, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { ArchiveView } from './components/ArchiveView.tsx';
import { Timeline } from './components/Timeline.tsx';
import { Theater } from './components/Theater.tsx';
import { TheVault } from './components/TheVault.tsx';
import { Footer } from './components/Footer.tsx';
import { GlobalAudioEngine } from './components/GlobalAudioEngine.tsx';
import { GlobalPlayer } from './components/GlobalPlayer.tsx';
import { PlayerProvider, usePlayer } from './context/PlayerContext.tsx';
import { useSongs } from './hooks/useSongs.ts';
import { supabase } from './services/supabaseClient.ts';
import { Song, ViewState } from './types.ts';
import { AlertCircle } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const LyricView = lazy(() => import('./components/LyricView.tsx').then(m => ({ default: m.LyricView })));

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('archive');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<string | null>(null);

  const { songs, loading, error, hasMore, loadMore } = useSongs(searchQuery, sentimentFilter);
  const { currentSong } = usePlayer();

  // Reusable function to fetch full artifact details (lyrics, metadata, etc)
  const fetchFullSongDetails = useCallback(async (songId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('songs')
        .select('lyrics, metadata, release_date, storage_url, video_url, album, producer')
        .eq('id', songId)
        .single();
      
      if (!fetchError && data) {
        setSelectedSong(prev => {
          if (prev && prev.id === songId) {
            return { 
              ...prev, 
              ...data,
              album: data.metadata?.album || data.album || prev.album || 'Single'
            };
          }
          return prev;
        });
      }
    } catch (err) {
      console.warn('Archive Sync: Could not retrieve full artifact details.', err);
    }
  }, []);

  // Sync selectedSong with the global player's current track and fetch lyrics if needed
  useEffect(() => {
    if (currentView === 'lyrics' && currentSong) {
      if (!selectedSong || currentSong.id !== selectedSong.id) {
        setSelectedSong(currentSong);
        // Automatically fetch lyrics for the new song skipped in the player
        fetchFullSongDetails(currentSong.id);
      }
    }
  }, [currentSong, currentView, selectedSong?.id, fetchFullSongDetails]);

  const handleSongClick = useCallback(async (song: Song) => {
    setSelectedSong(song);
    setCurrentView('lyrics');
    // Fetch details immediately on click
    fetchFullSongDetails(song.id);
  }, [fetchFullSongDetails]);

  const navigateTo = useCallback((view: ViewState) => {
    setCurrentView(view);
    if (view !== 'lyrics') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, []);

  return (
    <div className="min-h-screen relative z-10 flex flex-col selection:bg-[#FF007F]/30 overflow-x-hidden">
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
                <p className="font-mono text-[10px] uppercase tracking-[0.5em]">System Offline</p>
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

      <AnimatePresence>
        {currentView === 'lyrics' && selectedSong && (
          <Suspense fallback={null}>
            <LyricView 
              song={selectedSong} 
              onClose={() => navigateTo('archive')} 
            />
          </Suspense>
        )}
      </AnimatePresence>

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
