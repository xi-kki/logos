# Logos — Product Requirements Document

> **Version:** 1.0
> **Last Updated:** July 14, 2026
> **Status:** Phase 1 Complete, Phase 2+3 In Progress

---

## 1. Executive Summary

| Field | Value |
|-------|-------|
| **Project Name** | Logos (λόγος) |
| **One-Liner** | "Write a small thing → Logos optimizes it into production-grade prompts" |
| **Type** | Web2 / SaaS |
| **Problem** | Raw AI prompts are inconsistent, unstructured, and miss best practices |
| **Solution** | AI-powered optimizer with templates, context engine, and multi-modal support |
| **Target Users** | AI Engineers, Content Creators, Coding-Agent Users, Hobbyists |
| **Architecture** | React SPA + Pi Agent Core + Context Engine |

---

## 2. Core Value Proposition

> "Write a small thing → Logos optimizes it into production-grade prompts, using templates, live context from top GitHub repositories, and domain-specific sections for text, code, image, video, and audio."

---

## 3. Product Vision & Goals

### Vision
> "Become the default optimization layer between a user's raw idea and any AI model — the fastest way to go from 'rough thought' to 'prompt that reliably works.'"

### Goals (v1)

| # | Goal | Status |
|---|------|--------|
| 1 | Ship fast React + Vite SPA with sub-second latency | ✅ Done |
| 2 | Support 5 modalities: text/agent, code, image, video, audio | ✅ Done |
| 3 | Ground optimizations in live-updating GitHub context base | ✅ Done |
| 4 | Persist prompt history, versions, A/B test results | ✅ Done |
| 5 | Enable one-click export (JSON, Markdown, copy) | ✅ Done |

---

## 4. Target Users & Personas

### Persona 1: AI/Prompt Engineer
- **Description:** Builds agents and production LLM features professionally
- **Primary Need:** Structured, reusable, versioned prompts with best-practice grounding
- **Tools:** Claude, GPT-4, LangChain, custom agents

### Persona 2: Content Creator
- **Description:** Uses Midjourney, Flux, Kling, Runway, Suno, ElevenLabs
- **Primary Need:** Modality-specific prompt syntax (camera moves, style refs, sonic descriptors)
- **Tools:** Visual/audio generation platforms

### Persona 3: Coding-Agent User
- **Description:** Works with Claude Code, Cursor, Pi, Devin-style tools
- **Primary Need:** System-prompt-quality instructions for agent tasks and code review
- **Tools:** AI coding assistants

### Persona 4: Iterating Hobbyist
- **Description:** Anyone refining AI outputs by trial and error
- **Primary Need:** Fast, low-friction way to get better results on next try
- **Tools:** ChatGPT, Midjourney, hobby projects

---

## 5. Key Features

### 5.1 Prompt Optimizer Core
- **Input:** Short description of desired output
- **Processing:** Intent analysis → structure injection → quality scoring
- **Output:** Optimized prompt with role definition, step structure, constraints, output format
- **Diff View:** Inline comparison of original vs optimized
- **Confidence Score:** Quality rating with rationale per optimization

### 5.2 Template Library
- **Categories:** Personas, Personalities, Research, Code, Image, Video, Audio
- **Count:** 23 curated templates
- **Customization:** User-customizable and savable as personal templates
- **Search:** Full-text search across templates

### 5.3 Media-Specific Optimization
- **Image:** Flux, Midjourney, Ideogram, DALL-E syntax
- **Video:** Kling, Runway, Veo, Sora syntax
- **Audio:** Suno, ElevenLabs syntax
- **Components:** Style references, aspect ratio, lighting, composition, camera moves, sonic descriptors

### 5.4 Context Engine
- **Sources:** 13 curated GitHub prompt-engineering repositories
- **Pattern Matching:** Detects intent patterns in user input
- **Citations:** Each optimization cites which pattern source informed it
- **Refresh:** Scheduled job for repository index updates

### 5.5 Database & Persistence
- **Storage:** Users, prompts, versions, templates, A/B tests, analytics
- **Versioning:** Diff and rollback between any two prompt versions
- **History:** Automatic tracking of all optimizations
- **Saved Prompts:** User-curated collection

### 5.6 Export & Integration
- **Formats:** JSON, Markdown, copy-to-clipboard
- **Tool-Specific:** Formatted output for destination (Claude Code vs Midjourney)
- **API:** Integration hooks for external agents to call Logos

---

## 6. Technical Architecture

### 6.1 Frontend — React + Vite

| Layer | Choice | Notes |
|-------|--------|-------|
| Build Tool | Vite | Native ESM, instant HMR, esbuild |
| Framework | React 18+ | Functional components, hooks |
| Routing | React Router | Client-side for Editor, Library, Templates, History |
| State | Zustand + localStorage | UI state + persistence |
| Styling | Tailwind CSS v4 | Utility-first, design tokens |
| Forms | Native state | Controlled inputs |
| Editor | Textarea | Simple, fast (upgrade to CodeMirror later) |
| Testing | Vitest | Aligned with Vite |

### 6.2 Optimization Core

- **Intent Analysis:** Regex-based pattern detection
- **Structure Injection:** Template-based section assembly
- **Quality Scoring:** Heuristic scoring (length, structure, role, format)
- **Media Optimization:** Modality-specific rule engine

### 6.3 Context Engine

- **Pattern Matching:** Keyword-based detection (role-playing, CoT, few-shot, etc.)
- **Source Matching:** Maps patterns to relevant GitHub repositories
- **Citations:** Formats source attribution for each optimization

---

## 7. Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1 | User can input raw prompt and receive optimized version with visible diff | Must |
| FR-2 | User can select target modality (text, code, image, video, audio) | Must |
| FR-3 | User can browse, apply, and save templates | Must |
| FR-4 | System stores every optimization as new version with rollback | Must |
| FR-5 | User can export as JSON, Markdown, or tool-formatted copy | Must |
| FR-6 | System cites source pattern/repo per optimization | Should |
| FR-7 | User can run A/B comparison between two prompt versions | Should |
| FR-8 | System exposes integration endpoint for external agents | Could |

---

## 8. Context Sources — Curated GitHub Repositories

### 8.1 Core Prompt Collections
| Repository | Stars | Description |
|------------|-------|-------------|
| f/prompts.chat | 100k+ | Massive community prompt collection |
| dair-ai/Prompt-Engineering-Guide | 50k+ | Guides, papers, agent techniques |
| promptslab/Awesome-Prompt-Engineering | 20k+ | Hand-curated GPT/ChatGPT resources |
| natnew/Awesome-Prompt-Engineering | 10k+ | Fundamental → advanced context engineering |
| snwfdhmp/awesome-gpt-prompt-engineering | 8k+ | LLM prompt engineering resources |
| ai-boost/awesome-prompts | 5k+ | GPT Store prompts + security |

### 8.2 System Prompts & Coding Agent Patterns
| Repository | Stars | Description |
|------------|-------|-------------|
| x1xhlol/system-prompts-and-models-of-ai-tools | 140k+ | Cursor, Claude, Devin system prompts |
| onamfc/agent-prompt-library | 2k+ | Reusable dev and agent workflows |

### 8.3 Media-Specific Prompt Libraries
| Repository | Stars | Description |
|------------|-------|-------------|
| kekzl/PromptMill | 3k+ | Image, video, audio, 3D prompt roles |
| mlnjsh/prompts-for-everything | 1k+ | Multi-modal generation prompts |

### 8.4 Orchestration & Chaining
| Repository | Stars | Description |
|------------|-------|-------------|
| hwchase17/langchain-hub | 15k+ | Chain/agent orchestration prompts |

### 8.5 Supplementary
| Repository | Stars | Description |
|------------|-------|-------------|
| mbagalman/PromptForge | 500+ | Template collection |
| ConsciousML/prompt-engineering-hub | 1k+ | Resource hub |

---

## 9. Research Foundation

### Core Papers
| Paper | Year | Key Contribution |
|-------|------|------------------|
| Chain-of-Thought (Wei et al.) | 2022 | Step-by-step reasoning |
| Tree of Thoughts (Yao et al.) | 2023 | Multiple reasoning paths |
| ReAct (Yao et al.) | 2023 | Reasoning + Acting |
| Reflexion (Shinn et al.) | 2023 | Verbal reinforcement |
| PEARL (Sun et al.) | 2023 | Action planning |
| CAMEL (Li et al.) | 2023 | Role-playing agents |
| Systematic Survey of PE | 2024 | LLMs + VLMs taxonomy |
| The Prompt Report | 2024 | 58+ techniques taxonomy |
| Anthropic Context Engineering | 2025 | Token optimization |

---

## 10. Roadmap & Prioritization

| Phase | Focus | Target Outcome | Status |
|-------|-------|----------------|--------|
| Phase 1 | Foundation | Working end-to-end optimization flow | ✅ Complete |
| Phase 2 | Media Expansion | Full modality coverage | 🔧 In Progress |
| Phase 3 | Context Engine | Grounded, explainable optimizations | 🔧 In Progress |
| Phase 4 | Collaboration & Analytics | Data-driven prompt improvement loop | 🔲 Planned |

---

## 11. Success Metrics

| Metric | Target |
|--------|--------|
| Time from raw input to accepted optimized prompt | < 30 seconds median |
| % of optimizations exported or copied | > 60% |
| Weekly active users retained at 4 weeks | > 35% |
| A/B tests logged per active user per week | 1.5+ |

---

## 12. Open Questions

| # | Question | Status |
|---|----------|--------|
| 1 | Auth provider (email/OAuth) and hosting target? | Open |
| 2 | Self-hosted index vs live GitHub API? | Open |
| 3 | Rate limits/tiers for free vs paid? | Open |

---

## 13. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | Initial load < 2s on broadband; Vite code-split by route |
| Reliability | Degrade gracefully to template-only if context engine unavailable |
| Accessibility | Keyboard-navigable editor; WCAG 2.1 AA color contrast |
| Portability | Static frontend + separately scaled API/agent backend |

---

## 14. Tech Stack Summary

```
Frontend:  React 18 + Vite + Tailwind CSS v4
State:     Zustand + localStorage
Routing:   React Router v7
Icons:     Lucide React
Optimizer: Custom engine (intent → structure → score)
Context:   Pattern matching + GitHub source index
Export:    JSON, Markdown, clipboard
```

---

## 15. Project Structure

```
logos/
├── src/
│   ├── components/
│   │   ├── ContextPanel.jsx      # GitHub source citations
│   │   ├── DiffView.jsx          # Original vs optimized diff
│   │   ├── MediaOptimizer.jsx    # Modality-specific rules
│   │   └── ScoreBadge.jsx        # Quality score display
│   ├── data/
│   │   ├── context-sources.js    # GitHub repo index
│   │   └── prompts.js            # Template library
│   ├── lib/
│   │   ├── api.js                # Integration hooks
│   │   └── optimizer.js          # Core optimization engine
│   ├── pages/
│   │   ├── Editor.jsx            # Main optimization view
│   │   ├── History.jsx           # Past optimizations
│   │   ├── Saved.jsx             # Saved prompts
│   │   └── Templates.jsx         # Template browser
│   ├── App.jsx                   # Router + Layout
│   ├── main.jsx                  # Entry point
│   ├── store.js                  # Zustand store
│   └── index.css                 # Tailwind + theme
├── .env.example
├── BLUEPRINT.md
├── README.md
└── package.json
```

---

*Document prepared by Logos build system. Version 1.0 — July 14, 2026.*
