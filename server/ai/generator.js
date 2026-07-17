// ═══════════════════════════════════════════════════════════════
// LOGOS — Website Code Generator
// Uses Groq LLM to generate website code from prompts
// Enhanced with MotionSites patterns for production-quality output
// ═══════════════════════════════════════════════════════════════

import { groq, chatCompletion, MODELS, isConfigured } from './groq.js';

// Liquid Glass CSS pattern from MotionSites
const LIQUID_GLASS_CSS = `
/* Liquid Glass Effect */
.liquid-glass {
  background: rgba(255, 255, 255, 0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}
.liquid-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(180deg,
    rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%,
    rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%,
    rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
.liquid-glass-strong {
  background: rgba(255, 255, 255, 0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(50px);
  -webkit-backdrop-filter: blur(50px);
  border: none;
  box-shadow: 4px 4px 4px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.15);
  position: relative;
  overflow: hidden;
}
.liquid-glass-strong::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(180deg,
    rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 20%,
    rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%,
    rgba(255,255,255,0.2) 80%, rgba(255,255,255,0.5) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}`;

// Style presets based on MotionSites analysis
const STYLE_PRESETS = {
  minimal: {
    name: 'Minimal',
    description: 'Clean, lots of whitespace, monochrome',
    colors: {
      background: '0 0% 100%',
      foreground: '0 0% 9%',
      primary: '0 0% 9%',
      muted: '0 0% 96%',
      border: '0 0% 90%'
    },
    fonts: 'Inter (sans-serif)',
    keywords: 'minimalist, clean, whitespace, simple, elegant'
  },
  bold: {
    name: 'Bold',
    description: 'Strong colors, big typography, high contrast',
    colors: {
      background: '0 0% 0%',
      foreground: '0 0% 100%',
      primary: '262 83% 58%',
      muted: '0 0% 15%',
      border: '0 0% 20%'
    },
    fonts: 'Instrument Serif (headings) + Inter (body)',
    keywords: 'bold, dramatic, high-contrast, cinematic, dark'
  },
  elegant: {
    name: 'Elegant',
    description: 'Refined, sophisticated, subtle animations',
    colors: {
      background: '40 20% 98%',
      foreground: '0 0% 9%',
      primary: '0 0% 9%',
      muted: '40 10% 95%',
      border: '40 10% 90%'
    },
    fonts: 'Playfair Display (headings) + Inter (body)',
    keywords: 'elegant, sophisticated, refined, luxury, premium'
  },
  playful: {
    name: 'Playful',
    description: 'Fun, colorful, animated, friendly',
    colors: {
      background: '350 100% 98%',
      foreground: '350 10% 10%',
      primary: '340 82% 52%',
      muted: '350 10% 95%',
      border: '350 10% 90%'
    },
    fonts: 'Nunito (headings) + Inter (body)',
    keywords: 'playful, fun, colorful, friendly, rounded'
  },
  professional: {
    name: 'Professional',
    description: 'Corporate, trustworthy, clean',
    colors: {
      background: '210 20% 98%',
      foreground: '210 30% 10%',
      primary: '210 100% 40%',
      muted: '210 15% 95%',
      border: '210 15% 90%'
    },
    fonts: 'Inter (headings + body)',
    keywords: 'professional, corporate, trustworthy, clean, business'
  },
  dark: {
    name: 'Dark Mode',
    description: 'Dark background, neon accents, futuristic',
    colors: {
      background: '0 0% 3%',
      foreground: '0 0% 95%',
      primary: '262 83% 58%',
      muted: '0 0% 12%',
      border: '0 0% 18%'
    },
    fonts: 'Instrument Serif (headings) + Barlow (body)',
    keywords: 'dark, futuristic, neon, glassmorphism, premium'
  }
};

/**
 * Generate website code from a prompt
 * @param {string} prompt - User's website description
 * @param {string} framework - Target framework (html, react, nextjs)
 * @param {string} style - Design style preset
 * @returns {Object} Generated code with html, react, and notes
 */
async function generateWebsite(prompt, framework = 'html', style = 'dark') {
  const stylePreset = STYLE_PRESETS[style] || STYLE_PRESETS.dark;
  
  const systemPrompt = `You are an expert web developer creating production-ready website code from prompts.

CRITICAL RULES:
1. Generate COMPLETE, RUNNABLE code — no placeholders, no "add more here"
2. Use EXACT text content provided — every heading, paragraph, button label
3. Specify EVERY detail: exact colors (HSL/HEX), font sizes, spacing, animations
4. Include ALL CSS (Tailwind config, custom properties, utility classes)
5. Make it responsive with mobile-first approach
6. Use semantic HTML and accessibility best practices

DESIGN SYSTEM (use these exact values):
- Color palette: ${JSON.stringify(stylePreset.colors)}
- Fonts: ${stylePreset.fonts}
- Style keywords: ${stylePreset.keywords}

CSS VARIABLES (always include these in :root):
--background: ${stylePreset.colors.background};
--foreground: ${stylePreset.colors.foreground};
--primary: ${stylePreset.colors.primary};
--muted: ${stylePreset.colors.muted};
--border: ${stylePreset.colors.border};

LIQUID GLASS CSS (always include this):
${LIQUID_GLASS_CSS}

ANIMATION PATTERNS:
- Staggered fade-up: opacity 0→1, y: 20→0, 0.6s ease-out
- Scroll reveal: useScroll + useTransform, opacity 0.15→1
- Hover: scale 1.03, transition 0.2s

OUTPUT FORMAT:
Return a JSON object with:
- html: Complete HTML file with embedded CSS/JS (<!DOCTYPE html> to </html>)
- react: Complete React component (if applicable)
- notes: Design decisions and customization tips

Generate ONLY valid, runnable code.`;

  const userPrompt = `Generate a production-ready website based on this description:

"${prompt}"

Framework: ${framework}
Style: ${style} (${stylePreset.description})

IMPORTANT:
- Use EXACT text from the description — every word matters
- Specify EVERY color as HSL or HEX — no generic "primary color"
- Define ALL fonts with exact weights
- Include ALL sections mentioned
- Make it responsive with exact breakpoints
- Add smooth animations (Framer Motion or CSS)
- Include the liquid-glass CSS class for glassmorphism effects
- Use the color palette: ${JSON.stringify(stylePreset.colors)}

Generate the complete, runnable code as a JSON object with html, react, and notes fields.`;

  try {
    const response = await chatCompletion(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      {
        model: MODELS.TEXT,
        temperature: 0.7,
        max_tokens: 4000,
      }
    );
    
    const content = response.content;

    // Parse the JSON response
    let result;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      // If JSON parsing fails, wrap the response as HTML
      result = {
        html: content,
        react: null,
        notes: 'Generated code (format may need adjustment)',
      };
    }

    // Ensure we have the required fields
    return {
      html: result.html || content,
      react: result.react || null,
      notes: result.notes || 'Website generated based on your description.',
      model: MODELS.TEXT,
      style: stylePreset.name,
      framework: framework,
    };

  } catch (error) {
    console.error('Website generation error:', error);
    throw error;
  }
}

/**
 * Get available styles
 */
function getStyles() {
  return Object.entries(STYLE_PRESETS).map(([id, preset]) => ({
    id,
    name: preset.name,
    description: preset.description,
    colors: preset.colors,
  }));
}

export { generateWebsite, getStyles, STYLE_PRESETS, LIQUID_GLASS_CSS };
