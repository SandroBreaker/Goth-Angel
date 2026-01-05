
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient.ts';
import { Song } from '../types.ts';

const PAGE_SIZE = 24;

/**
 * Robust error message extractor.
 * Ensures we always return a human-readable string and never "[object Object]".
 */
const stringifyError = (err: any): string => {
  if (!err) return 'The Archive connection was interrupted.';
  if (typeof err === 'string') return err;
  
  // Standard Error or Supabase/Postgrest Error
  if (err.message && typeof err.message === 'string') {
    if (err.message.includes('Failed to fetch')) return 'Network connection failed. The Archive is offline.';
    return err.message;
  }
  
  // Supabase specific fields
  if (err.details && typeof err.details === 'string') return err.details;
  if (err.hint && typeof err.hint === 'string') return err.hint;
  if (err.error_description && typeof err.error_description === 'string') return err.error_description;

  // Handle arrays of errors
  if (Array.isArray(err) && err.length > 0) return stringifyError(err[0]);

  // Attempt to stringify the object if no message found
  try {
    const stringified = JSON.stringify(err);
    if (stringified !== '{}' && stringified !== 'null') {
      return `Database Error: ${stringified}`;
    }
  } catch (e) {
    // Stringify failed (circular ref, etc)
  }

  // Fallback to error code or generic message
  if (err.code) return `System Error (Code: ${err.code})`;
  
  // Final safeguard against [object Object]
  const finalString = String(err);
  return finalString === '[object Object]' ? 'Unspecified Database Error' : finalString;
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
      let request = supabase
        .from('songs')
        .select('id, title, album, image_url, video_url, release_date, metadata', { count: 'exact' });

      const trimmedQuery = query.trim();
      if (trimmedQuery) {
        // Prepare search query for FTS
        const sanitizedQuery = trimmedQuery
          .replace(/[!&|():*]/g, ' ')
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .join(' & ');

        if (sanitizedQuery) {
          request = request.textSearch('search_vector', sanitizedQuery, {
            type: 'phrase',
            config: 'english'
          });
        }
      }

      if (filter) {
        request = request.filter('metadata->>sentiment', 'eq', filter);
      }

      const from = currentPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error: supabaseError, count } = await request
        .order('release_date', { ascending: false })
        .range(from, to);

      if (supabaseError) {
        // Logic for column missing or FTS misconfiguration
        const isFtsError = supabaseError.code === '42703' || 
                          (supabaseError.message && supabaseError.message.toLowerCase().includes('search_vector'));
        
        if (trimmedQuery && isFtsError) {
          console.warn('Archive: Full-text search failed. Falling back to pattern matching.');
          const fallbackRequest = supabase
            .from('songs')
            .select('id, title, album, image_url, video_url, release_date, metadata', { count: 'exact' })
            .ilike('title', `%${trimmedQuery}%`)
            .order('release_date', { ascending: false })
            .range(from, to);
          
          const { data: fbData, error: fbError, count: fbCount } = await fallbackRequest;
          if (fbError) throw fbError;
          
          const newSongs = fbData as Song[] || [];
          setSongs(prev => isLoadMore ? [...prev, ...newSongs] : newSongs);
          setHasMore(fbCount ? (from + newSongs.length) < fbCount : false);
          setPage(currentPage);
          return;
        }
        throw supabaseError;
      }
      
      const newSongs = data as Song[] || [];
      setSongs(prev => isLoadMore ? [...prev, ...newSongs] : newSongs);
      setHasMore(count ? (from + newSongs.length) < count : false);
      setPage(currentPage);
    } catch (err: any) {
      // Improved logging to reveal the object's structure in the console
      console.group('Archive Internal Error Details');
      console.error('Error Object:', err);
      console.error('Error Code:', err?.code);
      console.error('Error Message:', err?.message);
      console.groupEnd();
      
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
