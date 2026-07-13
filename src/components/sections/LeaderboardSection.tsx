import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Copy, Check, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { Section, SectionHeader } from '../ui/Section';
import { GlassCard } from '../ui/GlassCard';
import { SomiLogo } from '../ui/SomiLogo';
import { ScrollReveal } from '../motion/ScrollReveal';
import { TraderDetailsModal } from './TraderDetailsModal';
import { shortenWallet, formatNumber, formatCurrency, copyToClipboard } from '../../utils/format';
import type { RankedTrader } from '../../types';

interface LeaderboardSectionProps {
  traders: RankedTrader[];
}

type SortField = 'rank' | 'totalPP' | 'totalEvents' | 'estimatedReward' | 'estimatedUsdReward';
type SortDir = 'asc' | 'desc';

export function LeaderboardSection({ traders }: LeaderboardSectionProps) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedWallet, setCopiedWallet] = useState<string | null>(null);
  const [selectedTrader, setSelectedTrader] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const PAGE_SIZE = 10;

  const handleCopy = async (wallet: string) => {
    const success = await copyToClipboard(wallet);
    if (success) {
      setCopiedWallet(wallet);
      setTimeout(() => setCopiedWallet(null), 2000);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir(field === 'rank' ? 'asc' : 'desc');
    }
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    let list = [...traders];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.wallet.toLowerCase().includes(q) ||
          t.rank.toString().includes(q)
      );
    }

    list.sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1;
      return (a[sortField] - b[sortField]) * mul;
    });

    return list;
  }, [traders, search, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const displayed = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const SortButton = ({ field, label, className = '' }: { field: SortField; label: string; className?: string }) => (
    <button
      onClick={() => handleSort(field)}
      className={`inline-flex items-center gap-1 text-xs uppercase tracking-widest text-white/40 font-medium hover:text-white/60 transition-colors cursor-pointer ${className}`}
    >
      {label}
      <ArrowUpDown className={`w-3 h-3 ${sortField === field ? 'text-emerald-400/60' : ''}`} />
    </button>
  );

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 2, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <Section id="leaderboard">
      <ScrollReveal>
        <SectionHeader
          eyebrow="Leaderboard"
          title="Top 200 Traders"
          description="Ranked by Prophecy Points with estimated reward distribution."
        />
      <div className="mb-8 max-w-md">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search by wallet or rank..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // Reset page on search
            }}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/[0.16] focus:bg-white/[0.06] transition-all duration-200"
          />
        </div>
      </div>
      <div className="hidden md:grid grid-cols-[60px_1fr_100px_90px_80px_130px_130px] gap-4 px-6 pb-3">
        <SortButton field="rank" label="Rank" />
        <span className="text-xs uppercase tracking-widest text-white/40 font-medium flex items-center">Wallet</span>
        <SortButton field="totalPP" label="PP" />
        <SortButton field="totalEvents" label="Events" />
        <span className="text-xs uppercase tracking-widest text-white/40 font-medium flex items-center justify-end">Share</span>
        <SortButton field="estimatedReward" label="Reward" className="justify-self-end" />
        <SortButton field="estimatedUsdReward" label="USD Value" className="justify-self-end" />
      </div>
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {displayed.map((trader) => (
            <motion.div
              key={trader.wallet}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <GlassCard
                hover
                onClick={() => setSelectedTrader(trader.wallet)}
                className="flex flex-col md:grid md:grid-cols-[60px_1fr_100px_90px_80px_130px_130px] gap-3 md:gap-4 p-4 md:px-6 md:py-4 cursor-pointer"
              >
                <div className="flex items-center justify-between w-full md:contents">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold tabular-nums ${
                        trader.rank <= 3 ? 'text-amber-400' : 'text-white/60'
                      }`}
                    >
                      #{trader.rank}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/80 font-mono">
                      {shortenWallet(trader.wallet, 6)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(trader.wallet);
                      }}
                      className="p-1 rounded-md hover:bg-white/[0.08] transition-colors cursor-pointer"
                      title={trader.wallet}
                    >
                      {copiedWallet === trader.wallet ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-white/30" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full pt-3 mt-1 border-t border-white/[0.04] md:contents md:pt-0 md:mt-0 md:border-0">
                  <div className="flex flex-col md:block">
                    <span className="md:hidden text-[10px] uppercase tracking-widest text-white/30 mb-0.5">Total PP</span>
                    <span className="text-sm text-white font-semibold tabular-nums">
                      {formatNumber(trader.totalPP)}
                    </span>
                  </div>
                  <div className="flex flex-col md:block">
                    <span className="md:hidden text-[10px] uppercase tracking-widest text-white/30 mb-0.5">Events</span>
                    <span className="text-sm text-white/60 tabular-nums">
                      {formatNumber(trader.totalEvents)}
                    </span>
                  </div>
                  <div className="flex flex-col md:block md:text-right">
                    <span className="md:hidden text-[10px] uppercase tracking-widest text-white/30 mb-0.5">Pool Share</span>
                    <span className="text-sm text-white/40 tabular-nums">
                      {trader.rewardPct.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex flex-col md:block md:text-right">
                    <span className="md:hidden text-[10px] uppercase tracking-widest text-white/30 mb-0.5">Est. Reward</span>
                    <div className="flex items-center justify-start md:justify-end gap-1">
                      <span className="text-sm text-emerald-400 font-semibold tabular-nums">
                        {formatNumber(trader.estimatedReward)}
                      </span>
                      <SomiLogo className="text-[10px] text-emerald-400/60" />
                    </div>
                  </div>
                  <div className="flex flex-col md:block md:text-right col-span-2 md:col-span-1 pt-2 border-t border-white/[0.02] md:pt-0 md:border-0">
                    <span className="md:hidden text-[10px] uppercase tracking-widest text-white/30 mb-0.5">Live Value (USD)</span>
                    <span className="text-sm text-white/50 tabular-nums">
                      ≈ {formatCurrency(trader.estimatedUsdReward)}
                    </span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/60 hover:bg-white/[0.08] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, idx) => (
                typeof page === 'number' ? (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-all cursor-pointer ${
                      currentPage === page 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'text-white/60 hover:bg-white/[0.08] hover:text-white'
                    }`}
                  >
                    {page}
                  </button>
                ) : (
                  <span key={idx} className="w-9 h-9 flex items-center justify-center text-white/30 text-sm">
                    {page}
                  </span>
                )
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/60 hover:bg-white/[0.08] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {filtered.length === 0 && search && (
        <div className="py-12 text-center text-white/40 text-sm">
          No traders found matching "{search}"
        </div>
      )}

        <TraderDetailsModal 
          isOpen={!!selectedTrader} 
          onClose={() => setSelectedTrader(null)} 
          wallet={selectedTrader} 
        />
      </ScrollReveal>
    </Section>
  );
}
