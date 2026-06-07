// server/lib/errors.ts
export type FieldError = { path: string; message: string };

export class AppError extends Error {
  constructor(
    public code: string,
    public status: number,
    message: string,
    public details?: FieldError[],
  ) {
    super(message);
    this.name = "AppError";
  }
}

// Common factories
export const NotFound = (what = "Resource") =>
  new AppError(`${what.toUpperCase()}_NOT_FOUND`, 404, `${what} not found`);
export const Forbidden = (msg = "You don't have access to this") =>
  new AppError("FORBIDDEN", 403, msg);
export const Unauthorized = (msg = "Sign in required") =>
  new AppError("UNAUTHORIZED", 401, msg);
export const Conflict = (msg = "Already exists") =>
  new AppError("CONFLICT", 409, msg);
