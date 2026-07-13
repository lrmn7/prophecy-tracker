import { motion, useScroll, useTransform } from 'framer-motion';
import { ScrollReveal } from '../motion/ScrollReveal';
import { Camera, CameraOff, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useCountdown } from '../../hooks/useCountdown';
import { LiveMarketPanel } from './LiveMarketPanel';
import { pad } from '../../utils/format';
import { cn } from '../../lib/utils';
import type { ActiveSeason, MarketData, RewardOverview } from '../../types';

interface HeroSectionProps {
  season: ActiveSeason;
  market?: MarketData;
  overview?: RewardOverview;
  nextRefresh?: number;
}

export function HeroSection({ season, market, overview, nextRefresh }: HeroSectionProps) {
  const countdown = useCountdown(season.endsAt, season.snapshotAt);
  const circumference = 2 * Math.PI * 68;
  const offset = circumference - (season.progressPct / 100) * circumference;

  const isComplete = !!season.snapshotAt;

  const getSnapshotStatus = () => {
    if (isComplete) return "Snapshot Completed";
    if (countdown.state === 'waiting') return "Snapshot Pending";
    return null;
  };

  const statusText = getSnapshotStatus();

  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, -60]);
  const scaleHero = useTransform(scrollY, [0, 500], [1, 0.95]);
  const opacityHero = useTransform(scrollY, [0, 400], [1, 0.3]);
  const yBg = useTransform(scrollY, [0, 500], [0, 40]);

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
      <motion.div style={{ y: yBg }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/[0.04] rounded-full blur-[120px]" />
      </motion.div>
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        <ScrollReveal
          delay={0}
          className="order-2 lg:order-1"
        >
          {market && overview && nextRefresh ? (
            <LiveMarketPanel market={market} overview={overview} nextRefresh={nextRefresh} />
          ) : (
            <div className="h-[250px] bg-white/[0.02] border border-white/[0.05] rounded-3xl animate-pulse" />
          )}
        </ScrollReveal>
        <motion.div
          style={{ y: yHero, scale: scaleHero, opacity: opacityHero }}
          className="relative z-10 flex flex-col items-center gap-8 order-1 lg:order-2 text-center"
        >
          <ScrollReveal delay={0.1} className="flex flex-col items-center gap-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-xs tracking-widest uppercase text-white/50 font-medium">
              {season.status === 'active' ? 'Live Season' : season.status}
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-white/30 uppercase tracking-[0.2em] font-medium">{season.id}</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tighter">
              {season.name}
            </h1>
          </div>
          <div className="relative mt-2">
            <svg width="160" height="160" className="transform -rotate-90" viewBox="0 0 180 180">
              <circle
                cx="90"
                cy="90"
                r="68"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="6"
              />
              <motion.circle
                cx="90"
                cy="90"
                r="68"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-emerald-400 tabular-nums">
                {Math.round(season.progressPct)}%
              </span>
              <span className="text-[10px] uppercase tracking-widest text-white/30 mt-1">Complete</span>
            </div>
          </div>
          </ScrollReveal>
        </motion.div>
        <ScrollReveal
          delay={0.2}
          className="order-3 bg-[#111111] border border-white/[0.05] rounded-3xl p-6 lg:p-8 flex flex-col gap-6"
        >
          <div className="flex items-start gap-4">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
              isComplete ? "bg-emerald-500/10" : "bg-amber-500/10"
            )}>
              {isComplete ? <Camera className="w-5 h-5 text-emerald-400" /> : <CameraOff className="w-5 h-5 text-amber-400" />}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-1">
                Snapshot Status
              </h3>
              <p className="text-xs text-white/40">
                {isComplete
                  ? `Captured on ${format(new Date(season.snapshotAt!), 'MMM d, yyyy')}`
                  : 'Season is still active'}
              </p>
            </div>
          </div>

          <div className="p-5 bg-white/[0.02] border border-white/[0.04] rounded-2xl flex flex-col items-center justify-center text-center min-h-[120px]">
            {statusText ? (
              <p className={cn(
                "text-base font-medium",
                statusText === "Snapshot Completed" ? "text-emerald-400" : "text-amber-400 animate-pulse"
              )}>
                {statusText}
              </p>
            ) : (
              <>
                <p className="text-xs uppercase tracking-widest text-white/40 mb-3 flex items-center gap-2">
                  <Clock className="w-3 h-3" /> Time Until Snapshot
                </p>
                <div className="flex items-baseline gap-2">
                  {[
                    { val: countdown.days, label: 'd' },
                    { val: countdown.hours, label: 'h' },
                    { val: countdown.minutes, label: 'm' },
                    { val: countdown.seconds, label: 's' },
                  ].map(({ val, label }) => (
                    <div key={label} className="flex items-baseline">
                      <span className={cn(
                        'text-2xl lg:text-3xl font-bold tracking-tighter tabular-nums',
                        countdown.state === 'imminent' ? 'text-amber-400' : 'text-white'
                      )}>
                        {pad(val)}
                      </span>
                      <span className="text-xs text-white/30 ml-0.5">{label}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </ScrollReveal>
      </div>
      <div 
        className="w-full mt-16 md:mt-24 overflow-hidden relative select-none flex flex-col gap-2 md:gap-4 group cursor-default transition-all duration-700 hover:scale-[1.02]" 
        style={{ 
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', 
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' 
        }}
      >
        <style>
          {`
            @keyframes marqueeLeft {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            @keyframes marqueeRight {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0); }
            }
            .animate-marquee-left {
              animation: marqueeLeft 80s linear infinite;
            }
            .animate-marquee-right {
              animation: marqueeRight 80s linear infinite;
            }
          `}
        </style>
        <div className="flex whitespace-nowrap items-center w-max animate-marquee-left">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="text-3xl md:text-5xl lg:text-6xl font-black text-white/20 group-hover:text-white uppercase tracking-tighter leading-none pr-12 md:pr-24 transition-colors duration-700">
              ANTEK ANTEK {'{P}'}ROPHECY
            </span>
          ))}
        </div>
        <div className="flex whitespace-nowrap items-center w-max animate-marquee-right">
          {[...Array(8)].map((_, i) => (
            <span key={`b-${i}`} className="text-3xl md:text-5xl lg:text-6xl font-black text-white/20 group-hover:text-white uppercase tracking-tighter leading-none pr-12 md:pr-24 transition-colors duration-700">
              ANTEK ANTEK {'{P}'}ROPHECY
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
