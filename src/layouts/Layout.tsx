import { motion } from 'framer-motion';
import { SmoothScroll } from '../components/ui/SmoothScroll';
import { Heart } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
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
            <a href="#leaderboard" className="hover:text-white/70 transition-colors hidden md:inline">Leaderboard</a>
            <a href="#charts" className="hover:text-white/70 transition-colors hidden md:inline">Charts</a>
            <a href="#timeline" className="hover:text-white/70 transition-colors hidden lg:inline">Timeline</a>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Live" />
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
            made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> by <a href="https://lrmn.wtf" target="_blank" rel="noopener noreferrer" className="text-white hover:text-emerald-400 transition-colors font-medium">L RMN</a>
          </span>
          <span>Data sourced from the official <a href="https://prophecy.social" target="_blank" rel="noopener noreferrer" className="text-white hover:text-emerald-400 underline decoration-white/25 hover:decoration-emerald-400/50 transition-colors">Prophecy Social</a></span>
        </div>
      </footer>
      </div>
    </SmoothScroll>
  );
}
