// server/serializers/agent.serializer.ts
import { formatDuration, lower, relativeTime } from "../lib/format";

// The aggregates are computed by the service (COUNT/AVG over calls), passed in here.
type AgentRow = {
  id: string; name: string; description: string; voice: string; language: string;
  status: string; updatedAt: Date;
  prompt: string; speakingSpeed: number; behaviorRules: unknown; businessHours: unknown;
};
type AgentAgg = { callCount: number; successRate: number; avgSeconds: number };

/** Slim shape — matches src/lib/data.ts `Agent` exactly (the list/cards view). */
export function serializeAgent(row: AgentRow, agg: AgentAgg) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    voice: row.voice,
    language: row.language,
    status: lower(row.status),                 // "LIVE" -> "live"
    calls: agg.callCount,
    successRate: agg.successRate,
    avgDuration: formatDuration(agg.avgSeconds),
    updated: relativeTime(row.updatedAt),
  };
}

/** Detail shape — adds the builder-only fields used on /agents/builder. */
export function serializeAgentDetail(row: AgentRow, agg: AgentAgg) {
  return {
    ...serializeAgent(row, agg),
    prompt: row.prompt,
    speakingSpeed: row.speakingSpeed,
    behaviorRules: row.behaviorRules ?? [],
    businessHours: row.businessHours ?? null,
  };
}
