
export interface Song {
  id: string;
  title: string;
  album: string;
  image_url: string;
  lyrics: string;
  release_date?: string;
  producer?: string;
  writer?: string;
  bpm?: number;
  sentiment?: string;
  metadata?: {
    sentiment?: string;
    producer?: string;
    writer?: string;
    bpm?: number;
    genre?: string;
    duration?: string;
  };
}

export type ViewState = 'archive' | 'lyrics' | 'developer';

export interface AppState {
  currentView: ViewState;
  selectedSong: Song | null;
  searchQuery: string;
  filter: string | null;
}
