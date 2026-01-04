
import React, { useState } from 'react';
import { Header } from './components/Header.tsx';
import { SongCard } from './components/SongCard.tsx';
import { SkeletonCard } from './components/SkeletonCard.tsx';
import { LyricView } from './components/LyricView.tsx';
import { DevSpace } from './components/DevSpace.tsx';
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
    if (view === 'archive') setSelectedSong(null);
  };

  const sentiments = ['Melancholy', 'Energetic', 'Sad', 'Dark', 'Hopeful'];

  return (
    <div className="min-h-screen relative z-10">
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        currentView={currentView}
        onNavigate={navigateTo}
      />

      <main>
        {currentView === 'archive' && (
          <div className="px-6 py-8">
            {/* Filter Section */}
            <div className="mb-8 flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex items-center gap-2 text-neutral-600 px-2">
                <Filter size={14} />
                <span className="text-[10px] font-mono uppercase tracking-widest">Vibe</span>
              </div>
              <button
                onClick={() => setSentimentFilter(null)}
                className={`px-4 py-1.5 text-[10px] font-mono border transition-all ${
                  !sentimentFilter ? 'border-[#FF007F] text-[#FF007F] bg-[#FF007F]/5' : 'border-neutral-800 text-neutral-500 hover:border-neutral-600'
                }`}
              >
                ALL_VOID
              </button>
              {sentiments.map((s) => (
                <button
                  key={s}
                  onClick={() => setSentimentFilter(s)}
                  className={`px-4 py-1.5 text-[10px] font-mono border transition-all uppercase ${
                    sentimentFilter === s ? 'border-[#7000FF] text-[#7000FF] bg-[#7000FF]/5' : 'border-neutral-800 text-neutral-500 hover:border-neutral-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {error && (
              <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
                <AlertCircle className="w-12 h-12 mb-4 text-red-900" />
                <p className="font-mono text-xs uppercase tracking-widest">Error accessing the archive</p>
                <p className="text-[10px] mt-2 opacity-50">{error}</p>
              </div>
            )}

            {!error && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0.5">
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
                  <div className="col-span-full text-center py-40">
                    <p className="font-gothic text-4xl opacity-10 select-none">Nothing found in the dark</p>
                    <p className="font-mono text-[10px] text-neutral-600 uppercase mt-4 tracking-widest">
                      Your query returned zero results
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {currentView === 'developer' && <DevSpace />}
      </main>

      {/* Lyrics Immersive Modal */}
      {currentView === 'lyrics' && selectedSong && (
        <LyricView 
          song={selectedSong} 
          onClose={() => navigateTo('archive')} 
        />
      )}

      {/* Footer Branding */}
      <footer className="py-12 px-6 border-t border-neutral-900/50 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <span className="font-gothic text-xl text-neutral-700">Lil Peep Memorial</span>
          <span className="text-[10px] font-mono text-neutral-800 uppercase tracking-[0.4em]">Forever</span>
        </div>
        <div className="text-[9px] font-mono text-neutral-600 tracking-widest uppercase">
          Build by Alê // SandroBreaker &copy; 2024
        </div>
      </footer>
    </div>
  );
};

export default App;
