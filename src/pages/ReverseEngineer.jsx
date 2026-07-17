// ═══════════════════════════════════════════════════════════════
// LOGOS — Reverse Engineer Page
// Upload images, audio, video, paste URLs, or drop code to extract prompts
// ═══════════════════════════════════════════════════════════════

import { useState, useCallback, useRef } from 'react';
import { 
  Upload, Link, Code, Image, Globe, FileText, 
  ArrowRight, Copy, Check, Loader2, X, Sparkles,
  Music, Video, ChevronDown, Download, Mic
} from 'lucide-react';
import { useStore } from '../store';
import { exportAsJSON, exportAsMarkdown, copyToClipboard } from '../lib/optimizer';

const TABS = [
  { id: 'image', label: 'Image → Prompt', icon: Image, description: 'Upload a screenshot to extract the prompt', accept: 'image/*' },
  { id: 'audio', label: 'Audio → Prompt', icon: Music, description: 'Upload audio to get a recreation prompt', accept: 'audio/*' },
  { id: 'video', label: 'Video → Prompt', icon: Video, description: 'Upload video to analyze and extract prompt', accept: 'video/*' },
  { id: 'website', label: 'URL → Prompt', icon: Globe, description: 'Paste a URL to reverse-engineer', accept: null },
  { id: 'code', label: 'Code → Prompt', icon: Code, description: 'Drop code to generate documentation', accept: null },
];

export default function ReverseEngineerPage() {
  const [activeTab, setActiveTab] = useState('image');
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);
  const fileInputRef = useRef(null);
  
  const { addToHistory, savePrompt } = useStore();

  // Check API status on mount
  useState(() => {
    fetch('/api/optimize/status')
      .then(r => r.json())
      .then(setApiStatus)
      .catch(() => setApiStatus({ configured: false }));
  });

  // ── Handle File Drop ───────────────────────────────────────

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer?.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, [activeTab]);

  const handleFile = (file) => {
    const tab = TABS.find(t => t.id === activeTab);
    
    // Validate file type
    if (tab?.accept && !file.type.match(tab.accept.replace(/\*/g, '.*'))) {
      setError(`Please upload a ${activeTab} file`);
      return;
    }
    
    setError(null);
    
    if (activeTab === 'image' || activeTab === 'video') {
      // Preview images and video thumbnails
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        if (activeTab === 'image') {
          setInput(e.target.result); // base64 for image
        }
      };
      reader.readAsDataURL(file);
    } else if (activeTab === 'audio') {
      // Read audio as base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result.split(',')[1]; // Remove data URL prefix
        setInput(base64);
        setPreview(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
    
    // Store file metadata
    setInput(prev => {
      if (activeTab !== 'image' && activeTab !== 'audio') return prev;
      return prev; // Already set above
    });
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  // ── Process Request ────────────────────────────────────────

  const processRequest = async () => {
    if (activeTab === 'website' && !input.trim()) return;
    if (activeTab === 'code' && !input.trim()) return;
    if ((activeTab === 'image' || activeTab === 'audio') && !input) return;
    if (activeTab === 'video' && !preview) return;
    
    setIsProcessing(true);
    setResult(null);
    setError(null);
    
    try {
      let requestBody = {
        type: activeTab,
        content: input,
      };

      // For video, extract frames client-side first
      if (activeTab === 'video' && preview) {
        const frames = await extractVideoFrames(preview);
        requestBody.content = JSON.stringify(frames);
        requestBody.metadata = {
          filename: 'video.mp4',
          frameCount: frames.length,
        };
      }
      
      const response = await fetch('/api/optimize/reverse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Processing failed');
      }
      
      const data = await response.json();
      setResult(data);
      
      // Add to history
      addToHistory({
        type: 'reverse',
        source: activeTab,
        input: activeTab === 'image' ? '[Image Upload]' : 
                activeTab === 'audio' ? '[Audio Upload]' :
                activeTab === 'video' ? '[Video Upload]' :
                input.substring(0, 100),
        output: data.prompt,
      });
      
    } catch (err) {
      setError(err.message || 'Failed to process. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Extract Video Frames (Client-Side) ─────────────────────

  const extractVideoFrames = async (videoSrc) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.src = videoSrc;
      video.muted = true;
      video.preload = 'metadata';
      
      video.onloadedmetadata = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const frames = [];
        const frameCount = 5; // Extract 5 frames
        const interval = video.duration / (frameCount + 1);
        
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;
        
        for (let i = 1; i <= frameCount; i++) {
          video.currentTime = interval * i;
          await new Promise(r => setTimeout(r, 100)); // Wait for frame
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          frames.push(canvas.toDataURL('image/jpeg', 0.8).split(',')[1]);
        }
        
        resolve(frames);
      };
      
      video.onerror = () => resolve([]); // Fallback
    });
  };

  // ── Copy to Clipboard ──────────────────────────────────────

  const handleCopy = async () => {
    if (result?.prompt) {
      await copyToClipboard(result.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ── Save to Library ────────────────────────────────────────

  const handleSave = () => {
    if (result?.prompt) {
      savePrompt({
        title: `Reverse: ${activeTab} → Prompt`,
        original: activeTab === 'image' ? '[Image Upload]' : 
                  activeTab === 'audio' ? '[Audio Upload]' :
                  activeTab === 'video' ? '[Video Upload]' :
                  input.substring(0, 200),
        optimized: result.prompt,
        modality: 'text',
        score: result.confidence === 'high' ? 90 : result.confidence === 'medium' ? 60 : 30,
        confidence: result.confidence || 'medium',
        tags: ['reverse-engineered', activeTab],
      });
    }
  };

  // ── Clear ──────────────────────────────────────────────────

  const handleClear = () => {
    setInput('');
    setResult(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const currentTab = TABS.find(t => t.id === activeTab);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="text-[var(--color-accent)]" size={24} />
          Reverse Engineer
        </h1>
        <p className="text-[var(--color-text-dim)]">
          Upload images, audio, video, paste URLs, or drop code to extract structured prompts
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

      {/* Tab Selector */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--color-border)] pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              handleClear();
            }}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${activeTab === tab.id
                ? 'bg-[var(--color-accent-dim)] text-[var(--color-accent)]'
                : 'text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)]'
              }
            `}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
            <label className="block text-sm font-medium mb-2">
              {currentTab?.description}
            </label>
            
            {activeTab === 'image' || activeTab === 'audio' || activeTab === 'video' ? (
              /* Media Upload Zone */
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
                  ${dragActive 
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-dim)]' 
                    : 'border-[var(--color-border)] hover:border-[var(--color-accent)]'
                  }
                  ${preview ? 'bg-[var(--color-surface-2)]' : ''}
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={currentTab?.accept}
                  onChange={handleFileInput}
                  className="hidden"
                />
                
                {preview ? (
                  <div className="space-y-3">
                    {activeTab === 'video' ? (
                      <video 
                        src={preview} 
                        className="max-h-48 mx-auto rounded-lg"
                        controls
                        muted
                      />
                    ) : activeTab === 'audio' ? (
                      <div className="space-y-3">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--color-accent-dim)]">
                          <Music size={32} className="text-[var(--color-accent)]" />
                        </div>
                        <audio src={preview} controls className="w-full" />
                      </div>
                    ) : (
                      <img 
                        src={preview} 
                        alt="Upload preview" 
                        className="max-h-48 mx-auto rounded-lg object-contain"
                      />
                    )}
                    <p className="text-sm text-[var(--color-text-dim)]">
                      Click or drop to replace
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeTab === 'audio' ? (
                      <Mic className="mx-auto text-[var(--color-text-dim)]" size={32} />
                    ) : activeTab === 'video' ? (
                      <Video className="mx-auto text-[var(--color-text-dim)]" size={32} />
                    ) : (
                      <Upload className="mx-auto text-[var(--color-text-dim)]" size={32} />
                    )}
                    <div>
                      <p className="font-medium">
                        {activeTab === 'audio' ? 'Drop audio here' :
                         activeTab === 'video' ? 'Drop video here' :
                         'Drop an image here'}
                      </p>
                      <p className="text-sm text-[var(--color-text-dim)]">
                        or click to browse
                      </p>
                    </div>
                    <p className="text-xs text-[var(--color-text-dim)]">
                      {activeTab === 'audio' ? 'MP3, WAV, M4A up to 25MB' :
                       activeTab === 'video' ? 'MP4, WebM, MOV up to 50MB' :
                       'PNG, JPG, GIF up to 10MB'}
                    </p>
                  </div>
                )}
              </div>
            ) : activeTab === 'website' ? (
              /* Website URL Input */
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" size={16} />
                    <input
                      type="url"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full pl-10 pr-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                    />
                  </div>
                </div>
                <p className="text-xs text-[var(--color-text-dim)]">
                  Paste any website URL to analyze its design and generate a recreation prompt
                </p>
              </div>
            ) : (
              /* Code Input */
              <div className="space-y-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste your code here..."
                  rows={10}
                  className="w-full p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg font-mono text-sm focus:outline-none focus:border-[var(--color-accent)] resize-none"
                />
                <p className="text-xs text-[var(--color-text-dim)]">
                  Paste any code snippet to generate documentation and analysis prompts
                </p>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={processRequest}
              disabled={isProcessing || (!input && !preview)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-accent)] text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {activeTab === 'audio' ? 'Transcribing & Analyzing...' :
                   activeTab === 'video' ? 'Extracting Frames & Analyzing...' :
                   'Analyzing...'}
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Extract Prompt
                </>
              )}
            </button>
            
            <button
              onClick={handleClear}
              className="px-4 py-3 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-2)] transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Extracted Prompt</label>
              {result && (
                <div className="flex items-center gap-2">
                  {result.model && (
                    <span className="text-xs text-[var(--color-text-dim)]">
                      {result.model}
                    </span>
                  )}
                  <span className={`
                    text-xs px-2 py-1 rounded-full
                    ${result.confidence === 'high' ? 'bg-green-500/20 text-green-400' :
                      result.confidence === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }
                  `}>
                    {result.confidence} confidence
                  </span>
                </div>
              )}
            </div>
            
            <div className="min-h-[300px] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-4 overflow-auto">
              {result ? (
                <pre className="whitespace-pre-wrap text-sm font-mono">{result.prompt}</pre>
              ) : (
                <div className="h-full flex items-center justify-center text-[var(--color-text-dim)]">
                  <div className="text-center space-y-2">
                    <FileText size={32} className="mx-auto opacity-50" />
                    <p className="text-sm">Extracted prompt will appear here</p>
                    <p className="text-xs text-[var(--color-text-dim)]">
                      {activeTab === 'image' && 'Upload an image to get a recreation prompt'}
                      {activeTab === 'audio' && 'Upload audio to get a transcription + recreation prompt'}
                      {activeTab === 'video' && 'Upload video to analyze frames and get a prompt'}
                      {activeTab === 'website' && 'Paste a URL to analyze the design'}
                      {activeTab === 'code' && 'Paste code to get documentation prompts'}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {result?.note && (
              <p className="mt-2 text-xs text-[var(--color-text-dim)] italic">
                💡 {result.note}
              </p>
            )}
          </div>

          {/* Export Buttons */}
          {result && (
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-2)] transition-colors"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-2)] transition-colors"
              >
                <Download size={16} />
                Save to Library
              </button>
              
              <button
                onClick={() => {
                  const json = exportAsJSON('[Reverse Engineered]', result.prompt, { type: activeTab });
                  const blob = new Blob([json], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `logos-reverse-${activeTab}-${Date.now()}.json`;
                  a.click();
                }}
                className="px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-2)] transition-colors"
              >
                <Download size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
