import type { Trader, RankedTrader, RewardOverview } from '../types';
export function calculateRankedTraders(
  traders: Trader[],
  rewardPool: number,
  somiPrice: number = 0
): RankedTrader[] {
  const sorted = [...traders].sort((a, b) => b.totalPP - a.totalPP);
  
  // Calculate weighted points for each trader using the 1.5 exponent
  const weightedTraders = sorted.map((t) => ({
    ...t,
    weightedPP: Math.pow(t.totalPP, 1.5),
  }));

  const totalWeightedPP = weightedTraders.reduce((sum, t) => sum + t.weightedPP, 0);

  if (totalWeightedPP === 0) {
    return sorted.map((t, i) => ({
      ...t,
      rank: i + 1,
      share: 0,
      estimatedReward: 0,
      estimatedUsdReward: 0,
      rewardPct: 0,
    }));
  }

  return weightedTraders.map((t, i) => {
    const share = t.weightedPP / totalWeightedPP;
    return {
      wallet: t.wallet,
      totalPP: t.totalPP,
      totalEvents: t.totalEvents,
      rank: i + 1,
      share,
      estimatedReward: share * rewardPool,
      estimatedUsdReward: (share * rewardPool) * somiPrice,
      rewardPct: share * 100,
    };
  });
}

export function calculateRewardOverview(
  rankedTraders: RankedTrader[],
  rewardPool: number,
  somiPrice: number = 0
): RewardOverview {
  if (rankedTraders.length === 0) {
    return {
      rewardPool,
      rewardPoolUsd: rewardPool * somiPrice,
      totalPP: 0,
      averagePP: 0,
      medianPP: 0,
      highestPP: 0,
      lowestPP: 0,
      totalEvents: 0,
      averageEvents: 0,
      averageReward: 0,
      averageRewardUsd: 0,
      largestReward: 0,
      largestRewardUsd: 0,
      rewardPerPP: 0,
      totalWeightedPP: 0,
      rewardPerWeightedPP: 0,
    };
  }

  const pps = rankedTraders.map((t) => t.totalPP);
  const totalPP = pps.reduce((a, b) => a + b, 0);
  const totalWeightedPP = rankedTraders.reduce((sum, t) => sum + Math.pow(t.totalPP, 1.5), 0);
  const totalEvents = rankedTraders.reduce((a, t) => a + t.totalEvents, 0);
  const rewards = rankedTraders.map((t) => t.estimatedReward);

  const sortedPPs = [...pps].sort((a, b) => a - b);
  const mid = Math.floor(sortedPPs.length / 2);
  const medianPP =
    sortedPPs.length % 2 === 0
      ? (sortedPPs[mid - 1] + sortedPPs[mid]) / 2
      : sortedPPs[mid];

  return {
    rewardPool,
    rewardPoolUsd: rewardPool * somiPrice,
    totalPP,
    averagePP: totalPP / rankedTraders.length,
    medianPP,
    highestPP: Math.max(...pps),
    lowestPP: Math.min(...pps),
    totalEvents,
    averageEvents: totalEvents / rankedTraders.length,
    averageReward: rewardPool / rankedTraders.length,
    averageRewardUsd: (rewardPool / rankedTraders.length) * somiPrice,
    largestReward: Math.max(...rewards),
    largestRewardUsd: Math.max(...rewards) * somiPrice,
    rewardPerPP: totalPP > 0 ? rewardPool / totalPP : 0,
    totalWeightedPP,
    rewardPerWeightedPP: totalWeightedPP > 0 ? rewardPool / totalWeightedPP : 0,
  };
}
