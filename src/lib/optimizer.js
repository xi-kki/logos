// ═══════════════════════════════════════════════════════════════
// LOGOS — Prompt Optimizer Engine
// Intent analysis → Structure injection → Quality scoring
// ═══════════════════════════════════════════════════════════════

import { ALL_TEMPLATES } from '../data/prompts';

// ── Intent Analysis ──────────────────────────────────────────

function analyzeIntent(input) {
  const lower = input.toLowerCase();
  const signals = [];

  // Check for modality signals
  if (/\b(draw|image|picture|photo|illustration|midjourney|flux|dall-e)\b/i.test(lower)) {
    signals.push({ type: 'modality', value: 'image', confidence: 0.8 });
  }
  if (/\b(video|animation|kling|runway|sora|clip)\b/i.test(lower)) {
    signals.push({ type: 'modality', value: 'video', confidence: 0.8 });
  }
  if (/\b(music|song|audio|voice|elevenlabs|suno|tts)\b/i.test(lower)) {
    signals.push({ type: 'modality', value: 'audio', confidence: 0.8 });
  }
  if (/\b(code|function|class|debug|refactor|review|api)\b/i.test(lower)) {
    signals.push({ type: 'modality', value: 'code', confidence: 0.7 });
  }

  // Check for persona signals
  if (/\b(research|analyze|study|investigate|review)\b/i.test(lower)) {
    signals.push({ type: 'persona', value: 'research', confidence: 0.6 });
  }
  if (/\b(design|creative|art|visual|aesthetic)\b/i.test(lower)) {
    signals.push({ type: 'persona', value: 'creative', confidence: 0.6 });
  }
  if (/\b(write|document|explain|teach|guide)\b/i.test(lower)) {
    signals.push({ type: 'persona', value: 'technical-writer', confidence: 0.6 });
  }
  if (/\b(product|strategy|roadmap|prioritize|plan)\b/i.test(lower)) {
    signals.push({ type: 'persona', value: 'product-strategist', confidence: 0.6 });
  }

  // Check for personality signals
  if (/\b(concise|brief|short|quick)\b/i.test(lower)) {
    signals.push({ type: 'personality', value: 'concise', confidence: 0.7 });
  }
  if (/\b(friendly|warm|casual|approachable)\b/i.test(lower)) {
    signals.push({ type: 'personality', value: 'friendly', confidence: 0.7 });
  }
  if (/\b(formal|professional|serious|authoritative)\b/i.test(lower)) {
    signals.push({ type: 'personality', value: 'analytical', confidence: 0.6 });
  }

  // Check for structure signals
  if (input.length < 20) {
    signals.push({ type: 'needsStructure', value: true, confidence: 0.9 });
  }
  if (!input.includes('\n') || input.split('\n').length < 3) {
    signals.push({ type: 'needsStructure', value: true, confidence: 0.5 });
  }

  return signals;
}

// ── Structure Injection ──────────────────────────────────────

function injectStructure(input, signals, modality) {
  const sections = [];
  const modalitySignal = signals.find(s => s.type === 'modality');
  const effectiveModality = modalitySignal?.value || modality;

  // 1. Role/Persona
  const personaSignal = signals.find(s => s.type === 'persona');
  if (personaSignal) {
    const personaTemplate = ALL_TEMPLATES.find(t =>
      t.category === 'personas' && t.id.includes(personaSignal.value)
    );
    if (personaTemplate) {
      sections.push({
        type: 'role',
        label: 'Role',
        content: personaTemplate.template.split('\n').slice(0, 2).join('\n'),
        source: personaTemplate.name,
      });
    }
  }

  // 2. Core Instruction
  sections.push({
    type: 'instruction',
    label: 'Core Instruction',
    content: input,
  });

  // 3. Modality-specific additions
  if (effectiveModality === 'code') {
    sections.push({
      type: 'constraints',
      label: 'Code Constraints',
      content: `## Requirements
- Follow language best practices
- Include error handling
- Add comments for complex logic
- Consider edge cases
- Write testable code`,
    });
  } else if (effectiveModality === 'image') {
    sections.push({
      type: 'format',
      label: 'Image Format',
      content: `## Visual Specifications
- Aspect ratio: 16:9 (landscape) or 1:1 (square)
- Style: [specify artistic style]
- Lighting: [describe lighting conditions]
- Composition: [describe framing and focus]
- Quality: 8k, highly detailed`,
    });
  } else if (effectiveModality === 'video') {
    sections.push({
      type: 'format',
      label: 'Video Format',
      content: `## Motion Specifications
- Subject action: [describe movement]
- Camera movement: [pan/tilt/zoom/static]
- Duration: [specify length]
- Atmosphere: [mood and environment]`,
    });
  } else if (effectiveModality === 'audio') {
    sections.push({
      type: 'format',
      label: 'Audio Format',
      content: `## Sound Specifications
- Genre: [musical style]
- Mood: [emotional quality]
- Instruments: [key instruments]
- Tempo: [speed/feel]
- Vocal style: [if applicable]`,
    });
  }

  // 4. Output Format
  sections.push({
    type: 'output',
    label: 'Output Format',
    content: `## Expected Output
- Clear, structured response
- Follow the specified format above
- Include examples where helpful
- Flag any assumptions made`,
  });

  // 5. Personality modifier
  const personalitySignal = signals.find(s => s.type === 'personality');
  if (personalitySignal) {
    sections.push({
      type: 'personality',
      label: 'Communication Style',
      content: `## Tone
${personalitySignal.value === 'concise' ? 'Be concise. Minimum words, maximum impact. No filler.' :
  personalitySignal.value === 'friendly' ? 'Be warm and approachable. Encouraging tone. Use examples.' :
  'Be analytical and objective. Lead with data. Structure arguments logically.'}`,
    });
  }

  return sections;
}

// ── Quality Scoring ──────────────────────────────────────────

function scoreQuality(original, optimized, sections) {
  let score = 0;
  const rationale = [];

  // Length improvement
  const lengthRatio = optimized.length / Math.max(original.length, 1);
  if (lengthRatio > 1.5 && lengthRatio < 5) {
    score += 20;
    rationale.push('Good expansion — adds detail without bloat');
  } else if (lengthRatio >= 5) {
    score += 10;
    rationale.push('Significant expansion — review for unnecessary content');
  }

  // Structure detection
  const hasHeaders = (optimized.match(/^##? /gm) || []).length;
  if (hasHeaders >= 2) {
    score += 25;
    rationale.push(`${hasHeaders} section headers for scannability`);
  }

  // Role/persona
  if (sections.some(s => s.type === 'role')) {
    score += 20;
    rationale.push('Role definition for consistent behavior');
  }

  // Output format
  if (sections.some(s => s.type === 'output')) {
    score += 15;
    rationale.push('Clear output format specified');
  }

  // Modality-specific
  if (sections.some(s => s.type === 'format')) {
    score += 15;
    rationale.push('Modality-specific structure added');
  }

  // Confidence level
  let confidence;
  if (score >= 70) confidence = 'high';
  else if (score >= 40) confidence = 'medium';
  else confidence = 'low';

  return {
    score: Math.min(score, 100),
    confidence,
    rationale,
    improvements: sections.length,
  };
}

// ── Main Optimizer ───────────────────────────────────────────

export function optimizePrompt(input, modality = 'text') {
  if (!input || input.trim().length === 0) {
    return {
      optimized: '',
      sections: [],
      score: { score: 0, confidence: 'low', rationale: [], improvements: 0 },
      diff: '',
    };
  }

  // 1. Analyze intent
  const signals = analyzeIntent(input);

  // 2. Inject structure
  const sections = injectStructure(input, signals, modality);

  // 3. Build optimized prompt
  const optimized = sections
    .map(s => s.content)
    .join('\n\n');

  // 4. Score quality
  const score = scoreQuality(input, optimized, sections);

  // 5. Generate diff (simple line-by-line)
  const originalLines = input.split('\n');
  const optimizedLines = optimized.split('\n');
  const diff = generateDiff(originalLines, optimizedLines);

  return {
    optimized,
    sections,
    score,
    diff,
    signals,
  };
}

// ── Simple Diff Generator ────────────────────────────────────

function generateDiff(original, optimized) {
  const lines = [];
  const maxLen = Math.max(original.length, optimized.length);

  for (let i = 0; i < maxLen; i++) {
    const orig = original[i] || '';
    const optim = optimized[i] || '';

    if (orig === optim) {
      lines.push({ type: 'same', content: orig });
    } else if (orig && !optimized.includes(orig)) {
      lines.push({ type: 'removed', content: orig });
    } else if (optim && !original.includes(optim)) {
      lines.push({ type: 'added', content: optim });
    } else {
      if (orig) lines.push({ type: 'removed', content: orig });
      if (optim) lines.push({ type: 'added', content: optim });
    }
  }

  return lines;
}

// ── Export Helpers ────────────────────────────────────────────

export function exportAsJSON(prompt, optimized, metadata = {}) {
  return JSON.stringify({
    original: prompt,
    optimized,
    metadata: {
      ...metadata,
      exportedAt: new Date().toISOString(),
      tool: 'Logos',
    },
  }, null, 2);
}

export function exportAsMarkdown(prompt, optimized, metadata = {}) {
  const sections = [];
  sections.push('# Optimized Prompt');
  sections.push('');
  if (metadata.modality) sections.push(`**Modality:** ${metadata.modality}`);
  if (metadata.score) sections.push(`**Quality Score:** ${metadata.score}/100`);
  sections.push('');
  sections.push('## Original');
  sections.push('```');
  sections.push(prompt);
  sections.push('```');
  sections.push('');
  sections.push('## Optimized');
  sections.push('```');
  sections.push(optimized);
  sections.push('```');
  sections.push('');
  sections.push('---');
  sections.push(`*Exported from Logos on ${new Date().toLocaleDateString()}*`);
  return sections.join('\n');
}

export function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  // Fallback
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  return Promise.resolve();
}
