// ═══════════════════════════════════════════════════════════════
// LOGOS — Express API Server
// Serves the prompt optimization API + static frontend
// ═══════════════════════════════════════════════════════════════

import express from 'express';
import cors from 'cors';
import { initDB, getDB } from './db/database.js';
import promptRoutes from './routes/prompts.js';
import contextRoutes from './routes/context.js';
import optimizeRoutes from './routes/optimize.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ── Rate Limiting (simple in-memory) ───────────────────────
const rateLimitMap = new Map();
function rateLimit(maxRequests = 60, windowMs = 60000) {
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!rateLimitMap.has(key)) {
      rateLimitMap.set(key, []);
    }
    
    const timestamps = rateLimitMap.get(key).filter(t => t > windowStart);
    rateLimitMap.set(key, timestamps);
    
    if (timestamps.length >= maxRequests) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    
    timestamps.push(now);
    next();
  };
}

app.use('/api/', rateLimit(100, 60000));

// ── Routes ─────────────────────────────────────────────────
app.use('/api/prompts', promptRoutes);
app.use('/api/context', contextRoutes);
app.use('/api/optimize', optimizeRoutes);

// ── Health Check ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '0.2.0' });
});

// ── Error Handler ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Logos Error]', err.message);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ── Start ──────────────────────────────────────────────────
async function start() {
  await initDB();
  app.listen(PORT, () => {
    console.log(`λ Logos API running on http://localhost:${PORT}`);
  });
}

start().catch(console.error);
