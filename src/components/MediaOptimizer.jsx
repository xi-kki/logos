// ═══════════════════════════════════════════════════════════════
// LOGOS — Media-Specific Optimizer
// Modality-aware prompt enhancement
// ═══════════════════════════════════════════════════════════════

export const MEDIA_RULES = {
  image: {
    midjourney: {
      structure: '[Subject], [Style], [Details], [Lighting], [Composition], [Technical] --ar [ratio] --v [version]',
      modifiers: ['--ar 16:9', '--ar 1:1', '--ar 9:16', '--v 6', '--style raw', '--q 2', '--s 750'],
      qualityTags: ['8k', 'highly detailed', 'masterpiece', 'sharp focus', 'professional photography'],
      lightingTerms: ['golden hour', 'dramatic shadows', 'soft diffused', 'rim lighting', 'volumetric', 'neon glow'],
      compositionTerms: ['rule of thirds', 'leading lines', 'centered', 'wide angle', 'close-up', 'bird\'s eye'],
      styleTerms: ['photorealistic', 'digital art', 'oil painting', 'watercolor', 'cinematic', 'anime', 'pixel art'],
    },
    flux: {
      structure: '[Detailed subject], [Scene], [Style/Mood], [Technical]',
      modifiers: ['photorealistic, 8k, sharp focus', 'cinematic lighting', 'highly detailed', 'professional photography'],
      styleTerms: ['cinematic', 'editorial', 'natural', 'dramatic', 'ethereal', 'gritty'],
    },
    dalle: {
      structure: '[Subject] in [style], [details], [lighting], [composition]',
      modifiers: ['highly detailed', 'trending on artstation', 'octane render', 'unreal engine 5'],
    },
    ideogram: {
      structure: '[Text if any] [Subject], [Style], [Details]',
      modifiers: ['typographic', 'graphic design', 'logo style', 'poster design'],
    },
  },
  video: {
    kling: {
      structure: '[Subject action], [Scene], [Camera movement], [Atmosphere]',
      cameraMoves: ['slow pan left', 'slow pan right', 'tilt up', 'tilt down', 'dolly in', 'dolly out', 'tracking shot', 'static'],
      motionTerms: ['slow motion', 'timelapse', 'smooth motion', 'dynamic movement'],
    },
    runway: {
      structure: '[Detailed scene with motion], [Visual style], [Camera behavior]',
      styleRefs: ['cinematic', 'documentary style', 'music video', 'film noir', 'vintage'],
    },
    veo: {
      structure: '[Scene description], [Subject action], [Environment], [Camera]',
      modifiers: ['professional cinematography', 'film grain', 'shallow depth of field'],
    },
    sora: {
      structure: '[Narrative scene], [Character action], [Environment details], [Visual style]',
      modifiers: ['shot on 35mm', 'anamorphic lens', 'practical lighting'],
    },
  },
  audio: {
    suno: {
      structure: '[Genre], [Mood], [Instruments], [Tempo], [Vocal style]',
      genres: ['indie folk', 'synthwave', 'jazz fusion', 'lo-fi hip hop', 'ambient', 'electronic', 'classical', 'rock', 'pop'],
      moodTerms: ['melancholic', 'uplifting', 'intense', 'dreamy', 'energetic', 'calm', 'dark', 'ethereal'],
      vocalStyles: ['soft female vocal', 'raspy male vocal', 'smooth baritone', 'ethereal choir', 'rap', 'spoken word', 'instrumental'],
    },
    elevenlabs: {
      structure: '[Voice characteristics], [Tone], [Pace], [Emotion], [Style]',
      tones: ['professional', 'casual', 'warm', 'authoritative', 'friendly', 'serious'],
      paces: ['normal', 'slow for emphasis', 'fast for energy', 'measured'],
      emotions: ['neutral', 'happy', 'serious', 'excited', 'calm', 'urgent', 'nostalgic'],
    },
  },
};

export function optimizeMediaPrompt(input, modality, tool = null) {
  if (!input || !MEDIA_RULES[modality]) {
    return { optimized: input, additions: [], tool };
  }

  const rules = MEDIA_RULES[modality];
  const toolRules = tool ? rules[tool] : Object.values(rules)[0];
  
  if (!toolRules) return { optimized: input, additions: [], tool };

  const additions = [];
  let optimized = input;

  // Add structure if missing
  if (!input.includes(',') && input.split(' ').length < 10) {
    optimized = `${input}, [detailed description]`;
    additions.push('Added structure placeholder');
  }

  // Add quality modifiers if missing
  if (toolRules.qualityTags) {
    const hasQuality = toolRules.qualityTags.some(tag => 
      input.toLowerCase().includes(tag.toLowerCase())
    );
    if (!hasQuality && toolRules.qualityTags.length > 0) {
      optimized = `${optimized}, ${toolRules.qualityTags[0]}`;
      additions.push(`Added quality tag: ${toolRules.qualityTags[0]}`);
    }
  }

  // Add lighting if missing (for images)
  if (modality === 'image' && toolRules.lightingTerms) {
    const hasLighting = toolRules.lightingTerms.some(term => 
      input.toLowerCase().includes(term.toLowerCase())
    );
    if (!hasLighting) {
      optimized = `${optimized}, ${toolRules.lightingTerms[0]}`;
      additions.push(`Added lighting: ${toolRules.lightingTerms[0]}`);
    }
  }

  // Add style if missing
  if (toolRules.styleTerms) {
    const hasStyle = toolRules.styleTerms.some(term => 
      input.toLowerCase().includes(term.toLowerCase())
    );
    if (!hasStyle) {
      optimized = `${optimized}, ${toolRules.styleTerms[0]}`;
      additions.push(`Added style: ${toolRules.styleTerms[0]}`);
    }
  }

  // Add camera movement for video
  if (modality === 'video' && toolRules.cameraMoves) {
    const hasCamera = toolRules.cameraMoves.some(move => 
      input.toLowerCase().includes(move.toLowerCase())
    );
    if (!hasCamera) {
      optimized = `${optimized}, ${toolRules.cameraMoves[0]}`;
      additions.push(`Added camera: ${toolRules.cameraMoves[0]}`);
    }
  }

  // Add mood for audio
  if (modality === 'audio' && toolRules.moodTerms) {
    const hasMood = toolRules.moodTerms.some(term => 
      input.toLowerCase().includes(term.toLowerCase())
    );
    if (!hasMood) {
      optimized = `${optimized}, ${toolRules.moodTerms[0]}`;
      additions.push(`Added mood: ${toolRules.moodTerms[0]}`);
    }
  }

  return { optimized, additions, tool };
}

export function getMediaStructure(modality, tool) {
  const rules = MEDIA_RULES[modality]?.[tool];
  return rules?.structure || '';
}

export function getMediaModifiers(modality, tool) {
  const rules = MEDIA_RULES[modality]?.[tool];
  return rules?.modifiers || [];
}
