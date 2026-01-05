
import React, { useRef, useEffect, useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import { usePlayer } from '../context/PlayerContext.tsx';

export const GlobalAudioEngine: React.FC = () => {
  const [hasWindow, setHasWindow] = useState(false);
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
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  useEffect(() => {
    if (seekRequest !== null && playerRef.current && hasWindow) {
      playerRef.current.seekTo(seekRequest, 'seconds');
    }
  }, [seekRequest, hasWindow]);

  if (!hasWindow || !currentSong?.video_url) return null;

  return (
    <div className="hidden pointer-events-none absolute opacity-0 w-0 h-0 overflow-hidden" aria-hidden="true">
      <ReactPlayer
        ref={playerRef}
        url={currentSong.video_url}
        playing={isPlaying}
        onProgress={({ playedSeconds }) => setProgress(playedSeconds)}
        onDuration={(d) => setDuration(d)}
        onEnded={() => setPlaying(false)}
        onError={(e) => {
          console.error('Audio Engine Error:', e);
          setPlaying(false);
        }}
        config={{
          youtube: {
            playerVars: { 
              showinfo: 0, 
              controls: 0, 
              modestbranding: 1,
              rel: 0,
              origin: typeof window !== "undefined" ? window.location.origin : ""
            }
          }
        }}
        width="0"
        height="0"
      />
    </div>
  );
};
