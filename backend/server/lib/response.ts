// server/lib/response.ts
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "./errors";

export function ok<T>(data: T, meta?: Record<string, unknown>, status = 200) {
  return NextResponse.json(meta ? { data, meta } : { data }, { status });
}

export function fail(code: string, status: number, message: string, details?: unknown) {
  return NextResponse.json({ error: { code, message, details } }, { status });
}

type Ctx = { orgId: string; userId: string; role: string };
type Handler = (req: Request, ctx: Ctx, params: Record<string, string>) => Promise<Response>;

/**
 * Wraps a route handler: resolves auth context, runs the handler, and converts
 * every known error type into the standard envelope. Logic never lives here —
 * only the cross-cutting concerns do.
 */
export function withApi(handler: Handler, opts?: { auth?: boolean }) {
  return async (req: Request, route: { params: Promise<Record<string, string>> }) => {
    try {
      const params = await route.params;
      // resolveContext() reads the session (Clerk/Auth.js) and the active org.
      // Throws Unauthorized if no session. Implemented in server/lib/auth.ts.
      const ctx = await resolveContext(req, opts?.auth !== false);
      return await handler(req, ctx, params);
    } catch (err) {
      return mapError(err);
    }
  };
}

function mapError(err: unknown): Response {
  if (err instanceof AppError) {
    return fail(err.code, err.status, err.message, err.details);
  }
  if (err instanceof ZodError) {
    const details = err.issues.map((i) => ({ path: i.path.join("."), message: i.message }));
    return fail("VALIDATION_ERROR", 422, "Invalid input", details);
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") return fail("NOT_FOUND", 404, "Resource not found");
    if (err.code === "P2002") return fail("CONFLICT", 409, "A record with this value already exists");
  }
  // Unknown — log server-side, return generic. (Wire to your logger.)
  console.error("[api] unhandled", err);
  return fail("INTERNAL", 500, "Something went wrong");
}

// Placeholder import target — real impl in server/lib/auth.ts.
declare function resolveContext(req: Request, required: boolean): Promise<Ctx>;
