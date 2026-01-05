
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient.ts';
import { Song } from '../types.ts';

const PAGE_SIZE = 24;

/**
 * Hyper-defensive utility to extract a human-readable string from any error object.
 * Prevents the dreaded "[object Object]" in the UI.
 */
const stringifyError = (err: any): string => {
  if (!err) return 'Unknown communication error.';
  if (typeof err === 'string') return err;
  
  // PostgrestError (Supabase) or standard Error object
  const message = err.message || err.details || err.hint || err.error_description;
  if (message && typeof message === 'string') {
    // Check for common network failures
    if (message.includes('Failed to fetch') || message.includes('Load failed')) {
      return 'Archive connection failed. Please check your network or firewall.';
    }
    return message;
  }

  // If we have an object but no recognizable string field, stringify it carefully
  try {
    const stringified = JSON.stringify(err);
    if (stringified !== '{}' && stringified !== 'null') {
      return `Database Error: ${stringified.substring(0, 100)}...`;
    }
  } catch (e) {
    // If circular reference or other JSON error
  }

  // Fallback for code-only errors
  if (err.code) return `Archive Error Code: ${err.code}`;

  return 'The Archive returned an unintelligible response. Please try again.';
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
        // Sanitize search query for Postgres full-text search
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
          console.warn('FTS unavailable, executing ilike fallback.');
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
      console.error('Archive Internal Log:', err);
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
