import { cn } from '../../lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className, hover = false, onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass-card',
        hover && 'hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300',
        className
      )}
    >
      {children}
    </div>
  );
}
