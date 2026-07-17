# λ Logos

> **Write a small thing → Logos optimizes it into production-grade prompts.**

Logos is a comprehensive prompt engineering platform powered by Groq AI. Optimize prompts, reverse engineer any media into prompts, generate websites from descriptions, and test with different models — all in one tool.

## ✨ Features

### 🎯 Prompt Optimizer
- **5 Modalities**: Text/Agent, Code, Image, Video, Audio
- **Intent Analysis**: Automatically detects what you're trying to do
- **Structure Injection**: Adds roles, constraints, output formats
- **Quality Scoring**: Rates your optimized prompt with rationale
- **Diff View**: See exactly what changed

### 🔄 Reverse Engineer (Any Media → Prompt)
- **Image → Prompt**: Upload screenshots to extract recreation prompts (Groq Vision)
- **Audio → Prompt**: Upload audio for transcription + style analysis (Groq Whisper)
- **Video → Prompt**: Extract frames and analyze motion/style (Vision + LLM)
- **URL → Prompt**: Paste URLs to reverse-engineer design prompts
- **Code → Prompt**: Drop code to generate documentation prompts

### 🌐 Prompt → Website
- **Describe → Generate**: Write a prompt, get production-ready HTML/React code
- **AI-Powered**: Real code generation via Groq LLM (not templates)
- **Style Selection**: Minimal, Bold, Elegant, Playful, Professional, Dark
- **Framework Choice**: HTML/CSS, React + Tailwind, Next.js
- **Live Preview**: See your website before downloading

### 🎮 Prompt Playground
- **Multi-Model**: Test with Llama 3.3, Llama 3.1, Mixtral, Gemma
- **Token Counter**: Real-time token estimation
- **Cost Estimator**: See what prompts would cost
- **Variable Injection**: Use `{{name}}` placeholders, fill at runtime
- **Quick Presets**: Code Review, Blog Post, Email Draft, API Docs, Image Prompt
- **Run History**: Replay previous runs with one click

### 📚 Additional Features
- **Template Library**: Curated personas, personalities, research frameworks
- **Export**: JSON, Markdown, or copy-to-clipboard
- **Version History**: Track all optimizations with rollback
- **GitHub Context**: Patterns from top prompt engineering repos

## 🚀 Quick Start

```bash
# Install dependencies
npm install
cd server && npm install && cd ..

# Set up Groq API key
cp .env.example .env
# Edit .env and add your GROQ_API_KEY from https://console.groq.com

# Start frontend (Vite)
npm run dev

# Start backend API (separate terminal)
npm run dev:server
```

Frontend: http://localhost:5173
Backend API: http://localhost:3001

## 📁 Project Structure

```
logos/
├── src/
│   ├── components/      # Reusable UI (DiffView, ScoreBadge, Toast)
│   ├── data/            # Prompt templates (personas, personalities)
│   ├── lib/             # Optimizer engine, export helpers, API layer
│   ├── pages/
│   │   ├── Editor.jsx           # Main optimization view
│   │   ├── Playground.jsx       # Test prompts with different models
│   │   ├── ReverseEngineer.jsx  # Image/Audio/Video/URL/Code → Prompt
│   │   ├── PromptToWebsite.jsx  # Prompt → Website code generation
│   │   ├── Templates.jsx        # Template browser
│   │   ├── Saved.jsx            # Saved prompts library
│   │   └── History.jsx          # Version history
│   ├── store.js         # Zustand state management
│   └── App.jsx          # Router + Layout + Keyboard shortcuts
├── server/
│   ├── ai/              # Groq AI integration
│   │   ├── groq.js      # Groq API client
│   │   ├── vision.js    # Image/URL/Code analysis
│   │   ├── audio.js     # Audio transcription + analysis
│   │   ├── video.js     # Video frame analysis
│   │   └── generator.js # Website code generation
│   ├── db/              # SQLite database
│   ├── routes/          # Express API routes
│   └── index.js         # Server entry point
├── .env.example
├── BLUEPRINT.md         # Full PRD and architecture
└── README.md
```

## 🛠️ API Endpoints

### Optimization
- `POST /api/optimize` — Optimize a prompt
- `GET /api/optimize/status` — Check AI configuration
- `POST /api/optimize/reverse` — Reverse engineer from media
- `POST /api/optimize/generate-website` — Generate website code

### Prompts
- `GET /api/prompts` — List all prompts
- `POST /api/prompts` — Create new prompt
- `PUT /api/prompts/:id` — Update prompt
- `DELETE /api/prompts/:id` — Delete prompt

### Context
- `GET /api/context/sources` — List GitHub context sources
- `GET /api/context/patterns` — Get prompt patterns
- `GET /api/context/recommend` — Get recommendations

## 📊 Prompt Templates

| Category | Count | Description |
|----------|-------|-------------|
| **Personas** | 5 | Senior Engineer, Product Strategist, Creative Director, etc. |
| **Personalities** | 5 | Concise, Friendly, Analytical, Creative, Socratic |
| **Research** | 4 | Literature Review, Competitive Analysis, Deep Dive |
| **Code** | 3 | Code Review, Refactoring, Debugging |
| **Image** | 2 | Midjourney, Flux |
| **Video** | 2 | Kling, Runway |
| **Audio** | 2 | Suno, ElevenLabs |

## 🔧 Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS 4
- **State**: Zustand + localStorage persistence
- **Routing**: React Router 7
- **Backend**: Express.js + SQLite (better-sqlite3)
- **AI**: Groq API (Vision, Whisper, LLM)
- **Validation**: Zod
- **Icons**: Lucide React

## 🤖 Groq Models Used

| Model | Use Case |
|-------|----------|
| `llama-3.2-11b-vision-preview` | Image analysis, video frame analysis |
| `whisper-large-v3` | Audio transcription |
| `llama-3.3-70b-versatile` | Text generation, code generation |
| `llama-3.1-8b-instant` | Fast inference for simple tasks |
| `mixtral-8x7b-32768` | Code and analysis tasks |

## 📝 Research Foundation

Built on prompt engineering research:
- Chain-of-Thought (Wei et al., 2022)
- Tree of Thoughts (Yao et al., 2023)
- ReAct (Yao et al., 2023)
- Reflexion (Shinn et al., 2023)
- Anthropic Context Engineering (2025)
- 13 curated GitHub repositories

## 🗺️ Roadmap

- [x] **Phase 1**: React + Vite scaffold, core optimizer, text/code modality
- [x] **Phase 2**: Image, video, audio optimization sections
- [x] **Phase 3**: Reverse engineering (Image/Audio/Video/URL/Code → Prompt)
- [x] **Phase 4**: Prompt → Website generator with real AI
- [x] **Phase 5**: Backend API + SQLite persistence + Groq integration
- [x] **Phase 6**: Prompt Playground with multi-model support
- [ ] **Phase 7**: GitHub context engine with live source citations
- [ ] **Phase 8**: A/B testing, analytics, user accounts

## 📄 License

MIT
