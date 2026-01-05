
import React, { useRef, useEffect } from 'react';
import ReactPlayer from 'https://esm.sh/react-player/youtube';
import { usePlayer } from '../context/PlayerContext.tsx';

export const GlobalAudioEngine: React.FC = () => {
  const { 
    currentSong, 
    isPlaying, 
    setPlaying, 
    setProgress, 
    setDuration, 
    seekRequest 
  } = usePlayer();
  
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (seekRequest !== null && playerRef.current) {
      playerRef.current.seekTo(seekRequest, 'seconds');
    }
  }, [seekRequest]);

  if (!currentSong?.video_url) return null;

  return (
    <div className="hidden pointer-events-none absolute opacity-0 w-0 h-0 overflow-hidden">
      <ReactPlayer
        ref={playerRef}
        url={currentSong.video_url}
        playing={isPlaying}
        onProgress={({ playedSeconds }) => setProgress(playedSeconds)}
        onDuration={(d) => setDuration(d)}
        onEnded={() => setPlaying(false)}
        onError={(e) => console.error('Audio Engine Error:', e)}
        config={{
          youtube: {
            playerVars: { showinfo: 0, controls: 0, modestbranding: 1 }
          }
        }}
      />
    </div>
  );
};
