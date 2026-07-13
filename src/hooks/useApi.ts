import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchActiveSeason, fetchSeasons, fetchTopTraders } from '../services/api';
import type { ActiveSeason, Season, Trader } from '../types';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (silent?: boolean) => void;
}

function useApi<T>(fetcher: () => Promise<T>, pollingInterval?: number): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const refetch = useCallback((silent: boolean = false) => {
    if (!silent) setLoading(true);
    setError(null);
    fetcherRef.current()
      .then(setData)
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(message);
      })
      .finally(() => {
        if (!silent) setLoading(false);
      });
  }, []);

  useEffect(() => {
    refetch(false); // initial fetch is not silent

    if (pollingInterval) {
      const intervalId = setInterval(() => {
        refetch(true);
      }, pollingInterval);
      return () => clearInterval(intervalId);
    }
  }, [refetch, pollingInterval]);

  return { data, loading, error, refetch };
}

const fetchActiveSeasonFn = () => fetchActiveSeason();
const fetchSeasonsFn = async () => {
  const res = await fetchSeasons();
  return res.seasons;
};
const fetchTopTradersFn = async () => {
  const res = await fetchTopTraders();
  return res.traders;
};

export function useActiveSeason(): UseApiState<ActiveSeason> {
  return useApi(fetchActiveSeasonFn, 60000);
}

export function useSeasons(): UseApiState<Season[]> {
  return useApi(fetchSeasonsFn);
}

export function useTopTraders(): UseApiState<Trader[]> {
  return useApi(fetchTopTradersFn, 60000);
}
