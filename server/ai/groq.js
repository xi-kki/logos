// ═══════════════════════════════════════════════════════════════
// LOGOS — Groq API Client
// OpenAI-compatible client for Groq's fast inference API
// ═══════════════════════════════════════════════════════════════

import OpenAI from 'openai';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root
config({ path: join(__dirname, '../../.env') });

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';

if (!GROQ_API_KEY) {
  console.warn('⚠️  GROQ_API_KEY not set. AI features will use fallback mode.');
}

// ── Groq Client ──────────────────────────────────────────────

export const groq = new OpenAI({
  apiKey: GROQ_API_KEY || 'dummy-key',
  baseURL: GROQ_BASE_URL,
});

// ── Model Constants ──────────────────────────────────────────

export const MODELS = {
  // Vision (images + video frames)
  VISION: 'llama-3.2-11b-vision-preview',
  VISION_LARGE: 'llama-3.2-90b-vision-preview',
  
  // Audio (transcription)
  WHISPER: 'whisper-large-v3',
  WHISPER_TURBO: 'whisper-large-v3-turbo',
  
  // Text (general purpose)
  TEXT: 'llama-3.3-70b-versatile',
  TEXT_FAST: 'llama-3.1-8b-instant',
  
  // Code
  CODE: 'deepseek-r1-distill-llama-70b',
};

// ── Helper: Check if API key is configured ───────────────────

export function isConfigured() {
  return !!GROQ_API_KEY && GROQ_API_KEY !== 'dummy-key';
}

// ── Helper: Format image for vision API ──────────────────────

export function formatImageForVision(base64Data) {
  // Remove data URL prefix if present
  const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
  return `data:image/jpeg;base64,${cleanBase64}`;
}

// ── Helper: Format audio for Whisper API ─────────────────────

export function formatAudioForWhisper(buffer, filename = 'audio.wav') {
  return new File([buffer], filename, { type: 'audio/wav' });
}

// ── Chat Completion Wrapper ──────────────────────────────────

export async function chatCompletion(messages, options = {}) {
  const {
    model = MODELS.TEXT,
    temperature = 0.7,
    max_tokens = 4096,
    top_p = 1,
  } = options;

  try {
    const response = await groq.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens,
      top_p,
    });

    return {
      content: response.choices[0]?.message?.content || '',
      model: response.model,
      usage: response.usage,
    };
  } catch (error) {
    console.error('[Groq Chat Error]', error.message);
    throw error;
  }
}

// ── Vision Analysis Wrapper ──────────────────────────────────

export async function analyzeWithVision(imageBase64, prompt, options = {}) {
  const {
    model = MODELS.VISION,
    max_tokens = 4096,
  } = options;

  const imageUrl = formatImageForVision(imageBase64);

  try {
    const response = await groq.chat.completions.create({
      model,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: imageUrl },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
      max_tokens,
    });

    return {
      content: response.choices[0]?.message?.content || '',
      model: response.model,
      usage: response.usage,
    };
  } catch (error) {
    console.error('[Groq Vision Error]', error.message);
    throw error;
  }
}

// ── Audio Transcription Wrapper ──────────────────────────────

export async function transcribeAudio(audioBuffer, filename = 'audio.wav') {
  try {
    const file = new File([audioBuffer], filename, { type: 'audio/wav' });
    
    const response = await groq.audio.transcriptions.create({
      model: MODELS.WHISPER,
      file,
      language: 'en',
      response_format: 'verbose_json',
    });

    return {
      text: response.text,
      language: response.language,
      duration: response.duration,
      segments: response.segments,
    };
  } catch (error) {
    console.error('[Groq Whisper Error]', error.message);
    throw error;
  }
}

// ── Text Completion (simpler wrapper) ────────────────────────

export async function completeText(prompt, options = {}) {
  return chatCompletion(
    [{ role: 'user', content: prompt }],
    options
  );
}

export default groq;
