// ═══════════════════════════════════════════════════════════════
// LOGOS — Context Panel
// Shows relevant GitHub sources and pattern citations
// ═══════════════════════════════════════════════════════════════

import { ExternalLink, GitBranch, Star, CheckCircle } from 'lucide-react';
import { matchPatterns, findRelevantSources, getCitation } from '../data/context-sources';

export default function ContextPanel({ input, modality }) {
  if (!input || input.trim().length < 10) {
    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="flex items-center gap-2 mb-2">
          <GitBranch size={14} className="text-[var(--color-accent)]" />
          <span className="text-xs font-mono text-[var(--color-text-dim)] uppercase tracking-wider">
            Context Sources
          </span>
        </div>
        <p className="text-xs text-[var(--color-text-dim)]">
          Enter a prompt to see relevant sources
        </p>
      </div>
    );
  }

  const patterns = matchPatterns(input);
  const sources = findRelevantSources(patterns, null);
  const topSources = sources.slice(0, 5);

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex items-center gap-2 mb-3">
        <GitBranch size={14} className="text-[var(--color-accent)]" />
        <span className="text-xs font-mono text-[var(--color-text-dim)] uppercase tracking-wider">
          Context Sources
        </span>
      </div>

      {/* Detected Patterns */}
      {patterns.length > 0 && (
        <div className="mb-3">
          <span className="block text-[10px] font-mono text-[var(--color-text-dim)] uppercase mb-1.5">
            Detected Patterns
          </span>
          <div className="flex flex-wrap gap-1.5">
            {patterns.map((pattern) => (
              <span
                key={pattern}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--color-accent-dim)] text-[var(--color-accent)]"
              >
                {pattern}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Relevant Sources */}
      {topSources.length > 0 ? (
        <div className="space-y-2">
          <span className="block text-[10px] font-mono text-[var(--color-text-dim)] uppercase">
            Relevant Sources
          </span>
          {topSources.map((source) => (
            <div
              key={source.id}
              className="p-2 rounded bg-[var(--color-surface-2)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-[var(--color-text)] truncate">
                      {source.name}
                    </span>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-text-dim)] hover:text-[var(--color-accent)] transition-colors"
                    >
                      <ExternalLink size={10} />
                    </a>
                  </div>
                  <p className="text-[10px] text-[var(--color-text-dim)] mt-0.5 line-clamp-1">
                    {source.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[var(--color-text-dim)]">
                  <Star size={10} />
                  {source.stars}
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {source.patterns.slice(0, 3).map((p) => (
                  <span
                    key={p}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${
                      patterns.includes(p)
                        ? 'bg-[var(--color-success-dim)] text-[var(--color-success)]'
                        : 'bg-[var(--color-surface)] text-[var(--color-text-dim)]'
                    }`}
                  >
                    {patterns.includes(p) && <CheckCircle size={8} className="inline mr-0.5" />}
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-[var(--color-text-dim)]">
          No specific sources matched — try adding more context
        </p>
      )}

      {/* Citation Format */}
      {topSources.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
          <span className="block text-[10px] font-mono text-[var(--color-text-dim)] uppercase mb-1">
            Citation Format
          </span>
          <code className="text-[10px] text-[var(--color-text-dim)] bg-[var(--color-surface-2)] px-2 py-1 rounded block">
            {getCitation(topSources[0])}
          </code>
        </div>
      )}
    </div>
  );
}
