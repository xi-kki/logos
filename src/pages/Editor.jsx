import { useState, useCallback } from 'react';
import { Sparkles, Copy, Download, Save, Zap } from 'lucide-react';
import { useStore } from '../store';
import { optimizePrompt, exportAsJSON, exportAsMarkdown, copyToClipboard } from '../lib/optimizer';
import { MEDIA_RULES } from '../components/MediaOptimizer';
import { MODALITIES } from '../data/prompts';
import { validate, optimizeSchema } from '../lib/validation';
import DiffView from '../components/DiffView';
import ScoreBadge from '../components/ScoreBadge';
import ContextPanel from '../components/ContextPanel';
import Toast from '../components/ui/Toast';

export default function EditorPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [optimizing, setOptimizing] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [toast, setToast] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const { modality, setModality, addToHistory, savePrompt } = useStore();

  // Get available tools for current modality
  const availableTools = modality !== 'text' && modality !== 'code'
    ? Object.keys(MEDIA_RULES[modality] || {})
    : [];

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const handleOptimize = () => {
    // Validate with Zod
    const { valid, errors } = validate(optimizeSchema, {
      input,
      modality,
      tool: selectedTool,
    });

    if (!valid) {
      setValidationErrors(errors);
      showToast(errors[0]?.message || 'Invalid input', 'error');
      return;
    }

    setValidationErrors([]);
    setOptimizing(true);

    // Simulate processing with realistic delay
    setTimeout(() => {
      try {
        const optimized = optimizePrompt(input, modality);
        setResult(optimized);
        setOptimizing(false);

        addToHistory({
          input,
          output: optimized.optimized,
          modality,
          score: optimized.score.score,
        });

        showToast('Prompt optimized successfully');
      } catch (err) {
        setOptimizing(false);
        showToast('Optimization failed. Please try again.', 'error');
      }
    }, 300);
  };

  const handleCopy = () => {
    if (!result?.optimized) return;
    copyToClipboard(result.optimized);
    showToast('Copied to clipboard');
  };

  const handleExportJSON = () => {
    if (!result?.optimized) return;
    const json = exportAsJSON(input, result.optimized, { modality, score: result.score.score });
    downloadFile(json, 'prompt.json', 'application/json');
    showToast('Exported as JSON');
  };

  const handleExportMarkdown = () => {
    if (!result?.optimized) return;
    const md = exportAsMarkdown(input, result.optimized, { modality, score: result.score.score });
    downloadFile(md, 'prompt.md', 'text/markdown');
    showToast('Exported as Markdown');
  };

  const handleSave = () => {
    if (!result?.optimized) return;
    savePrompt({
      input,
      output: result.optimized,
      modality,
      score: result.score.score,
    });
    showToast('Prompt saved');
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

  const charCount = input.length;
  const charColor = charCount > 4000
    ? 'text-[var(--color-error)]'
    : charCount > 3000
      ? 'text-[var(--color-accent)]'
      : 'text-[var(--color-text-dim)]';

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Toast */}
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

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
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (validationErrors.length > 0) setValidationErrors([]);
                }}
                placeholder="Describe what you want... e.g., 'A function that validates email addresses' or 'A cyberpunk cityscape at sunset'"
                maxLength={5000}
                className={`w-full h-40 p-4 rounded-lg bg-[var(--color-surface)] border text-[var(--color-text)] font-mono text-sm resize-none focus:outline-none transition-colors placeholder:text-[var(--color-text-dim)]/50 ${
                  validationErrors.length > 0
                    ? 'border-[var(--color-error)] focus:border-[var(--color-error)]'
                    : 'border-[var(--color-border)] focus:border-[var(--color-accent)]'
                }`}
              />
              {validationErrors.length > 0 && (
                <p className="text-xs text-[var(--color-error)] mt-1.5">
                  {validationErrors[0].message}
                </p>
              )}
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className={`text-xs font-mono ${charColor}`}>
                {charCount.toLocaleString()} / 5,000
              </span>
              <button
                onClick={handleOptimize}
                disabled={!input.trim() || optimizing || charCount > 5000}
                className={`
                  flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all
                  ${optimizing
                    ? 'bg-[var(--color-accent-dim)] text-[var(--color-accent)] cursor-wait'
                    : 'bg-[var(--color-accent)] text-[var(--color-bg)] hover:opacity-90 active:scale-95'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {optimizing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[var(--color-bg)] border-t-transparent rounded-full animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Optimize
                  </>
                )}
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
                      Copy
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
                <div className="p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] font-mono text-sm whitespace-pre-wrap text-[var(--color-text)] leading-relaxed">
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
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-surface)] mb-4">
                <Zap size={32} className="opacity-30" />
              </div>
              <p className="text-sm mb-1">Enter a prompt above and click Optimize</p>
              <p className="text-xs text-[var(--color-text-dim)]/50">
                Logos will analyze your intent and generate a structured, production-grade prompt
              </p>
            </div>
          )}
        </div>

        {/* Sidebar — Context Panel */}
        <div className="space-y-6">
          <ContextPanel input={input} modality={modality} />

          {/* Quick Tips */}
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <h4 className="text-xs font-mono text-[var(--color-text-dim)] uppercase tracking-wider mb-3">
              Tips
            </h4>
            <ul className="space-y-2 text-xs text-[var(--color-text-dim)]">
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-accent)] mt-0.5">→</span>
                <span>Be specific about what you want the output to look like</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-accent)] mt-0.5">→</span>
                <span>Include context like "for a senior engineer" or "beginner-friendly"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-accent)] mt-0.5">→</span>
                <span>For images, describe the scene, style, and mood</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-accent)] mt-0.5">→</span>
                <span>For code, mention the language and specific requirements</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
