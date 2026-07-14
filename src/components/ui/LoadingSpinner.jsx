import { clsx } from 'clsx';

export default function LoadingSpinner({ size = 'md', label = 'Loading...' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return (
    <div className="flex flex-col items-center gap-3 py-12">
      <div
        className={clsx(
          'border-2 border-[var(--color-border)] border-t-[var(--color-accent)] rounded-full animate-spin',
          sizes[size]
        )}
      />
      {label && (
        <p className="text-sm text-[var(--color-text-dim)] animate-pulse-slow">
          {label}
        </p>
      )}
    </div>
  );
}
