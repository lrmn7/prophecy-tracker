import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchSomiMarketData } from '../services/api';
import type { MarketData } from '../types';

export function useMarketData() {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextRefresh, setNextRefresh] = useState(60);

  const fetcherRef = useRef(fetchSomiMarketData);
  fetcherRef.current = fetchSomiMarketData;

  const refetch = useCallback(async () => {
    try {
      const result = await fetcherRef.current();
      setData(result);
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
      if (data) {
        setData(prev => prev ? { ...prev, error: message } : null);
      }
    } finally {
      setLoading(false);
      setNextRefresh(60);
    }
  }, [data]);

  useEffect(() => {
    refetch();
    
    const intervalId = setInterval(() => {
      setNextRefresh((prev) => {
        if (prev <= 1) {
          refetch();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return { data, loading, error, nextRefresh };
}
