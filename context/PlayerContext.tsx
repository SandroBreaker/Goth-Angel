
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Song } from '../types.ts';

interface PlayerContextType {
  isPlaying: boolean;
  currentSong: Song | null;
  progress: number;
  duration: number;
  setPlaying: (playing: boolean) => void;
  togglePlay: () => void;
  playSong: (song: Song) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  seek: (seconds: number) => void;
  seekRequest: number | null;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seekRequest, setSeekRequest] = useState<number | null>(null);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const playSong = (song: Song) => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
      setProgress(0);
    }
  };

  const seek = (seconds: number) => {
    setSeekRequest(seconds);
    // Reset the request after a tick (handled by the engine)
    setTimeout(() => setSeekRequest(null), 50);
  };

  return (
    <PlayerContext.Provider value={{ 
      isPlaying, 
      currentSong, 
      progress, 
      duration, 
      setPlaying: setIsPlaying,
      togglePlay, 
      playSong, 
      setProgress, 
      setDuration,
      seek,
      seekRequest
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within a PlayerProvider');
  return context;
};
