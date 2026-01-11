
import { SongMetadata } from '../types.ts';

export interface FormattedMetadata {
  bpm: string;
  key: string;
  producers: string;
  sample: string;
  releaseDate: string;
  location: string;
}

/**
 * Safely parses the JSONB metadata field from Supabase into a display-ready format.
 */
export const parseTrackMetadata = (metadata?: SongMetadata): FormattedMetadata => {
  if (!metadata) {
    return {
      bpm: '---',
      key: 'N/A',
      producers: 'Unknown Architect',
      sample: 'Pure Signal',
      releaseDate: 'Archived',
      location: 'Digital Void'
    };
  }

  // Handle Producers (Array or single string)
  const producersList = metadata.producers 
    ? metadata.producers.join(', ') 
    : (metadata.producer || 'Unknown');

  // Handle Sample String Formatting: "Track (Artist)"
  const sampleInfo = metadata.sample?.original_track
    ? `${metadata.sample.original_track}${metadata.sample.artist ? ` (${metadata.sample.artist})` : ''}`
    : 'No Samples Detected';

  return {
    bpm: metadata.technical?.bpm?.toString() || metadata.bpm?.toString() || '---',
    key: metadata.technical?.key || 'N/A',
    producers: producersList,
    sample: sampleInfo,
    releaseDate: metadata.release_info?.date || 'N/A',
    location: metadata.technical?.location || 'Unknown'
  };
};
