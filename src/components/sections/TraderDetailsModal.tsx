import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, History, ExternalLink } from 'lucide-react';
import { SomiLogo } from '../ui/SomiLogo';
import { fetchTraderBalance, fetchTraderForwards } from '../../services/api';
import type { TraderBalanceResponse, TraderForwardsResponse } from '../../types';
import { shortenWallet } from '../../utils/format';

interface TraderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: string | null;
}

export function TraderDetailsModal({ isOpen, onClose, wallet }: TraderDetailsModalProps) {
  const [balanceData, setBalanceData] = useState<TraderBalanceResponse | null>(null);
  const [forwardsData, setForwardsData] = useState<TraderForwardsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && wallet) {
      setLoading(true);
      setBalanceData(null);
      setForwardsData(null);

      Promise.all([
        fetchTraderBalance(wallet).catch(e => {
          console.error('Failed to fetch balance', e);
          return null;
        }),
        fetchTraderForwards(wallet).catch(e => {
          console.error('Failed to fetch forwards', e);
          return null;
        })
      ]).then(([balance, forwards]) => {
        setBalanceData(balance);
        setForwardsData(forwards);
        setLoading(false);
      });
    }
  }, [isOpen, wallet]);

  const formatWei = (wei: string, decimals: number = 18) => {
    try {
      if (!wei) return '0';
      const padded = wei.padStart(decimals + 1, '0');
      const integerPart = padded.slice(0, -decimals) || '0';
      const fractionalPart = padded.slice(-decimals).replace(/0+$/, '');
      const formattedInteger = BigInt(integerPart).toLocaleString('en-US');
      
      return fractionalPart ? `${formattedInteger}.${fractionalPart}` : formattedInteger;
    } catch {
      return '0';
    }
  };

  const getSomiBalance = () => {
    if (!balanceData || !balanceData.assets) return '0';
    const somiAsset = balanceData.assets.find(a => a.symbol === 'SOMI' || a.token === 'native');
    if (!somiAsset) return '0';
    return formatWei(somiAsset.balance, somiAsset.decimals);
  };

  if (!isOpen || !wallet) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#0D0D0D]/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0 }}
          className="relative w-full max-w-lg bg-[#151515] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          <div className="p-6 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.02]">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                Trader Details
              </h3>
              <p className="text-sm text-white/50 font-mono mt-1">
                {wallet}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/[0.08] text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="space-y-6">
                <div className="h-24 bg-white/[0.03] animate-pulse rounded-xl" />
                <div className="space-y-3">
                  <div className="h-16 bg-white/[0.03] animate-pulse rounded-xl" />
                  <div className="h-16 bg-white/[0.03] animate-pulse rounded-xl" />
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <section>
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">
                    Current Balance (Somnia Network)
                  </h4>
                  <div className="bg-emerald-400/[0.03] border border-emerald-400/10 rounded-xl p-5 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-emerald-400/60 mb-1">Native <SomiLogo className="inline-block w-3 h-3 ml-0.5" /></p>
                      <p className="text-3xl font-bold text-white tabular-nums">
                        {getSomiBalance()}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-emerald-400/10 flex items-center justify-center">
                      <SomiLogo className="text-xl text-emerald-400" />
                    </div>
                  </div>
                </section>
                <section>
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3 flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Previous Claimed Rewards
                  </h4>
                  
                  {(!forwardsData || !forwardsData.forwards || forwardsData.forwards.length === 0) ? (
                    <div className="bg-white/[0.02] border border-white/[0.04] border-dashed rounded-xl p-8 text-center">
                      <p className="text-sm text-white/40">No claim history from previous seasons.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {forwardsData.forwards.map((forward, idx) => (
                        <div key={idx} className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-emerald-400 tabular-nums">
                              +{formatWei(forward.amount, forward.decimals)} {forward.symbol}
                            </span>
                            <span className="text-xs text-white/30">
                              {new Date(forward.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs border-t border-white/[0.04] pt-3 mt-1">
                            <div className="flex flex-col gap-1">
                              <span className="text-white/30">Destination</span>
                              <span className="text-white/60 font-mono">{shortenWallet(forward.destination, 6)}</span>
                            </div>
                            <a 
                              href={`https://explorer.somnia.network/tx/${forward.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-emerald-400/70 hover:text-emerald-400 transition-colors"
                            >
                              Tx <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
