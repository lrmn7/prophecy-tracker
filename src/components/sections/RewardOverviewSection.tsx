import { Section, SectionHeader } from '../ui/Section';
import { StatCard } from '../ui/StatCard';
import { SomiLogo } from '../ui/SomiLogo';
import { formatCurrency } from '../../utils/format';
import type { RewardOverview as RewardOverviewType, MarketData } from '../../types';
import { ScrollReveal, ScrollRevealItem } from '../motion/ScrollReveal';
import { AnimatedNumber } from '../motion/AnimatedNumber';

interface RewardOverviewSectionProps {
  overview: RewardOverviewType;
  market: MarketData;
}

export function RewardOverviewSection({ overview, market }: RewardOverviewSectionProps) {
  const stats = [
    { label: 'Reward Pool', value: <span className="flex items-center gap-1"><AnimatedNumber value={overview.rewardPool} format="number" /> <SomiLogo className="text-[0.6em]" /></span>, sub: `≈ ${formatCurrency(overview.rewardPoolUsd)}`, accent: 'emerald' as const },
    { label: 'SOMI Price', value: <AnimatedNumber value={market.price} format="currency" decimals={4} />, sub: 'Current Market Rate', accent: 'default' as const },
    { label: 'Average Reward', value: <span className="flex items-center gap-1"><AnimatedNumber value={Math.round(overview.averageReward)} format="number" /> <SomiLogo className="text-[0.6em]" /></span>, sub: `≈ ${formatCurrency(overview.averageRewardUsd)}`, accent: 'default' as const },
    { label: 'Largest Reward', value: <span className="flex items-center gap-1"><AnimatedNumber value={Math.round(overview.largestReward)} format="number" /> <SomiLogo className="text-[0.6em]" /></span>, sub: `≈ ${formatCurrency(overview.largestRewardUsd)}`, accent: 'orange' as const },
    { label: 'Reward / PP', value: <span className="flex items-center gap-1"><AnimatedNumber value={overview.rewardPerPP} format="number" decimals={4} /> <SomiLogo className="text-[0.6em]" /></span>, sub: `≈ ${formatCurrency(overview.rewardPerPP * market.price, 4)}`, accent: 'default' as const },
    { label: 'Total PP', value: <AnimatedNumber value={overview.totalPP} format="compact" />, sub: 'Top 200 Traders', accent: 'default' as const },
  ];

  return (
    <Section id="rewards">
      <SectionHeader
        eyebrow="Rewards"
        title="Reward Overview"
        description="Estimated SOMI reward distribution based on current top 200 performance."
      />

      <ScrollReveal staggerChildren={true} staggerDelay={0.05} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <ScrollRevealItem key={stat.label} className="h-full">
            <StatCard {...stat} />
          </ScrollRevealItem>
        ))}
      </ScrollReveal>
    </Section>
  );
}
