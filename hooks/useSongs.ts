import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient.ts';
import { Song } from '../types.ts';

export const useSongs = (query: string, filter: string | null) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSongs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let request = supabase
        .from('songs')
        .select('*');

      const trimmedQuery = query.trim();
      if (trimmedQuery) {
        // Using 'plain' search type for safer user input handling
        request = request.textSearch('search_vector', trimmedQuery, {
          type: 'plain',
          config: 'english'
        });
      }

      if (filter) {
        // Filtering by metadata sentiment
        request = request.filter('metadata->>sentiment', 'eq', filter);
      }

      const { data, error: supabaseError } = await request.order('release_date', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }
      
      setSongs(data as Song[] || []);
    } catch (err: any) {
      console.error('Archive Fetch error:', err);
      // Improve error display by ensuring we stringify objects or show the message
      const message = err.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [query, filter]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSongs();
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [fetchSongs]);

  return { songs, loading, error };
};