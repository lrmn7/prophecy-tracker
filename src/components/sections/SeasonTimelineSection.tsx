import { format, differenceInDays } from 'date-fns';
import { Camera, Circle, CheckCircle2 } from 'lucide-react';
import { Section, SectionHeader } from '../ui/Section';
import { cn } from '../../lib/utils';
import type { Season } from '../../types';
import { ScrollReveal, ScrollRevealItem } from '../motion/ScrollReveal';

interface SeasonTimelineSectionProps {
  seasons: Season[];
}

export function SeasonTimelineSection({ seasons }: SeasonTimelineSectionProps) {
  const sorted = [...seasons].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
  );

  return (
    <Section id="timeline">
      <ScrollReveal>
        <SectionHeader
          eyebrow="History"
          title="Season Timeline"
          description="A chronological overview of all Prophecy seasons."
        />
      </ScrollReveal>

      <div className="relative max-w-2xl mx-auto">
        <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-white/[0.08] via-white/[0.06] to-transparent" />

        <ScrollReveal staggerChildren staggerDelay={0.08} className="space-y-8">
          {sorted.map((season) => {
            const isActive = season.status === 'active';
            const hasSnapshot = !!season.snapshotAt;
            const duration = differenceInDays(
              new Date(season.endsAt),
              new Date(season.startsAt)
            );

            return (
              <ScrollRevealItem
                key={season.id}
                className="relative pl-16 md:pl-20"
              >
                <div
                  className={cn(
                    'absolute left-4 md:left-6 top-2 w-4 h-4 rounded-full border-2 flex items-center justify-center',
                    isActive
                      ? 'border-emerald-400 bg-emerald-400/20'
                      : 'border-white/20 bg-[#151515]'
                  )}
                >
                  {isActive && (
                    <span className="absolute w-4 h-4 rounded-full bg-emerald-400/30 animate-ping" />
                  )}
                </div>
                <div
                  className={cn(
                    'glass-card p-6 space-y-3',
                    isActive && 'border-emerald-500/20'
                  )}
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3
                      className={cn(
                        'text-lg font-semibold',
                        isActive ? 'text-white' : 'text-white/60'
                      )}
                    >
                      {season.name}
                    </h3>
                    <span
                      className={cn(
                        'text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full',
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-white/[0.04] text-white/30'
                      )}
                    >
                      {season.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-white/30">
                    <span>
                      {format(new Date(season.startsAt), 'MMM d')} — {format(new Date(season.endsAt), 'MMM d, yyyy')}
                    </span>
                    <span>{duration} days</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {hasSnapshot ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/60" />
                        <span className="text-xs text-white/40">
                          Snapshot: {format(new Date(season.snapshotAt!), 'MMM d, yyyy HH:mm:ss')} UTC
                        </span>
                      </>
                    ) : isActive ? (
                      <>
                        <Circle className="w-3.5 h-3.5 text-amber-400/60" />
                        <span className="text-xs text-white/40">
                          Awaiting snapshot
                        </span>
                      </>
                    ) : (
                      <>
                        <Camera className="w-3.5 h-3.5 text-white/20" />
                        <span className="text-xs text-white/25">
                          No snapshot data
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </ScrollRevealItem>
            );
          })}
        </ScrollReveal>
      </div>
    </Section>
  );
}
