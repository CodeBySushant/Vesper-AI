# Vesper Backend — Architecture (Phase 1 Foundation)

> Scope: a clean, multi-tenant SaaS backend that the existing Next.js frontend can
> talk to with **minimal refactoring**. No telephony, AI orchestration, queues,
> Redis, or vector DB. Those attach in later phases without reworking these tables.

---

## 1. Stack decision: Next.js API Routes, not NestJS

**Use Next.js Route Handlers (App Router, `app/api/**/route.ts`) for Phase 1.** Reasons:

- The frontend is already Next.js on Vercel. One repo, one deploy, one language, shared types between client and server. Zero extra infra.
- Your data contracts are CRUD over ~12 tables. That does not need NestJS's modules/providers/DI ceremony yet.
- Cost: stays on the Vercel free/pro tier. NestJS wants a long-running Node host (another bill).

**When to revisit NestJS:** when the AI-calling layer arrives — long-running call sessions, websockets, queue workers, provider webhooks. That work wants a persistent server and benefits from NestJS structure. Plan: keep business logic in a framework-agnostic `services/` layer now, so moving the HTTP shell later is cheap. **Do not put logic in route handlers.**

---

## 2. Folder structure

Backend lives inside the existing Next.js app (single repo):

```
src/
  app/
    api/
      v1/
        auth/            # session bootstrap, current user+org
        organizations/   # GET/PATCH org, members
        agents/          # CRUD + publish
        campaigns/       # CRUD + contacts import
        knowledge/       # KB CRUD
        documents/       # upload (presign) + list + delete
        calls/           # list + detail (transcript)
        billing/         # subscription, invoices, usage, stripe webhook
        api-keys/        # create/list/revoke
  server/                # framework-agnostic — survives a NestJS move
    services/            # business logic, one file per domain
      agent.service.ts
      call.service.ts
      campaign.service.ts
      document.service.ts
      billing.service.ts
      organization.service.ts
      apikey.service.ts
    serializers/         # DB row -> exact frontend shape (the contract layer)
      agent.serializer.ts
      call.serializer.ts
      ...
    lib/
      prisma.ts          # singleton client
      auth.ts            # getSession, requireOrg, requireRole
      errors.ts          # AppError + codes
      response.ts        # ok() / fail() envelope helpers
      validation/        # zod schemas per endpoint
      format.ts          # duration, bytes, money, relative-time formatters
      storage.ts         # R2/S3 presign
      stripe.ts          # stripe client
  lib/
    data.ts              # <- existing mock file; becomes thin API-client wrappers
prisma/
  schema.prisma
  seed.ts                # seeds the exact mock rows so UI looks identical on day 1
```

The **serializers** are the heart of "minimal frontend refactor": they turn DB rows into the precise JSON the components already expect.

---

## 3. Multi-tenancy

**Model:** shared database, shared schema, `organizationId` on every tenant row (already in the schema). This is the cheapest model and fine to low-thousands of tenants.

**Enforcement (critical):** MySQL has no row-level security, so isolation is the *application's* job.

1. Every request resolves the caller's `organizationId` from session (see Auth).
2. Every Prisma query **must** include `where: { organizationId }`. No exceptions.
3. Centralize this: services take `ctx: { orgId, userId, role }` as the first arg and apply the scope, so individual handlers can't forget.

```ts
// server/services/agent.service.ts
export async function listAgents(ctx: Ctx) {
  return prisma.agent.findMany({
    where: { organizationId: ctx.orgId },     // scope is non-negotiable
    orderBy: { updatedAt: "desc" },
  });
}
```

A lint rule / code-review checklist item: "no `prisma.*.findMany|findFirst|update|delete` without an org scope." Later this can be hardened with a Prisma extension that injects the filter automatically.

---

## 4. Auth (Clerk or Auth.js)

Either works; the schema only needs `User.authId` (the external subject id).

- **Recommendation: Clerk** for speed — hosted sign-in/up (your `/auth` page can swap to Clerk components), orgs/roles built in, generous free tier. Auth.js is the choice if you want zero vendor lock-in and own the tables.
- Flow: on first authenticated request, upsert a `User` by `authId`; if they have no `Member` row, create an `Organization` + `Member(OWNER)` (onboarding). Cache `{ userId, orgId, role }` per request.
- **RBAC:** `requireRole(ctx, [OWNER, ADMIN])` guards mutating routes. Mapping:
  - OWNER: everything incl. billing + delete org
  - ADMIN: manage agents, campaigns, team (not billing/delete org)
  - MANAGER: run campaigns, view all
  - VIEWER: read-only

---

## 5. API design & the response envelope

**Base path:** `/api/v1`. Versioned from day one.

**Envelope:** every response is one of:

```jsonc
// success
{ "data": <payload>, "meta": { /* pagination, optional */ } }
// error
{ "error": { "code": "AGENT_NOT_FOUND", "message": "…", "details": [ /* field errors */ ] } }
```

The current frontend reads bare arrays/objects, so serializers return exactly the
shapes below and the client unwraps `.data`. This is the only client change needed
for most pages: `fetch(...).then(r => r.json()).then(j => j.data)`.

### Endpoint map (Phase 1)

| Method | Path | Returns (shape) | Notes |
|---|---|---|---|
| GET | `/auth/me` | `{ user, org, role }` | bootstrap |
| GET | `/organizations/current` | org + settings | |
| PATCH | `/organizations/current` | org | name, settings (ADMIN+) |
| GET | `/organizations/current/members` | `team[]` shape | |
| POST | `/organizations/current/members` | member | invite (ADMIN+) |
| GET | `/agents` | `Agent[]` (slim) | list shape below |
| POST | `/agents` | `Agent` | |
| GET | `/agents/:id` | `AgentDetail` (full) | builder shape |
| PATCH | `/agents/:id` | `AgentDetail` | |
| POST | `/agents/:id/publish` | `Agent` | status -> LIVE |
| DELETE | `/agents/:id` | `{ id }` | |
| GET | `/campaigns` | `Campaign[]` | derived counts |
| POST | `/campaigns` | `Campaign` | |
| PATCH | `/campaigns/:id` | `Campaign` | |
| POST | `/campaigns/:id/contacts` | `{ imported }` | CSV rows |
| GET | `/knowledge` | `KnowledgeBase[]` | |
| POST | `/knowledge` | `KnowledgeBase` | |
| GET | `/documents` | `Doc[]` | |
| POST | `/documents/presign` | `{ url, storageKey }` | direct-to-R2 upload |
| POST | `/documents` | `Doc` | confirm after upload |
| DELETE | `/documents/:id` | `{ id }` | |
| GET | `/calls` | `Call[]` | filters: outcome, q, agentId |
| GET | `/calls/:id` | `CallDetail` + `transcript[]` | |
| GET | `/phone-numbers` | `phoneNumbers[]` | |
| GET | `/billing/subscription` | subscription + plan | |
| GET | `/billing/invoices` | `invoices[]` | |
| GET | `/billing/usage` | `{ aiMinutesUsed, ... }` | powers usage bars |
| POST | `/billing/checkout` | `{ url }` | Stripe Checkout |
| POST | `/billing/webhook` | `200` | Stripe events (raw body) |
| GET | `/api-keys` | keys (masked) | |
| POST | `/api-keys` | `{ key }` **once** | raw key shown once |
| DELETE | `/api-keys/:id` | `{ id }` | revoke |
| GET | `/analytics/overview` | `kpis[]`, `callVolume[]`, `activity[]` | computed |
| GET | `/analytics/breakdown` | `outcomeFunnel[]`, `langSplit[]` | computed |

---

## 6. The serialization contract (DB → exact frontend shape)

This is where the audit findings get resolved. Each serializer maps raw columns to
the display shape the components already render.

### Agent (list) — matches `data.ts` `Agent`
```ts
// raw: Agent row + computed aggregates
{
  id, name, description, voice, language,
  status: row.status.toLowerCase(),                 // "LIVE" -> "live"
  calls: agg.callCount,                              // COUNT(calls) — computed
  successRate: agg.successRate,                      // computed %
  avgDuration: formatDuration(agg.avgSeconds),       // 108 -> "1m 48s"
  updated: relativeTime(row.updatedAt),              // -> "2h ago"
}
```

### Agent (detail) — adds builder fields
```ts
{ ...slim, prompt, speakingSpeed, behaviorRules, businessHours }
```

### Call (list) — matches `data.ts` `Call`
```ts
{
  id,
  caller: maskNumber(row.customerNumber),            // "+91 99•• 88210"
  agent: row.agent.name.split(" — ")[0],             // "Rohan"
  agentId: row.agentId,                              // NEW: for navigation
  duration: formatDuration(row.durationSeconds),     // "2m 41s"
  outcome: titleCase(row.outcome),                   // "QUALIFIED" -> "Qualified"
  sentiment: row.sentiment.toLowerCase(),
  date: callDateLabel(row.startedAt),                // "Today, 13:58"
}
```

### Call (detail) — adds transcript matching `data.ts` `transcript`
```ts
transcript: messages.map(m => ({
  who: m.speaker,                                    // "agent" | "caller"
  t: msToClock(m.offsetMs),                          // "0:06"
  text: m.text,
}))
```

### Campaign — matches `data.ts` `Campaign`, counts DERIVED
```ts
{
  id, name,
  agent: row.agent.name.split(" — ")[0],
  status: row.status.toLowerCase(),
  contacts: agg.total,                               // COUNT(contacts)
  reached: agg.reached,                              // COUNT(status in reached set)
  progress: agg.total ? Math.round(agg.reached/agg.total*100) : 0,
  created: shortDate(row.createdAt),                 // "Oct 2"
}
```

### Document — matches `data.ts` `Doc`
```ts
{
  id, name: row.filename,
  type: row.type,                                    // "PDF"
  size: formatBytes(row.sizeBytes),                  // "1.2 MB"
  status: row.status.toLowerCase(),
  chunks: row.chunkCount,
}
```

### Team member — matches `data.ts` `team`
```ts
{
  id, name: user.name, email: user.email,
  role: titleCase(member.role),                      // "Owner"
  initials: initialsOf(user.name),                   // derived "SS"
  color: colorFor(user.id),                          // derived, stable
}
```

### Invoice — matches `data.ts` `invoices`
```ts
{
  id, number: row.number,
  date: longDate(row.issuedAt),                      // "Oct 1, 2026"
  amount: formatMoney(row.amountMinor, row.currency),// 1420000 -> "₹14,200"
  status: titleCase(row.status),                     // "Paid"
}
```

Formatters live in `server/lib/format.ts` and are the **only** place display strings
are produced. Keep them pure and unit-tested.

---

## 7. Validation strategy

**Zod at the edge.** Every route parses input with a zod schema before touching a
service. One schema file per resource under `server/lib/validation/`.

```ts
export const createAgentInput = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(2000).default(""),
  voice: z.string().min(1),
  language: z.string().min(1),
  prompt: z.string().max(20000).default(""),
  speakingSpeed: z.number().min(0.5).max(1.5).default(1),
  behaviorRules: z.array(z.string()).optional(),
  businessHours: z.record(z.object({ open: z.string(), close: z.string() })).nullable().optional(),
});
```

Parse failures become a `VALIDATION_ERROR` with `details: [{ path, message }]` so the
UI can show field-level errors. Shared zod types can also be imported client-side for
form validation — one source of truth.

---

## 8. Error handling strategy

- One `AppError(code, httpStatus, message, details?)` class. Services throw it.
- A single `withApi(handler)` wrapper around each route catches errors and maps:
  - `AppError` → its status + envelope
  - `ZodError` → 422 `VALIDATION_ERROR`
  - Prisma `P2025` (not found) → 404, `P2002` (unique) → 409
  - anything else → 500 `INTERNAL`, logged with a request id, generic message to client
- Never leak Prisma/stack details to the client. Log them server-side with context.
- Stable error `code`s (SCREAMING_SNAKE) so the frontend can branch without parsing prose.

```ts
export const GET = withApi(async (req, ctx) => {
  const agents = await agentService.list(ctx);
  return ok(agents.map(serializeAgent));
});
```

---

## 9. File uploads (Cloudflare R2)

R2 (S3-compatible, no egress fees — good for India/Nepal cost profile).

Flow, no file ever passes through the API server:
1. Client calls `POST /documents/presign` with `{ filename, type, sizeBytes }`.
2. Server validates size/type/plan-limits, generates `storageKey =
   org/{orgId}/kb/{cuid}/{filename}`, returns a presigned PUT url.
3. Client uploads directly to R2.
4. Client calls `POST /documents` to persist the row (`status: PROCESSING`).
   (Actual indexing is a later phase; for now it can flip to `INDEXED` immediately or
   via a simple deferred job.)

Env: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`,
`R2_PUBLIC_BASE_URL`. Use `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner`.

---

## 10. Billing (Stripe)

- Products/Prices for STARTER / GROWTH (ENTERPRISE = "contact sales", no self-serve price).
- `POST /billing/checkout` → Stripe Checkout Session → returns `url`.
- `POST /billing/webhook` (raw body, signature-verified) handles:
  `checkout.session.completed`, `customer.subscription.updated|deleted`,
  `invoice.paid|payment_failed` → upsert `Subscription` / insert `Invoice`.
- Usage bars read `UsageCounter` for the current `YYYY-MM`.
- **Money is always minor units (paise) in the DB.** Formatting to "₹14,200" happens
  only in the serializer. This avoids float rounding and matches Stripe's model.

---

## 11. Seeding (why the UI looks identical on day one)

`prisma/seed.ts` inserts exactly the mock entities (Aastha, Rohan, Priya, etc.), one
org ("Sunaulo" / Vesper), the 4 team members, sample calls with transcript turns, the
4 campaigns, 4 documents, 4 phone numbers, 3 invoices. Because the serializers emit
the same shapes, the dashboard renders the same content it shows today — except now
it's real rows you can edit, and edits persist.

---

## 12. Environment variables

See `.env.example`. Phase-1 required: `DATABASE_URL`, the auth provider keys, the four
`R2_*` values, and the `STRIPE_*` values. Everything telephony/AI is intentionally absent.

---

## 13. Migration path from mock to live (per-page, low-risk)

1. Stand up DB + run `prisma migrate dev` + `prisma db seed`.
2. Replace `src/lib/data.ts` exports one at a time with async fetchers hitting the API.
   Start read-only: Agents list, Calls, Campaigns. Verify UI unchanged.
3. Wire mutations: agent create/edit/publish, document upload, campaign create.
4. Add Clerk to `/auth` and guard `/dashboard`.
5. Turn on Stripe Checkout from the billing page.
6. Only then begin Phase 2 (telephony/AI) against the same schema.

Because every endpoint returns the established shapes, the components themselves barely
change — the work is swapping the data source, not redesigning the UI.
