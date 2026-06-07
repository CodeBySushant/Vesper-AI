# Vesper Backend Foundation — Phase 1

This bundle is the **backend design + reference implementation** for the Vesper
frontend. It is built so the existing UI swaps from mock data to real APIs with
minimal refactoring: every endpoint returns the exact shapes in `src/lib/data.ts`.

## What's here

```
prisma/
  schema.prisma          # Complete MySQL 8 schema — 16 models, 14 enums (run migrate against this)
  seed.ts                # Seeds the exact mock entities so the UI is unchanged on day one
docs/
  BACKEND_ARCHITECTURE.md# The implementation reference: stack rationale, folder layout,
                         # multi-tenancy, auth, full endpoint map, serialization
                         # contract, validation + error strategy, uploads, billing,
                         # and the mock→live migration path
.env.example            # Phase-1 env vars (no telephony/AI keys)
server/
  lib/
    prisma.ts            # client singleton
    errors.ts            # AppError + factories
    response.ts          # ok()/fail() envelope + withApi() wrapper (maps all error types)
    format.ts            # ★ the single source of display strings (audit resolution)
    validation/agent.ts  # zod input schemas (pattern)
  serializers/
    agent.serializer.ts  # ★ DB row -> exact frontend Agent shape (pattern)
  services/
    agent.service.ts     # ★ org-scoped logic + computed aggregates (pattern)
  example-routes/
    agents.route.ts      # ★ the copyable route pattern -> goes to app/api/v1/agents/route.ts
```

★ = the worked **Agents vertical slice**. Clone this exact pattern
(serializer + service + validation + route) for calls, campaigns, documents,
knowledge, billing, api-keys.

## Verified in this build

- Schema: 16 models, 14 enums, balanced, no unknown types, 25 relations resolve.
- Formatters: 16/16 cases reproduce the exact strings in `data.ts`
  (durations, bytes, money, initials, enum labels). The contract is tested, not assumed.
- `format.ts` + `agent.serializer.ts` type-check clean under `--strict`.

> Prisma `validate`/`migrate` and a full `tsc` across the Prisma/Next-typed files
> couldn't run in the build sandbox (engine binary + packages are network-blocked).
> Run `npx prisma validate` and `tsc` locally — the schema is structurally checked
> and the worked files are written against documented APIs.

## How to stand it up (local)

```bash
# inside the existing Next.js app
npm i -D prisma && npm i @prisma/client zod
# copy prisma/ and server/ in, set DATABASE_URL in .env
npx prisma migrate dev --name init
npx prisma db seed
# add Clerk (or Auth.js), implement server/lib/auth.ts resolveContext(), then
# create app/api/v1/agents/route.ts from server/example-routes/agents.route.ts
```

Then follow `docs/BACKEND_ARCHITECTURE.md` §13 to swap `src/lib/data.ts` page by page.

## Explicitly out of scope (Phase 2+)

Telephony (Twilio/Exotel/Plivo/SIP), AI orchestration (Vapi/Retell), TTS/STT
(ElevenLabs/Deepgram), Redis, BullMQ/queues, vector DB, Kubernetes, analytics
pipelines. The schema is designed so these attach later without altering existing tables.
