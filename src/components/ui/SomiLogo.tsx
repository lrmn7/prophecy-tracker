export function SomiLogo({ className = '' }: { className?: string }) {
  return (
    <span className={`font-mono font-bold tracking-tighter ${className}`}>
      {'{S}'}
    </span>
  );
}
