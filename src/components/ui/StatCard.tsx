import React from 'react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  sub?: string;
  accent?: 'emerald' | 'amber' | 'orange' | 'default';
}

const accentColors = {
  emerald: 'text-emerald-400',
  amber: 'text-amber-400',
  orange: 'text-orange-400',
  default: 'text-white',
};

import { PremiumCard } from '../motion/PremiumCard';

export function StatCard({ label, value, sub, accent = 'default' }: StatCardProps) {
  return (
    <PremiumCard className="p-5 md:p-6 h-full flex flex-col justify-center">
      <p className="text-xs uppercase tracking-widest text-white/40 font-medium mb-2">{label}</p>
      <p className={cn('text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight', accentColors[accent])}>
        {value}
      </p>
      {sub && <p className="text-xs text-white/30 mt-2">{sub}</p>}
    </PremiumCard>
  );
}
