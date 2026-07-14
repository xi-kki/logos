import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-error-dim)] mb-4">
        <AlertTriangle size={24} className="text-[var(--color-error)]" />
      </div>
      <p className="text-sm text-[var(--color-error)] mb-1">{message}</p>
      <p className="text-xs text-[var(--color-text-dim)] mb-4">
        If this persists, try refreshing the page.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-text)] transition-colors"
        >
          <RefreshCw size={14} />
          Retry
        </button>
      )}
    </div>
  );
}
