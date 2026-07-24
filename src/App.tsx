import { useMemo } from 'react';
import { Layout } from './layouts/Layout';
import { HeroSection } from './components/sections/HeroSection';
import { RewardOverviewSection } from './components/sections/RewardOverviewSection';
import { LeaderboardSection } from './components/sections/LeaderboardSection';
import { AnalyticsSection } from './components/sections/AnalyticsSection';
import { ChartsSection } from './components/sections/ChartsSection';
import { RewardBreakdownPanel } from './components/sections/RewardBreakdownPanel';
import { CardSkeleton, LeaderboardSkeleton } from './components/ui/Skeleton';
import { ErrorState } from './components/ui/ErrorState';
import { useTopTraders } from './hooks/useApi';
import { useMarketData } from './hooks/useMarketData';
import { calculateRankedTraders, calculateRewardOverview } from './utils/rewards';
import { TOTAL_REWARD_POOL } from './constants';

const SEASON_KICKOFF_DETAILS = {
  id: 'season-2',
  name: 'Kickoff',
  status: 'snapshot',
  startsAt: '2026-06-10T00:00:00.000Z',
  endsAt: '2026-07-20T03:00:00.000Z',
  snapshotAt: '2026-07-20T03:00:18.233Z',
  rewardedRanks: 1000,
  daysRemaining: 0,
  progressPct: 100,
};

function App() {
  const dynamicLimit = SEASON_KICKOFF_DETAILS.rewardedRanks;
  const topTraders = useTopTraders(SEASON_KICKOFF_DETAILS.id, dynamicLimit);
  const market = useMarketData();

  const somiPrice = market.data?.price || 0;

  const rankedTraders = useMemo(
    () => (topTraders.data ? calculateRankedTraders(topTraders.data, TOTAL_REWARD_POOL, somiPrice) : []),
    [topTraders.data, somiPrice]
  );

  const rewardOverview = useMemo(
    () => calculateRewardOverview(rankedTraders, TOTAL_REWARD_POOL, somiPrice),
    [rankedTraders, somiPrice]
  );

  return (
    <Layout>
      <HeroSection 
        season={SEASON_KICKOFF_DETAILS} 
        market={market.data || undefined}
        overview={rewardOverview}
        nextRefresh={market.nextRefresh}
      />
      {topTraders.loading ? (
        <div className="py-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : topTraders.error ? (
        <div className="py-16">
          <ErrorState message={topTraders.error} onRetry={topTraders.refetch} />
        </div>
      ) : rankedTraders.length > 0 && market.data ? (
        <RewardOverviewSection overview={rewardOverview} market={market.data} limit={dynamicLimit} />
      ) : null}
      {!topTraders.loading && rankedTraders.length > 0 && market.data && (
        <div className="py-8">
          <RewardBreakdownPanel overview={rewardOverview} market={market.data} limit={dynamicLimit} />
        </div>
      )}
      {topTraders.loading ? (
        <div className="py-16">
          <LeaderboardSkeleton />
        </div>
      ) : rankedTraders.length > 0 ? (
        <LeaderboardSection 
          traders={rankedTraders} 
          limit={dynamicLimit}
        />
      ) : null}
      {!topTraders.loading && rankedTraders.length > 0 && (
        <AnalyticsSection overview={rewardOverview} traderCount={rankedTraders.length} limit={dynamicLimit} />
      )}
      {!topTraders.loading && rankedTraders.length > 0 && (
        <ChartsSection traders={rankedTraders} />
      )}
    </Layout>
  );
}

export default App;
