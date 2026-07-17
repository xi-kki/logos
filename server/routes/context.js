// ═══════════════════════════════════════════════════════════════
// LOGOS — GitHub Context Engine
// Fetches patterns from top GitHub repositories
// ═══════════════════════════════════════════════════════════════

import { Router } from 'express';

const router = Router();

// ── Curated GitHub Repos for Prompt Engineering ────────────

const CONTEXT_SOURCES = [
  {
    id: 'anthropic-cookbook',
    name: 'Anthropic Cookbook',
    url: 'https://github.com/anthropics/anthropic-cookbook',
    description: 'Official prompt engineering patterns from Anthropic',
    tags: ['prompt-engineering', 'claude', 'best-practices'],
    patterns: [
      { name: 'Chain of Thought', description: 'Step-by-step reasoning prompts' },
      { name: 'Role Prompting', description: 'Assigning expertise roles' },
      { name: 'Structured Output', description: 'JSON/XML output formatting' },
    ],
  },
  {
    id: 'awesome-chatgpt-prompts',
    name: 'Awesome ChatGPT Prompts',
    url: 'https://github.com/f/awesome-chatgpt-prompts',
    description: 'Curated collection of ChatGPT prompt templates',
    tags: ['chatgpt', 'prompts', 'templates'],
    patterns: [
      { name: 'Persona Assignment', description: 'Act as [expert role]' },
      { name: 'Task Framing', description: 'Clear task boundaries' },
      { name: 'Output Specification', description: 'Expected format definition' },
    ],
  },
  {
    id: 'prompt-engineering-guide',
    name: 'Prompt Engineering Guide',
    url: 'https://github.com/dair-ai/Prompt-Engineering-Guide',
    description: 'Comprehensive guide to prompt engineering techniques',
    tags: ['education', 'techniques', 'research'],
    patterns: [
      { name: 'Few-Shot Learning', description: 'Example-based prompting' },
      { name: 'Zero-Shot CoT', description: 'Let\'s think step by step' },
      { name: 'Self-Consistency', description: 'Multiple reasoning paths' },
    ],
  },
  {
    id: 'langchain-prompts',
    name: 'LangChain Prompt Templates',
    url: 'https://github.com/langchain-ai/langchain',
    description: 'Production prompt templates from LangChain',
    tags: ['langchain', 'production', 'templates'],
    patterns: [
      { name: 'Dynamic Templates', description: 'Variable-based prompts' },
      { name: 'Output Parsers', description: 'Structured response parsing' },
      { name: 'Chain Composition', description: 'Multi-step prompt chains' },
    ],
  },
  {
    id: 'openai-cookbook',
    name: 'OpenAI Cookbook',
    url: 'https://github.com/openai/openai-cookbook',
    description: 'Official OpenAI prompt engineering examples',
    tags: ['openai', 'gpt', 'best-practices'],
    patterns: [
      { name: 'System Messages', description: 'System-level instructions' },
      { name: 'Temperature Control', description: 'Creativity vs consistency' },
      { name: 'Function Calling', description: 'Structured tool usage' },
    ],
  },
];

// ── GET /api/context/sources — List all sources ────────────

router.get('/sources', (req, res) => {
  const { tag, search } = req.query;
  
  let sources = [...CONTEXT_SOURCES];
  
  if (tag) {
    sources = sources.filter(s => s.tags.includes(tag));
  }
  
  if (search) {
    const lower = search.toLowerCase();
    sources = sources.filter(s => 
      s.name.toLowerCase().includes(lower) ||
      s.description.toLowerCase().includes(lower) ||
      s.tags.some(t => t.includes(lower))
    );
  }
  
  res.json({
    sources,
    total: sources.length,
    allTags: [...new Set(CONTEXT_SOURCES.flatMap(s => s.tags))],
  });
});

// ── GET /api/context/sources/:id — Get single source ───────

router.get('/sources/:id', (req, res) => {
  const source = CONTEXT_SOURCES.find(s => s.id === req.params.id);
  
  if (!source) {
    return res.status(404).json({ error: 'Source not found' });
  }
  
  res.json(source);
});

// ── GET /api/context/patterns — Get all patterns ───────────

router.get('/patterns', (req, res) => {
  const { category } = req.query;
  
  let patterns = CONTEXT_SOURCES.flatMap(s => 
    s.patterns.map(p => ({
      ...p,
      source: s.name,
      sourceId: s.id,
    }))
  );
  
  if (category) {
    patterns = patterns.filter(p => 
      p.name.toLowerCase().includes(category.toLowerCase())
    );
  }
  
  res.json({
    patterns,
    total: patterns.length,
  });
});

// ── GET /api/context/recommend — Get context recommendations ──

router.get('/recommend', (req, res) => {
  const { input } = req.query;
  
  if (!input) {
    return res.status(400).json({ error: 'Input query required' });
  }
  
  const lower = input.toLowerCase();
  
  // Simple keyword matching for recommendations
  const recommendations = [];
  
  if (/\b(code|function|debug|refactor)\b/i.test(lower)) {
    recommendations.push({
      source: 'LangChain Prompt Templates',
      pattern: 'Chain Composition',
      relevance: 'high',
      snippet: 'Use multi-step chains for complex code analysis tasks...',
    });
  }
  
  if (/\b(image|visual|design|ui)\b/i.test(lower)) {
    recommendations.push({
      source: 'Anthropic Cookbook',
      pattern: 'Structured Output',
      relevance: 'high',
      snippet: 'Define clear visual specifications with structured sections...',
    });
  }
  
  if (/\b(write|document|explain)\b/i.test(lower)) {
    recommendations.push({
      source: 'Prompt Engineering Guide',
      pattern: 'Few-Shot Learning',
      relevance: 'medium',
      snippet: 'Include 2-3 examples of desired output format...',
    });
  }
  
  if (recommendations.length === 0) {
    recommendations.push({
      source: 'OpenAI Cookbook',
      pattern: 'System Messages',
      relevance: 'medium',
      snippet: 'Start with clear role definition and task boundaries...',
    });
  }
  
  res.json({
    input,
    recommendations,
    total: recommendations.length,
  });
});

export default router;
