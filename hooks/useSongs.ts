
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient.ts';
import { Song } from '../types.ts';

const PAGE_SIZE = 24;

/**
 * Garante que o valor retornado seja sempre uma string segura para o React renderizar.
 */
const ensureString = (val: any): string => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    // Se for um objeto do Genius, tentamos extrair o campo de texto mais provável
    return val.title || val.name || val.full_title || "Unknown Artifact";
  }
  return String(val);
};

const stringifyError = (err: any): string => {
  if (!err) return 'The Archive connection was interrupted.';
  if (typeof err === 'string') return err;
  if (err.message && typeof err.message === 'string') return err.message;
  return 'Unspecified Database Error';
};

export const useSongs = (query: string, filter: string | null) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchSongs = useCallback(async (isLoadMore = false) => {
    const currentPage = isLoadMore ? page + 1 : 0;
    if (!isLoadMore) setLoading(true);
    setError(null);

    try {
      // producer e bpm removidos do select root para evitar erro 400
      let request = supabase
        .from('songs')
        .select('id, title, image_url, video_url, storage_url, release_date, metadata', { count: 'exact' });

      const trimmedQuery = query.trim();
      if (trimmedQuery) {
        request = request.ilike('title', `%${trimmedQuery}%`);
      }

      if (filter) {
        request = request.filter('metadata->>sentiment', 'eq', filter);
      }

      const from = currentPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error: supabaseError, count } = await request
        .order('release_date', { ascending: false })
        .range(from, to);

      if (supabaseError) throw supabaseError;
      
      const newSongs = (data as any[] || []).map(song => ({
        ...song,
        title: ensureString(song.title),
        album: ensureString(song.metadata?.album || song.album || 'Single')
      }));

      setSongs(prev => isLoadMore ? [...prev, ...newSongs] : newSongs);
      setHasMore(count ? (from + newSongs.length) < count : false);
      setPage(currentPage);
    } catch (err: any) {
      setError(stringifyError(err));
    } finally {
      setLoading(false);
    }
  }, [query, filter, page]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSongs(false);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [query, filter]);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchSongs(true);
    }
  };

  return { songs, loading, error, hasMore, loadMore };
};
