// ═══════════════════════════════════════════════════════════════
// LOGOS — Optimizer Engine Tests
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import {
  optimizePrompt,
  exportAsJSON,
  exportAsMarkdown,
  copyToClipboard,
} from '../lib/optimizer';

describe('optimizePrompt', () => {
  it('returns empty result for empty input', () => {
    const result = optimizePrompt('');
    expect(result.optimized).toBe('');
    expect(result.sections).toEqual([]);
    expect(result.score.score).toBe(0);
  });

  it('returns empty result for whitespace-only input', () => {
    const result = optimizePrompt('   ');
    expect(result.optimized).toBe('');
    expect(result.score.score).toBe(0);
  });

  it('optimizes a simple text prompt', () => {
    const result = optimizePrompt('Write a function that validates email addresses');
    expect(result.optimized).toBeTruthy();
    expect(result.optimized.length).toBeGreaterThan(0);
    expect(result.sections.length).toBeGreaterThan(0);
    expect(result.score.score).toBeGreaterThan(0);
  });

  it('detects code modality signals', () => {
    const result = optimizePrompt('Write a function that validates email addresses', 'code');
    expect(result.optimized).toBeTruthy();
    expect(result.sections.some(s => s.type === 'constraints')).toBe(true);
  });

  it('detects image modality signals', () => {
    const result = optimizePrompt('Draw a cyberpunk cityscape at sunset', 'image');
    expect(result.optimized).toBeTruthy();
    expect(result.sections.some(s => s.type === 'format')).toBe(true);
  });

  it('detects video modality signals', () => {
    const result = optimizePrompt('Create a video of a dancer', 'video');
    expect(result.optimized).toBeTruthy();
    expect(result.sections.some(s => s.type === 'format')).toBe(true);
  });

  it('detects audio modality signals', () => {
    const result = optimizePrompt('Generate a jazz song', 'audio');
    expect(result.optimized).toBeTruthy();
    expect(result.sections.some(s => s.type === 'format')).toBe(true);
  });

  it('detects persona signals', () => {
    const result = optimizePrompt('Research the history of quantum computing');
    expect(result.optimized).toBeTruthy();
    // Should detect research persona
    expect(result.signals.some(s => s.type === 'persona')).toBe(true);
  });

  it('generates a diff', () => {
    const result = optimizePrompt('Write a function');
    expect(result.diff).toBeTruthy();
    expect(Array.isArray(result.diff)).toBe(true);
    expect(result.diff.length).toBeGreaterThan(0);
  });

  it('score confidence levels are valid', () => {
    const result = optimizePrompt('Write a comprehensive code review guide for senior engineers');
    expect(['high', 'medium', 'low']).toContain(result.score.confidence);
  });

  it('score is between 0 and 100', () => {
    const result = optimizePrompt('Test prompt');
    expect(result.score.score).toBeGreaterThanOrEqual(0);
    expect(result.score.score).toBeLessThanOrEqual(100);
  });
});

describe('exportAsJSON', () => {
  it('returns valid JSON', () => {
    const json = exportAsJSON('test input', 'optimized output', { modality: 'text' });
    const parsed = JSON.parse(json);
    expect(parsed.original).toBe('test input');
    expect(parsed.optimized).toBe('optimized output');
    expect(parsed.metadata.modality).toBe('text');
    expect(parsed.metadata.tool).toBe('Logos');
  });

  it('includes export timestamp', () => {
    const json = exportAsJSON('input', 'output');
    const parsed = JSON.parse(json);
    expect(parsed.metadata.exportedAt).toBeTruthy();
    expect(new Date(parsed.metadata.exportedAt)).toBeInstanceOf(Date);
  });
});

describe('exportAsMarkdown', () => {
  it('returns markdown with headers', () => {
    const md = exportAsMarkdown('test input', 'optimized output', { modality: 'code', score: 85 });
    expect(md).toContain('# Optimized Prompt');
    expect(md).toContain('**Modality:** code');
    expect(md).toContain('**Quality Score:** 85/100');
    expect(md).toContain('## Original');
    expect(md).toContain('## Optimized');
    expect(md).toContain('test input');
    expect(md).toContain('optimized output');
  });
});

describe('copyToClipboard', () => {
  it('returns a promise', () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
    const result = copyToClipboard('test');
    expect(result).toBeInstanceOf(Promise);
  });
});
