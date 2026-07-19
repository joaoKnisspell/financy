import type { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { builder } from "../../builder.js";
import { badRequestError, notFoundError } from "../../lib/errors.js";
import { requireAuth } from "../../lib/require-auth.js";
import { CreateTransactionInput, UpdateTransactionInput } from "./types.js";

const createTransactionSchema = z.object({
  amount: z.number().int().positive("O valor da transação deve ser positivo"),
  type: z.enum(["INCOME", "EXPENSE"]),
  date: z.date(),
  description: z.string().min(1, "A descrição da transação é obrigatória"),
  categoryId: z.string().optional().nullable(),
});

const updateTransactionSchema = z.object({
  amount: z.number().int().positive("O valor da transação deve ser positivo").optional(),
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  date: z.date().optional(),
  description: z.string().min(1, "A descrição da transação é obrigatória").optional(),
  categoryId: z.string().optional().nullable(),
});

async function assertCategoryOwnership(prisma: PrismaClient, categoryId: string, userId: string) {
  const category = await prisma.category.findFirst({ where: { id: categoryId, userId } });
  if (!category) throw badRequestError("Categoria inválida");
}

builder.mutationFields((t) => ({
  createTransaction: t.prismaField({
    type: "Transaction",
    args: { input: t.arg({ type: CreateTransactionInput, required: true }) },
    resolve: async (query, _parent, { input }, ctx) => {
      const currentUser = requireAuth(ctx);
      const parsed = createTransactionSchema.safeParse(input);
      if (!parsed.success) throw badRequestError(parsed.error.issues[0].message);

      if (parsed.data.categoryId) {
        await assertCategoryOwnership(ctx.prisma, parsed.data.categoryId, currentUser.id);
      }

      return ctx.prisma.transaction.create({
        ...query,
        data: {
          amount: parsed.data.amount,
          type: parsed.data.type,
          date: parsed.data.date,
          description: parsed.data.description,
          categoryId: parsed.data.categoryId ?? undefined,
          userId: currentUser.id,
        },
      });
    },
  }),

  updateTransaction: t.prismaField({
    type: "Transaction",
    args: {
      id: t.arg.id({ required: true }),
      input: t.arg({ type: UpdateTransactionInput, required: true }),
    },
    resolve: async (query, _parent, { id, input }, ctx) => {
      const currentUser = requireAuth(ctx);
      const parsed = updateTransactionSchema.safeParse(input);
      if (!parsed.success) throw badRequestError(parsed.error.issues[0].message);

      if (parsed.data.categoryId) {
        await assertCategoryOwnership(ctx.prisma, parsed.data.categoryId, currentUser.id);
      }

      const { count } = await ctx.prisma.transaction.updateMany({
        where: { id: String(id), userId: currentUser.id },
        data: {
          amount: parsed.data.amount,
          type: parsed.data.type,
          date: parsed.data.date,
          description: parsed.data.description,
          categoryId: parsed.data.categoryId ?? undefined,
        },
      });
      if (count === 0) throw notFoundError("Transação");

      return ctx.prisma.transaction.findUniqueOrThrow({ ...query, where: { id: String(id) } });
    },
  }),

  deleteTransaction: t.field({
    type: "Boolean",
    args: { id: t.arg.id({ required: true }) },
    resolve: async (_parent, { id }, ctx) => {
      const currentUser = requireAuth(ctx);
      const { count } = await ctx.prisma.transaction.deleteMany({
        where: { id: String(id), userId: currentUser.id },
      });
      if (count === 0) throw notFoundError("Transação");
      return true;
    },
  }),
}));
