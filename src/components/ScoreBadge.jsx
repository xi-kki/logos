import { clsx } from 'clsx';

export default function ScoreBadge({ score, confidence, rationale }) {
  const getColor = (score) => {
    if (score >= 70) return 'success';
    if (score >= 40) return 'accent';
    return 'error';
  };

  const color = getColor(score);

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono text-[var(--color-text-dim)] uppercase tracking-wider">
          Quality Score
        </span>
        <span
          className={clsx(
            'text-2xl font-bold font-mono',
            color === 'success' && 'text-[var(--color-success)]',
            color === 'accent' && 'text-[var(--color-accent)]',
            color === 'error' && 'text-[var(--color-error)]'
          )}
        >
          {score}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-[var(--color-surface-2)] mb-3 overflow-hidden">
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-500',
            color === 'success' && 'bg-[var(--color-success)]',
            color === 'accent' && 'bg-[var(--color-accent)]',
            color === 'error' && 'bg-[var(--color-error)]'
          )}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Confidence */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-[var(--color-text-dim)]">Confidence:</span>
        <span
          className={clsx(
            'text-xs font-mono px-2 py-0.5 rounded',
            confidence === 'high' && 'bg-[var(--color-success-dim)] text-[var(--color-success)]',
            confidence === 'medium' && 'bg-[var(--color-accent-dim)] text-[var(--color-accent)]',
            confidence === 'low' && 'bg-[var(--color-error-dim)] text-[var(--color-error)]'
          )}
        >
          {confidence}
        </span>
      </div>

      {/* Rationale */}
      {rationale && rationale.length > 0 && (
        <div className="space-y-1">
          {rationale.map((reason, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-[var(--color-text-dim)]">
              <span className="text-[var(--color-success)] mt-0.5">+</span>
              <span>{reason}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
