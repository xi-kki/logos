// ═══════════════════════════════════════════════════════════════
// LOGOS — Prompt CRUD Routes
// ═══════════════════════════════════════════════════════════════

import { Router } from 'express';
import { z } from 'zod';
import { getDB } from '../db/database.js';

const router = Router();

// ── Validation Schemas ─────────────────────────────────────

const CreatePromptSchema = z.object({
  title: z.string().min(1).max(200),
  original: z.string().min(1),
  optimized: z.string().min(1),
  modality: z.enum(['text', 'code', 'image', 'video', 'audio']).default('text'),
  score: z.number().min(0).max(100).default(0),
  confidence: z.enum(['low', 'medium', 'high']).default('low'),
  tags: z.array(z.string()).default([]),
});

const UpdatePromptSchema = CreatePromptSchema.partial();

// ── GET /api/prompts — List all prompts ────────────────────

router.get('/', (req, res) => {
  try {
    const db = getDB();
    const { modality, search, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM prompts';
    const conditions = [];
    const params = [];
    
    if (modality) {
      conditions.push('modality = ?');
      params.push(modality);
    }
    
    if (search) {
      conditions.push('(title LIKE ? OR original LIKE ? OR optimized LIKE ?)');
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));
    
    const prompts = db.prepare(query).all(...params);
    const total = db.prepare('SELECT COUNT(*) as count FROM prompts').get().count;
    
    res.json({
      prompts: prompts.map(p => ({
        ...p,
        tags: JSON.parse(p.tags || '[]'),
      })),
      total,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    console.error('[Prompts GET]', error);
    res.status(500).json({ error: 'Failed to fetch prompts' });
  }
});

// ── GET /api/prompts/:id — Get single prompt ───────────────

router.get('/:id', (req, res) => {
  try {
    const db = getDB();
    const prompt = db.prepare('SELECT * FROM prompts WHERE id = ?').get(req.params.id);
    
    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    
    // Get version history
    const versions = db.prepare(
      'SELECT * FROM prompt_versions WHERE prompt_id = ? ORDER BY version_number DESC'
    ).all(req.params.id);
    
    res.json({
      ...prompt,
      tags: JSON.parse(prompt.tags || '[]'),
      versions: versions.map(v => ({
        ...v,
      })),
    });
  } catch (error) {
    console.error('[Prompts GET/:id]', error);
    res.status(500).json({ error: 'Failed to fetch prompt' });
  }
});

// ── POST /api/prompts — Create new prompt ──────────────────

router.post('/', (req, res) => {
  try {
    const db = getDB();
    const data = CreatePromptSchema.parse(req.body);
    
    const result = db.prepare(`
      INSERT INTO prompts (title, original, optimized, modality, score, confidence, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.title,
      data.original,
      data.optimized,
      data.modality,
      data.score,
      data.confidence,
      JSON.stringify(data.tags)
    );
    
    // Create initial version
    db.prepare(`
      INSERT INTO prompt_versions (prompt_id, version_number, original, optimized, score)
      VALUES (?, 1, ?, ?, ?)
    `).run(result.lastInsertRowid, data.original, data.optimized, data.score);
    
    const prompt = db.prepare('SELECT * FROM prompts WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json({
      ...prompt,
      tags: JSON.parse(prompt.tags || '[]'),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('[Prompts POST]', error);
    res.status(500).json({ error: 'Failed to create prompt' });
  }
});

// ── PUT /api/prompts/:id — Update prompt ───────────────────

router.put('/:id', (req, res) => {
  try {
    const db = getDB();
    const existing = db.prepare('SELECT * FROM prompts WHERE id = ?').get(req.params.id);
    
    if (!existing) {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    
    const data = UpdatePromptSchema.parse(req.body);
    
    const updates = [];
    const params = [];
    
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        params.push(key === 'tags' ? JSON.stringify(value) : value);
      }
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(req.params.id);
    
    db.prepare(`UPDATE prompts SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    
    // Add version entry
    const versionCount = db.prepare(
      'SELECT COUNT(*) as count FROM prompt_versions WHERE prompt_id = ?'
    ).get(req.params.id).count;
    
    db.prepare(`
      INSERT INTO prompt_versions (prompt_id, version_number, original, optimized, score)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      req.params.id,
      versionCount + 1,
      data.original || existing.original,
      data.optimized || existing.optimized,
      data.score ?? existing.score
    );
    
    const prompt = db.prepare('SELECT * FROM prompts WHERE id = ?').get(req.params.id);
    
    res.json({
      ...prompt,
      tags: JSON.parse(prompt.tags || '[]'),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('[Prompts PUT]', error);
    res.status(500).json({ error: 'Failed to update prompt' });
  }
});

// ── DELETE /api/prompts/:id — Delete prompt ────────────────

router.delete('/:id', (req, res) => {
  try {
    const db = getDB();
    const result = db.prepare('DELETE FROM prompts WHERE id = ?').run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('[Prompts DELETE]', error);
    res.status(500).json({ error: 'Failed to delete prompt' });
  }
});

// ── GET /api/prompts/stats/overview — Stats ────────────────

router.get('/stats/overview', (req, res) => {
  try {
    const db = getDB();
    
    const stats = {
      total: db.prepare('SELECT COUNT(*) as count FROM prompts').get().count,
      byModality: db.prepare(
        'SELECT modality, COUNT(*) as count FROM prompts GROUP BY modality'
      ).all(),
      avgScore: db.prepare('SELECT AVG(score) as avg FROM prompts').get().avg || 0,
      recentCount: db.prepare(
        "SELECT COUNT(*) as count FROM prompts WHERE created_at > datetime('now', '-7 days')"
      ).get().count,
    };
    
    res.json(stats);
  } catch (error) {
    console.error('[Stats]', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
