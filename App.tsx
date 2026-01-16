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
import { AlertCircle, Heart } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';

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

      {/* Floating Support Button - REFINED SIZE & PULSE ANIMATION */}
      <AnimatePresence>
        {currentView !== 'terminal' && currentView !== 'lyrics' && (
          <MotionDiv
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ 
              opacity: 1, 
              scale: [1, 1.02, 1],
              x: 0 
            }}
            transition={{
              scale: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              },
              opacity: { duration: 0.5 },
              x: { duration: 0.5 }
            }}
            exit={{ opacity: 0, scale: 0.8, x: 50 }}
            className={`fixed z-[140] right-5 md:right-8 transition-all duration-500 ${currentSong ? 'bottom-32 md:bottom-40' : 'bottom-6 md:bottom-10'}`}
          >
            <button 
              onClick={() => setIsSupportModalOpen(true)}
              className="group relative flex items-center gap-2.5 px-4 py-2.5 bg-black border border-[#FF007F] shadow-[0_0_10px_rgba(255,0,127,0.15)] hover:shadow-[0_0_30px_rgba(255,0,127,0.5)] hover:scale-105 transition-all duration-500 rounded-sm"
            >
              {/* Breathing Glow Pulse Effect */}
              <MotionDiv 
                animate={{ 
                  opacity: [0.1, 0.4, 0.1],
                  boxShadow: [
                    "0 0 5px rgba(255,0,127,0.2)",
                    "0 0 20px rgba(255,0,127,0.4)",
                    "0 0 5px rgba(255,0,127,0.2)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-[#FF007F]/5 pointer-events-none"
              />
              
              <div className="relative z-10 shrink-0">
                <Heart size={14} className="text-[#FF007F] fill-[#FF007F]/20 group-hover:fill-[#FF007F] transition-all duration-500 transform group-hover:scale-110" />
              </div>
              
              <div className="flex flex-col items-start relative z-10 border-l border-[#FF007F]/30 pl-3">
                <span className="font-gothic text-base md:text-lg text-white tracking-widest drop-shadow-[0_0_8px_rgba(255,0,127,0.4)] group-hover:text-[#FF007F] transition-colors leading-tight">Support the Archive</span>
                <span className="font-serif-classic text-[7px] text-neutral-400 uppercase tracking-[0.2em] font-bold group-hover:text-white transition-colors">Maintain the Legacy</span>
              </div>

              {/* Decorative Corner Accents */}
              <div className="absolute top-0 right-0 w-1 h-1 border-t border-r border-[#FF007F] opacity-40 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 w-1 h-1 border-b border-l border-[#FF007F] opacity-40 group-hover:opacity-100 transition-opacity" />
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
      <Analytics />
    </PlayerProvider>
  );
};

export default App;