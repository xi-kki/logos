// ═══════════════════════════════════════════════════════════════
// LOGOS — Validation Schema Tests
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import { validate, optimizeSchema, templateSearchSchema, savedPromptSchema } from '../lib/validation';

describe('optimizeSchema', () => {
  it('accepts valid input', () => {
    const result = validate(optimizeSchema, {
      input: 'Write a function that validates emails',
      modality: 'text',
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toBeNull();
  });

  it('rejects input shorter than 3 characters', () => {
    const result = validate(optimizeSchema, {
      input: 'ab',
      modality: 'text',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toBeTruthy();
    expect(result.errors[0].message).toContain('at least 3');
  });

  it('rejects input longer than 5000 characters', () => {
    const result = validate(optimizeSchema, {
      input: 'x'.repeat(5001),
      modality: 'text',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toBeTruthy();
    expect(result.errors[0].message).toContain('5,000');
  });

  it('accepts input at exactly 5000 characters', () => {
    const result = validate(optimizeSchema, {
      input: 'x'.repeat(5000),
      modality: 'text',
    });
    expect(result.valid).toBe(true);
  });

  it('rejects invalid modality', () => {
    const result = validate(optimizeSchema, {
      input: 'test prompt here',
      modality: 'invalid',
    });
    expect(result.valid).toBe(false);
  });

  it('accepts all valid modalities', () => {
    const modalities = ['text', 'code', 'image', 'video', 'audio'];
    modalities.forEach((modality) => {
      const result = validate(optimizeSchema, {
        input: 'test prompt here',
        modality,
      });
      expect(result.valid).toBe(true);
    });
  });

  it('trims whitespace from input', () => {
    const result = validate(optimizeSchema, {
      input: '  test prompt  ',
      modality: 'text',
    });
    expect(result.valid).toBe(true);
    expect(result.data.input).toBe('test prompt');
  });
});

describe('templateSearchSchema', () => {
  it('accepts empty search', () => {
    const result = validate(templateSearchSchema, {});
    expect(result.valid).toBe(true);
  });

  it('accepts valid search string', () => {
    const result = validate(templateSearchSchema, { search: 'engineer' });
    expect(result.valid).toBe(true);
  });

  it('rejects search longer than 100 characters', () => {
    const result = validate(templateSearchSchema, { search: 'x'.repeat(101) });
    expect(result.valid).toBe(false);
  });

  it('accepts valid category', () => {
    const result = validate(templateSearchSchema, { category: 'personas' });
    expect(result.valid).toBe(true);
  });

  it('rejects invalid category', () => {
    const result = validate(templateSearchSchema, { category: 'nonexistent' });
    expect(result.valid).toBe(false);
  });
});

describe('savedPromptSchema', () => {
  it('accepts valid saved prompt', () => {
    const result = validate(savedPromptSchema, {
      input: 'original',
      output: 'optimized',
      modality: 'text',
      score: 75,
    });
    expect(result.valid).toBe(true);
  });

  it('rejects score below 0', () => {
    const result = validate(savedPromptSchema, {
      input: 'original',
      output: 'optimized',
      modality: 'text',
      score: -1,
    });
    expect(result.valid).toBe(false);
  });

  it('rejects score above 100', () => {
    const result = validate(savedPromptSchema, {
      input: 'original',
      output: 'optimized',
      modality: 'text',
      score: 101,
    });
    expect(result.valid).toBe(false);
  });

  it('accepts score at boundaries', () => {
    expect(validate(savedPromptSchema, { input: 'a', output: 'b', modality: 'text', score: 0 }).valid).toBe(true);
    expect(validate(savedPromptSchema, { input: 'a', output: 'b', modality: 'text', score: 100 }).valid).toBe(true);
  });
});
