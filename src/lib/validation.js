// ═══════════════════════════════════════════════════════════════
// LOGOS — Zod Validation Schemas
// Input validation for all user-facing forms
// ═══════════════════════════════════════════════════════════════

import { z } from 'zod';

// ── Prompt Optimization ──

export const optimizeSchema = z.object({
  input: z
    .string()
    .min(3, 'Prompt must be at least 3 characters')
    .max(5000, 'Prompt must be under 5,000 characters')
    .trim(),
  modality: z.enum(['text', 'code', 'image', 'video', 'audio'], {
    message: 'Select a valid modality',
  }),
  tool: z.string().nullable().optional(),
});

// ── Template Search ──

export const templateSearchSchema = z.object({
  search: z.string().max(100, 'Search too long').trim().optional(),
  category: z
    .enum(['all', 'personas', 'personalities', 'research', 'code', 'image', 'video', 'audio'])
    .optional(),
});

// ── Saved Prompt ──

export const savedPromptSchema = z.object({
  input: z.string().min(1),
  output: z.string().min(1),
  modality: z.enum(['text', 'code', 'image', 'video', 'audio']),
  score: z.number().min(0).max(100),
});

// ── History Entry ──

export const historyEntrySchema = z.object({
  input: z.string().min(1),
  output: z.string().min(1),
  modality: z.enum(['text', 'code', 'image', 'video', 'audio']),
  score: z.number().min(0).max(100),
});

// ── Validation Helper ──

export function validate(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) {
    return { valid: true, data: result.data, errors: null };
  }
  const errors = result.error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
  return { valid: false, data: null, errors };
}
