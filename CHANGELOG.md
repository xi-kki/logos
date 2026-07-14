# Changelog

All notable changes to Logos.

## [0.2.0] — 2026-07-14

### Added
- **Phase 2 — Media Expansion**
  - `MediaOptimizer` component with rules for all modalities
  - Image: Flux, Midjourney, DALL-E, Ideogram syntax
  - Video: Kling, Runway, Veo, Sora syntax
  - Audio: Suno, ElevenLabs syntax
  - Tool selector in Editor for platform-specific optimization
  - Quality tags, lighting, composition, camera moves, mood terms

- **Phase 3 — Context Engine**
  - 13 curated GitHub repositories indexed
  - Pattern matching (role-playing, CoT, few-shot, etc.)
  - `ContextPanel` UI showing relevant sources + citations
  - API layer with integration hooks for external agents
  - Source citation format for each optimization

- **Documentation**
  - Full PRD added (`docs/PRD.md`)
  - Updated README with Phase 2+3 features

## [0.1.0] — 2026-07-14

### Added
- **Phase 1 — Foundation**
  - React 18 + Vite + Tailwind CSS scaffold
  - Prompt optimizer engine (intent analysis → structure injection → quality scoring)
  - 23 curated templates (personas, personalities, research, code, media)
  - 5 modalities: Text, Code, Image, Video, Audio
  - Inline diff view + quality scoring
  - Export: JSON, Markdown, copy-to-clipboard
  - Zustand store with localStorage persistence
  - 4 pages: Editor, Templates, Saved, History
  - Full PRD and blueprint included
