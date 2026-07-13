import { motion } from 'framer-motion';
import { Camera, CameraOff } from 'lucide-react';
import { format } from 'date-fns';
import { useCountdown } from '../../hooks/useCountdown';
import { pad } from '../../utils/format';
import { Section, SectionHeader } from '../ui/Section';
import { GlassCard } from '../ui/GlassCard';
import { cn } from '../../lib/utils';
import type { ActiveSeason } from '../../types';

interface SnapshotSectionProps {
  season: ActiveSeason;
}

export function SnapshotSection({ season }: SnapshotSectionProps) {
  const countdown = useCountdown(season.endsAt, season.snapshotAt);

  const isActive = season.status === 'active' && !season.snapshotAt;
  const isComplete = !!season.snapshotAt;

  return (
    <Section id="snapshot">
      <SectionHeader
        eyebrow="Snapshot"
        title="Snapshot Status"
        description="Track the current season snapshot state and live countdown."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-8">
          <div className="flex items-start gap-5">
            <div
              className={cn(
                'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0',
                isComplete ? 'bg-emerald-500/10' : 'bg-amber-500/10'
              )}
            >
              {isComplete ? (
                <Camera className="w-6 h-6 text-emerald-400" />
              ) : (
                <CameraOff className="w-6 h-6 text-amber-400" />
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">
                {isComplete ? 'Snapshot Completed' : 'Season Active'}
              </h3>
              <p className="text-sm text-white/40">
                {isComplete
                  ? `Captured on ${format(new Date(season.snapshotAt!), 'MMM d, yyyy')} at ${format(new Date(season.snapshotAt!), 'HH:mm:ss')} UTC`
                  : 'Snapshot has not occurred'}
              </p>
            </div>
          </div>
        </GlassCard>
        {isActive && (
          <GlassCard className="p-8">
            <p className="text-xs uppercase tracking-widest text-white/40 font-medium mb-5">
              {countdown.state === 'waiting'
                ? 'Waiting for confirmation'
                : countdown.state === 'imminent'
                ? 'Snapshot is imminent'
                : 'Time until snapshot'}
            </p>

            {countdown.state === 'waiting' ? (
              <motion.p
                className="text-lg text-amber-400/80"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Waiting for official snapshot confirmation
              </motion.p>
            ) : (
              <div className="flex items-baseline gap-1">
                {[
                  { val: countdown.days, label: 'd' },
                  { val: countdown.hours, label: 'h' },
                  { val: countdown.minutes, label: 'm' },
                  { val: countdown.seconds, label: 's' },
                ].map(({ val, label }) => (
                  <div key={label} className="flex items-baseline">
                    <motion.span
                      className={cn(
                        'text-4xl md:text-5xl font-bold tracking-tighter tabular-nums',
                        countdown.state === 'imminent'
                          ? 'text-amber-400'
                          : countdown.state === 'critical'
                          ? 'text-orange-400'
                          : 'text-white'
                      )}
                      animate={
                        countdown.state === 'imminent'
                          ? { opacity: [0.6, 1, 0.6] }
                          : undefined
                      }
                      transition={
                        countdown.state === 'imminent'
                          ? { duration: 1.5, repeat: Infinity }
                          : undefined
                      }
                    >
                      {pad(val)}
                    </motion.span>
                    <span className="text-sm text-white/30 ml-0.5 mr-3">{label}</span>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        )}
      </div>
    </Section>
  );
}
