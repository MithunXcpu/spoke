# Spoke ⚡

**Screenshot it. Describe it. Ship it.**

Build internal tools in 60 seconds. Stop paying for SaaS tools you don't need - paste a screenshot of your data, tell us what you want, and get a working tool instantly.

## Features

- **Screenshot data extraction** - Paste screenshots from spreadsheets, CRMs, or any data source
- **Natural language input** - Describe what you need in plain English
- **Instant tool generation** - Get trackers, dashboards, or checklists
- **Export options** - JSON, CSV, or shareable links

## How It Works

1. **Screenshot** - Paste a screenshot of your spreadsheet, CRM, or any data source
2. **Describe** - Tell us what you need: "I want a dashboard with renewal alerts"
3. **Ship** - Get a working tool in seconds, ready to use

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **AI**: Vision models for screenshot extraction
- **Styling**: Tailwind CSS with dark theme
- **Fonts**: Geist (optimized via next/font)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start building tools.

## Project Structure

```
src/
├── app/           # Next.js app router pages
│   ├── build/     # Tool builder interface
│   ├── demo/      # Demo showcase
│   └── dashboard/ # User dashboard
├── components/    # Reusable UI components
└── lib/           # Utilities and AI integration
```

## Deployment

Deployed on Vercel at [spoke-pi.vercel.app](https://spoke-pi.vercel.app)
