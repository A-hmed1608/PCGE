import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Compte {
  id: string;
  posteId: string;
  title: string;
}

export function usePCGEData() {
  const [comptes, setComptes] = useState<Compte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchComptes() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('comptes')
          .select('*');

        if (error) throw error;
        setComptes(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchComptes();
  }, []);

  return { comptes, loading, error };
}
