import { clsx } from 'clsx';

export default function DiffView({ diff }) {
  if (!diff || diff.length === 0) return null;

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
      <div className="px-4 py-2 border-b border-[var(--color-border)] flex items-center gap-2">
        <span className="text-xs font-mono text-[var(--color-text-dim)]">Changes</span>
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[var(--color-success)]"></span>
            <span className="text-[var(--color-text-dim)]">Added</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[var(--color-error)]"></span>
            <span className="text-[var(--color-text-dim)]">Removed</span>
          </span>
        </div>
      </div>
      <div className="font-mono text-sm overflow-x-auto">
        {diff.map((line, i) => (
          <div
            key={i}
            className={clsx(
              'px-4 py-0.5 border-l-2',
              line.type === 'added' && 'bg-[var(--color-success-dim)] border-l-[var(--color-success)] text-[var(--color-text)]',
              line.type === 'removed' && 'bg-[var(--color-error-dim)] border-l-[var(--color-error)] text-[var(--color-text-dim)] line-through',
              line.type === 'same' && 'border-l-transparent text-[var(--color-text-dim)]'
            )}
          >
            <span className="inline-block w-6 text-right mr-3 opacity-50">{i + 1}</span>
            {line.content || '\u00A0'}
          </div>
        ))}
      </div>
    </div>
  );
}
