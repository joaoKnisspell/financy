import { z } from "zod";
import { builder } from "../../builder.js";
import { comparePassword, hashPassword, signToken } from "../../lib/auth.js";
import { badRequestError, conflictError, unauthenticatedError } from "../../lib/errors.js";
import { requireAuth } from "../../lib/require-auth.js";
import { AuthPayload, SignInInput, SignUpInput, UpdateUserInput } from "./types.js";

const signUpSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
});

const signInSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

const updateUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
});

builder.mutationFields((t) => ({
  signUp: t.field({
    type: AuthPayload,
    args: { input: t.arg({ type: SignUpInput, required: true }) },
    resolve: async (_parent, { input }, ctx) => {
      const parsed = signUpSchema.safeParse(input);
      if (!parsed.success) throw badRequestError(parsed.error.issues[0].message);

      const existing = await ctx.prisma.user.findUnique({ where: { email: parsed.data.email } });
      if (existing) throw conflictError("E-mail já cadastrado");

      const passwordHash = await hashPassword(parsed.data.password);
      const user = await ctx.prisma.user.create({
        data: { name: parsed.data.name, email: parsed.data.email, passwordHash },
      });

      return { token: signToken(user.id), userId: user.id };
    },
  }),

  signIn: t.field({
    type: AuthPayload,
    args: { input: t.arg({ type: SignInInput, required: true }) },
    resolve: async (_parent, { input }, ctx) => {
      const parsed = signInSchema.safeParse(input);
      if (!parsed.success) throw badRequestError(parsed.error.issues[0].message);

      const user = await ctx.prisma.user.findUnique({ where: { email: parsed.data.email } });
      if (!user) throw unauthenticatedError();

      const valid = await comparePassword(parsed.data.password, user.passwordHash);
      if (!valid) throw unauthenticatedError();

      return { token: signToken(user.id), userId: user.id };
    },
  }),

  updateUser: t.prismaField({
    type: "User",
    args: { input: t.arg({ type: UpdateUserInput, required: true }) },
    resolve: async (query, _parent, { input }, ctx) => {
      const currentUser = requireAuth(ctx);
      const parsed = updateUserSchema.safeParse(input);
      if (!parsed.success) throw badRequestError(parsed.error.issues[0].message);

      return ctx.prisma.user.update({
        ...query,
        where: { id: currentUser.id },
        data: { name: parsed.data.name },
      });
    },
  }),
}));

builder.queryFields((t) => ({
  me: t.prismaField({
    type: "User",
    resolve: (query, _parent, _args, ctx) => {
      const currentUser = requireAuth(ctx);
      return ctx.prisma.user.findUniqueOrThrow({ ...query, where: { id: currentUser.id } });
    },
  }),
}));
