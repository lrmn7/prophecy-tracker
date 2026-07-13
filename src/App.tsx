import { useMemo } from 'react';
import { Layout } from './layouts/Layout';
import { HeroSection } from './components/sections/HeroSection';
import { RewardOverviewSection } from './components/sections/RewardOverviewSection';
import { LeaderboardSection } from './components/sections/LeaderboardSection';
import { AnalyticsSection } from './components/sections/AnalyticsSection';
import { ChartsSection } from './components/sections/ChartsSection';
import { SeasonTimelineSection } from './components/sections/SeasonTimelineSection';
import { RewardBreakdownPanel } from './components/sections/RewardBreakdownPanel';
import { HeroSkeleton, CardSkeleton, LeaderboardSkeleton } from './components/ui/Skeleton';
import { ErrorState } from './components/ui/ErrorState';
import { useActiveSeason, useSeasons, useTopTraders } from './hooks/useApi';
import { useMarketData } from './hooks/useMarketData';
import { calculateRankedTraders, calculateRewardOverview } from './utils/rewards';
import { TOTAL_REWARD_POOL } from './constants';

function App() {
  const activeSeason = useActiveSeason();
  const seasons = useSeasons();
  const topTraders = useTopTraders();
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
      {activeSeason.loading ? (
        <HeroSkeleton />
      ) : activeSeason.error ? (
        <div className="py-20">
          <ErrorState message={activeSeason.error} onRetry={activeSeason.refetch} />
        </div>
      ) : activeSeason.data ? (
        <HeroSection 
          season={activeSeason.data} 
          market={market.data || undefined}
          overview={rewardOverview}
          nextRefresh={market.nextRefresh}
        />
      ) : null}
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
        <RewardOverviewSection overview={rewardOverview} market={market.data} />
      ) : null}
      {!topTraders.loading && rankedTraders.length > 0 && market.data && (
        <div className="py-8">
          <RewardBreakdownPanel overview={rewardOverview} market={market.data} />
        </div>
      )}
      {topTraders.loading ? (
        <div className="py-16">
          <LeaderboardSkeleton />
        </div>
      ) : rankedTraders.length > 0 ? (
        <LeaderboardSection traders={rankedTraders} />
      ) : null}
      {!topTraders.loading && rankedTraders.length > 0 && (
        <AnalyticsSection overview={rewardOverview} traderCount={rankedTraders.length} />
      )}
      {!topTraders.loading && rankedTraders.length > 0 && (
        <ChartsSection traders={rankedTraders} />
      )}
      {seasons.loading ? (
        <div className="py-16 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : seasons.error ? (
        <div className="py-16">
          <ErrorState message={seasons.error} onRetry={seasons.refetch} />
        </div>
      ) : seasons.data ? (
        <SeasonTimelineSection seasons={seasons.data} />
      ) : null}
    </Layout>
  );
}

export default App;
