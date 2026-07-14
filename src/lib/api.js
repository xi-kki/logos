// ═══════════════════════════════════════════════════════════════
// LOGOS — API Layer
// Integration hooks for external agents
// ═══════════════════════════════════════════════════════════════

import { optimizePrompt } from './optimizer';
import { optimizeMediaPrompt, MEDIA_RULES } from '../components/MediaOptimizer';
import { matchPatterns, findRelevantSources, getCitation } from '../data/context-sources';

// ── Internal API (runs in-browser) ──

export const API = {
  /**
   * Optimize a prompt (main entry point)
   * @param {string} input - Raw prompt
   * @param {string} modality - 'text' | 'code' | 'image' | 'video' | 'audio'
   * @param {string} tool - Optional specific tool (e.g., 'midjourney', 'suno')
   * @returns {Object} Optimization result
   */
  optimize(input, modality = 'text', tool = null) {
    // Get base optimization
    const base = optimizePrompt(input, modality);

    // Add media-specific optimization
    let mediaResult = null;
    if (modality !== 'text' && modality !== 'code') {
      mediaResult = optimizeMediaPrompt(input, modality, tool);
    }

    // Get context sources
    const patterns = matchPatterns(input);
    const sources = findRelevantSources(patterns, null);

    // Build citations
    const citations = sources.slice(0, 3).map(s => getCitation(s));

    return {
      original: input,
      optimized: mediaResult ? `${base.optimized}\n\n${mediaResult.optimized}` : base.optimized,
      sections: base.sections,
      score: base.score,
      diff: base.diff,
      modality,
      tool,
      mediaAdditions: mediaResult?.additions || [],
      context: {
        patterns,
        sources: sources.slice(0, 5),
        citations,
      },
      exportedAt: new Date().toISOString(),
    };
  },

  /**
   * Batch optimize multiple prompts
   * @param {Array} prompts - [{input, modality, tool?}]
   * @returns {Array} Results
   */
  batchOptimize(prompts) {
    return prompts.map(p => this.optimize(p.input, p.modality, p.tool));
  },

  /**
   * Get available modalities
   * @returns {Object} Modalities with their tools
   */
  getModalities() {
    return {
      text: { tools: [], label: 'Text / Agent' },
      code: { tools: [], label: 'Code' },
      image: { tools: Object.keys(MEDIA_RULES.image || {}), label: 'Image' },
      video: { tools: Object.keys(MEDIA_RULES.video || {}), label: 'Video' },
      audio: { tools: Object.keys(MEDIA_RULES.audio || {}), label: 'Audio' },
    };
  },

  /**
   * Get context sources for a prompt
   * @param {string} input - Prompt to analyze
   * @returns {Object} Matching patterns and sources
   */
  getContext(input) {
    const patterns = matchPatterns(input);
    const sources = findRelevantSources(patterns, null);
    return { patterns, sources };
  },

  /**
   * Export in specific format
   * @param {Object} result - Optimization result
   * @param {string} format - 'json' | 'markdown' | 'copy'
   * @returns {string} Formatted output
   */
  export(result, format = 'json') {
    if (format === 'json') {
      return JSON.stringify(result, null, 2);
    }
    if (format === 'markdown') {
      const lines = [
        '# Optimized Prompt',
        '',
        `**Modality:** ${result.modality}`,
        `**Score:** ${result.score.score}/100`,
        '',
        '## Original',
        '```',
        result.original,
        '```',
        '',
        '## Optimized',
        '```',
        result.optimized,
        '```',
      ];

      if (result.context?.citations?.length > 0) {
        lines.push('', '## Sources');
        result.context.citations.forEach(c => lines.push(`- ${c}`));
      }

      lines.push('', '---', `*Exported from Logos on ${new Date().toLocaleDateString()}*`);
      return lines.join('\n');
    }
    return result.optimized;
  },
};

// ── External Integration Hook ──

/**
 * Use this to call Logos from external agents
 * 
 * Example (from another app):
 *   import { optimize } from 'logos/src/lib/api';
 *   const result = optimize("write a function that...", "code");
 *   console.log(result.optimized);
 */
export function optimize(input, modality, tool) {
  return API.optimize(input, modality, tool);
}

export function batchOptimize(prompts) {
  return API.batchOptimize(prompts);
}

export function getModalities() {
  return API.getModalities();
}

export function getContext(input) {
  return API.getContext(input);
}

export function exportResult(result, format) {
  return API.export(result, format);
}
