import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  CartesianGrid,
} from 'recharts';
import { Section, SectionHeader } from '../ui/Section';
import { PremiumCard } from '../motion/PremiumCard';
import { ScrollReveal, ScrollRevealItem } from '../motion/ScrollReveal';
import { shortenWallet, formatNumber } from '../../utils/format';
import type { RankedTrader } from '../../types';

interface ChartsSectionProps {
  traders: RankedTrader[];
}

const COLORS = [
  '#34d399', '#10b981', '#059669', '#047857', '#065f46',
  '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f',
];

const tooltipStyle = {
  backgroundColor: '#1a1a1a',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  padding: '10px 14px',
  color: '#fff',
  fontSize: '12px',
};

export function ChartsSection({ traders }: ChartsSectionProps) {
  const top10 = useMemo(() => traders.slice(0, 10), [traders]);

  const barData = useMemo(
    () =>
      top10.map((t) => ({
        wallet: shortenWallet(t.wallet, 4),
        pp: t.totalPP,
      })).reverse(),
    [top10]
  );

  const donutData = useMemo(() => {
    const topSlice = top10.map((t) => ({
      name: shortenWallet(t.wallet, 4),
      value: t.estimatedReward,
    }));
    const othersReward = traders
      .slice(10)
      .reduce((sum, t) => sum + t.estimatedReward, 0);
    if (othersReward > 0) {
      topSlice.push({ name: 'Others', value: othersReward });
    }
    return topSlice;
  }, [traders, top10]);

  const scatterData = useMemo(
    () =>
      traders.map((t) => ({
        pp: t.totalPP,
        events: t.totalEvents,
        wallet: shortenWallet(t.wallet, 4),
      })),
    [traders]
  );

  const chartCard = (title: string, children: React.ReactNode) => (
    <ScrollRevealItem className="h-full">
      <PremiumCard className="p-6 md:p-8 h-full">
        <p className="text-xs uppercase tracking-widest text-white/40 font-medium mb-6">
          {title}
        </p>
        {children}
      </PremiumCard>
    </ScrollRevealItem>
  );

  return (
    <Section id="charts">
      <ScrollReveal>
        <SectionHeader
          eyebrow="Visualizations"
          title="Data Charts"
          description="Visual breakdown of PP distribution, rewards, and activity."
        />
      </ScrollReveal>

      <ScrollReveal staggerChildren staggerDelay={0.15} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {chartCard('Top 10 Prophecy Points', (
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="wallet"
                  width={80}
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'monospace' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [formatNumber(Number(value)), 'PP']}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                <Bar
                  dataKey="pp"
                  radius={[0, 6, 6, 0]}
                  fill="#34d399"
                  fillOpacity={0.8}
                  maxBarSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}

        {chartCard('Reward Distribution', (
          <div className="h-[360px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius="55%"
                  outerRadius="80%"
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {donutData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [`${formatNumber(Number(value))} SOMI`, 'Est. Reward']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ))}
      </ScrollReveal>

      <ScrollReveal delay={0.2} className="mt-6">
        {chartCard('PP vs Events Correlation', (
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ left: 10, right: 20, bottom: 10 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  type="number"
                  dataKey="events"
                  name="Events"
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                  tickLine={false}
                  label={{
                    value: 'Events',
                    position: 'bottom',
                    offset: 0,
                    fill: 'rgba(255,255,255,0.25)',
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="pp"
                  name="PP"
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                  tickLine={false}
                  label={{
                    value: 'PP',
                    angle: -90,
                    position: 'insideLeft',
                    offset: 0,
                    fill: 'rgba(255,255,255,0.25)',
                    fontSize: 11,
                  }}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value, name) => [
                    formatNumber(Number(value)),
                    String(name),
                  ]}
                />
                <Scatter data={scatterData} fill="#f59e0b" fillOpacity={0.6} r={4} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        ))}
      </ScrollReveal>
    </Section>
  );
}
