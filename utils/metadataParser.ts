
import { Song, SongMetadata } from '../types.ts';

export interface FormattedMetadataItem {
  label: string;
  value: string;
}

export interface FormattedMetadata {
  tempo: FormattedMetadataItem;
  key: FormattedMetadataItem;
  producers: FormattedMetadataItem;
  sample: FormattedMetadataItem;
  location: FormattedMetadataItem;
}

/**
 * Analisa os metadados e retorna fallbacks inteligentes caso os dados técnicos estejam faltando.
 */
export const parseTrackMetadata = (song: Song): FormattedMetadata => {
  const m = song.metadata || {};

  // 1. TEMPO / FREQUENCY
  const tempoValue = m.technical?.bpm || m.bpm || song.bpm;
  const tempo: FormattedMetadataItem = tempoValue 
    ? { label: 'Tempo', value: `${tempoValue} BPM` }
    : { label: 'Sentiment', value: (m.sentiment || song.sentiment || 'Atmospheric').toUpperCase() };

  // 2. KEY / CONTEXT
  const keyValue = m.technical?.key;
  const key: FormattedMetadataItem = keyValue
    ? { label: 'Key', value: keyValue }
    : { label: 'Release', value: song.release_date?.split('-')[0] || 'Unknown' };

  // 3. ENGINEERS / ARCHITECTS
  const producersList = m.producers?.join(', ') || m.producer || song.producer;
  const producers: FormattedMetadataItem = producersList
    ? { label: 'Engineers', value: producersList }
    : { label: 'Author', value: song.writer || m.writer || 'G. Åhr' };

  // 4. GENETIC SAMPLE / ORIGIN
  const sampleInfo = m.sample?.original_track 
    ? `${m.sample.original_track}${m.sample.artist ? ` (${m.sample.artist})` : ''}`
    : null;
  const sample: FormattedMetadataItem = sampleInfo
    ? { label: 'Genetic Sample', value: sampleInfo }
    : { label: 'Archive', value: (song.album || m.album || 'Single Artifact').toUpperCase() };

  // 5. NODE / LOCATION
  const location: FormattedMetadataItem = {
    label: 'Node',
    value: m.technical?.location || (m.genre || 'Digital Sanctuary').toUpperCase()
  };

  return { tempo, key, producers, sample, location };
};
