
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../services/supabaseClient.ts';
import { Song } from '../types.ts';

const PAGE_SIZE = 24;

const ensureString = (val: any): string => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
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

  // Use a ref to track the current page for the async fetch function
  const pageRef = useRef(0);

  const fetchSongs = useCallback(async (isLoadMore = false) => {
    if (!isLoadMore) {
      setLoading(true);
      pageRef.current = 0;
      setPage(0);
    } else {
      pageRef.current += 1;
      setPage(pageRef.current);
    }
    
    setError(null);

    try {
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

      const from = pageRef.current * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error: supabaseError, count } = await request
        .order('release_date', { ascending: false })
        .range(from, to);

      if (supabaseError) throw supabaseError;
      
      const newSongs = (data as any[] || []).map(song => ({
        ...song,
        title: ensureString(song.title),
        album: ensureString(song.metadata?.album || song.album || 'Single'),
        // Ensure id is a string to avoid key issues
        id: String(song.id)
      }));

      setSongs(prev => isLoadMore ? [...prev, ...newSongs] : newSongs);
      setHasMore(count ? (from + newSongs.length) < count : false);
    } catch (err: any) {
      setError(stringifyError(err));
    } finally {
      setLoading(false);
    }
  }, [query, filter]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSongs(false);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [query, filter, fetchSongs]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchSongs(true);
    }
  }, [loading, hasMore, fetchSongs]);

  return { songs, loading, error, hasMore, loadMore };
};
