import { useState } from 'react';
import { Sparkles, Copy, Download, Save, ChevronDown } from 'lucide-react';
import { useStore } from '../store';
import { optimizePrompt, exportAsJSON, exportAsMarkdown, copyToClipboard } from '../lib/optimizer';
import { MEDIA_RULES } from '../components/MediaOptimizer';
import { MODALITIES } from '../data/prompts';
import DiffView from '../components/DiffView';
import ScoreBadge from '../components/ScoreBadge';
import ContextPanel from '../components/ContextPanel';

export default function EditorPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [optimizing, setOptimizing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const { modality, setModality, addToHistory, savePrompt } = useStore();

  // Get available tools for current modality
  const availableTools = modality !== 'text' && modality !== 'code' 
    ? Object.keys(MEDIA_RULES[modality] || {})
    : [];

  const handleOptimize = () => {
    if (!input.trim()) return;
    setOptimizing(true);

    setTimeout(() => {
      const optimized = optimizePrompt(input, modality);
      setResult(optimized);
      setOptimizing(false);

      addToHistory({
        input,
        output: optimized.optimized,
        modality,
        score: optimized.score.score,
      });
    }, 300);
  };

  const handleCopy = () => {
    if (!result?.optimized) return;
    copyToClipboard(result.optimized);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJSON = () => {
    if (!result?.optimized) return;
    const json = exportAsJSON(input, result.optimized, { modality, score: result.score.score });
    downloadFile(json, 'prompt.json', 'application/json');
  };

  const handleExportMarkdown = () => {
    if (!result?.optimized) return;
    const md = exportAsMarkdown(input, result.optimized, { modality, score: result.score.score });
    downloadFile(md, 'prompt.md', 'text/markdown');
  };

  const handleSave = () => {
    if (!result?.optimized) return;
    savePrompt({
      input,
      output: result.optimized,
      modality,
      score: result.score.score,
    });
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <h2 className="text-2xl font-bold mb-2">Prompt Optimizer</h2>
        <p className="text-[var(--color-text-dim)]">
          Write a rough idea — Logos optimizes it into a production-grade prompt.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Modality Selector */}
          <div className="animate-fade-up" style={{ animationDelay: '60ms' }}>
            <label className="block text-xs font-mono text-[var(--color-text-dim)] uppercase tracking-wider mb-2">
              Target Modality
            </label>
            <div className="flex flex-wrap gap-2">
              {MODALITIES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setModality(m.id);
                    setSelectedTool(null);
                  }}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${modality === m.id
                      ? 'bg-[var(--color-accent-dim)] text-[var(--color-accent)] border border-[var(--color-accent)]'
                      : 'bg-[var(--color-surface)] text-[var(--color-text-dim)] border border-[var(--color-border)] hover:border-[var(--color-text-dim)]'
                    }
                  `}
                >
                  <span className="mr-1.5">{m.icon}</span>
                  {m.label}
                </button>
              ))}
            </div>

            {/* Tool Selector (for media modalities) */}
            {availableTools.length > 0 && (
              <div className="mt-3">
                <label className="block text-[10px] font-mono text-[var(--color-text-dim)] uppercase mb-1.5">
                  Platform (optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableTools.map((tool) => (
                    <button
                      key={tool}
                      onClick={() => setSelectedTool(selectedTool === tool ? null : tool)}
                      className={`
                        px-3 py-1.5 rounded text-xs font-medium transition-all
                        ${selectedTool === tool
                          ? 'bg-[var(--color-success-dim)] text-[var(--color-success)] border border-[var(--color-success)]'
                          : 'bg-[var(--color-surface-2)] text-[var(--color-text-dim)] border border-[var(--color-border)] hover:border-[var(--color-text-dim)]'
                        }
                      `}
                    >
                      {tool}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="animate-fade-up" style={{ animationDelay: '120ms' }}>
            <label className="block text-xs font-mono text-[var(--color-text-dim)] uppercase tracking-wider mb-2">
              Your Raw Prompt
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe what you want... e.g., 'A function that validates email addresses' or 'A cyberpunk cityscape at sunset'"
              className="w-full h-40 p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] font-mono text-sm resize-none focus:outline-none focus:border-[var(--color-accent)] transition-colors placeholder:text-[var(--color-text-dim)]/50"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-[var(--color-text-dim)]">
                {input.length} characters
              </span>
              <button
                onClick={handleOptimize}
                disabled={!input.trim() || optimizing}
                className={`
                  flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all
                  ${optimizing
                    ? 'bg-[var(--color-accent-dim)] text-[var(--color-accent)] cursor-wait'
                    : 'bg-[var(--color-accent)] text-[var(--color-bg)] hover:opacity-90 active:scale-95'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <Sparkles size={16} className={optimizing ? 'animate-spin' : ''} />
                {optimizing ? 'Optimizing...' : 'Optimize'}
              </button>
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-6 animate-fade-up">
              {/* Score */}
              <ScoreBadge
                score={result.score.score}
                confidence={result.score.confidence}
                rationale={result.score.rationale}
              />

              {/* Optimized Output */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono text-[var(--color-text-dim)] uppercase tracking-wider">
                    Optimized Prompt
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-text)] transition-colors"
                    >
                      <Copy size={14} />
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={handleExportJSON}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-text)] transition-colors"
                    >
                      <Download size={14} />
                      JSON
                    </button>
                    <button
                      onClick={handleExportMarkdown}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-text)] transition-colors"
                    >
                      <Download size={14} />
                      MD
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-[var(--color-accent-dim)] border border-[var(--color-accent)] text-[var(--color-accent)] hover:opacity-90 transition-colors"
                    >
                      <Save size={14} />
                      Save
                    </button>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] font-mono text-sm whitespace-pre-wrap text-[var(--color-text)]">
                  {result.optimized}
                </div>
              </div>

              {/* Diff View */}
              <DiffView diff={result.diff} />
            </div>
          )}

          {/* Empty State */}
          {!result && !optimizing && (
            <div className="text-center py-16 text-[var(--color-text-dim)]">
              <Sparkles size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-sm">Enter a prompt above and click Optimize</p>
            </div>
          )}
        </div>

        {/* Sidebar — Context Panel */}
        <div className="space-y-6">
          <ContextPanel input={input} modality={modality} />
        </div>
      </div>
    </div>
  );
}
