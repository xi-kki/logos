// ═══════════════════════════════════════════════════════════════
// LOGOS — Context Engine Sources
// Curated GitHub repositories for prompt patterns
// ═══════════════════════════════════════════════════════════════

export const CONTEXT_SOURCES = [
  // ── Core Prompt Collections ──
  {
    id: 'f-prompts-chat',
    name: 'f/prompts.chat',
    url: 'https://github.com/f/awesome-chatgpt-prompts',
    category: 'core',
    stars: '100k+',
    description: 'Massive, actively maintained community prompt collection',
    license: 'CC0-1.0',
    patterns: ['role-playing', 'system-prompts', 'task-specific'],
    lastValidated: null,
  },
  {
    id: 'dair-ai-guide',
    name: 'dair-ai/Prompt-Engineering-Guide',
    url: 'https://github.com/dair-ai/Prompt-Engineering-Guide',
    category: 'core',
    stars: '50k+',
    description: 'Guides, papers, and resources covering prompt engineering and agent techniques',
    license: 'MIT',
    patterns: ['techniques', 'research', 'best-practices'],
    lastValidated: null,
  },
  {
    id: 'promptslab-awesome',
    name: 'promptslab/Awesome-Prompt-Engineering',
    url: 'https://github.com/promptslab/Awesome-Prompt-Engineering',
    category: 'core',
    stars: '20k+',
    description: 'Hand-curated resources spanning GPT, ChatGPT, and PaLM-era prompt engineering',
    license: 'MIT',
    patterns: ['curated-list', 'techniques', 'tools'],
    lastValidated: null,
  },
  {
    id: 'natnew-awesome',
    name: 'natnew/Awesome-Prompt-Engineering',
    url: 'https://github.com/natnew/Awesome-Prompt-Engineering',
    category: 'core',
    stars: '10k+',
    description: 'Resources spanning fundamental prompting through advanced context engineering',
    license: 'MIT',
    patterns: ['fundamentals', 'advanced', 'production'],
    lastValidated: null,
  },
  {
    id: 'snwfdhmp-awesome',
    name: 'snwfdhmp/awesome-gpt-prompt-engineering',
    url: 'https://github.com/snwfdhmp/awesome-gpt-prompt-engineering',
    category: 'core',
    stars: '8k+',
    description: 'Curated list of resources and tools for LLM prompt engineering',
    license: 'MIT',
    patterns: ['resources', 'tools', 'llm'],
    lastValidated: null,
  },
  {
    id: 'ai-boost-prompts',
    name: 'ai-boost/awesome-prompts',
    url: 'https://github.com/ai-boost/awesome-prompts',
    category: 'core',
    stars: '5k+',
    description: 'Top-rated GPT Store prompts plus prompt-attack/prompt-protect',
    license: 'MIT',
    patterns: ['gpt-store', 'security', 'advanced'],
    lastValidated: null,
  },

  // ── System Prompts & Coding Agent Patterns ──
  {
    id: 'x1xhlol-system-prompts',
    name: 'x1xhlol/system-prompts-and-models-of-ai-tools',
    url: 'https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools',
    category: 'system-prompts',
    stars: '140k+',
    description: 'Published system prompts from Cursor, Claude, Devin, and others',
    license: 'MIT',
    patterns: ['system-prompts', 'coding-agents', 'real-world'],
    lastValidated: null,
  },
  {
    id: 'onamfc-agent-library',
    name: 'onamfc/agent-prompt-library',
    url: 'https://github.com/onamfc/agent-prompt-library',
    category: 'system-prompts',
    stars: '2k+',
    description: 'Reusable prompts for development and agent workflows',
    license: 'MIT',
    patterns: ['agent-workflows', 'development', 'reusable'],
    lastValidated: null,
  },

  // ── Media-Specific Prompt Libraries ──
  {
    id: 'kekzl-promptmill',
    name: 'kekzl/PromptMill',
    url: 'https://github.com/kekzl/PromptMill',
    category: 'media',
    stars: '3k+',
    description: 'Specialized prompt roles for image, video, audio, and 3D generation',
    license: 'MIT',
    patterns: ['image', 'video', 'audio', '3d'],
    lastValidated: null,
  },
  {
    id: 'mlnjsh-prompts-everything',
    name: 'mlnjsh/prompts-for-everything',
    url: 'https://github.com/mlnjsh/prompts-for-everything',
    category: 'media',
    stars: '1k+',
    description: 'Prompts spanning Manim, video, image, coding, and music generation',
    license: 'MIT',
    patterns: ['multi-modal', 'creative', 'generation'],
    lastValidated: null,
  },

  // ── Orchestration & Chaining ──
  {
    id: 'langchain-hub',
    name: 'hwchase17/langchain-hub',
    url: 'https://github.com/hwchase17/langchain-hub',
    category: 'orchestration',
    stars: '15k+',
    description: 'Battle-tested prompts organized by use case for chain/agent orchestration',
    license: 'MIT',
    patterns: ['summarization', 'qa', 'agents', 'sql'],
    lastValidated: null,
  },

  // ── Additional / Supplementary ──
  {
    id: 'promptforge',
    name: 'mbagalman/PromptForge',
    url: 'https://github.com/mbagalman/PromptForge',
    category: 'supplementary',
    stars: '500+',
    description: 'Supplementary prompt template collection',
    license: 'MIT',
    patterns: ['templates', 'supplementary'],
    lastValidated: null,
  },
  {
    id: 'consciousml-hub',
    name: 'ConsciousML/prompt-engineering-hub',
    url: 'https://github.com/ConsciousML/prompt-engineering-hub',
    category: 'supplementary',
    stars: '1k+',
    description: 'Supplementary hub of prompt engineering resources',
    license: 'MIT',
    patterns: ['resources', 'hub'],
    lastValidated: null,
  },
];

export const CONTEXT_CATEGORIES = [
  { id: 'core', label: 'Core Collections', description: 'Primary prompt engineering repositories' },
  { id: 'system-prompts', label: 'System Prompts', description: 'Real-world system prompts and agent patterns' },
  { id: 'media', label: 'Media Generation', description: 'Image, video, audio prompt libraries' },
  { id: 'orchestration', label: 'Orchestration', description: 'Chain and agent workflow prompts' },
  { id: 'supplementary', label: 'Supplementary', description: 'Additional resources and templates' },
];

// ── Pattern Matching Rules ──

export const PATTERN_KEYWORDS = {
  'role-playing': ['you are', 'act as', 'pretend to be', 'role', 'persona'],
  'chain-of-thought': ['think step by step', 'reasoning', 'chain of thought', 'cot'],
  'few-shot': ['example', 'for instance', 'such as', 'e.g.', 'like this'],
  'structured-output': ['json', 'format', 'structure', 'template', 'schema'],
  'constraints': ['do not', 'never', 'always', 'must', 'requirement'],
  'output-format': ['output', 'response', 'return', 'format as'],
  'persona': ['expert', 'specialist', 'professional', 'experienced'],
  'research': ['analyze', 'research', 'investigate', 'review', 'study'],
  'code': ['function', 'class', 'api', 'implement', 'refactor'],
  'creative': ['write', 'create', 'design', 'generate', 'imagine'],
};

export function matchPatterns(input) {
  const lower = input.toLowerCase();
  const matches = [];

  for (const [pattern, keywords] of Object.entries(PATTERN_KEYWORDS)) {
    const matched = keywords.some(kw => lower.includes(kw));
    if (matched) {
      matches.push(pattern);
    }
  }

  return matches;
}

export function findRelevantSources(patterns, category = null) {
  let sources = CONTEXT_SOURCES;
  
  if (category) {
    sources = sources.filter(s => s.category === category);
  }

  return sources.filter(source => 
    source.patterns.some(p => patterns.includes(p))
  ).map(source => ({
    ...source,
    relevance: source.patterns.filter(p => patterns.includes(p)).length,
  })).sort((a, b) => b.relevance - a.relevance);
}

export function getCitation(source) {
  return `[${source.name}](${source.url}) — ${source.description}`;
}
