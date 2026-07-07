<div align="center">

# ✨ Appening

**Describe a mobile app in plain English — and get a real, editable starter back, with a live preview you can shape.**

[![License: All Rights Reserved](https://img.shields.io/badge/license-All_Rights_Reserved-red.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Claude](https://img.shields.io/badge/Claude-Sonnet_4.6-D97757?logo=anthropic&logoColor=white)](https://www.anthropic.com)

[The problem](#-the-problem-idea-to-app) · [The solution](#-the-solution) · [Highlights](#-highlights) · [Tech stack](#-tech-stack) · [Getting started](#-getting-started) · [Architecture](#-architecture) · [Roadmap](#-roadmap)

_Appening is a placeholder name and an unbranded demo — not a finished product._

</div>

---

Appening is an AI agent that turns a sentence into a working mobile app. Describe what you want in plain English, and it generates a real Expo / React Native starter — screens, components, and project structure — that you can refine in chat, preview on a phone, and browse file-by-file. Real, editable code, not a black box.

> **Project status.** This is a production-quality **front-end foundation** with **live AI generation already wired in**: every screen, interaction, and animation is real, and the compose screen calls the **Anthropic Messages API** server-side to generate apps. Projects persist in the browser today; the architecture is deliberately built so a real backend (auth, database, cloud projects) slots in behind one swappable module — no UI rewrites required. See [Architecture](#-architecture).

## 🎯 The problem: idea to app

Going from _"I have an app idea"_ to _"I have running starter code"_ is mostly friction — and the worst of it happens **before** you've built anything that matters:

1. **The scaffolding tax** — picking a stack, wiring config, and writing boilerplate before line one of your actual idea.
2. **Blank-canvas paralysis** — _"what files do I even need?"_ is often the hardest part of starting.
3. **No-code lock-in** — drag-and-drop builders hide the code and trap your project inside their platform.
4. **Idea → code is lossy** — translating a plain-English description into real screens and structure is slow, manual work.
5. **You can't feel it yet** — there's no way to see or touch the app until you've already done all the setup.

The result: the gap between a good idea and something runnable is wide enough that most ideas never make it across.

## 💡 The solution

Appening collapses _idea → starter app_ into a single conversation:

- **Describe it, get real files.** A plain-English prompt becomes a complete Expo / React Native starter — `App.tsx`, screens, components, and config — generated as structured JSON, not a screenshot.
- **Refine in chat.** Keep talking to the agent to reshape the app; each turn is a normal message, with a model-size selector for control.
- **Preview on a phone.** A live device frame renders the generated app, switchable across **iPhone 15, iPhone SE, Pixel 8, and iPad mini**.
- **Browse the actual code.** A working, read-only **file tree + code view** shows exactly what was generated — no paywall, no lock-in.
- **Pick up where you left off.** Projects persist locally, and a pre-loaded **Demo Project** lets you explore the entire flow with zero setup.

Three surfaces carry the experience: a **landing** page to pitch it, a **dashboard** to manage projects, and the **compose** screen where the building happens.

## ✨ Highlights

Things in here worth a closer look:

| Feature | What's interesting |
| --- | --- |
| **Plain-English generation** | The compose screen POSTs the conversation to a server route that calls Claude (`claude-sonnet-4-6`) and returns a validated `{ summary, files }` contract. |
| **Graceful by design** | Markdown fences are stripped, JSON is parsed inside a `try/catch`, and any failure surfaces as a calm in-chat error — never a crash. |
| **Live multi-device preview** | A single `PhoneFrame` primitive renders any device profile; the selector reflows the same app across phone and tablet sizes. |
| **Working file browser** | A real recursive tree (folders-first, expandable) plus a line-numbered code view of the generated output. |
| **Themeable in one file** | Every color, radius, and font is a CSS variable in `app/tokens.css` — there is **zero hardcoded brand palette** anywhere. Re-skin the whole product by editing one file. |
| **Swappable wordmark** | The mark + product name live in a single component, built to rebrand in exactly one place. |
| **Projects without a backend** | A `useSyncExternalStore` localStorage store powers create / rename / delete, a right-click context menu with a delete-warning, and the seeded Demo Project. |
| **Tunable generation** | The system prompt lives in its own editable file (`lib/genSystemPrompt.ts`), treated like a skill you can tune. |

## 🧰 Tech stack

| Layer | Technology |
| --- | --- |
| **Framework** | [Next.js 15](https://nextjs.org) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org) (strict mode) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com) wired entirely to CSS-variable design tokens |
| **Font** | [Inter](https://rsms.me/inter/) via `next/font` |
| **AI** | [Anthropic Messages API](https://docs.anthropic.com) — `claude-sonnet-4-6` |
| **State** | React + `localStorage` (no backend yet) |
| **Deploy** | [Vercel](https://vercel.com) |

> The generation route runs server-side, so your `ANTHROPIC_API_KEY` never reaches the client. Without a key the UI still runs end-to-end — generation just returns a friendly error, and the Demo Project remains fully explorable.

## 🚀 Getting started

**Prerequisites:** [Node.js](https://nodejs.org) 18+ and npm. An [Anthropic API key](https://console.anthropic.com) for live generation (optional — the Demo Project works without one).

```bash
# 1. Clone
git clone https://github.com/gmazaratti/app-builder-concept.git
cd app-builder-concept

# 2. Install
npm install

# 3. Configure your key (optional)
cp .env.example .env.local
#    then edit .env.local and set ANTHROPIC_API_KEY=sk-ant-...

# 4. Run the dev server (http://localhost:3000)
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Type-check and build for production |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint over the project |

## 🗂 Project structure

```
app/
├── page.tsx               # Landing
├── dashboard/page.tsx     # Project home
├── compose/page.tsx       # The builder — chat + preview + files
├── api/generate/route.ts  # Server route → Anthropic Messages API
├── tokens.css             # ALL design tokens — reskin in one file
├── globals.css
└── layout.tsx
components/                 # Navbar, Sidebar, PhoneFrame, FileTree, CodeView, …
lib/
├── genSystemPrompt.ts      # The tunable generation prompt
├── projectStore.ts         # localStorage project store (the swappable backend seam)
├── demoProject.ts          # The seeded Demo Project
└── types.ts
```

## 🏛 Architecture

A few decisions that make the codebase pleasant to grow:

- **Three surfaces, one shell.** Landing, dashboard, and compose share a tokenized design system and a single sidebar; compose is the one stateful, interactive surface where generation happens.
- **Generation is a clean contract.** `compose → /api/generate → Claude → strip fences → parse → { summary, files }`. The UI only depends on that shape, so the model or prompt can change freely behind it.
- **The prompt is a tunable file.** `lib/genSystemPrompt.ts` is treated like a skill — edit it to change what gets built, without touching route or UI code.
- **Designed for a clean backend swap.** Projects flow through one module (`lib/projectStore.ts`). Replace its `localStorage` internals with a database + auth and every surface keeps working — no UI changes. This is the seam where Postgres and real accounts land.
- **Themeable to the core.** Colors, radii, spacing, and the font are CSS custom properties in `app/tokens.css`, mapped into Tailwind; re-skinning or rebranding is a one-file change with no hardcoded brand values.
- **Discipline.** TypeScript strict on, files kept small and single-purpose, motion CSS-driven and `prefers-reduced-motion` safe.

## 🛣 Roadmap

The front end and live generation are real. The next phase deepens the loop:

- [x] Landing, dashboard, and compose surfaces
- [x] Live AI generation via the Anthropic Messages API
- [x] Multi-device live preview
- [x] Working read-only file browser
- [x] Local project persistence + a seeded Demo Project
- [ ] **Real auth + cloud projects** — replace the `localStorage` store with a database
- [ ] **Runnable preview** — execute the generated app in a sandbox (react-native-web)
- [ ] **Inline editing + regenerate** — edit files and re-run generation on a diff
- [ ] **Export / download** the generated project as a zip
- [ ] **One-click deploy** of a generated app

## 🤖 Development & AI assistance

Built with the assistance of Claude Code for scaffolding, implementation, and refactoring.

## 📄 License & usage

**© 2026 Alex Degryse — All rights reserved.**

This repository is published for **review only**. It is **not** open source: you're welcome to read the code, but copying, modifying, redistributing, or reusing it — in whole or in part — is not permitted without prior written permission. See [LICENSE](./LICENSE).
