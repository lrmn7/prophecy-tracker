import { useState } from 'react';
import { ArrowDown, X, Calculator, CircleDollarSign } from 'lucide-react';
import { PremiumCard } from '../motion/PremiumCard';
import { SomiLogo } from '../ui/SomiLogo';
import { ScrollReveal } from '../motion/ScrollReveal';
import { formatNumber, formatCurrency } from '../../utils/format';
import type { MarketData, RewardOverview } from '../../types';

interface RewardBreakdownPanelProps {
  overview: RewardOverview;
  market: MarketData;
}

export function RewardBreakdownPanel({ overview, market }: RewardBreakdownPanelProps) {
  const [calculatorPP, setCalculatorPP] = useState<string>('25000');
  
  const numericPP = parseInt(calculatorPP.replace(/,/g, '')) || 0;
  const exampleReward = numericPP * overview.rewardPerPP;
  const exampleUsd = exampleReward * market.price;

  return (
    <ScrollReveal className="w-full">
      <PremiumCard className="p-8">
        <div className="mb-10 text-center">
          <h3 className="text-xl font-bold tracking-tight text-white mb-2 flex items-center justify-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-400" />
            Fair Reward Distribution
          </h3>
          <p className="text-sm text-white/40 max-w-lg mx-auto">
            Transparent breakdown of how the <SomiLogo className="inline h-3 opacity-60" /> reward pool is distributed fairly among the Top 200 traders based on their Prophecy Points (PP).
          </p>
        </div>
        <div className="relative max-w-4xl mx-auto flex flex-col items-center">
          <div className="flex flex-col md:flex-row w-full justify-between items-center gap-6 md:gap-0 px-4 md:px-12 relative">
            <div className="flex flex-col items-center gap-2 z-10 w-full md:w-auto">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-6 py-4 flex flex-col items-center w-full md:min-w-[200px] shadow-[0_0_30px_rgba(52,211,153,0.1)]">
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-emerald-400 mb-1 text-center">Total Reward Pool</span>
                <span className="text-lg md:text-xl font-bold text-white tabular-nums flex items-center gap-1.5">{formatNumber(overview.rewardPool)} <SomiLogo className="text-[0.6em]" /></span>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-2 z-10 w-full md:w-auto">
              <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex flex-col items-center w-full md:min-w-[200px]">
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-white/40 mb-1 text-center">Total Top 200 PP</span>
                <span className="text-lg md:text-xl font-bold text-white tabular-nums">{formatNumber(overview.totalPP)} PP</span>
              </div>
            </div>
            <div className="hidden md:block absolute top-full left-[120px] right-[120px] h-10 border-b-[2px] border-l-[2px] border-r-[2px] border-white/10 rounded-b-3xl -z-10" />
            <div className="hidden md:block absolute top-[calc(100%+40px)] left-1/2 -ml-[1px] w-[2px] h-10 bg-white/10 -z-10" />
          </div>
          <div className="md:hidden w-px h-8 bg-white/10 my-2" />
          <div className="hidden md:block h-20" /> {/* Spacer for desktop lines */}
          <div className="z-10 bg-[#151515] border border-white/10 rounded-2xl p-5 flex flex-col items-center min-w-[280px]">
            <div className="text-[10px] text-white/30 uppercase tracking-widest mb-2 px-3 py-1 bg-white/5 rounded-full">
              Pool ÷ Total PP
            </div>
            <span className="text-sm text-white/50 mb-1">Reward Per 1 PP</span>
            <span className="text-2xl font-bold text-emerald-400 tabular-nums flex items-center gap-1.5">{overview.rewardPerPP.toFixed(6)} <SomiLogo className="text-[0.6em]" /></span>
          </div>
          <div className="w-px h-12 bg-white/10 my-2" />
          <ArrowDown className="w-4 h-4 text-white/20 mb-2" />
          <div className="w-full max-w-2xl bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 md:p-8">
            <h4 className="text-sm font-semibold text-white/70 mb-6 text-center">Example Trader Calculation</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col items-center text-center">
                <span className="text-[10px] uppercase tracking-widest text-emerald-400 mb-2">Input Your PP</span>
                <input
                  type="text"
                  value={calculatorPP}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setCalculatorPP(val ? parseInt(val).toLocaleString() : '');
                  }}
                  className="w-full bg-transparent text-center font-bold text-white tabular-nums border-b border-emerald-400/30 focus:border-emerald-400 focus:outline-none transition-colors pb-1"
                  placeholder="0"
                />
              </div>
              <div className="hidden md:flex justify-center text-white/20">
                <span className="text-xl font-bold">×</span>
              </div>
              <div className="flex md:hidden justify-center text-white/20 my-1">
                <X className="w-4 h-4" />
              </div>
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col items-center text-center">
                <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Reward per PP</span>
                <span className="font-bold text-emerald-400/80 tabular-nums">{overview.rewardPerPP.toFixed(4)}</span>
              </div>
            </div>

            <div className="flex justify-center my-4">
              <ArrowDown className="w-4 h-4 text-emerald-400/50" />
            </div>
            <div className="bg-emerald-500/[0.05] border border-emerald-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[inset_0_0_30px_rgba(52,211,153,0.05)]">
              <div>
                <span className="text-xs uppercase tracking-widest text-emerald-400/80 mb-2 block">
                  Estimated Trader Reward
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl md:text-4xl font-bold text-white tabular-nums">
                    {formatNumber(exampleReward, 2)}
                  </span>
                  <SomiLogo className="text-xl text-emerald-400" />
                </div>
              </div>

              <div className="h-10 w-px bg-emerald-500/20 hidden md:block" />

              <div className="text-center md:text-right flex flex-col items-center md:items-end w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-emerald-500/10">
                <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1 flex items-center justify-center md:justify-end gap-1">
                  <CircleDollarSign className="w-3 h-3" /> Live Market Value
                </span>
                <span className="text-lg font-bold text-white/80 tabular-nums">
                  {formatCurrency(exampleUsd)}
                </span>
                <span className="text-[10px] text-white/30 mt-1 flex items-center gap-1">
                  @ ${market.price.toFixed(4)} / <SomiLogo className="text-[0.8em]" />
                </span>
              </div>
            </div>
            
          </div>
        </div>
      </PremiumCard>
    </ScrollReveal>
  );
}
