
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient.ts';
import { Song } from '../types.ts';

export const useSongs = (query: string, filter: string | null) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSongs = useCallback(async () => {
    setLoading(true);
    try {
      let request = supabase
        .from('songs')
        .select('*');

      if (query) {
        // Using full-text search column as requested
        request = request.textSearch('search_vector', query);
      }

      if (filter) {
        // Filtering by metadata sentiment
        request = request.filter('metadata->>sentiment', 'eq', filter);
      }

      const { data, error: supabaseError } = await request.order('release_date', { ascending: false });

      if (supabaseError) throw supabaseError;
      setSongs(data as Song[] || []);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [query, filter]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSongs();
    }, 300); // 300ms debounce as requested

    return () => clearTimeout(timeoutId);
  }, [fetchSongs]);

  return { songs, loading, error };
};
