
import React, { useState, Suspense, lazy, useCallback, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { ArchiveView } from './components/ArchiveView.tsx';
import { Timeline } from './components/Timeline.tsx';
import { TerminalView } from './components/TerminalView.tsx';
import { TheVault } from './components/TheVault.tsx';
import { Footer } from './components/Footer.tsx';
import { DonationModal } from './components/DonationModal.tsx';
import { GlobalAudioEngine } from './components/GlobalAudioEngine.tsx';
import { GlobalPlayer } from './components/GlobalPlayer.tsx';
import { PlayerProvider, usePlayer } from './context/PlayerContext.tsx';
import { useSongs } from './hooks/useSongs.ts';
import { supabase } from './services/supabaseClient.ts';
import { trackAccess } from './services/analytics.ts';
import { Song, ViewState } from './types.ts';
import { AlertCircle, Coffee } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const LyricView = lazy(() => import('./components/LyricView.tsx').then(m => ({ default: m.LyricView })));

const ensureString = (val: any): string => {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') return val.title || val.name || "Artifact";
  return String(val);
};

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('archive');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilters, setSentimentFilters] = useState<string[]>([]);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const { songs, loading, error, hasMore, loadMore } = useSongs(searchQuery, sentimentFilters);
  const { currentSong, stop } = usePlayer();

  // Rastreamento de Acesso e Telemetria
  useEffect(() => {
    trackAccess(currentView);
  }, [currentView]);

  const fetchFullSongDetails = useCallback(async (songId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('songs')
        .select('lyrics, metadata, release_date, storage_url, video_url, title')
        .eq('id', songId)
        .single();
      
      if (fetchError) throw fetchError;
      
      if (data) {
        setSelectedSong(prev => {
          if (prev && prev.id === songId) {
            return { 
              ...prev, 
              ...data,
              title: ensureString(data.title || prev.title),
              album: ensureString(data.metadata?.album || (data as any).album || prev.album || 'Single')
            };
          }
          return prev;
        });
      }
    } catch (err) {
      console.warn('Sync Error:', err);
    }
  }, []);

  useEffect(() => {
    if (currentView === 'lyrics' && currentSong) {
      if (!selectedSong || currentSong.id !== selectedSong.id) {
        setSelectedSong(currentSong);
        fetchFullSongDetails(currentSong.id);
      }
    }
  }, [currentSong, currentView, selectedSong?.id, fetchFullSongDetails]);

  const handleSongClick = useCallback(async (song: Song) => {
    setSelectedSong(song);
    setCurrentView('lyrics');
    fetchFullSongDetails(song.id);
  }, [fetchFullSongDetails]);

  const navigateTo = useCallback((view: ViewState) => {
    setCurrentView(view);
    if (view !== 'lyrics' && view !== 'terminal') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, []);

  const handleExpandPlayer = useCallback(() => {
    if (currentSong) {
      handleSongClick(currentSong);
    }
  }, [currentSong, handleSongClick]);

  const handleCloseEverything = useCallback(() => {
    stop();
    navigateTo('archive');
  }, [stop, navigateTo]);

  const MotionDiv = motion.div as any;

  return (
    <div className="min-h-screen relative z-10 flex flex-col selection:bg-[#FF007F]/30 overflow-x-hidden">
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        currentView={currentView}
        onNavigate={navigateTo}
      />

      <main className="flex-grow pt-[180px] lg:pt-[96px]">
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
        {currentView === 'terminal' && <TerminalView onClose={() => navigateTo('archive')} />}
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

      {/* Floating CTA Button */}
      <AnimatePresence>
        {currentView !== 'terminal' && currentView !== 'lyrics' && (
          <MotionDiv
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className={`fixed z-[140] right-6 md:right-10 transition-all duration-500 ${currentSong ? 'bottom-40 md:bottom-48' : 'bottom-10'}`}
          >
            <button 
              onClick={() => setIsSupportModalOpen(true)}
              className="group relative flex items-center gap-4 px-6 py-4 bg-[#050505] border border-[#FF007F]/40 shadow-[0_0_30px_rgba(255,0,127,0.1)] hover:shadow-[0_0_50px_rgba(255,0,127,0.3)] hover:border-[#FF007F] transition-all duration-500 overflow-hidden"
            >
              {/* Pulsing Glow Background */}
              <MotionDiv 
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 bg-[#FF007F]"
              />
              
              <Coffee size={18} className="relative z-10 text-[#FF007F] group-hover:rotate-12 transition-transform" />
              <div className="flex flex-col items-start relative z-10">
                <span className="font-mono text-[10px] font-bold text-white uppercase tracking-[0.3em]">Support_Project</span>
                <span className="font-mono text-[7px] text-[#FF007F] uppercase tracking-[0.2em] font-bold opacity-60">Buy me a coffee</span>
              </div>
              
              {/* Scanline inside button */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] z-0"></div>
            </button>
          </MotionDiv>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSupportModalOpen && (
          <DonationModal onClose={() => setIsSupportModalOpen(false)} />
        )}
      </AnimatePresence>

      <GlobalPlayer onExpand={handleExpandPlayer} onClose={handleCloseEverything} />
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
