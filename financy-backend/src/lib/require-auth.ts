import type { Context } from "../context.js";
import { unauthenticatedError } from "./errors.js";

export function requireAuth(ctx: Context) {
  if (!ctx.currentUser) throw unauthenticatedError();
  return ctx.currentUser;
}
