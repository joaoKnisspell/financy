import type { Prisma } from "@prisma/client";
import { builder } from "../../builder.js";
import { requireAuth } from "../../lib/require-auth.js";
import { TransactionFilter } from "./types.js";

builder.queryFields((t) => ({
  transactions: t.prismaField({
    type: ["Transaction"],
    args: {
      filter: t.arg({ type: TransactionFilter, required: false }),
      skip: t.arg.int({ required: false }),
      take: t.arg.int({ required: false }),
    },
    resolve: (query, _parent, { filter, skip, take }, ctx) => {
      const currentUser = requireAuth(ctx);

      const where: Prisma.TransactionWhereInput = { userId: currentUser.id };
      if (filter?.type) where.type = filter.type;
      if (filter?.categoryId) where.categoryId = String(filter.categoryId);
      if (filter?.startDate || filter?.endDate) {
        where.date = {
          ...(filter.startDate ? { gte: filter.startDate } : {}),
          ...(filter.endDate ? { lte: filter.endDate } : {}),
        };
      }

      return ctx.prisma.transaction.findMany({
        ...query,
        where,
        orderBy: { date: "desc" },
        skip: skip ?? undefined,
        take: take ?? undefined,
      });
    },
  }),

  transaction: t.prismaField({
    type: "Transaction",
    nullable: true,
    args: { id: t.arg.id({ required: true }) },
    resolve: async (query, _parent, { id }, ctx) => {
      const currentUser = requireAuth(ctx);
      const transaction = await ctx.prisma.transaction.findFirst({
        ...query,
        where: { id: String(id), userId: currentUser.id },
      });
      return transaction;
    },
  }),
}));
