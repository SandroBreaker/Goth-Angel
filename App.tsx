
import React, { useState } from 'react';
import { Header } from './components/Header.tsx';
import { SongCard } from './components/SongCard.tsx';
import { SkeletonCard } from './components/SkeletonCard.tsx';
import { LyricView } from './components/LyricView.tsx';
import { Timeline } from './components/Timeline.tsx';
import { Theater } from './components/Theater.tsx';
import { TheVault } from './components/TheVault.tsx';
import { Footer } from './components/Footer.tsx';
import { useSongs } from './hooks/useSongs.ts';
import { Song, ViewState } from './types.ts';
import { AlertCircle, Filter } from 'lucide-react';

const App: React.FC = () => {
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
    // When navigating away from lyrics, clear selection
    if (view !== 'lyrics') {
      window.scrollTo(0, 0);
    }
  };

  const sentiments = ['Melancholy', 'Energetic', 'Sad', 'Dark', 'Hopeful'];

  return (
    <div className="min-h-screen relative z-10 flex flex-col">
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        currentView={currentView}
        onNavigate={navigateTo}
      />

      <main className="flex-grow">
        {currentView === 'archive' && (
          <div className="px-6 py-12">
            <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-8 border-b border-neutral-900 pb-8">
               <div>
                 <h2 className="font-serif-classic text-2xl tracking-[0.2em] text-white">THE ARCHIVE</h2>
                 <p className="font-mono text-[9px] text-neutral-600 uppercase tracking-[0.4em] mt-1">Cataloging the frequency of emotion</p>
               </div>

              <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide max-w-full">
                <div className="flex items-center gap-2 text-neutral-700 px-2 shrink-0">
                  <Filter size={12} />
                  <span className="text-[9px] font-mono uppercase tracking-widest">Resonance</span>
                </div>
                <button
                  onClick={() => setSentimentFilter(null)}
                  className={`px-4 py-1.5 text-[9px] font-mono border transition-all shrink-0 ${
                    !sentimentFilter ? 'border-[#FF007F]/40 text-[#FF007F] bg-[#FF007F]/5' : 'border-neutral-900 text-neutral-600 hover:border-neutral-700'
                  }`}
                >
                  ALL_VOID
                </button>
                {sentiments.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSentimentFilter(s)}
                    className={`px-4 py-1.5 text-[9px] font-mono border transition-all uppercase shrink-0 ${
                      sentimentFilter === s ? 'border-[#7000FF]/40 text-[#7000FF] bg-[#7000FF]/5' : 'border-neutral-900 text-neutral-600 hover:border-neutral-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="flex flex-col items-center justify-center py-40 text-neutral-600">
                <AlertCircle className="w-10 h-10 mb-6 text-red-950/40" />
                <p className="font-mono text-[10px] uppercase tracking-[0.5em]">The Archive is currently unreachable</p>
                <p className="text-[8px] mt-4 opacity-30 font-mono">{error}</p>
              </div>
            )}

            {!error && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {loading ? (
                  Array.from({ length: 15 }).map((_, i) => <SkeletonCard key={i} />)
                ) : (
                  songs.map((song) => (
                    <SongCard 
                      key={song.id} 
                      song={song} 
                      onClick={handleSongClick} 
                    />
                  ))
                )}
                {!loading && songs.length === 0 && (
                  <div className="col-span-full text-center py-60">
                    <p className="font-gothic text-5xl opacity-5 select-none tracking-widest">Void</p>
                    <p className="font-mono text-[9px] text-neutral-700 uppercase mt-6 tracking-[0.6em]">
                      No frequencies detected for this query
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {currentView === 'timeline' && <Timeline />}
        {currentView === 'theater' && <Theater />}
        {currentView === 'vault' && <TheVault />}
      </main>

      {/* Lyrics Immersive Modal */}
      {currentView === 'lyrics' && selectedSong && (
        <LyricView 
          song={selectedSong} 
          onClose={() => navigateTo('archive')} 
        />
      )}

      <Footer />
    </div>
  );
};

export default App;
