# Vesper — AI Voice Agent SaaS (Frontend)

A premium, production-grade **frontend** for an AI voice-agent platform, built to feel like a funded startup product. Fully responsive, dark/light mode, animated, and deployable on Vercel in minutes.

> This is the **UI + UX layer only**. There is no telephony, AI calling engine, Redis, queues, or backend database. All data is mocked in `src/lib/data.ts` so the product is fully clickable and demo-ready. Swap the mock imports for real API calls when you build the backend.

## Tech stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** (custom design tokens, no template look)
- **Framer Motion** (page transitions, micro-interactions)
- **Recharts** (analytics)
- **lucide-react** (icons)

Fonts: **Fraunces** (display) + **Inter** (body) + **JetBrains Mono** (code).

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

## Deploy to Vercel

```bash
npm i -g vercel
vercel            # follow prompts — zero config needed
```

Or push to GitHub and import the repo at vercel.com. No environment variables required (everything is mock data).

## Routes

| Route | What it is |
|---|---|
| `/` | Marketing landing page (hero, demo, pricing, FAQ) |
| `/auth` | Sign in / sign up flow |
| `/dashboard` | Overview — KPIs, charts, activity |
| `/dashboard/agents` | Agent list |
| `/dashboard/agents/builder` | **Agent Builder** (3-panel, live chat preview) |
| `/dashboard/calls` | Call log + transcript drawer |
| `/dashboard/campaigns` | Outbound campaigns |
| `/dashboard/knowledge` | Knowledge base / uploads |
| `/dashboard/numbers` | Phone numbers |
| `/dashboard/analytics` | Charts, funnel, language split |
| `/dashboard/team` | Team & roles |
| `/dashboard/billing` | Plan, usage, invoices |
| `/dashboard/settings` | Org / branding / security |
| `/dashboard/api` | API keys, webhooks, logs |

Press **⌘K / Ctrl+K** anywhere in the dashboard for the command palette.

## Project structure

```
src/
  app/
    layout.tsx            # fonts, theme provider
    globals.css           # design tokens (light + dark)
    page.tsx              # landing page
    auth/page.tsx         # auth flow
    dashboard/
      layout.tsx          # sidebar + topbar shell
      page.tsx            # overview
      agents/ ...         # list + builder
      calls/ campaigns/ knowledge/ numbers/
      analytics/ team/ billing/ settings/ api/
  components/
    ui.tsx                # Button, Badge, Card, Logo, ThemeToggle
    theme-provider.tsx    # dark/light
    marketing-nav.tsx
    call-card.tsx         # animated live-call demo
    command-palette.tsx   # ⌘K search
    page-bits.tsx         # PageHeader, Stagger, EmptyState
  lib/
    cn.ts                 # className helper
    data.ts               # ALL mock data — swap for real APIs here
```

## Connecting a real backend later

Every page imports from `src/lib/data.ts`. To go live:

1. Replace those imports with fetches to your API (e.g. React Query).
2. Keep the component props identical — the UI won't need to change.
3. Add auth (Clerk/Auth.js) by wrapping `/dashboard` and the `/auth` page.

## Design system

Tokens live as CSS variables in `globals.css` and are exposed to Tailwind in `tailwind.config.ts`. Change the `--accent` variable to re-skin the whole product.

## Notes

- This is a demo: phone numbers, transcripts, and metrics are illustrative.
- No real calls are placed anywhere in the app.
