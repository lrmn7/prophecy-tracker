import axios from 'axios';
import { API_BASE_URL } from '../constants';
import type { ActiveSeason, SeasonsResponse, TradersResponse, MarketData, TraderBalanceResponse, TraderForwardsResponse } from '../types';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});

export async function fetchActiveSeason(): Promise<ActiveSeason> {
  const { data } = await api.get<ActiveSeason>('/seasons/active');
  return data;
}

export async function fetchSeasons(): Promise<SeasonsResponse> {
  const { data } = await api.get<SeasonsResponse>('/seasons');
  return data;
}

export async function fetchTopTraders(season?: string): Promise<TradersResponse> {
  const params: Record<string, any> = { limit: 200, audience: 'humans' };
  if (season) {
    params.season = season;
  }
  const { data } = await api.get<TradersResponse>('/stats/top-traders', {
    params,
  });
  return data;
}

export async function fetchSomiMarketData(): Promise<MarketData> {
  const { data } = await axios.get('https://api.binance.com/api/v3/ticker/24hr?symbol=SOMIUSDT', {
    timeout: 5000
  });
  
  return {
    price: Number(data.lastPrice),
    change24h: Number(data.priceChangePercent),
    lastUpdated: Date.now()
  };
}

export async function fetchTraderBalance(wallet: string): Promise<TraderBalanceResponse> {
  const { data } = await axios.get<TraderBalanceResponse>(
    `/api/claim/scan?address=${wallet}&chainId=5031`
  );
  return data;
}

export async function fetchTraderForwards(wallet: string): Promise<TraderForwardsResponse> {
  const { data } = await axios.get<TraderForwardsResponse>(
    `/api/v1/forwards/${wallet}?chainId=5031`
  );
  return data;
}
