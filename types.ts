
export interface Song {
  id: string;
  title: string;
  image_url: string;
  lyrics?: string;
  album?: string;
  video_url?: string;
  release_date?: string;
  producer?: string;
  writer?: string;
  bpm?: number;
  sentiment?: string;
  metadata?: {
    album?: string;
    sentiment?: string;
    producer?: string;
    writer?: string;
    bpm?: number;
    genre?: string;
    duration?: string;
  };
}

export type ViewState = 'archive' | 'lyrics' | 'timeline' | 'vault' | 'theater';

export interface AppState {
  currentView: ViewState;
  selectedSong: Song | null;
  searchQuery: string;
  filter: string | null;
}
