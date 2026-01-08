
import { useRef, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { usePlayer } from '../context/PlayerContext.tsx';

export const GlobalAudioEngine: React.FC = () => {
  const [hasWindow, setHasWindow] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const { 
    currentSong, 
    isPlaying, 
    setPlaying, 
    setProgress, 
    setDuration, 
    seekRequest,
    nextTrack
  } = usePlayer();
  
  const playerRef = useRef<any>(null);

  // Fix: Casting ReactPlayer to any to handle React 19 type incompatibilities with legacy player components
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

  // Logic: Prioritize direct MP3 URL from Supabase Storage, fallback to YouTube
  const activeUrl = currentSong?.storage_url || currentSong?.video_url;

  if (!hasWindow || !activeUrl) return null;

  return (
    <div className="hidden pointer-events-none absolute opacity-0 w-0 h-0 overflow-hidden" aria-hidden="true">
      {/* Fix: Using casted Player component to avoid Prop 'url' missing error */}
      <Player
        ref={playerRef}
        url={activeUrl}
        playing={isPlaying}
        // Throttling progress updates to 500ms for performance
        progressInterval={500} 
        // Use any to bypass React 19 SyntheticEvent inference issues
        onProgress={(state: any) => {
          setProgress(state.playedSeconds);
          if (isBuffering) setIsBuffering(false);
        }}
        onDuration={(d: any) => setDuration(d)}
        onEnded={() => nextTrack()} // Trigger auto-play for next item in queue
        onBuffer={() => setIsBuffering(true)}
        onBufferEnd={() => setIsBuffering(false)}
        onError={(e: any) => {
          console.warn('Audio Engine Frequency Error (Source switch or network):', e);
          // Auto skip if error occurs
          setTimeout(() => nextTrack(), 1000);
        }}
        // Use any to bypass conflicting YouTube playerVars types in current environment
        config={{
          file: {
            forceAudio: true,
            attributes: {
              controlsList: 'nodownload',
              preload: 'auto'
            }
          },
          youtube: {
            playerVars: { 
              showinfo: 0, 
              controls: 0, 
              modestbranding: 1,
              rel: 0,
              origin: typeof window !== "undefined" ? window.location.origin : ""
            }
          }
        } as any}
        width="0"
        height="0"
      />
    </div>
  );
};
