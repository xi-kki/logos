// ═══════════════════════════════════════════════════════════════
// LOGOS — Prompt Playground
// Test prompts with different Groq models, token counting, variables
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';
import { 
  Play, Loader2, Copy, Check, RotateCcw, 
  Settings, Variable, Hash, DollarSign,
  ChevronDown, Zap, Brain, Code, Image
} from 'lucide-react';
import { useStore } from '../store';
import { copyToClipboard } from '../lib/optimizer';

const MODELS = [
  { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B', description: 'Most capable, best quality', icon: Brain, tier: 'premium' },
  { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B', description: 'Fastest, good for simple tasks', icon: Zap, tier: 'fast' },
  { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B', description: 'Great for code and analysis', icon: Code, tier: 'balanced' },
  { id: 'gemma2-9b-it', label: 'Gemma 2 9B', description: 'Google\'s efficient model', icon: Zap, tier: 'fast' },
];

const PRESETS = [
  { name: 'Code Review', prompt: 'Review this code for bugs and improvements:\n\n```javascript\n{{code}}\n```' },
  { name: 'Blog Post', prompt: 'Write a 500-word blog post about {{topic}} for {{audience}}.' },
  { name: 'Email Draft', prompt: 'Write a professional email to {{recipient}} about {{subject}}. Tone: {{tone}}' },
  { name: 'API Documentation', prompt: 'Document this API endpoint:\n\n{{endpoint}}\n\nInclude: description, parameters, response format, examples.' },
  { name: 'Image Prompt', prompt: 'Create a Midjourney prompt for: {{description}}\n\nStyle: {{style}}\nMood: {{mood}}' },
];

// Token estimation (rough: 1 token ≈ 4 chars for English)
function estimateTokens(text) {
  if (!text) return { input: 0, output: 0, total: 0 };
  const chars = text.length;
  const words = text.split(/\s+/).filter(Boolean).length;
  // Better estimate: words * 1.3 tokens + punctuation
  const tokens = Math.ceil(words * 1.3) + Math.ceil(chars / 20);
  return { input: tokens, output: 0, total: tokens };
}

// Cost estimation (Groq free tier, but show what it would cost)
function estimateCost(tokens, model) {
  // Approximate costs per 1M tokens (if not free)
  const rates = {
    'llama-3.3-70b-versatile': 0.59,
    'llama-3.1-8b-instant': 0.05,
    'mixtral-8x7b-32768': 0.24,
    'gemma2-9b-it': 0.10,
  };
  const rate = rates[model] || 0.59;
  return ((tokens / 1_000_000) * rate).toFixed(4);
}

export default function PlaygroundPage() {
  const [prompt, setPrompt] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('llama-3.3-70b-versatile');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [variables, setVariables] = useState({});
  const [showVariables, setShowVariables] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  
  const { addToHistory } = useStore();

  // Extract variables from prompt
  const extractedVars = [...prompt.matchAll(/\{\{(\w+)\}\}/g)].map(m => m[1]);
  
  // Replace variables in prompt
  const processPrompt = useCallback(() => {
    let processed = prompt;
    for (const [key, value] of Object.entries(variables)) {
      processed = processed.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value || `[${key}]`);
    }
    return processed;
  }, [prompt, variables]);

  // Token counts
  const tokenEstimate = estimateTokens(processPrompt());
  const costEstimate = estimateCost(tokenEstimate.input, selectedModel);

  const handleRun = async () => {
    if (!prompt.trim()) return;
    
    setIsRunning(true);
    setResult(null);
    setError(null);
    
    try {
      const processedPrompt = processPrompt();
      
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: processedPrompt,
          modality: 'text',
        }),
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Generation failed');
      }
      
      const data = await response.json();
      
      const outputResult = {
        id: Date.now(),
        prompt: processedPrompt,
        output: data.optimized,
        model: selectedModel,
        temperature,
        maxTokens,
        tokens: tokenEstimate,
        timestamp: new Date().toISOString(),
      };
      
      setResult(outputResult);
      setHistory(prev => [outputResult, ...prev].slice(0, 20));
      
      addToHistory({
        type: 'playground',
        input: processedPrompt.substring(0, 100),
        output: data.optimized,
        metadata: { model: selectedModel, temperature },
      });
    } catch (err) {
      setError(err.message || 'Failed to run. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = async () => {
    if (result?.output) {
      await copyToClipboard(result.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLoadPreset = (preset) => {
    setPrompt(preset.prompt);
    setShowPresets(false);
    // Initialize variables
    const vars = [...preset.prompt.matchAll(/\{\{(\w+)\}\}/g)].map(m => m[1]);
    const newVars = {};
    vars.forEach(v => { newVars[v] = ''; });
    setVariables(newVars);
  };

  const handleReset = () => {
    setPrompt('');
    setSystemPrompt('');
    setResult(null);
    setVariables({});
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Play className="text-[var(--color-accent)]" size={24} />
            Prompt Playground
          </h1>
          <p className="text-[var(--color-text-dim)]">
            Test prompts with different models, adjust parameters, use variables
          </p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-2)] transition-colors"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Presets */}
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium">Quick Presets</label>
              <button
                onClick={() => setShowPresets(!showPresets)}
                className="text-xs text-[var(--color-accent)] hover:underline"
              >
                {showPresets ? 'Hide' : 'Show all'}
              </button>
            </div>
            <div className={`flex flex-wrap gap-2 ${showPresets ? '' : 'max-h-10 overflow-hidden'}`}>
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleLoadPreset(preset)}
                  className="px-3 py-1.5 text-xs bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-accent)] transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* System Prompt */}
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
            <label className="block text-sm font-medium mb-2">System Prompt (optional)</label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="You are a helpful assistant that..."
              rows={3}
              className="w-full p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent)] resize-none"
            />
          </div>

          {/* Main Prompt */}
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Prompt</label>
              <div className="flex items-center gap-4 text-xs text-[var(--color-text-dim)]">
                <span className="flex items-center gap-1">
                  <Hash size={12} />
                  {tokenEstimate.input} tokens
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign size={12} />
                  ${costEstimate}
                </span>
              </div>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Write your prompt here... Use {{variable}} for dynamic values"
              rows={12}
              className="w-full p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg font-mono text-sm focus:outline-none focus:border-[var(--color-accent)] resize-none"
            />
          </div>

          {/* Variables */}
          {extractedVars.length > 0 && (
            <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
              <div className="flex items-center gap-2 mb-3">
                <Variable size={16} className="text-[var(--color-accent)]" />
                <label className="text-sm font-medium">Variables</label>
                <span className="text-xs text-[var(--color-text-dim)]">
                  ({extractedVars.length} detected)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {extractedVars.map((varName) => (
                  <div key={varName}>
                    <label className="block text-xs text-[var(--color-text-dim)] mb-1">
                      {`{{${varName}}}`}
                    </label>
                    <input
                      type="text"
                      value={variables[varName] || ''}
                      onChange={(e) => setVariables(prev => ({ ...prev, [varName]: e.target.value }))}
                      placeholder={`Enter ${varName}...`}
                      className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent)]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Run Button */}
          <button
            onClick={handleRun}
            disabled={isRunning || !prompt.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-accent)] text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {isRunning ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play size={18} />
                Run Prompt
              </>
            )}
          </button>
        </div>

        {/* Settings Panel */}
        <div className="space-y-4">
          {/* Model Selection */}
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
            <label className="block text-sm font-medium mb-3">Model</label>
            <div className="space-y-2">
              {MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`
                    w-full text-left p-3 rounded-lg border transition-colors
                    ${selectedModel === model.id
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent-dim)]'
                      : 'border-[var(--color-border)] hover:border-[var(--color-accent)]'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <model.icon size={16} />
                    <div>
                      <div className="font-medium text-sm">{model.label}</div>
                      <div className="text-xs text-[var(--color-text-dim)]">{model.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Parameters */}
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
            <label className="block text-sm font-medium mb-3">Parameters</label>
            
            {/* Temperature */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-[var(--color-text-dim)]">Temperature</label>
                <span className="text-xs font-mono">{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-[var(--color-text-dim)]">
                <span>Precise</span>
                <span>Creative</span>
              </div>
            </div>

            {/* Max Tokens */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-[var(--color-text-dim)]">Max Tokens</label>
                <span className="text-xs font-mono">{maxTokens}</span>
              </div>
              <input
                type="range"
                min="128"
                max="4096"
                step="128"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-[var(--color-text-dim)]">
                <span>Short</span>
                <span>Long</span>
              </div>
            </div>
          </div>

          {/* Output */}
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Output</label>
              {result && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-[var(--color-accent)] hover:underline"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>
            
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm mb-3">
                {error}
              </div>
            )}
            
            <div className="min-h-[200px] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 overflow-auto">
              {result ? (
                <pre className="whitespace-pre-wrap text-sm font-mono">{result.output}</pre>
              ) : (
                <div className="h-full flex items-center justify-center text-[var(--color-text-dim)] text-sm">
                  Output will appear here
                </div>
              )}
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
              <label className="block text-sm font-medium mb-3">Recent Runs</label>
              <div className="space-y-2 max-h-48 overflow-auto">
                {history.slice(0, 5).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setPrompt(item.prompt);
                      setSelectedModel(item.model);
                      setTemperature(item.temperature);
                    }}
                    className="w-full text-left p-2 rounded-lg bg-[var(--color-surface-2)] hover:bg-[var(--color-border)] transition-colors text-xs"
                  >
                    <div className="truncate text-[var(--color-text)]">{item.prompt.substring(0, 50)}...</div>
                    <div className="text-[var(--color-text-dim)] mt-1">
                      {item.model.split('-').slice(0, 2).join(' ')} • {new Date(item.timestamp).toLocaleTimeString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
