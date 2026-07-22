export interface ActiveSeason {
  id: string;
  name: string;
  status: string;
  startsAt: string;
  endsAt: string;
  snapshotAt: string | null;
  daysRemaining: number;
  progressPct: number;
  rewardedRanks?: number;
}

export interface Season {
  id: string;
  name: string;
  status: string;
  startsAt: string;
  endsAt: string;
  snapshotAt: string | null;
  rewardedRanks?: number;
}

export interface SeasonsResponse {
  seasons: Season[];
}

export interface Trader {
  wallet: string;
  totalPP: number;
  totalEvents: number;
}

export interface TradersResponse {
  traders: Trader[];
}

export interface TraderForward {
  txHash: string;
  asset: string;
  symbol: string;
  amount: string;
  decimals: number;
  destination: string;
  createdAt: string;
}

export interface TraderForwardsResponse {
  forwards: TraderForward[];
}

export interface AssetBalance {
  token: string;
  symbol: string;
  decimals: number;
  balance: string;
  origin: string | null;
}

export interface TraderBalanceResponse {
  address: string;
  chainId: number;
  nativeGasReserveWei: string;
  pointsToken: string;
  assets: AssetBalance[];
  partial: boolean;
}

export interface RankedTrader extends Trader {
  rank: number;
  share: number;
  estimatedReward: number; 
  estimatedUsdReward: number; 
  rewardPct: number;
}

export interface RewardOverview {
  rewardPool: number; 
  rewardPoolUsd: number; 
  totalPP: number;
  averagePP: number;
  medianPP: number;
  highestPP: number;
  lowestPP: number;
  totalEvents: number;
  averageEvents: number;
  averageReward: number; 
  averageRewardUsd: number; 
  largestReward: number; 
  largestRewardUsd: number; 
  rewardPerPP: number; 
}

export interface MarketData {
  price: number;
  change24h: number;
  lastUpdated: number;
  error?: string;
}

export interface SnapshotStatus {
  label: string;
  description: string;
  snapshotTime: string | null;
  isComplete: boolean;
}

export type CountdownState = 'normal' | 'warning' | 'critical' | 'imminent' | 'waiting';

export interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  state: CountdownState;
  totalMs: number;
}
