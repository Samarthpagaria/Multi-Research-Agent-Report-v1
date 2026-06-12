<div align="center">

# 🤖 MultiAgent AI Research

**A multi-agent AI pipeline that searches, scrapes, synthesizes, and self-critiques detailed research reports — delivered through a premium animated dark-mode interface.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-black?style=for-the-badge&logo=vercel)](https://github.com/Samarthpagaria/MultiAgent-Ai-Reasearch)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://render.com)
[![OpenRouter](https://img.shields.io/badge/LLM-OpenRouter-6C47FF?style=for-the-badge&logo=openai)](https://openrouter.ai)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)

</div>

---

## 📌 Overview

MultiAgent AI Research automates the manual workflow of searching the web, reading and filtering pages, summarizing insights, and proofreading outputs. A structured 4-agent sequential pipeline — **Search Scout → Reader → Writer → Critic** — handles everything from raw query to a self-critiqued, cite-able report, surfaced on a smooth animated React dashboard.

Built for researchers, analysts, students, and developers who need factual, structured summaries of complex topics — without the tab-switching.

---

## ✨ Features

- **🔍 Multi-Agent Sequential Pipeline** — Four dedicated agents/chains (Scout, Reader, Writer, Critic) each own a distinct stage of the research workflow
- **🌐 Tavily Advanced Web Search** — Queries Tavily Search API with `advanced` depth to fetch up to 6 high-quality sources per report
- **🧹 Noisy-Markup Scraper** — Cheerio strips scripts, styles, headers, footers, and navbars — delivering clean prose for the Reader agent
- **✍️ LangChain Synthesis Writer** — Compiles aggregated research text into a structured markdown report via a dedicated Writer chain
- **🧠 Self-Critique Scoring Loop** — A Critic chain grades the drafted report out of 10, lists strengths and improvements, and delivers a final verdict
- **🎨 Premium Dark Mode UI** — Framer Motion morphing panels, word-by-word streaming animation, and a dedicated Critic Report Card view
- **🛡️ Security Guardrails** — Prompt injection blocklist + 5,000 character cap to prevent API abuse
- **⚡ Rate Limiting** — Hard-throttled at 20 requests per 15 minutes per IP via `express-rate-limit`

---

## 🤖 AI & LLM Architecture

### Pipeline — 4 LLM Calls Per Report

```
User Query
    │
    ▼
[1] Express Backend ──► Length check (max 5,000 chars) + Prompt injection guard
    │
    ▼
[2] Search Scout Agent ──► Tavily Search API (1 query, up to 6 results)    ← LLM Call 1
    │
    ▼
[3] Reader Agent ──► Selects top 2 URLs → Cheerio scrape → Summarizes        ← LLM Call 2
    │
    ▼
[4] Writer Chain ──► Synthesizes all research into structured markdown        ← LLM Call 3
    │
    ▼
[5] Critic Chain ──► Scores /10, strengths, improvements, verdict             ← LLM Call 4
    │
    ▼
[6] React Frontend ──► Animated word-by-word report + Critic Report Card
```

### Agent Breakdown

| #   | Agent / Chain                           | Role                                                                              |
| --- | --------------------------------------- | --------------------------------------------------------------------------------- |
| 1   | **Search Scout** (`build_search_agent`) | Fires Tavily search, gathers raw sources and snippets                             |
| 2   | **Reader Agent** (`build_reader_agent`) | Picks top 2 URLs, triggers Cheerio scrape, aggregates clean summaries             |
| 3   | **Writer Chain** (`writer_chain`)       | Synthesizes research into a structured markdown report                            |
| 4   | **Critic Chain** (`critic_chain`)       | Reviews the report, assigns score, lists strengths/improvements, delivers verdict |

### LLM Configuration

| Setting                     | Value                                                              |
| --------------------------- | ------------------------------------------------------------------ |
| **Provider**                | OpenRouter (`https://openrouter.ai/api/v1`)                        |
| **Default Model**           | `qwen/qwen3-8b` (configurable via `MODEL` env var)                 |
| **Orchestration Framework** | LangChain JS (`@langchain/core`, `@langchain/openai`, `langchain`) |
| **Execution Pattern**       | Sequential (Scout → Reader → Writer → Critic)                      |
| **LLM Calls / Report**      | **4 total**                                                        |
| **Search Tool**             | Tavily Search — 1 query, `maxResults: 6`                           |
| **Scrape Tool**             | Cheerio — top 2 URLs only                                          |
| **Token Usage / Report**    | ~7,000 – 10,000 tokens (input + output)                            |
| **Backend Streaming**       | ❌ No — single JSON payload response                               |
| **Frontend Streaming**      | ✅ Yes — simulated word-by-word via `useAnimatedText`              |
| **Response Caching**        | ❌ None                                                            |

---

## 🛠️ Tech Stack

### Backend (`server/`)

| Layer         | Package              | Version   |
| ------------- | -------------------- | --------- |
| Runtime       | Node.js              | v18+      |
| Framework     | Express.js           | `^5.2.1`  |
| LLM SDK       | `@langchain/openai`  | `^1.4.7`  |
| LLM Core      | `@langchain/core`    | `^1.1.48` |
| LangChain     | `langchain`          | `^1.4.4`  |
| Search        | `@langchain/tavily`  | `^1.2.0`  |
| Search Core   | `@tavily/core`       | `^0.7.5`  |
| Web Scraping  | `cheerio`            | `^1.2.0`  |
| Security      | `helmet`             | `^8.2.0`  |
| Rate Limiting | `express-rate-limit` | `^8.5.2`  |
| CORS          | `cors`               | `^2.8.6`  |
| Validation    | `zod`                | `^4.4.3`  |
| Config        | `dotenv`             | `^17.4.2` |

### Frontend (`frontend/`)

| Layer      | Package                               | Version              |
| ---------- | ------------------------------------- | -------------------- |
| Framework  | React + TypeScript                    | `^19.2.6` / `~6.0.2` |
| Build Tool | Vite                                  | `^8.0.12`            |
| Styling    | Tailwind CSS                          | `^4.3.0`             |
| Animation  | `framer-motion` + `motion`            | `^12.40.0`           |
| Icons      | `lucide-react`                        | `^1.17.0`            |
| Primitives | `@radix-ui/react-*`, `@base-ui/react` | —                    |

---

## 📁 Project Structure

```bash
MultiAgent-Ai-Reasearch/
│
├── server/                              # Express backend
│   ├── src/
│   │   ├── controllers/
│   │   │   └── aiResponse.controller.js # Input validation, injection check, pipeline trigger
│   │   ├── routes/
│   │   │   └── airesponse.route.js      # POST /api/research/ai-research
│   │   ├── tools/
│   │   │   ├── webSearch.js             # Tavily search tool (maxResults: 6)
│   │   │   └── scape_web.js             # Cheerio scraper (8s timeout, noise removal)
│   │   ├── agents.js                    # LLM init + Scout/Reader agents + Writer/Critic chains
│   │   └── pipeline.js                  # Sequential pipeline: Scout → Read → Write → Critique
│   ├── app.js                           # Express app setup — CORS, Helmet, rate limiting, routing
│   ├── server.js                        # Entry point — starts server on port 8000
│   ├── .env                             # API keys and model config (not committed)
│   └── package.json
│
└── frontend/                            # React + Vite + TypeScript frontend
    ├── src/
    │   ├── components/
    │   │   ├── ui/
    │   │   │   ├── ai-input-with-loading.tsx  # AI input card with loading indicator
    │   │   │   ├── animated-text.tsx           # Word-by-word stream animation
    │   │   │   ├── button.tsx                  # Styled button variants
    │   │   │   ├── message-loading.tsx         # Pulsing loading placeholder
    │   │   │   └── textarea.tsx                # Auto-resize multi-line input
    │   │   ├── ai-research-input.tsx           # Framer Motion morphing "Ask AI" panel
    │   │   ├── CriticReportCard.jsx            # Score card — strengths, improvements, verdict
    │   │   └── ReportRenderer.jsx              # Markdown parser — titles, lists, tables
    │   ├── context/
    │   │   └── ResearchContext.jsx             # Global state — history, loading, queries
    │   ├── hooks/
    │   │   └── use-auto-resize-textarea.tsx    # Dynamic textarea height hook
    │   ├── lib/
    │   │   ├── api.js                          # Backend fetch logic
    │   │   └── utils.ts                        # CSS class merge utility
    │   ├── App.jsx                             # Main layout — landing, loading, report views
    │   ├── index.css                           # Global styles + Tailwind directives
    │   └── main.jsx                            # App entry — mounts with ResearchProvider
    ├── index.html
    ├── vite.config.ts
    └── tsconfig.json
```

---

## ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/Samarthpagaria/MultiAgent-Ai-Reasearch.git
cd MultiAgent-Ai-Reasearch
```

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside `server/` with the following:

```env
# Search
TAVILY_API_KEY=your_tavily_api_key

# LLM via OpenRouter
OPENROUTER_API_KEY=your_openrouter_api_key
BASE_URL=https://openrouter.ai/api/v1
MODEL=qwen/qwen3-8b
```

> **Tip:** The model is fully swappable — replace `qwen/qwen3-8b` with any OpenRouter-supported model ID (e.g. `openai/gpt-4o`, `anthropic/claude-3-5-sonnet`, `google/gemini-pro`).

> `OPENWEATHER_API_KEY` and `HUGGINGFACE_API_KEY` are defined in `.env` but not used by the current pipeline.

---

## 🚀 Run Locally

### Development

```bash
# Terminal 1 — Backend (http://localhost:8000)
cd server
npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend
npm run dev
```

### Production

```bash
# Build frontend
cd frontend
npm run build
npm run preview

# Start backend
cd ../server
node server.js
```

---

## 💡 Usage Examples

**Example 1 — Deep Technical Topic**

```
Input:  "Impact of quantum computing on modern cryptography"

Output: AI Critic Report Card (score ~8/10)
        ├── Strengths: detailed RSA coverage, NIST post-quantum standards
        ├── Improvements: add more implementation timelines
        └── Verdict: Well-researched, production-ready summary

        Report Sections:
        ├── Introduction: Cryptography paradigm overview
        ├── Key Findings: Shor's algorithm, lattice-based crypto, NIST standards
        ├── Conclusion: Next steps for institutional security
        └── Sources: Bulleted URL list from search results
```

**Example 2 — Comparative Analysis**

```
Input:  "Comparison between React 19 and React 18 updates"

Output: AI Critic Report Card (score ~9/10)
        ├── Strengths: structural clarity, compiler change coverage
        ├── Improvements: add code transition examples
        └── Verdict: Excellent structural breakdown

        Report Sections:
        ├── Compiler changes
        ├── Server components support
        ├── Transitions hooks deep-dive
        └── Sources
```

---

## 🌐 API Endpoints

### `POST /api/research/ai-research`

Runs the full 4-step agentic pipeline and returns a research report + critic feedback.

**Request Body**

```json
{
  "topic": "Your research topic here"
}
```

**Response — Success**

```json
{
  "status": "success",
  "message": "AI Research pipeline completed successfully",
  "data": {
    "search_results": "Raw web search snippets and source metadata...",
    "scraped_content": "Cleaned full-text extracted summaries from top 2 URLs...",
    "report": "# Full synthesized markdown report...",
    "feedback": "Score: 8/10\nStrengths:\n- ...\nAreas for Improvement:\n- ...\nVerdict: ..."
  }
}
```

**Response — Validation / Injection Blocked**

```json
{
  "error": "Invalid input",
  "message": "Security threat detected: Your request contains blocked instructions."
}
```

**Constraints**

- Max topic length: `5,000` characters
- Rate limit: `20 requests / 15 minutes` per IP
- Blocked phrases: `developer mode`, `reveal api keys`, `ignore all instructions`, and similar injection patterns

---

## 🔧 Scripts

```bash
# Backend (from /server)
npm run dev     # nodemon — hot reload development
node server.js  # production start

# Frontend (from /frontend)
npm run dev     # Vite dev server
npm run build   # Production build → dist/
npm run preview # Preview production build
```

---

## 🚢 Deployment

### Frontend → Vercel / Netlify

| Setting          | Value                                    |
| ---------------- | ---------------------------------------- |
| Build Command    | `npm run build`                          |
| Output Directory | `dist/`                                  |
| Env Variable     | `VITE_API_URL` → your Render backend URL |

### Backend → Render / Railway

| Setting       | Value                                                        |
| ------------- | ------------------------------------------------------------ |
| Start Command | `node server.js`                                             |
| Port          | `8000`                                                       |
| Env Variables | All keys from `server/.env`                                  |
| CORS Update   | Set `corsOptions.origin` in `app.js` to your frontend domain |

> Docker support is not included. A standard Node.js base image (`node:18-alpine`) can containerize either directory with a minimal Dockerfile.

---

## ⚠️ Limitations & Known Issues

- **Scrape depth** — Only the top 2 URLs are scraped per report; secondary sources may be missed
- **Fetch timeout** — Hardcoded 8-second scrape timeout; slow servers will be skipped silently
- **No streaming** — Backend returns a complete JSON payload; real-time LLM streaming is not yet implemented
- **No caching** — Every request fires all 4 LLM calls and a fresh Tavily search
- **Topic length cap** — Inputs over 5,000 characters are rejected with a `400` error
- **Search cap** — Tavily `maxResults` is fixed at 6; not user-configurable from the frontend

---

## 🗺️ Roadmap

- [ ] Server-Sent Events (SSE) for real LLM generation streaming
- [ ] Frontend model selector — switch between GPT-4o, Claude, Gemini, etc.
- [ ] Database persistence layer for research report history
- [ ] Dynamic search result limits (user-configurable Tavily `maxResults`)
- [ ] Docker support for one-command deployment

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).

---

## 👤 Contact

Built by **Samarth Pagaria**

[![GitHub](https://img.shields.io/badge/GitHub-Samarthpagaria-181717?style=flat&logo=github)](https://github.com/Samarthpagaria)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=flat&logo=linkedin)](https://linkedin.com/in/your-profile)
[![Issues](https://img.shields.io/badge/Report%20Bug-Issues-red?style=flat&logo=github)](https://github.com/Samarthpagaria/MultiAgent-Ai-Reasearch/issues)

---

<div align="center">
  <sub>MultiAgent AI Research © 2026</sub>
</div>
