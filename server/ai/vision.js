// ═══════════════════════════════════════════════════════════════
// LOGOS — Vision Analysis Module
// Image → Prompt reverse engineering via Groq Vision
// ═══════════════════════════════════════════════════════════════

import { analyzeWithVision, completeText, isConfigured, MODELS } from './groq.js';

// ── Image Analysis ───────────────────────────────────────────

export async function analyzeImage(imageBase64) {
  if (!isConfigured()) {
    return analyzeImageFallback();
  }

  const prompt = `You are an expert visual analyst and prompt engineer. Analyze this image and generate a detailed recreation prompt that could be used with an AI image generator (Midjourney, DALL-E, Flux, Stable Diffusion).

Provide your analysis in this exact format:

## Visual Analysis
- **Subject**: [Detailed description of the main subject]
- **Style**: [Artistic style — photorealistic, illustration, 3D render, oil painting, etc.]
- **Composition**: [How the image is framed — close-up, wide shot, centered, rule of thirds, etc.]
- **Lighting**: [Lighting conditions — natural, studio, dramatic, backlit, golden hour, etc.]
- **Color Palette**: [Dominant colors and overall color temperature]
- **Mood**: [Emotional quality — serene, energetic, mysterious, etc.]
- **Details**: [Notable textures, patterns, or small elements]
- **Background**: [What's behind the main subject]

## Recreation Prompt
[Write a single, comprehensive prompt that could recreate this image. Include all visual elements, style specifications, and technical parameters. Make it detailed enough for an AI image generator.]

## Suggested Parameters
- **Aspect Ratio**: [Match the original or suggest one]
- **Style Keywords**: [2-3 key style tags]
- **Quality Tags**: [e.g., 8k, highly detailed, professional]`;

  try {
    const result = await analyzeWithVision(imageBase64, prompt, {
      model: MODELS.VISION,
      max_tokens: 2048,
    });

    return {
      prompt: result.content,
      confidence: 'high',
      model: result.model,
      note: 'Analysis powered by Groq Vision (Llama 3.2 Vision)',
    };
  } catch (error) {
    console.error('[Image Analysis Error]', error.message);
    return analyzeImageFallback();
  }
}

// ── Website Analysis (URL) ───────────────────────────────────

export async function analyzeWebsite(url) {
  if (!isConfigured()) {
    return analyzeWebsiteFallback(url);
  }

  const prompt = `You are a web design expert. Analyze this website URL and generate a detailed recreation prompt.

Website URL: ${url}

Provide your analysis in this exact format:

## Design System Analysis
- **Layout Pattern**: [Hero + sections, dashboard, card grid, etc.]
- **Navigation**: [Top bar, sidebar, hamburger menu, etc.]
- **Typography**: [Font families, sizes, weights used]
- **Color Scheme**: [Primary, secondary, accent colors with hex values if possible]
- **Spacing**: [Padding, margins, grid system]
- **Components**: [Cards, buttons, forms, tables, etc.]
- **Visual Style**: [Minimal, bold, elegant, playful, professional, dark]

## Recreation Prompt
Build a website with the following specifications:

**Layout**: [Detailed layout description]
**Design System**:
- Primary Color: [Hex value]
- Secondary Color: [Hex value]
- Accent Color: [Hex value]
- Font Primary: [Font name]
- Border Radius: [Small/Medium/Large]
- Spacing Unit: [4px/8px/16px grid]

**Components to Include**:
1. [Component 1 with description]
2. [Component 2 with description]
3. [Component 3 with description]

**Responsive Behavior**: [How it adapts to mobile]
**Interactions**: [Hover states, animations, transitions]

## Tech Stack Recommendation
[Recommended technologies for rebuilding]`;

  try {
    const result = await completeText(prompt, {
      model: MODELS.TEXT,
      max_tokens: 2048,
    });

    return {
      prompt: result.content,
      confidence: 'medium',
      model: result.model,
      note: 'For full website analysis, the page content would need to be scraped first',
    };
  } catch (error) {
    console.error('[Website Analysis Error]', error.message);
    return analyzeWebsiteFallback(url);
  }
}

// ── Code Analysis ────────────────────────────────────────────

export async function analyzeCode(code) {
  if (!isConfigured()) {
    return analyzeCodeFallback(code);
  }

  const prompt = `You are a senior software engineer and technical writer. Analyze this code and generate a documentation/explanation prompt.

Code:
\`\`\`
${code}
\`\`\`

Provide your analysis in this exact format:

## Code Analysis
- **Language**: [Detected programming language]
- **Framework**: [Any frameworks or libraries used]
- **Purpose**: [What this code does]
- **Pattern**: [Architecture pattern — MVC, hooks, components, etc.]
- **Complexity**: [Simple/Medium/Complex]

## Key Components
1. [Function/Component 1] — [What it does]
2. [Function/Component 2] — [What it does]
3. [Function/Component 3] — [What it does]

## Recreation Prompt
Create comprehensive documentation for this code:

**Summary**: [One-line description]
**Architecture**: [Pattern and structure]
**API Reference**:
- [Function Name]
  - Parameters: [List with types]
  - Returns: [Return type and description]
  - Example: [Usage example]

**Dependencies**: [Required packages]
**Edge Cases**: [Error handling covered]
**Improvements**: [Suggestions for better code]`;

  try {
    const result = await completeText(prompt, {
      model: MODELS.CODE,
      max_tokens: 2048,
    });

    return {
      prompt: result.content,
      confidence: 'high',
      model: result.model,
      note: 'Code analysis powered by Groq',
    };
  } catch (error) {
    console.error('[Code Analysis Error]', error.message);
    return analyzeCodeFallback(code);
  }
}

// ── Fallback Functions (when API not configured) ─────────────

function analyzeImageFallback() {
  return {
    prompt: `## Image Recreation Prompt (Template)

This is a template — connect Groq API key for real AI analysis.

### Visual Analysis
- **Subject**: [Analyze the main subject]
- **Style**: [Identify artistic style]
- **Composition**: [Describe framing]
- **Lighting**: [Describe lighting]
- **Color Palette**: [Note dominant colors]
- **Mood**: [Emotional quality]

### Recreation Prompt
Create an image with the following specifications:

**Subject**: [Detailed description]
**Style**: [Artistic style]
**Technical Parameters**:
- Aspect ratio: [Match original]
- Quality: 8k, highly detailed
- Lighting: [Description]
- Color grading: [Description]

**Mood**: [Emotional quality]
**Composition**: [Framing and focus]`,
    confidence: 'low',
    note: '⚠️ Template mode — add GROQ_API_KEY to .env for real AI analysis',
  };
}

function analyzeWebsiteFallback(url) {
  return {
    prompt: `## Website Recreation Prompt (Template)

URL: ${url || '[URL]'}

This is a template — connect Groq API key for real AI analysis.

### Design System Analysis
- **Layout Pattern**: [Hero + sections, dashboard, etc.]
- **Navigation**: [Top bar, sidebar, etc.]
- **Typography**: [Font families]
- **Color Scheme**: [Primary, secondary, accent]
- **Components**: [Cards, buttons, forms]

### Recreation Prompt
Build a website with:
**Layout**: [Description]
**Colors**: [Primary, secondary, accent]
**Fonts**: [Font names]
**Components**: [List]
**Responsive**: [Mobile behavior]`,
    confidence: 'low',
    note: '⚠️ Template mode — add GROQ_API_KEY to .env for real AI analysis',
  };
}

function analyzeCodeFallback(code) {
  return {
    prompt: `## Code Documentation Prompt (Template)

This is a template — connect Groq API key for real AI analysis.

### Code Analysis
- **Language**: [Detected]
- **Purpose**: [What it does]
- **Pattern**: [Architecture]

### Documentation Prompt
Create documentation for this code:
**Summary**: [Description]
**Architecture**: [Pattern]
**API Reference**: [Functions]
**Dependencies**: [Packages]
**Edge Cases**: [Error handling]`,
    confidence: 'low',
    note: '⚠️ Template mode — add GROQ_API_KEY to .env for real AI analysis',
  };
}
