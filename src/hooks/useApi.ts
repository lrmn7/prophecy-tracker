import type { Trader } from '../types';
import season2TradersData from '../data/season2-traders.json';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (silent?: boolean) => void;
}

export function useTopTraders(_season?: string, _limit?: number): UseApiState<Trader[]> {
  return {
    data: season2TradersData.traders as Trader[],
    loading: false,
    error: null,
    refetch: () => {},
  };
}

