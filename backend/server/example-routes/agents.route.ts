// app/api/v1/agents/route.ts
import { withApi, ok } from "@/server/lib/response";
import { listAgents, createAgent } from "@/server/services/agent.service";
import { serializeAgent } from "@/server/serializers/agent.serializer";
import { createAgentInput } from "@/server/lib/validation/agent";

// GET /api/v1/agents  -> Agent[] (slim), exactly the shape data.ts exports.
export const GET = withApi(async (_req, ctx) => {
  const agents = await listAgents(ctx);
  return ok(agents.map(({ row, agg }) => serializeAgent(row as any, agg)));
});

// POST /api/v1/agents -> Agent
export const POST = withApi(async (req, ctx) => {
  const body = createAgentInput.parse(await req.json()); // throws ZodError -> 422
  const { row, agg } = await createAgent(ctx, body);
  return ok(serializeAgent(row as any, agg), undefined, 201);
});
