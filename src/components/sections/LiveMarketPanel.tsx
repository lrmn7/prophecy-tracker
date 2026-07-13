import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Clock, RefreshCw } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { SomiLogo } from '../ui/SomiLogo';
import { formatNumber, formatCurrency } from '../../utils/format';
import type { MarketData, RewardOverview } from '../../types';

interface LiveMarketPanelProps {
  market: MarketData;
  overview: RewardOverview;
  nextRefresh: number;
}

export function LiveMarketPanel({ market, overview, nextRefresh }: LiveMarketPanelProps) {
  const isPositive = market.change24h >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassCard className="p-6 md:p-8 flex flex-col justify-between h-full relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] pointer-events-none opacity-20"
             style={{ backgroundColor: isPositive ? '#34d399' : '#f87171' }} />
             
        <div className="space-y-6 relative z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-widest uppercase text-white/50 flex items-center gap-1.5">
              <SomiLogo className="text-emerald-400" /> Market
            </h3>
            {market.error ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] uppercase font-medium">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Waiting for price
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] text-white/40 text-[10px] uppercase font-medium">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/60" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                Live
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-white/40 mb-1">Price</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-white tabular-nums">
                  ${market.price.toFixed(4)}
                </p>
              </div>
            </div>
            
            <div>
              <p className="text-xs text-white/40 mb-1">24H</p>
              <div className={`flex items-center gap-1 text-lg font-semibold tabular-nums ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {Math.abs(market.change24h).toFixed(2)}%
              </div>
            </div>
            
            <div>
              <p className="text-xs text-white/40 mb-1">Reward Pool</p>
              <p className="text-lg font-semibold text-emerald-400 tabular-nums flex items-center gap-1">
                {formatNumber(overview.rewardPool)} <SomiLogo className="text-sm" />
              </p>
            </div>
            
            <div>
              <p className="text-xs text-white/40 mb-1">Current Value</p>
              <p className="text-lg font-semibold text-white/80 tabular-nums">
                ≈ {formatCurrency(overview.rewardPoolUsd)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/30 relative z-10">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Updated {new Date(market.lastUpdated).toLocaleTimeString('en-US', { timeZone: 'UTC' })} UTC</span>
          </div>
          <div>
            Next refresh in {nextRefresh}s
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
