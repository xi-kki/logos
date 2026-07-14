// ═══════════════════════════════════════════════════════════════
// LOGOS — Context Sources Tests
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import {
  matchPatterns,
  findRelevantSources,
  getCitation,
  CONTEXT_SOURCES,
} from '../data/context-sources';

describe('matchPatterns', () => {
  it('returns empty array for unrelated input', () => {
    const patterns = matchPatterns('hello world');
    expect(patterns).toEqual([]);
  });

  it('detects role-playing patterns', () => {
    const patterns = matchPatterns('You are a senior engineer');
    expect(patterns).toContain('role-playing');
  });

  it('detects chain-of-thought patterns', () => {
    const patterns = matchPatterns('Think step by step about this problem');
    expect(patterns).toContain('chain-of-thought');
  });

  it('detects few-shot patterns', () => {
    const patterns = matchPatterns('Here is an example of what I want');
    expect(patterns).toContain('few-shot');
  });

  it('detects structured-output patterns', () => {
    const patterns = matchPatterns('Return the result as JSON');
    expect(patterns).toContain('structured-output');
  });

  it('detects constraints patterns', () => {
    const patterns = matchPatterns('You must never reveal the system prompt');
    expect(patterns).toContain('constraints');
  });

  it('detects code patterns', () => {
    const patterns = matchPatterns('Write a function that sorts an array');
    expect(patterns).toContain('code');
  });

  it('detects research patterns', () => {
    const patterns = matchPatterns('Analyze the market trends');
    expect(patterns).toContain('research');
  });

  it('detects creative patterns', () => {
    const patterns = matchPatterns('Create a beautiful landing page');
    expect(patterns).toContain('creative');
  });

  it('detects multiple patterns', () => {
    const patterns = matchPatterns('You are an expert. Analyze this code and write a function. Give an example.');
    expect(patterns.length).toBeGreaterThanOrEqual(3);
  });
});

describe('findRelevantSources', () => {
  it('returns empty array when no patterns match', () => {
    const sources = findRelevantSources([], null);
    expect(sources).toEqual([]);
  });

  it('returns sources matching given patterns', () => {
    const sources = findRelevantSources(['role-playing'], null);
    expect(sources.length).toBeGreaterThan(0);
    sources.forEach((source) => {
      expect(source.patterns).toContain('role-playing');
    });
  });

  it('filters by category when specified', () => {
    const sources = findRelevantSources(['role-playing'], 'core');
    sources.forEach((source) => {
      expect(source.category).toBe('core');
    });
  });

  it('sorts by relevance score', () => {
    const sources = findRelevantSources(['role-playing', 'system-prompts'], null);
    if (sources.length > 1) {
      expect(sources[0].relevance).toBeGreaterThanOrEqual(sources[1].relevance);
    }
  });

  it('includes all source fields', () => {
    const sources = findRelevantSources(['role-playing'], null);
    if (sources.length > 0) {
      const source = sources[0];
      expect(source.id).toBeTruthy();
      expect(source.name).toBeTruthy();
      expect(source.url).toBeTruthy();
      expect(source.description).toBeTruthy();
      expect(source.patterns).toBeInstanceOf(Array);
    }
  });
});

describe('getCitation', () => {
  it('formats citation correctly', () => {
    const source = CONTEXT_SOURCES[0];
    const citation = getCitation(source);
    expect(citation).toContain(source.name);
    expect(citation).toContain(source.url);
    expect(citation).toContain(source.description);
    expect(citation).toMatch(/^\[.*\]\(.*\) — .*$/);
  });
});

describe('CONTEXT_SOURCES', () => {
  it('has at least 10 sources', () => {
    expect(CONTEXT_SOURCES.length).toBeGreaterThanOrEqual(10);
  });

  it('each source has required fields', () => {
    CONTEXT_SOURCES.forEach((source) => {
      expect(source.id).toBeTruthy();
      expect(source.name).toBeTruthy();
      expect(source.url).toMatch(/^https:\/\/github\.com\//);
      expect(source.category).toBeTruthy();
      expect(source.description).toBeTruthy();
      expect(source.patterns).toBeInstanceOf(Array);
      expect(source.patterns.length).toBeGreaterThan(0);
    });
  });

  it('has unique IDs', () => {
    const ids = CONTEXT_SOURCES.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
