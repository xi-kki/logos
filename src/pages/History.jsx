import { Clock, Trash2, Copy, Check } from 'lucide-react';
import { useStore } from '../store';
import { copyToClipboard } from '../lib/optimizer';
import { useState } from 'react';

export default function HistoryPage() {
  const { history, clearHistory } = useStore();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (text, id) => {
    copyToClipboard(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString();
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-up">
        <div>
          <h2 className="text-2xl font-bold mb-2">History</h2>
          <p className="text-[var(--color-text-dim)]">
            Your recent optimizations ({history.length} total)
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-[var(--color-error-dim)] text-[var(--color-error)] hover:opacity-90 transition-opacity"
          >
            <Trash2 size={14} />
            Clear All
          </button>
        )}
      </div>

      {/* History List */}
      {history.length > 0 ? (
        <div className="space-y-4 stagger">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] animate-fade-up"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--color-accent-dim)] text-[var(--color-accent)]">
                    {entry.modality}
                  </span>
                  <span className="text-xs text-[var(--color-text-dim)]">
                    Score: <span className="font-mono text-[var(--color-text)]">{entry.score}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--color-text-dim)]">
                  <Clock size={12} />
                  {formatTime(entry.timestamp)}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <span className="block text-[10px] font-mono text-[var(--color-text-dim)] uppercase mb-1">
                    Original
                  </span>
                  <p className="text-sm text-[var(--color-text-dim)] line-clamp-3">
                    {entry.input}
                  </p>
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-[var(--color-text-dim)] uppercase mb-1">
                    Optimized
                  </span>
                  <p className="text-sm text-[var(--color-text)] line-clamp-3">
                    {entry.output}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => handleCopy(entry.output, entry.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-text)] transition-colors"
                >
                  {copiedId === entry.id ? (
                    <>
                      <Check size={12} className="text-[var(--color-success)]" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      Copy Optimized
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-[var(--color-text-dim)]">
          <Clock size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-sm">No history yet</p>
          <p className="text-xs mt-1">Optimized prompts will appear here</p>
        </div>
      )}
    </div>
  );
}
