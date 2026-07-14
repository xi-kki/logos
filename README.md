# λ Logos

> **Write a small thing → Logos optimizes it into production-grade prompts.**

Logos is a prompt optimization tool that takes raw ideas and transforms them into structured, effective prompts using templates, live context from top GitHub repositories, and domain-specific sections for text, code, image, video, and audio.

## Features

- **5 Modalities**: Text/Agent, Code, Image, Video, Audio
- **Intent Analysis**: Automatically detects what you're trying to do
- **Structure Injection**: Adds roles, constraints, output formats
- **Quality Scoring**: Rates your optimized prompt with rationale
- **Diff View**: See exactly what changed
- **Template Library**: Curated personas, personalities, research frameworks
- **Export**: JSON, Markdown, or copy-to-clipboard
- **Version History**: Track all optimizations with rollback

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **State**: Zustand + localStorage persistence
- **Routing**: React Router
- **Icons**: Lucide React
- **Optimizer**: Custom engine with intent analysis + structure injection

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
logos/
├── src/
│   ├── components/      # Reusable UI (DiffView, ScoreBadge)
│   ├── data/            # Prompt templates (personas, personalities, etc.)
│   ├── lib/             # Optimizer engine, export helpers
│   ├── pages/           # Route pages (Editor, Templates, History, Saved)
│   ├── store.js         # Zustand state management
│   ├── App.jsx          # Router + Layout
│   └── main.jsx         # Entry point
├── .env.example
├── BLUEPRINT.md         # Full PRD and architecture
└── README.md
```

## Prompt Templates

Logos includes curated templates across 7 categories:

| Category | Count | Description |
|----------|-------|-------------|
| **Personas** | 5 | Senior Engineer, Product Strategist, Creative Director, Research Analyst, Technical Writer |
| **Personalities** | 5 | Concise, Friendly, Analytical, Creative, Socratic |
| **Research** | 4 | Literature Review, Competitive Analysis, Deep Dive, Fact-Check |
| **Code** | 3 | Code Review, Refactoring, Debugging |
| **Image** | 2 | Midjourney, Flux |
| **Video** | 2 | Kling, Runway |
| **Audio** | 2 | Suno, ElevenLabs |

## Roadmap

- [x] **Phase 1**: React + Vite scaffold, core optimizer, text/code modality
- [ ] **Phase 2**: Image, video, audio optimization sections
- [ ] **Phase 3**: GitHub context engine with source citations
- [ ] **Phase 4**: A/B testing, analytics, API integration

## Research Foundation

Logos is built on prompt engineering research:

- Chain-of-Thought (Wei et al., 2022)
- Tree of Thoughts (Yao et al., 2023)
- ReAct (Yao et al., 2023)
- Reflexion (Shinn et al., 2023)
- Anthropic Context Engineering (2025)
- 13 curated GitHub repositories

## License

MIT
