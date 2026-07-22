import { motion } from 'framer-motion';
import { Section, SectionHeader } from '../ui/Section';
import { StatCard } from '../ui/StatCard';
import { SomiLogo } from '../ui/SomiLogo';
import { formatNumber, formatCurrency } from '../../utils/format';
import type { RewardOverview } from '../../types';

interface AnalyticsSectionProps {
  overview: RewardOverview;
  traderCount: number;
  limit?: number;
}

export function AnalyticsSection({ overview, traderCount, limit = 200 }: AnalyticsSectionProps) {
  const stats = [
    { label: 'Total PP', value: formatNumber(overview.totalPP), accent: 'emerald' as const },
    { label: 'Average PP', value: formatNumber(Math.round(overview.averagePP)), accent: 'default' as const },
    { label: 'Median PP', value: formatNumber(Math.round(overview.medianPP)), accent: 'default' as const },
    { label: 'Total Events', value: formatNumber(overview.totalEvents), accent: 'default' as const },
    { label: 'Average Events', value: formatNumber(Math.round(overview.averageEvents)), accent: 'default' as const },
    { label: 'Highest Reward', value: <span className="flex items-center gap-1">{formatNumber(Math.round(overview.largestReward))} <SomiLogo className="text-[0.6em]" /></span>, sub: `≈ ${formatCurrency(overview.largestRewardUsd)}`, accent: 'amber' as const },
    { label: 'Average Reward', value: <span className="flex items-center gap-1">{formatNumber(Math.round(overview.averageReward))} <SomiLogo className="text-[0.6em]" /></span>, sub: `≈ ${formatCurrency(overview.averageRewardUsd)}`, accent: 'default' as const },
    { label: 'Total Traders', value: formatNumber(traderCount), sub: `in the top ${limit}`, accent: 'default' as const },
  ];

  return (
    <Section id="analytics">
      <SectionHeader
        eyebrow="Analytics"
        title="Performance Metrics"
        description={`Derived statistics from the current top ${limit} traders.`}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="h-full"
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
