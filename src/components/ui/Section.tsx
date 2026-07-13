import { cn } from '../../lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn('py-16 md:py-24', className)}>
      {children}
    </section>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({ eyebrow, title, description, className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-10 md:mb-14', className)}>
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-400/80 font-medium mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-sm md:text-base text-white/40 max-w-xl">{description}</p>
      )}
    </div>
  );
}
