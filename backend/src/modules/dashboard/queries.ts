import { builder } from "../../builder.js";
import { requireAuth } from "../../lib/require-auth.js";
import { DashboardSummaryType } from "./types.js";

builder.queryFields((t) => ({
  dashboardSummary: t.field({
    type: DashboardSummaryType,
    resolve: async (_parent, _args, ctx) => {
      const currentUser = requireAuth(ctx);

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      const [incomeTotal, expenseTotal, incomeMonth, expenseMonth] = await Promise.all([
        ctx.prisma.transaction.aggregate({
          where: { userId: currentUser.id, type: "INCOME" },
          _sum: { amount: true },
        }),
        ctx.prisma.transaction.aggregate({
          where: { userId: currentUser.id, type: "EXPENSE" },
          _sum: { amount: true },
        }),
        ctx.prisma.transaction.aggregate({
          where: {
            userId: currentUser.id,
            type: "INCOME",
            date: { gte: monthStart, lt: monthEnd },
          },
          _sum: { amount: true },
        }),
        ctx.prisma.transaction.aggregate({
          where: {
            userId: currentUser.id,
            type: "EXPENSE",
            date: { gte: monthStart, lt: monthEnd },
          },
          _sum: { amount: true },
        }),
      ]);

      return {
        saldoTotal: (incomeTotal._sum.amount ?? 0) - (expenseTotal._sum.amount ?? 0),
        receitasDoMes: incomeMonth._sum.amount ?? 0,
        despesasDoMes: expenseMonth._sum.amount ?? 0,
      };
    },
  }),
}));
