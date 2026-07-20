-- ═══════════════════════════════════════════════════════════════
-- LOGOS — Supabase Database Schema
-- Run this in Supabase SQL Editor after creating your project
-- ═══════════════════════════════════════════════════════════════

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Prompts Table ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled',
  original TEXT NOT NULL,
  optimized TEXT NOT NULL,
  modality TEXT DEFAULT 'text' CHECK (modality IN ('text', 'code', 'image', 'video', 'audio')),
  score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── History Table ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  input TEXT NOT NULL,
  output TEXT,
  modality TEXT DEFAULT 'text',
  score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Indexes ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_prompts_user ON prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_prompts_created ON prompts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_history_user ON history(user_id);
CREATE INDEX IF NOT EXISTS idx_history_created ON history(user_id, created_at DESC);

-- ── Row Level Security (RLS) ──────────────────────────────
-- Users can only see and modify their own data

ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;

-- Prompts policies
CREATE POLICY "Users can view own prompts" ON prompts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prompts" ON prompts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prompts" ON prompts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own prompts" ON prompts
  FOR DELETE USING (auth.uid() = user_id);

-- History policies
CREATE POLICY "Users can view own history" ON history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own history" ON history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own history" ON history
  FOR DELETE USING (auth.uid() = user_id);

-- ── Updated At Trigger ─────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prompts_updated_at
  BEFORE UPDATE ON prompts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ── Done! ──────────────────────────────────────────────────
-- Now enable Auth providers in Supabase Dashboard:
-- 1. Go to Authentication → Providers
-- 2. Enable Google (requires OAuth credentials)
-- 3. Enable GitHub (optional)
-- 4. Enable Email (for magic links)
