
// Fix: Added React to the default import to resolve 'Cannot find namespace React' when using React.FC
import React, { useRef, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { usePlayer } from '../context/PlayerContext.tsx';

export const GlobalAudioEngine: React.FC = () => {
  const [hasWindow, setHasWindow] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const { 
    currentSong, 
    isPlaying, 
    setProgress, 
    setDuration, 
    seekRequest,
    nextTrack
  } = usePlayer();
  
  const playerRef = useRef<any>(null);

  // Fix: Casting ReactPlayer to any to handle React 19 type incompatibilities
  const Player = ReactPlayer as any;

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

  // Logic: ONLY allow direct MP3 URL from Supabase Storage. video_url is now blocked.
  const activeUrl = currentSong?.storage_url;

  if (!hasWindow || !activeUrl) return null;

  return (
    <div className="hidden pointer-events-none absolute opacity-0 w-0 h-0 overflow-hidden" aria-hidden="true">
      <Player
        ref={playerRef}
        url={activeUrl}
        playing={isPlaying}
        progressInterval={500} 
        onProgress={(state: any) => {
          setProgress(state.playedSeconds);
          if (isBuffering) setIsBuffering(false);
        }}
        onDuration={(d: any) => setDuration(d)}
        onEnded={() => nextTrack()}
        onBuffer={() => setIsBuffering(true)}
        onBufferEnd={() => setIsBuffering(false)}
        onError={(e: any) => {
          console.warn('Audio Engine Error:', e);
          setTimeout(() => nextTrack(), 1000);
        }}
        config={{
          file: {
            forceAudio: true,
            attributes: {
              controlsList: 'nodownload',
              preload: 'auto'
            }
          }
        } as any}
        width="0"
        height="0"
      />
    </div>
  );
};
