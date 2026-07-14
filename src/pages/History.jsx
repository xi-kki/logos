import { useState } from 'react';
import { Clock, Trash2, Copy, Check, ArrowLeft, Eye } from 'lucide-react';
import { useStore } from '../store';
import { copyToClipboard } from '../lib/optimizer';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Toast from '../components/ui/Toast';
import EmptyState from '../components/ui/EmptyState';

export default function HistoryPage() {
  const { history, clearHistory } = useStore();
  const [copiedId, setCopiedId] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [toast, setToast] = useState(null);

  const handleCopy = (text, id) => {
    copyToClipboard(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    setToast({ message: 'Copied to clipboard', type: 'success', id: Date.now() });
  };

  const formatTime = (iso) => {
    return new Date(iso).toLocaleString();
  };

  const formatRelative = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Detail view
  if (selectedEntry) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        {toast && (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}

        <button
          onClick={() => setSelectedEntry(null)}
          className="flex items-center gap-2 text-sm text-[var(--color-text-dim)] hover:text-[var(--color-text)] mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to History
        </button>

        <div className="animate-fade-up">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--color-accent-dim)] text-[var(--color-accent)]">
              {selectedEntry.modality}
            </span>
            <span className="text-sm text-[var(--color-text-dim)]">
              Score: <span className="font-mono text-[var(--color-text)]">{selectedEntry.score}</span>/100
            </span>
            <span className="text-xs text-[var(--color-text-dim)]">
              {formatTime(selectedEntry.timestamp)}
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Original */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-[var(--color-text-dim)] uppercase tracking-wider">
                  Original Input
                </span>
                <button
                  onClick={() => handleCopy(selectedEntry.input, 'orig')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-text)] transition-colors"
                >
                  {copiedId === 'orig' ? (
                    <><Check size={12} className="text-[var(--color-success)]" /> Copied</>
                  ) : (
                    <><Copy size={12} /> Copy</>
                  )}
                </button>
              </div>
              <div className="p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] font-mono text-sm whitespace-pre-wrap text-[var(--color-text-dim)] leading-relaxed">
                {selectedEntry.input}
              </div>
            </div>

            {/* Optimized */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-[var(--color-text-dim)] uppercase tracking-wider">
                  Optimized Output
                </span>
                <button
                  onClick={() => handleCopy(selectedEntry.output, 'opt')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-text)] transition-colors"
                >
                  {copiedId === 'opt' ? (
                    <><Check size={12} className="text-[var(--color-success)]" /> Copied</>
                  ) : (
                    <><Copy size={12} /> Copy</>
                  )}
                </button>
              </div>
              <div className="p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] font-mono text-sm whitespace-pre-wrap text-[var(--color-text)] leading-relaxed">
                {selectedEntry.output}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {toast && (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {showClearConfirm && (
        <ConfirmDialog
          title="Clear History?"
          message="This will remove all optimization history. This cannot be undone."
          onConfirm={() => {
            clearHistory();
            setShowClearConfirm(false);
            setToast({ message: 'History cleared', type: 'success', id: Date.now() });
          }}
          onCancel={() => setShowClearConfirm(false)}
        />
      )}

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
            onClick={() => setShowClearConfirm(true)}
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
              className="p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all animate-fade-up cursor-pointer group"
              onClick={() => setSelectedEntry(entry)}
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
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[var(--color-text-dim)]">
                    {formatRelative(entry.timestamp)}
                  </span>
                  <Eye size={14} className="text-[var(--color-text-dim)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <span className="block text-[10px] font-mono text-[var(--color-text-dim)] uppercase mb-1">
                    Original
                  </span>
                  <p className="text-sm text-[var(--color-text-dim)] line-clamp-2">
                    {entry.input}
                  </p>
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-[var(--color-text-dim)] uppercase mb-1">
                    Optimized
                  </span>
                  <p className="text-sm text-[var(--color-text)] line-clamp-2">
                    {entry.output}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(entry.output, entry.id);
                  }}
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
        <EmptyState
          icon={Clock}
          title="No history yet"
          description="Optimized prompts will appear here"
        />
      )}
    </div>
  );
}
