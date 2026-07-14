# LOGOS — AI Prompt Optimization Agent

> *Logos (λόγος) — Greek for "word", "reason", "discourse"*

## 🎯 Executive Summary

| Field | Value |
|-------|-------|
| **Project Name** | Logos |
| **One-Liner** | "Write a small thing → Logos optimizes it into production-grade prompts" |
| **Type** | Web2 / SaaS (AI-powered tool) |
| **Problem** | Raw AI prompts are inconsistent, unstructured, and miss best practices |
| **Solution** | AI agent that analyzes intent and generates optimized, multi-modal prompts with citations |
| **Target Users** | AI Engineers, Content Creators, Coding-Agent Users, Hobbyists |
| **Timeline** | Phase 1 MVP in this session |
| **Architecture** | React SPA + Express API + Pi Agent Core |

---

## 📊 PROGRESS: 0% Complete

| Phase | Status | Time | % Done |
|-------|--------|------|--------|
| Phase 1 — Foundation | 🔲 Not started | — | 0% |
| Phase 2 — Core Build | 🔲 Not started | — | 0% |
| Phase 3 — Quality | 🔲 Not started | — | 0% |
| Phase 4 — Ship | 🔲 Not started | — | 0% |

---

## 🏗️ Tech Stack

| Layer | Choice | Justification |
|-------|--------|---------------|
| **Frontend** | React 18 + Vite + Tailwind | Fast HMR, optimized builds, utility-first CSS |
| **State** | Zustand + React Query | UI state + server cache |
| **Routing** | React Router | Client-side for Editor, Library, Templates, History |
| **Forms** | React Hook Form + Zod | Validated prompt input forms |
| **Editor** | CodeMirror | Syntax-aware prompt/code editing with diff |
| **Backend** | Express.js | REST API connecting frontend to Pi agent |
| **Database** | SQLite (MVP) → PostgreSQL | Local dev first, scale later |
| **AI Core** | Pi Coding Agent | Intent analysis, structure injection, example retrieval |
| **Testing** | Vitest + React Testing Library | Aligned with Vite toolchain |

---

## 🔄 User Flow

```
[Raw Idea Input] → [Select Modality] → [Logos Optimizes]
    → [Inline Diff View] → [Confidence Score + Rationale]
    → [Accept/Edit] → [Version Saved]
    → [Export: JSON / Markdown / Copy-formatted]
```

---

## 📁 Project Structure

```
logos/
├── src/
│   ├── components/
│   │   ├── ui/              # Shared UI components
│   │   ├── editor/          # Prompt editor + diff view
│   │   ├── templates/       # Template browser
│   │   └── export/          # Export buttons + formatting
│   ├── pages/
│   │   ├── Home.jsx         # Landing / input page
│   │   ├── Editor.jsx       # Main optimization view
│   │   ├── Library.jsx      # Saved prompts
│   │   ├── Templates.jsx    # Template browser
│   │   └── History.jsx      # Version history + A/B
│   ├── stores/              # Zustand stores
│   ├── hooks/               # Custom hooks
│   ├── api/                 # API client functions
│   ├── lib/                 # Utilities, formatters
│   └── types/               # Type definitions
├── server/
│   ├── routes/              # Express routes
│   ├── core/                # Pi agent optimization core
│   ├── db/                  # SQLite/PostgreSQL setup
│   └── index.js             # Express server entry
├── data/
│   └── patterns/            # Curated GitHub repo patterns
├── public/
├── CLAUDE.md
├── .env.example
├── .gitignore
├── vite.config.js
├── package.json
└── README.md
```

---

## ⚡ Build Order (Phase 1 — Foundation)

### Phase 1: Foundation (30 min)
- [ ] React + Vite scaffold with Tailwind
- [ ] Express server with API routes
- [ ] SQLite database setup
- [ ] Basic routing (Home, Editor, Library, Templates, History)
- [ ] CLAUDE.md + .env.example + .gitignore
- [ ] Core prompt optimizer function (role + structure + constraints)

### Phase 2: Core Build (60 min)
- [ ] Prompt input form with modality selector
- [ ] Optimizer API endpoint
- [ ] Inline diff view (original vs optimized)
- [ ] Confidence score display
- [ ] Version persistence (save to DB)
- [ ] Export (JSON, Markdown, Copy-to-clipboard)

### Phase 3: Quality (30 min)
- [ ] Security scan
- [ ] Type validation with Zod
- [ ] Loading/empty/error states
- [ ] Responsive design check

### Phase 4: Ship (30 min)
- [ ] Deploy frontend (Vercel)
- [ ] Deploy backend (Railway)
- [ ] README with demo
- [ ] Push to GitHub

---

## 🔐 Security (Non-Negotiable)

1. NEVER commit .env
2. Validate ALL user inputs with Zod
3. No console.log in production
4. Handle loading/empty/error states
5. Rate-limit API endpoints

---

## ✅ Quality Gates

- [ ] Secret scan clean
- [ ] .env.example with all vars
- [ ] Input validation on all forms
- [ ] TypeScript/Zod validation
- [ ] Loading/empty/error states
- [ ] Happy path works end-to-end
- [ ] README written
