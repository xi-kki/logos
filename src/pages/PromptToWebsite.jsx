// ═══════════════════════════════════════════════════════════════
// LOGOS — Prompt to Website Generator
// Transform prompts into website code via Groq LLM
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { 
  Code, Wand2, Copy, Check, Loader2, 
  Globe, Palette, Layout, Smartphone,
  ChevronDown, Download, Eye, AlertCircle
} from 'lucide-react';
import { useStore } from '../store';
import { copyToClipboard } from '../lib/optimizer';

const FRAMEWORKS = [
  { id: 'html', label: 'HTML/CSS/JS', description: 'Simple static site' },
  { id: 'react', label: 'React + Tailwind', description: 'Modern component-based' },
  { id: 'nextjs', label: 'Next.js', description: 'Full-stack React framework' },
];

const STYLES = [
  { id: 'minimal', label: 'Minimal', description: 'Clean, lots of whitespace', color: '#ffffff' },
  { id: 'bold', label: 'Bold', description: 'Strong colors, big typography', color: '#0f0f0f' },
  { id: 'elegant', label: 'Elegant', description: 'Refined, sophisticated', color: '#fafafa' },
  { id: 'playful', label: 'Playful', description: 'Fun, colorful, animated', color: '#fff5f5' },
  { id: 'professional', label: 'Professional', description: 'Corporate, trustworthy', color: '#f8f9fa' },
  { id: 'dark', label: 'Dark Mode', description: 'Dark background, neon accents', color: '#121212' },
];

export default function PromptToWebsitePage() {
  const [prompt, setPrompt] = useState('');
  const [framework, setFramework] = useState('html');
  const [style, setStyle] = useState('minimal');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [activeTab, setActiveTab] = useState('code');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);
  
  const { addToHistory, savePrompt } = useStore();

  // Check API status on mount
  useEffect(() => {
    fetch('/api/optimize/status')
      .then(r => r.json())
      .then(setApiStatus)
      .catch(() => setApiStatus({ configured: false }));
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setGeneratedCode(null);
    setError(null);
    
    try {
      const response = await fetch('/api/optimize/generate-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          framework,
          style,
        }),
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Generation failed');
      }
      
      const code = await response.json();
      setGeneratedCode(code);
      
      addToHistory({
        type: 'prompt-to-website',
        input: prompt.substring(0, 100),
        output: code.html,
        metadata: { framework, style },
      });
    } catch (err) {
      setError(err.message || 'Failed to generate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = async () => {
    const code = activeTab === 'code' 
      ? (generatedCode?.html || '') 
      : (generatedCode?.react || '');
    await copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const code = generatedCode?.html || '';
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logos-website-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Wand2 className="text-[var(--color-accent)]" size={24} />
          Prompt → Website
        </h1>
        <p className="text-[var(--color-text-dim)]">
          Describe your website and get production-ready code
        </p>
        
        {/* API Status Indicator */}
        {apiStatus && (
          <div className={`text-xs px-3 py-1.5 rounded-full inline-flex items-center gap-2 ${
            apiStatus.configured 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-yellow-500/20 text-yellow-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${apiStatus.configured ? 'bg-green-400' : 'bg-yellow-400'}`} />
            {apiStatus.configured ? 'Groq AI Connected' : 'Template Mode (No API Key)'}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* Prompt Input */}
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
            <label className="block text-sm font-medium mb-2">Describe your website</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A modern SaaS landing page for an AI writing assistant with hero section, features grid, pricing table, and testimonials..."
              rows={6}
              className="w-full p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent)] resize-none"
            />
            <p className="text-xs text-[var(--color-text-dim)] mt-2">
              Be specific about sections, content, and style for best results
            </p>
          </div>

          {/* Framework Selection */}
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
            <label className="block text-sm font-medium mb-3">Framework</label>
            <div className="space-y-2">
              {FRAMEWORKS.map((fw) => (
                <button
                  key={fw.id}
                  onClick={() => setFramework(fw.id)}
                  className={`
                    w-full text-left p-3 rounded-lg border transition-colors
                    ${framework === fw.id
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent-dim)]'
                      : 'border-[var(--color-border)] hover:border-[var(--color-accent)]'
                    }
                  `}
                >
                  <div className="font-medium text-sm">{fw.label}</div>
                  <div className="text-xs text-[var(--color-text-dim)]">{fw.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Style Selection */}
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
            <label className="block text-sm font-medium mb-3">Style</label>
            <div className="grid grid-cols-2 gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`
                    p-2 rounded-lg border text-left transition-colors
                    ${style === s.id
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent-dim)]'
                      : 'border-[var(--color-border)] hover:border-[var(--color-accent)]'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: s.color }}
                    />
                    <div className="text-sm font-medium">{s.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-accent)] text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 size={18} />
                Generate Website
              </>
            )}
          </button>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {generatedCode ? (
            <>
              {/* Tab Selector */}
              <div className="flex gap-2 border-b border-[var(--color-border)] pb-2">
                <button
                  onClick={() => setActiveTab('code')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                    activeTab === 'code' ? 'bg-[var(--color-accent-dim)] text-[var(--color-accent)]' : 'text-[var(--color-text-dim)]'
                  }`}
                >
                  <Code size={16} />
                  HTML/CSS
                </button>
                <button
                  onClick={() => setActiveTab('react')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                    activeTab === 'react' ? 'bg-[var(--color-accent-dim)] text-[var(--color-accent)]' : 'text-[var(--color-text-dim)]'
                  }`}
                >
                  <Code size={16} />
                  React
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                    activeTab === 'preview' ? 'bg-[var(--color-accent-dim)] text-[var(--color-accent)]' : 'text-[var(--color-text-dim)]'
                  }`}
                >
                  <Eye size={16} />
                  Preview
                </button>
              </div>

              {/* Code Display */}
              <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
                {activeTab === 'preview' ? (
                  <iframe
                    srcDoc={generatedCode.html}
                    className="w-full h-[600px] bg-white"
                    title="Preview"
                    sandbox="allow-scripts"
                  />
                ) : (
                  <div className="relative">
                    <pre className="p-4 overflow-auto max-h-[600px] text-sm font-mono">
                      <code>{activeTab === 'code' ? generatedCode.html : generatedCode.react}</code>
                    </pre>
                  </div>
                )}
              </div>

              {/* Design Notes */}
              {generatedCode.notes && (
                <div className="p-4 bg-[var(--color-surface-2)] rounded-lg border border-[var(--color-border)]">
                  <h4 className="text-sm font-medium mb-2">Design Notes</h4>
                  <p className="text-xs text-[var(--color-text-dim)]">{generatedCode.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleCopyCode}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-2)] transition-colors"
                >
                  {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-2)] transition-colors"
                >
                  <Download size={16} />
                  Download HTML
                </button>
              </div>
            </>
          ) : (
            <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-12 text-center">
              <Globe className="mx-auto mb-4 text-[var(--color-text-dim)]" size={48} />
              <h3 className="text-lg font-medium mb-2">No website generated yet</h3>
              <p className="text-[var(--color-text-dim)]">
                Describe your website in the prompt and click Generate
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
