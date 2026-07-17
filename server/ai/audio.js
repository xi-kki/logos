// ═══════════════════════════════════════════════════════════════
// LOGOS — Audio Analysis Module
// Audio → Prompt reverse engineering via Groq Whisper + LLM
// ═══════════════════════════════════════════════════════════════

import { transcribeAudio, completeText, isConfigured, MODELS } from './groq.js';

// ── Audio Analysis (Transcription + Description) ─────────────

export async function analyzeAudio(audioBuffer, filename = 'audio.wav') {
  if (!isConfigured()) {
    return analyzeAudioFallback(filename);
  }

  try {
    // Step 1: Transcribe with Whisper
    console.log('[Audio] Transcribing with Whisper...');
    const transcription = await transcribeAudio(audioBuffer, filename);
    
    // Step 2: Analyze transcription with LLM to generate recreation prompt
    console.log('[Audio] Analyzing transcription...');
    const analysisPrompt = generateAudioAnalysisPrompt(transcription);
    
    const analysis = await completeText(analysisPrompt, {
      model: MODELS.TEXT,
      max_tokens: 2048,
    });

    // Combine transcription + analysis
    const fullPrompt = `## Transcription
"${transcription.text}"

## Detected Metadata
- **Language**: ${transcription.language || 'Unknown'}
- **Duration**: ${transcription.duration ? `${transcription.duration.toFixed(1)}s` : 'Unknown'}
- **Segments**: ${transcription.segments?.length || 'Unknown'}

---

${analysis.content}`;

    return {
      prompt: fullPrompt,
      transcription: transcription.text,
      language: transcription.language,
      duration: transcription.duration,
      confidence: 'high',
      model: `whisper-large-v3 + ${MODELS.TEXT}`,
      note: 'Audio analyzed with Groq Whisper + LLM',
    };
  } catch (error) {
    console.error('[Audio Analysis Error]', error.message);
    return analyzeAudioFallback(filename, error.message);
  }
}

// ── Generate Analysis Prompt from Transcription ──────────────

function generateAudioAnalysisPrompt(transcription) {
  const { text, language, duration, segments } = transcription;
  
  // Detect if it's lyrics, speech, or music
  const isLyrics = detectIfLyrics(text);
  const isSpeech = detectIfSpeech(text);
  
  if (isLyrics) {
    return `You are a music producer and songwriter. Analyze these lyrics and generate a prompt to recreate a song with similar style.

Lyrics:
"${text}"

Provide your analysis in this format:

## Music Analysis
- **Genre**: [Detected or suggested genre]
- **Mood**: [Emotional quality — happy, melancholic, energetic, etc.]
- **Tempo**: [Estimated BPM or feel — slow, mid, upbeat]
- **Instruments**: [Suggested instruments based on lyrics/theme]
- **Vocal Style**: [Male/Female, style — clean, raspy, whispered, etc.]
- **Song Structure**: [Verse-Chorus, etc.]

## Recreation Prompt
Create a song with the following specifications:

**Genre**: [Genre]
**Mood**: [Mood]
**Tempo**: [BPM or feel]
**Instruments**: [Key instruments]
**Vocal Style**: [Description]
**Lyrics Theme**: [Summary of lyrical content]

**Production Notes**:
- [Any specific production style]
- [Reference artists if applicable]`;
  }
  
  if (isSpeech) {
    return `You are a voice analyst and content strategist. Analyze this speech/podcast transcript and generate a prompt to recreate similar audio content.

Transcript:
"${text}"

Provide your analysis in this format:

## Speech Analysis
- **Topic**: [Main topic discussed]
- **Tone**: [Formal, casual, educational, entertaining, etc.]
- **Speaker Style**: [Fast/slow, enthusiastic/calm, etc.]
- **Content Type**: [Podcast, lecture, interview, narration, etc.]
- **Audience**: [Target audience]

## Recreation Prompt
Create audio content with the following specifications:

**Content Type**: [Type]
**Topic**: [Subject]
**Tone**: [Tone]
**Speaker Style**: [Description]
**Pacing**: [Speed and rhythm]
**Duration**: [Target length]

**Script Notes**:
- [Key points to cover]
- [Style references]`;
  }
  
  // Default: general audio analysis
  return `You are an audio engineer and music analyst. Analyze this audio content and generate a prompt to recreate similar audio.

Transcript/Content:
"${text}"

Duration: ${duration ? `${duration.toFixed(1)}s` : 'Unknown'}

Provide your analysis in this format:

## Audio Analysis
- **Content Type**: [Music, speech, sound effects, ambient, etc.]
- **Genre/Category**: [If applicable]
- **Mood**: [Emotional quality]
- **Quality**: [Professional, amateur, lo-fi, etc.]

## Recreation Prompt
Create audio with the following specifications:

**Type**: [Content type]
**Style**: [Description]
**Mood**: [Mood]
**Technical Specs**: [Quality, format, etc.]

**Notes**:
- [Any specific elements to include]`;
}

// ── Detection Helpers ────────────────────────────────────────

function detectIfLyrics(text) {
  const lower = text.toLowerCase();
  // Check for common lyric patterns
  const lyricPatterns = [
    /\b(verse|chorus|bridge|hook|refrain)\b/i,
    /\b(love|heart|soul|dream|night|day|feel)\b/i,
    /[!?]{2,}/, // Multiple exclamation/question marks
    /\b(doo|la|na|oh|yeah|baby)\b/i,
  ];
  
  const matches = lyricPatterns.filter(p => p.test(text)).length;
  return matches >= 2 || text.split('\n').length > 4;
}

function detectIfSpeech(text) {
  const lower = text.toLowerCase();
  // Check for speech patterns
  const speechPatterns = [
    /\b(welcome|hello|today|we|discuss|topic|question)\b/i,
    /\b(um|uh|so|well|you know|basically)\b/i,
    /\b(think|believe|opinion|agree|disagree)\b/i,
  ];
  
  const matches = speechPatterns.filter(p => p.test(text)).length;
  return matches >= 2;
}

// ── Fallback (when API not configured) ───────────────────────

function analyzeAudioFallback(filename, error = null) {
  return {
    prompt: `## Audio Recreation Prompt (Template)

File: ${filename}
${error ? `Error: ${error}` : ''}

This is a template — connect Groq API key for real AI analysis.

### Audio Analysis
- **Content Type**: [Music, speech, sound effects]
- **Genre**: [If applicable]
- **Mood**: [Emotional quality]
- **Tempo**: [BPM or feel]

### Recreation Prompt
Create audio with:
**Type**: [Content type]
**Genre**: [Genre]
**Mood**: [Mood]
**Instruments**: [If music]
**Vocal Style**: [If applicable]
**Production**: [Quality level]`,
    confidence: 'low',
    note: '⚠️ Template mode — add GROQ_API_KEY to .env for real AI analysis (Whisper + LLM)',
  };
}

export default analyzeAudio;
