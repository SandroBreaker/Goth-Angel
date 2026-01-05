
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient.ts';
import { Song } from '../types.ts';

const PAGE_SIZE = 24;

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
      // Fetching only required columns for the grid view
      let request = supabase
        .from('songs')
        .select('id, title, album, image_url, video_url, release_date, metadata', { count: 'exact' });

      const trimmedQuery = query.trim();
      if (trimmedQuery) {
        // Sanitize search query for Postgres full-text search
        // Replacing common special characters that break tsquery
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
        // If textSearch fails (e.g., column doesn't exist or isn't indexed), try a basic ilike fallback
        if (trimmedQuery && (supabaseError.code === '42703' || supabaseError.message.includes('search_vector'))) {
           console.warn('FTS not available, falling back to basic ilike search');
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
      console.error('Archive Fetch Error:', err);
      
      // Extract the most readable error message possible
      let message = 'An unexpected error occurred.';
      
      if (typeof err === 'string') {
        message = err;
      } else if (err && typeof err === 'object') {
        // Supabase error objects often have 'message'
        message = err.message || err.error_description || err.details || 'Database connection error';
        
        // Final guard against [object Object] stringification
        if (message === '[object Object]' || (typeof message === 'object')) {
          message = JSON.stringify(err);
        }
      }
      
      setError(message);
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
