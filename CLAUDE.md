# CLAUDE.md — Spoke

## What This Is
Screenshot-to-tool builder that lets users upload a screenshot, describe what it does, and generates a working micro-tool powered by AI.

## Tech Stack
- Next.js 16, React 19, TypeScript
- Tailwind CSS v4 (**NEVER** use custom `*` CSS reset or arbitrary bracket values like `bg-[#hex]`)
- Framer Motion for animations
- Anthropic AI SDK (`@anthropic-ai/sdk`) for AI-powered tool generation

## Key Architecture

### Routes (`src/app/`)
- `/` — Landing page
- `/login` — Authentication page
- `/dashboard` — User dashboard (saved tools)
- `/build` — Tool builder entry
- `/build/describe` — Step where user describes the screenshot
- `/build/result` — Generated tool output
- `/tools` — Public tools listing
- `/tools/[id]` — Individual tool view
- `/demo` — Demo/showcase page
- `/contact` — Contact form (Formspree)
- `/api/auth/login` — Auth API route
- `/api/extract` — Screenshot extraction API
- `/api/tools` — Tools CRUD API
- `/api/tools/[id]` — Individual tool API

### Libs (`src/lib/`)
- `ai.ts` — Anthropic AI integration and prompt logic
- `store.ts` — Client-side state management

### Components
- No dedicated `src/components/` directory; components are co-located within route directories

## Commands
```bash
npm run dev
npm run build
npm run lint
```

## Conventions
- Accent color: violet (`--color-primary`)
- Dark theme throughout
- Formspree for /contact page (needs form ID — currently placeholder `xplaceholder`)
- Multi-step build flow: upload screenshot -> describe -> result
- API routes handle auth, extraction, and tool CRUD
