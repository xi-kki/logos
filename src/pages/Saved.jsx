import { Save, Trash2, Copy, Check, ExternalLink } from 'lucide-react';
import { useStore } from '../store';
import { copyToClipboard } from '../lib/optimizer';
import { useState } from 'react';

export default function SavedPage() {
  const { savedPrompts, deletePrompt } = useStore();
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
      <div className="mb-8 animate-fade-up">
        <h2 className="text-2xl font-bold mb-2">Saved Prompts</h2>
        <p className="text-[var(--color-text-dim)]">
          Your collection of optimized prompts ({savedPrompts.length} total)
        </p>
      </div>

      {/* Saved List */}
      {savedPrompts.length > 0 ? (
        <div className="space-y-4 stagger">
          {savedPrompts.map((prompt) => (
            <div
              key={prompt.id}
              className="p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] animate-fade-up"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--color-accent-dim)] text-[var(--color-accent)]">
                    {prompt.modality}
                  </span>
                  <span className="text-xs text-[var(--color-text-dim)]">
                    Score: <span className="font-mono text-[var(--color-text)]">{prompt.score}</span>
                  </span>
                  <span className="text-xs text-[var(--color-text-dim)]">
                    Saved {formatTime(prompt.savedAt)}
                  </span>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <span className="block text-[10px] font-mono text-[var(--color-text-dim)] uppercase mb-1">
                    Original
                  </span>
                  <p className="text-sm text-[var(--color-text-dim)] line-clamp-3">
                    {prompt.input}
                  </p>
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-[var(--color-text-dim)] uppercase mb-1">
                    Optimized
                  </span>
                  <p className="text-sm text-[var(--color-text)] whitespace-pre-wrap line-clamp-5">
                    {prompt.output}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex justify-end gap-2">
                <button
                  onClick={() => handleCopy(prompt.output, prompt.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-text)] transition-colors"
                >
                  {copiedId === prompt.id ? (
                    <>
                      <Check size={12} className="text-[var(--color-success)]" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={() => deletePrompt(prompt.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-[var(--color-error-dim)] text-[var(--color-error)] hover:opacity-90 transition-opacity"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-[var(--color-text-dim)]">
          <Save size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-sm">No saved prompts yet</p>
          <p className="text-xs mt-1">Save optimized prompts from the editor</p>
        </div>
      )}
    </div>
  );
}
