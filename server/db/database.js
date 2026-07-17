// ═══════════════════════════════════════════════════════════════
// LOGOS — SQLite Database Setup
// ═══════════════════════════════════════════════════════════════

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let db;

export function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() first.');
  }
  return db;
}

export async function initDB() {
  const dbPath = join(__dirname, 'logos.db');
  db = new Database(dbPath);
  
  // Enable WAL mode for better concurrent performance
  db.pragma('journal_mode = WAL');
  
  // Create tables
  db.exec(`
    -- Optimized prompts with version history
    CREATE TABLE IF NOT EXISTS prompts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      original TEXT NOT NULL,
      optimized TEXT NOT NULL,
      modality TEXT DEFAULT 'text',
      score INTEGER DEFAULT 0,
      confidence TEXT DEFAULT 'low',
      tags TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Version history for each prompt
    CREATE TABLE IF NOT EXISTS prompt_versions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prompt_id INTEGER NOT NULL,
      version_number INTEGER NOT NULL,
      original TEXT NOT NULL,
      optimized TEXT NOT NULL,
      score INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (prompt_id) REFERENCES prompts(id) ON DELETE CASCADE
    );

    -- Reverse-engineered prompts from images/websites
    CREATE TABLE IF NOT EXISTS reverse_engineered (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_type TEXT NOT NULL, -- 'image', 'website', 'code'
      source_url TEXT,
      source_preview TEXT, -- base64 thumbnail or text snippet
      extracted_prompt TEXT NOT NULL,
      modality TEXT DEFAULT 'text',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Saved template collections
    CREATE TABLE IF NOT EXISTS collections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      prompt_ids TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Indexes for performance
    CREATE INDEX IF NOT EXISTS idx_prompts_modality ON prompts(modality);
    CREATE INDEX IF NOT EXISTS idx_prompts_created ON prompts(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_reverse_type ON reverse_engineered(source_type);
  `);

  console.log('λ Database initialized');
  return db;
}
