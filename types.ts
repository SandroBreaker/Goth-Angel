
export interface SongMetadata {
  producers?: string[];
  technical?: {
    bpm?: number;
    key?: string;
    location?: string;
  };
  sample?: {
    original_track?: string;
    artist?: string;
    year?: number | string;
  };
  release_info?: {
    date?: string;
    platform?: string;
  };
  // Keeping original flat structure for backward compatibility with existing data
  album?: string;
  sentiment?: string;
  producer?: string;
  writer?: string;
  bpm?: number;
  genre?: string;
  duration?: string;
}

export interface Song {
  id: string;
  title: string;
  image_url: string;
  lyrics?: string;
  album?: string;
  video_url?: string;
  storage_url?: string;
  release_date?: string;
  producer?: string;
  writer?: string;
  bpm?: number;
  sentiment?: string;
  metadata?: SongMetadata;
}

export type ViewState = 'archive' | 'lyrics' | 'timeline' | 'vault' | 'terminal';

export interface AppState {
  currentView: ViewState;
  selectedSong: Song | null;
  searchQuery: string;
  filter: string | null;
}