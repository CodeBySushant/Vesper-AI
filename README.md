# Vesper — AI Voice Agent Platform

A premium AI voice-agent SaaS for clinics, sales, support and collections — built for Nepal and India. This repository has two parts:

```
vesper/
├── frontend/   # Next.js 15 app — the product (runs today on mock data)
└── backend/    # Backend foundation — Prisma schema, architecture, reference code
```

---

## frontend/ — the running product

A complete Next.js 15 + React 19 + TypeScript app: landing page, auth flow, and a full dashboard (overview, agents, agent builder, calls, campaigns, knowledge base, phone numbers, analytics, team, billing, API). Dark/light mode, animations, command palette (⌘K).

**It runs today with zero setup** — all data is mocked in `src/lib/data.ts`, so no database or env vars are needed to see the full product.

```bash
cd frontend
npm install
npm run dev          # http://localhost:3000
```

Deploy to Vercel: `npx vercel` (no env vars required for the mock build).

Verified: production build compiles all 17 routes cleanly.

---

## backend/ — the foundation (design + reference, not yet a running server)

This is **not a standalone server**. The backend is designed to live *inside* the Next.js app: its API routes become `frontend/src/app/api/...` and its server code imports Next.js modules. On its own it does not boot — it is the **blueprint and worked reference** for building the real API:

- `prisma/schema.prisma` — complete MySQL 8 schema (16 models, 14 enums), multi-tenant
- `prisma/seed.ts` — seeds the exact mock entities so the UI is unchanged on day one
- `docs/BACKEND_ARCHITECTURE.md` — the implementation guide: stack, endpoints, serialization contract, validation/error strategy, multi-tenancy, migration path
- `server/` — a fully worked **Agents vertical slice** (serializer + service + validation + route) to clone for every other resource
- `.env.example` — all Phase-1 env vars (database, auth, storage, Stripe)

### How to use it

Follow `docs/BACKEND_ARCHITECTURE.md`. In short: copy `prisma/` and `server/` into `frontend/`, install Prisma + zod, run migrations + seed, implement auth, then create API routes from the `server/example-routes/` pattern and swap `src/lib/data.ts` page by page. Because every endpoint returns the shapes the UI already uses, the components barely change.

> The backend is intentionally Phase 1: **no telephony, AI calling, queues, or vector DB.** The schema is built so those attach later without altering existing tables.

---

## Environment & secrets

- `frontend/.env.example` — copy to `frontend/.env` (not needed for the mock build)
- `backend/.env.example` — the full Phase-1 variable set, used once the API routes are wired into the frontend

Never commit real `.env` files — both folders' `.gitignore` exclude them.

---

## Status

| Part | State |
|---|---|
| Frontend UI | Complete, builds, deployable on mock data |
| Backend schema & architecture | Complete and documented |
| Backend implementation | Foundation + one worked slice (Agents); remaining slices to build |
| Telephony / AI calling | Not started (Phase 2, by design) |
