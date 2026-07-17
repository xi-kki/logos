// ═══════════════════════════════════════════════════════════════
// LOGOS — Video Analysis Module
// Video → Prompt reverse engineering via frame extraction + Vision
// ═══════════════════════════════════════════════════════════════

import { analyzeWithVision, completeText, isConfigured, MODELS } from './groq.js';

// ── Video Analysis (from extracted frames) ───────────────────

export async function analyzeVideo(frames, metadata = {}) {
  // frames: array of base64 images extracted from video
  // metadata: { duration, fps, resolution, filename }
  
  if (!isConfigured()) {
    return analyzeVideoFallback(metadata);
  }

  if (!frames || frames.length === 0) {
    return {
      prompt: '',
      confidence: 'low',
      note: 'No frames provided. Use the browser-based frame extractor.',
    };
  }

  try {
    // Analyze first frame for initial context
    console.log(`[Video] Analyzing ${frames.length} frames...`);
    
    const firstFrameAnalysis = await analyzeFrame(frames[0], 'first');
    
    // If multiple frames, analyze middle and last for motion detection
    let motionAnalysis = '';
    if (frames.length >= 3) {
      const middleFrame = frames[Math.floor(frames.length / 2)];
      const lastFrame = frames[frames.length - 1];
      
      const middleAnalysis = await analyzeFrame(middleFrame, 'middle');
      const lastAnalysis = await analyzeFrame(lastFrame, 'last');
      
      motionAnalysis = `\n\n## Motion Analysis
- **Opening Frame**: ${firstFrameAnalysis.content.substring(0, 200)}...
- **Middle Frame**: ${middleAnalysis.content.substring(0, 200)}...
- **Final Frame**: ${lastAnalysis.content.substring(0, 200)}...`;
    }

    // Generate comprehensive video recreation prompt
    const videoPrompt = generateVideoRecreationPrompt(
      firstFrameAnalysis.content,
      metadata,
      motionAnalysis
    );

    const finalAnalysis = await completeText(videoPrompt, {
      model: MODELS.TEXT,
      max_tokens: 2048,
    });

    return {
      prompt: finalAnalysis.content,
      confidence: 'high',
      model: `${MODELS.VISION} + ${MODELS.TEXT}`,
      note: `Video analyzed from ${frames.length} extracted frames`,
      framesAnalyzed: frames.length,
      metadata,
    };
  } catch (error) {
    console.error('[Video Analysis Error]', error.message);
    return analyzeVideoFallback(metadata, error.message);
  }
}

// ── Analyze Single Frame ─────────────────────────────────────

async function analyzeFrame(frameBase64, position = 'unknown') {
  const prompt = `Analyze this video frame (position: ${position}) and describe:
1. The main subject and action
2. The visual style and cinematography
3. Lighting and color grading
4. Camera angle and movement hints
5. Any text or UI elements visible

Be concise but detailed.`;

  try {
    return await analyzeWithVision(frameBase64, prompt, {
      model: MODELS.VISION,
      max_tokens: 1024,
    });
  } catch (error) {
    console.error(`[Frame Analysis Error] ${position}:`, error.message);
    return { content: `Frame analysis failed: ${error.message}` };
  }
}

// ── Generate Video Recreation Prompt ─────────────────────────

function generateVideoRecreationPrompt(frameAnalysis, metadata, motionAnalysis = '') {
  const { duration, fps, resolution, filename } = metadata;
  
  return `You are a cinematographer and video director. Based on the frame analysis below, generate a detailed video recreation prompt.

Frame Analysis:
${frameAnalysis}
${motionAnalysis}

Video Metadata:
- Duration: ${duration || 'Unknown'}
- FPS: ${fps || 'Unknown'}
- Resolution: ${resolution || 'Unknown'}
- Filename: ${filename || 'Unknown'}

Generate a comprehensive video recreation prompt in this format:

## Video Analysis
- **Subject**: [What's happening in the video]
- **Style**: [Cinematic style — documentary, commercial, music video, etc.]
- **Camera Work**: [Movement, angles, transitions]
- **Lighting**: [Setup and mood]
- **Color Grade**: [Color treatment]
- **Pacing**: [Fast, slow, rhythmic]
- **Audio Hints**: [If any audio elements are visible]

## Recreation Prompt
Create a video with the following specifications:

**Subject/Action**: [Detailed description of what happens]
**Duration**: [Target length]
**Frame Rate**: [24fps cinematic, 30fps standard, 60fps smooth]

**Camera**:
- Opening shot: [Description]
- Movement: [Pan, tilt, zoom, dolly, tracking, static]
- Transitions: [Cuts, fades, wipes]

**Visual Style**:
- Color grading: [Description]
- Lighting: [Setup]
- Aspect ratio: [16:9, 1:1, 9:16, etc.]

**Atmosphere**:
- Mood: [Emotional quality]
- Sound design: [If applicable]

**Technical Specs**:
- Resolution: [4K, 1080p, etc.]
- Quality: [Cinematic, broadcast, social media]`;
}

// ── Fallback ─────────────────────────────────────────────────

function analyzeVideoFallback(metadata, error = null) {
  return {
    prompt: `## Video Recreation Prompt (Template)

${metadata?.filename ? `File: ${metadata.filename}` : ''}
${error ? `Error: ${error}` : ''}

This is a template — connect Groq API key for real AI analysis.

### Video Analysis
- **Subject**: [What's happening]
- **Style**: [Cinematic style]
- **Camera**: [Movement and angles]
- **Lighting**: [Setup]
- **Color Grade**: [Treatment]
- **Pacing**: [Speed]

### Recreation Prompt
Create a video with:
**Subject**: [Description]
**Duration**: [Length]
**Camera**: [Movement]
**Style**: [Visual style]
**Lighting**: [Setup]
**Color**: [Grade]
**Mood**: [Atmosphere]
**Resolution**: [Quality]

### Technical Specs
- Frame Rate: [24/30/60 fps]
- Aspect Ratio: [16:9, 1:1, 9:16]
- Quality: [Cinematic, social media]`,
    confidence: 'low',
    note: '⚠️ Template mode — add GROQ_API_KEY to .env for real AI analysis',
  };
}

export default analyzeVideo;
