// ═══════════════════════════════════════════════════════════════
// LOGOS — Prompt Optimization API
// Server-side optimization engine + reverse engineering + AI
// ═══════════════════════════════════════════════════════════════

import { Router } from 'express';
import { z } from 'zod';
import { getDB } from '../db/database.js';
import { analyzeImage, analyzeWebsite, analyzeCode, analyzeAudio, analyzeVideo, generateWebsite, isConfigured } from '../ai/index.js';

const router = Router();

// ── Validation ─────────────────────────────────────────────

const OptimizeSchema = z.object({
  input: z.string().min(1, 'Input is required'),
  modality: z.enum(['text', 'code', 'image', 'video', 'audio']).default('text'),
  persona: z.string().optional(),
  personality: z.enum(['concise', 'friendly', 'analytical', 'creative', 'socratic']).optional(),
});

const ReverseEngineerSchema = z.object({
  type: z.enum(['image', 'website', 'code', 'audio', 'video']),
  content: z.string().min(1),
  modality: z.enum(['text', 'code', 'image', 'video', 'audio']).optional(),
  metadata: z.object({
    filename: z.string().optional(),
    duration: z.number().optional(),
    fps: z.number().optional(),
    resolution: z.string().optional(),
  }).optional(),
});

const GenerateWebsiteSchema = z.object({
  prompt: z.string().min(1),
  framework: z.enum(['html', 'react', 'nextjs']).default('html'),
  style: z.enum(['minimal', 'bold', 'elegant', 'playful', 'professional', 'dark']).default('minimal'),
});

// ── GET /api/optimize/status — Check AI configuration ──────

router.get('/status', (req, res) => {
  res.json({
    configured: isConfigured(),
    message: isConfigured() ? 'Groq API connected' : 'Using template mode (no API key)',
  });
});

// ── POST /api/optimize — Optimize a prompt ─────────────────

router.post('/', (req, res) => {
  try {
    const data = OptimizeSchema.parse(req.body);
    const result = optimizePromptServer(data.input, data.modality, data.persona, data.personality);
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('[Optimize]', error);
    res.status(500).json({ error: 'Optimization failed' });
  }
});

// ── POST /api/optimize/reverse — Reverse engineer from source ──

router.post('/reverse', async (req, res) => {
  try {
    const data = ReverseEngineerSchema.parse(req.body);
    
    let extractedPrompt;
    
    switch (data.type) {
      case 'image':
        extractedPrompt = await analyzeImage(data.content);
        break;
      case 'website':
        extractedPrompt = await analyzeWebsite(data.content);
        break;
      case 'code':
        extractedPrompt = await analyzeCode(data.content);
        break;
      case 'audio':
        // Audio content is base64 encoded audio data
        const audioBuffer = Buffer.from(data.content, 'base64');
        extractedPrompt = await analyzeAudio(audioBuffer, data.metadata?.filename);
        break;
      case 'video':
        // Video frames are sent as array of base64 images
        const frames = JSON.parse(data.content);
        extractedPrompt = await analyzeVideo(frames, data.metadata);
        break;
      default:
        return res.status(400).json({ error: 'Invalid reverse engineering type' });
    }
    
    // Save to database
    const db = getDB();
    const result = db.prepare(`
      INSERT INTO reverse_engineered (source_type, source_url, extracted_prompt, modality)
      VALUES (?, ?, ?, ?)
    `).run(data.type, data.content.substring(0, 500), extractedPrompt.prompt, data.modality || 'text');
    
    res.json({
      id: result.lastInsertRowid,
      ...extractedPrompt,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('[Reverse Engineer]', error);
    res.status(500).json({ error: 'Reverse engineering failed' });
  }
});

// ── POST /api/optimize/generate-website — Generate website from prompt ──

router.post('/generate-website', async (req, res) => {
  try {
    const data = GenerateWebsiteSchema.parse(req.body);
    const result = await generateWebsite(data.prompt, data.framework, data.style);
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('[Generate Website]', error);
    res.status(500).json({ error: 'Website generation failed' });
  }
});

// ── GET /api/optimize/reverse/history — Get reverse history ──

router.get('/reverse/history', (req, res) => {
  try {
    const db = getDB();
    const { type, limit = 20 } = req.query;
    
    let query = 'SELECT * FROM reverse_engineered';
    const params = [];
    
    if (type) {
      query += ' WHERE source_type = ?';
      params.push(type);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(Number(limit));
    
    const history = db.prepare(query).all(...params);
    res.json(history);
  } catch (error) {
    console.error('[Reverse History]', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// ═══════════════════════════════════════════════════════════════
// OPTIMIZATION ENGINE
// ═══════════════════════════════════════════════════════════════

function optimizePromptServer(input, modality, persona, personality) {
  const signals = analyzeIntent(input);
  const sections = injectStructure(input, signals, modality, persona, personality);
  const optimized = sections.map(s => s.content).join('\n\n');
  const score = scoreQuality(input, optimized, sections);
  
  return { original: input, optimized, sections, score, signals };
}

function analyzeIntent(input) {
  const lower = input.toLowerCase();
  const signals = [];
  
  if (/\b(draw|image|picture|photo|illustration|midjourney|flux|dall-e|stable diffusion)\b/i.test(lower)) {
    signals.push({ type: 'modality', value: 'image', confidence: 0.85 });
  }
  if (/\b(video|animation|kling|runway|sora|clip|pika)\b/i.test(lower)) {
    signals.push({ type: 'modality', value: 'video', confidence: 0.85 });
  }
  if (/\b(music|song|audio|voice|elevenlabs|suno|tts|podcast)\b/i.test(lower)) {
    signals.push({ type: 'modality', value: 'audio', confidence: 0.85 });
  }
  if (/\b(code|function|class|debug|refactor|review|api|component|hook)\b/i.test(lower)) {
    signals.push({ type: 'modality', value: 'code', confidence: 0.8 });
  }
  if (/\b(research|analyze|study|investigate|review|compare)\b/i.test(lower)) {
    signals.push({ type: 'persona', value: 'research', confidence: 0.7 });
  }
  if (/\b(design|creative|art|visual|aesthetic|ui|ux)\b/i.test(lower)) {
    signals.push({ type: 'persona', value: 'creative', confidence: 0.7 });
  }
  if (/\b(write|document|explain|teach|guide|tutorial)\b/i.test(lower)) {
    signals.push({ type: 'persona', value: 'technical-writer', confidence: 0.7 });
  }
  if (/\b(product|strategy|roadmap|prioritize|plan|feature)\b/i.test(lower)) {
    signals.push({ type: 'persona', value: 'product-strategist', confidence: 0.7 });
  }
  if (/\b(concise|brief|short|quick|tldr)\b/i.test(lower)) {
    signals.push({ type: 'personality', value: 'concise', confidence: 0.8 });
  }
  if (/\b(friendly|warm|casual|approachable|fun)\b/i.test(lower)) {
    signals.push({ type: 'personality', value: 'friendly', confidence: 0.8 });
  }
  if (/\b(formal|professional|serious|authoritative|academic)\b/i.test(lower)) {
    signals.push({ type: 'personality', value: 'analytical', confidence: 0.7 });
  }
  
  const wordCount = input.split(/\s+/).length;
  if (wordCount < 15) signals.push({ type: 'needsExpansion', value: true, confidence: 0.9 });
  if (!input.includes('\n') || input.split('\n').length < 3) {
    signals.push({ type: 'needsStructure', value: true, confidence: 0.8 });
  }
  
  return signals;
}

function injectStructure(input, signals, modality, persona, personality) {
  const sections = [];
  const modalitySignal = signals.find(s => s.type === 'modality');
  const effectiveModality = modalitySignal?.value || modality;
  const effectivePersonality = personality || signals.find(s => s.type === 'personality')?.value;
  
  const personaSignal = signals.find(s => s.type === 'persona');
  if (persona) {
    sections.push({ type: 'role', label: 'Role', content: `## Role\n${persona}` });
  } else if (personaSignal) {
    const roleMap = {
      'research': 'Senior Research Analyst with expertise in data synthesis and evidence-based analysis',
      'creative': 'Creative Director with a keen eye for visual storytelling and brand identity',
      'technical-writer': 'Technical Writer specializing in clear, structured documentation',
      'product-strategist': 'Product Strategist focused on user value and market fit',
    };
    sections.push({ type: 'role', label: 'Role', content: `## Role\nYou are a ${roleMap[personaSignal.value] || 'Expert Assistant'}.` });
  }
  
  sections.push({ type: 'instruction', label: 'Core Instruction', content: input });
  
  const modalitySections = {
    code: `## Code Requirements\n- Follow language best practices and idioms\n- Include proper error handling\n- Add JSDoc/docstrings for public APIs\n- Handle edge cases explicitly\n- Write testable, modular code\n- Consider performance implications`,
    image: `## Visual Specifications\n- Aspect ratio: [specify: 16:9, 1:1, 4:3, etc.]\n- Style: [artistic style — photorealistic, illustration, 3D, etc.]\n- Lighting: [natural, studio, dramatic, soft, etc.]\n- Composition: [close-up, wide shot, centered, rule of thirds]\n- Color palette: [vibrant, muted, monochrome, etc.]\n- Quality: 8k, highly detailed, professional grade`,
    video: `## Motion Specifications\n- Subject action: [describe primary movement]\n- Camera movement: [pan, tilt, zoom, static, dolly]\n- Duration: [5s, 15s, 30s, 60s]\n- Frame rate: [24fps cinematic, 30fps standard, 60fps smooth]\n- Transitions: [cuts, fades, wipes]\n- Atmosphere: [mood and environmental feel]`,
    audio: `## Sound Specifications\n- Genre: [musical style or category]\n- Mood: [emotional quality — energetic, calm, mysterious]\n- Instruments: [key instruments or synth types]\n- Tempo: [BPM range or feel]\n- Vocal style: [if applicable — clean, raspy, spoken word]\n- Production: [lo-fi, polished, cinematic, etc.]`,
    text: `## Output Requirements\n- Clear, structured response\n- Use headers for major sections\n- Include examples where helpful\n- Flag any assumptions made\n- Provide actionable recommendations`,
  };
  
  if (modalitySections[effectiveModality]) {
    sections.push({
      type: 'format',
      label: `${effectiveModality.charAt(0).toUpperCase() + effectiveModality.slice(1)} Specifications`,
      content: modalitySections[effectiveModality],
    });
  }
  
  sections.push({
    type: 'constraints',
    label: 'Constraints',
    content: `## Constraints\n- Stay focused on the core request\n- Be specific and actionable\n- Avoid unnecessary verbosity\n- If ambiguous, state assumptions before proceeding`,
  });
  
  sections.push({
    type: 'output',
    label: 'Expected Output',
    content: `## Expected Output\nProvide a structured response following the specifications above.\nInclude concrete examples where applicable.\nIf multiple approaches exist, briefly note trade-offs.`,
  });
  
  if (effectivePersonality) {
    const toneMap = {
      'concise': 'Be concise and direct. Minimum words, maximum impact. No filler or fluff.',
      'friendly': 'Be warm, approachable, and encouraging. Use natural language and relatable examples.',
      'analytical': 'Be analytical and objective. Lead with data and evidence. Structure arguments logically.',
      'creative': 'Be creative and expressive. Use vivid language. Think outside conventional patterns.',
      'socratic': 'Guide through questions. Help the user discover answers. Teach principles, not just solutions.',
    };
    sections.push({
      type: 'personality',
      label: 'Communication Style',
      content: `## Tone\n${toneMap[effectivePersonality] || toneMap['analytical']}`,
    });
  }
  
  return sections;
}

function scoreQuality(original, optimized, sections) {
  let score = 0;
  const rationale = [];
  
  const lengthRatio = optimized.length / Math.max(original.length, 1);
  if (lengthRatio >= 1.5 && lengthRatio < 5) {
    score += 20;
    rationale.push('Good expansion — adds detail without bloat');
  } else if (lengthRatio >= 5) {
    score += 10;
    rationale.push('Significant expansion — review for unnecessary content');
  } else {
    score += 5;
    rationale.push('Minimal expansion — consider adding more structure');
  }
  
  const hasHeaders = (optimized.match(/^##? /gm) || []).length;
  if (hasHeaders >= 3) {
    score += 25;
    rationale.push(`${hasHeaders} section headers for scannability`);
  } else if (hasHeaders >= 1) {
    score += 15;
    rationale.push(`${hasHeaders} section headers — consider adding more`);
  }
  
  if (sections.some(s => s.type === 'role')) {
    score += 20;
    rationale.push('Role definition for consistent behavior');
  }
  if (sections.some(s => s.type === 'output')) {
    score += 15;
    rationale.push('Clear output format specified');
  }
  if (sections.some(s => s.type === 'format')) {
    score += 15;
    rationale.push('Modality-specific structure added');
  }
  if (sections.some(s => s.type === 'personality')) {
    score += 5;
    rationale.push('Communication style defined');
  }
  
  let confidence;
  if (score >= 75) confidence = 'high';
  else if (score >= 45) confidence = 'medium';
  else confidence = 'low';
  
  return { score: Math.min(score, 100), confidence, rationale, improvements: sections.length };
}

export default router;
