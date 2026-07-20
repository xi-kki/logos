// ═══════════════════════════════════════════════════════════════
// LOGOS — Supabase Client
// Auth + Database for cross-device prompt persistence
// ═══════════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase not configured. Using localStorage fallback.');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ── Auth Helpers ──────────────────────────────────────────

export async function signInWithGoogle() {
  if (!supabase) return { error: 'Supabase not configured' };
  return supabase.auth.signInWithOAuth({ provider: 'google' });
}

export async function signInWithGitHub() {
  if (!supabase) return { error: 'Supabase not configured' };
  return supabase.auth.signInWithOAuth({ provider: 'github' });
}

export async function signInWithEmail(email) {
  if (!supabase) return { error: 'Supabase not configured' };
  return supabase.auth.signInWithOtp({ email });
}

export async function signOut() {
  if (!supabase) return;
  return supabase.auth.signOut();
}

export async function getUser() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ── Database Helpers ──────────────────────────────────────

// Save a prompt
export async function savePrompt(prompt) {
  if (!supabase) return { data: { ...prompt, id: Date.now() }, error: null };
  
  const user = await getUser();
  if (!user) return { data: { ...prompt, id: Date.now() }, error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('prompts')
    .insert({
      user_id: user.id,
      title: prompt.title || 'Untitled',
      original: prompt.original,
      optimized: prompt.optimized,
      modality: prompt.modality || 'text',
      score: prompt.score || 0,
      tags: prompt.tags || [],
    })
    .select()
    .single();

  return { data, error };
}

// Get all prompts for current user
export async function getPrompts() {
  if (!supabase) return { data: [], error: null };
  
  const user = await getUser();
  if (!user) return { data: [], error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return { data, error };
}

// Delete a prompt
export async function deletePrompt(id) {
  if (!supabase) return { error: null };
  
  const user = await getUser();
  if (!user) return { error: 'Not authenticated' };

  const { error } = await supabase
    .from('prompts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id); // RLS ensures user can only delete their own

  return { error };
}

// Save to history
export async function addToHistory(entry) {
  if (!supabase) return { data: { ...entry, id: Date.now() }, error: null };
  
  const user = await getUser();
  if (!user) return { data: { ...entry, id: Date.now() }, error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('history')
    .insert({
      user_id: user.id,
      input: entry.input,
      output: entry.output,
      modality: entry.modality || 'text',
      score: entry.score || 0,
    })
    .select()
    .single();

  return { data, error };
}

// Get history
export async function getHistory() {
  if (!supabase) return { data: [], error: null };
  
  const user = await getUser();
  if (!user) return { data: [], error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('history')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(100);

  return { data, error };
}

// Clear history
export async function clearHistory() {
  if (!supabase) return { error: null };
  
  const user = await getUser();
  if (!user) return { error: 'Not authenticated' };

  const { error } = await supabase
    .from('history')
    .delete()
    .eq('user_id', user.id);

  return { error };
}

// ── Listen for auth changes ──────────────────────────────

export function onAuthStateChange(callback) {
  if (!supabase) {
    callback('SIGNED_OUT', null);
    return { data: { subscription: { unsubscribe: () => {} } } };
  }
  
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session?.user || null);
  });
}
