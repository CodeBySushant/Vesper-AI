// server/lib/validation/agent.ts
import { z } from "zod";

export const createAgentInput = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(2000).default(""),
  voice: z.string().min(1),
  language: z.string().min(1),
  prompt: z.string().max(20000).default(""),
  speakingSpeed: z.number().min(0.5).max(1.5).default(1),
  behaviorRules: z.array(z.string().max(500)).max(50).optional(),
  businessHours: z
    .record(z.object({ open: z.string(), close: z.string() }))
    .nullable()
    .optional(),
});

export const updateAgentInput = createAgentInput.partial();

export type CreateAgentInput = z.infer<typeof createAgentInput>;
