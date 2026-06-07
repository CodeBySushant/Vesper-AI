// server/services/agent.service.ts
import { prisma } from "../lib/prisma";
import { NotFound } from "../lib/errors";

type Ctx = { orgId: string; userId: string; role: string };

// Outcomes that count as a "success" for the rate metric.
const SUCCESS_OUTCOMES = ["BOOKED", "QUALIFIED", "RESOLVED"] as const;

/**
 * Computes the derived metrics the UI shows (calls, successRate, avgDuration)
 * for a set of agents in ONE pass — never stored as columns, always fresh.
 */
async function aggregatesFor(orgId: string, agentIds: string[]) {
  if (agentIds.length === 0) return new Map();
  const grouped = await prisma.call.groupBy({
    by: ["agentId"],
    where: { organizationId: orgId, agentId: { in: agentIds } },
    _count: { _all: true },
    _avg: { durationSeconds: true },
  });
  const success = await prisma.call.groupBy({
    by: ["agentId"],
    where: { organizationId: orgId, agentId: { in: agentIds }, outcome: { in: [...SUCCESS_OUTCOMES] as any } },
    _count: { _all: true },
  });
  const successMap = new Map(success.map((s) => [s.agentId, s._count._all]));
  const out = new Map<string, { callCount: number; successRate: number; avgSeconds: number }>();
  for (const g of grouped) {
    const total = g._count._all;
    const succ = successMap.get(g.agentId) ?? 0;
    out.set(g.agentId, {
      callCount: total,
      successRate: total ? Math.round((succ / total) * 100) : 0,
      avgSeconds: Math.round(g._avg.durationSeconds ?? 0),
    });
  }
  // Agents with zero calls won't appear in groupBy — fill defaults.
  for (const id of agentIds) if (!out.has(id)) out.set(id, { callCount: 0, successRate: 0, avgSeconds: 0 });
  return out;
}

export async function listAgents(ctx: Ctx) {
  const rows = await prisma.agent.findMany({
    where: { organizationId: ctx.orgId },           // tenant scope — required
    orderBy: { updatedAt: "desc" },
  });
  const agg = await aggregatesFor(ctx.orgId, rows.map((r) => r.id));
  return rows.map((r) => ({ row: r, agg: agg.get(r.id)! }));
}

export async function getAgent(ctx: Ctx, id: string) {
  const row = await prisma.agent.findFirst({
    where: { id, organizationId: ctx.orgId },        // scope guards cross-tenant reads
  });
  if (!row) throw NotFound("Agent");
  const agg = await aggregatesFor(ctx.orgId, [id]);
  return { row, agg: agg.get(id)! };
}

export async function createAgent(ctx: Ctx, input: {
  name: string; description: string; voice: string; language: string;
  prompt: string; speakingSpeed: number; behaviorRules?: string[]; businessHours?: unknown;
}) {
  const row = await prisma.agent.create({
    data: {
      organizationId: ctx.orgId,
      name: input.name,
      description: input.description,
      voice: input.voice,
      language: input.language,
      prompt: input.prompt,
      speakingSpeed: input.speakingSpeed,
      behaviorRules: input.behaviorRules ?? undefined,
      businessHours: (input.businessHours as any) ?? undefined,
      status: "DRAFT",
    },
  });
  return { row, agg: { callCount: 0, successRate: 0, avgSeconds: 0 } };
}

export async function updateAgent(ctx: Ctx, id: string, input: Record<string, unknown>) {
  // Ensure the agent belongs to the caller's org before updating.
  await getAgent(ctx, id);
  const row = await prisma.agent.update({ where: { id }, data: input });
  const agg = await aggregatesFor(ctx.orgId, [id]);
  return { row, agg: agg.get(id)! };
}

export async function publishAgent(ctx: Ctx, id: string) {
  await getAgent(ctx, id);
  const row = await prisma.agent.update({ where: { id }, data: { status: "LIVE" } });
  await prisma.auditLog.create({
    data: { organizationId: ctx.orgId, userId: ctx.userId, action: "agent.published",
            entityType: "Agent", entityId: id, summary: `published agent "${row.name}"` },
  });
  const agg = await aggregatesFor(ctx.orgId, [id]);
  return { row, agg: agg.get(id)! };
}

export async function deleteAgent(ctx: Ctx, id: string) {
  await getAgent(ctx, id);
  await prisma.agent.delete({ where: { id } });
  return { id };
}
