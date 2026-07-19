import type { ExpressContextFunctionArgument } from "@as-integrations/express5";
import { prisma } from "./lib/prisma.js";
import { verifyToken } from "./lib/auth.js";

export type CurrentUser = {
  id: string;
};

export type Context = {
  prisma: typeof prisma;
  currentUser: CurrentUser | null;
};

export async function createContext({ req }: ExpressContextFunctionArgument): Promise<Context> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const payload = token ? verifyToken(token) : null;

  return {
    prisma,
    currentUser: payload ? { id: payload.sub } : null,
  };
}
