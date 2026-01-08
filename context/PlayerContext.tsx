
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Song } from '../types.ts';

interface PlayerContextType {
  isPlaying: boolean;
  currentSong: Song | null;
  queue: Song[];
  currentIndex: number;
  progress: number;
  duration: number;
  isShuffle: boolean;
  setPlaying: (playing: boolean) => void;
  togglePlay: () => void;
  playSong: (song: Song, newQueue?: Song[]) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  toggleShuffle: () => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  seek: (seconds: number) => void;
  seekRequest: number | null;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isShuffle, setIsShuffle] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seekRequest, setSeekRequest] = useState<number | null>(null);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const playSong = useCallback((song: Song, newQueue?: Song[]) => {
    if (newQueue && newQueue.length > 0) {
      setQueue(newQueue);
      const index = newQueue.findIndex(s => s.id === song.id);
      setCurrentIndex(index !== -1 ? index : 0);
    } else if (queue.length === 0) {
      setQueue([song]);
      setCurrentIndex(0);
    } else {
      const index = queue.findIndex(s => s.id === song.id);
      if (index !== -1) {
        setCurrentIndex(index);
      } else {
        // Append to queue if not present
        setQueue(prev => [...prev, song]);
        setCurrentIndex(queue.length);
      }
    }

    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
      setProgress(0);
    }
  }, [currentSong, queue]);

  const nextTrack = useCallback(() => {
    if (queue.length === 0) return;

    let nextIdx: number;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
      // Try not to play the same song if queue > 1
      if (nextIdx === currentIndex && queue.length > 1) {
        nextIdx = (nextIdx + 1) % queue.length;
      }
    } else {
      nextIdx = (currentIndex + 1) % queue.length;
    }

    setCurrentIndex(nextIdx);
    setCurrentSong(queue[nextIdx]);
    setIsPlaying(true);
    setProgress(0);
  }, [queue, currentIndex, isShuffle]);

  const prevTrack = useCallback(() => {
    if (queue.length === 0) return;

    // If progress > 3 seconds, just restart the song
    if (progress > 3) {
      seek(0);
      return;
    }

    const prevIdx = (currentIndex - 1 + queue.length) % queue.length;
    setCurrentIndex(prevIdx);
    setCurrentSong(queue[prevIdx]);
    setIsPlaying(true);
    setProgress(0);
  }, [queue, currentIndex, progress]);

  const toggleShuffle = () => setIsShuffle(!isShuffle);

  const seek = (seconds: number) => {
    setSeekRequest(seconds);
    setTimeout(() => setSeekRequest(null), 50);
  };

  return (
    <PlayerContext.Provider value={{ 
      isPlaying, 
      currentSong, 
      queue,
      currentIndex,
      progress, 
      duration, 
      isShuffle,
      setPlaying: setIsPlaying,
      togglePlay, 
      playSong, 
      nextTrack,
      prevTrack,
      toggleShuffle,
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
