import { motion } from 'framer-motion';
import { SmoothScroll } from '../components/ui/SmoothScroll';
import { Heart, ChevronDown } from 'lucide-react';
import type { Season } from '../types';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

interface LayoutProps {
  children: React.ReactNode;
  seasons?: Season[];
  selectedSeasonId?: string;
  onSeasonChange?: (id: string) => void;
}

export function Layout({ children, seasons, selectedSeasonId, onSeasonChange }: LayoutProps) {
  return (
    <SmoothScroll>
      <div className="min-h-dvh bg-[#0D0D0D] text-white">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.05] bg-[#0D0D0D]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <a href="#" className="flex items-center gap-0.5 group">
              <span className="text-xl font-bold tracking-tight text-emerald-400 font-mono group-hover:text-emerald-300 transition-colors">
                {'{P}'}
              </span>
              <span className="text-lg font-bold tracking-wide text-white group-hover:text-white/90 transition-colors">
                rophecy Tracker
              </span>
            </a>
          </div>
          <nav className="flex items-center gap-5 text-xs text-white/40">
            <a href="#snapshot" className="hover:text-white/70 transition-colors hidden sm:inline">Snapshot</a>
            <a href="#rewards" className="hover:text-white/70 transition-colors hidden sm:inline">Rewards</a>
            <div className="flex items-center gap-2">
              <a href="#leaderboard" className="hover:text-white/70 transition-colors hidden md:inline">Leaderboard</a>
              {seasons && seasons.length > 0 && (
                <div className="relative inline-flex items-center hidden md:inline-flex">
                  <select
                    value={selectedSeasonId}
                    onChange={(e) => onSeasonChange?.(e.target.value)}
                    className="appearance-none bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] rounded-full pl-3 pr-7 py-0.5 text-[10px] text-white/80 hover:text-white focus:outline-none focus:border-emerald-500/50 cursor-pointer transition-all duration-200"
                  >
                    {seasons.map((s) => (
                      <option key={s.id} value={s.id} className="bg-[#151515] text-white/80">
                        {s.name} {s.status === 'active' ? '(Live)' : ''}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-white/40 absolute right-2 pointer-events-none" />
                </div>
              )}
            </div>
            <a href="#charts" className="hover:text-white/70 transition-colors hidden md:inline">Charts</a>
            <a href="#timeline" className="hover:text-white/70 transition-colors hidden lg:inline">Timeline</a>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Live" />
            <a 
              href="https://github.com/lrmn7/prophecy-tracker" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white/40 hover:text-white transition-colors flex items-center gap-1.5 ml-1 border-l border-white/10 pl-3.5"
              title="GitHub Repository"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          </nav>
        </div>
      </header>
      <main className="pt-14 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-6xl mx-auto px-4 md:px-8"
        >
          {children}
        </motion.div>
      </main>
      <footer className="border-t border-white/[0.04] py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <span className="flex items-center gap-1">
            made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> by <a href="https://www.youtube.com/watch?v=Aq5WXmQQooo" target="_blank" rel="noopener noreferrer" className="text-white hover:text-emerald-400 transition-colors font-medium">ZIO GANTENG</a>
          </span>
          <span>Data sourced from the official <a href="https://prophecy.social" target="_blank" rel="noopener noreferrer" className="text-white hover:text-emerald-400 underline decoration-white/25 hover:decoration-emerald-400/50 transition-colors">Prophecy Social</a></span>
        </div>
      </footer>
      </div>
    </SmoothScroll>
  );
}
