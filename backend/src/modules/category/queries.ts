import { builder } from "../../builder.js";
import { requireAuth } from "../../lib/require-auth.js";
import { CategoriesOverviewType, type CategorySummaryShape } from "./types.js";

builder.queryFields((t) => ({
  categories: t.prismaField({
    type: ["Category"],
    resolve: (query, _parent, _args, ctx) => {
      const currentUser = requireAuth(ctx);
      return ctx.prisma.category.findMany({
        ...query,
        where: { userId: currentUser.id },
        orderBy: { name: "asc" },
      });
    },
  }),

  categoriesOverview: t.field({
    type: CategoriesOverviewType,
    resolve: async (_parent, _args, ctx) => {
      const currentUser = requireAuth(ctx);

      const [categories, totalTransactions, grouped] = await Promise.all([
        ctx.prisma.category.findMany({ where: { userId: currentUser.id } }),
        ctx.prisma.transaction.count({ where: { userId: currentUser.id } }),
        ctx.prisma.transaction.groupBy({
          by: ["categoryId"],
          where: { userId: currentUser.id, categoryId: { not: null } },
          _sum: { amount: true },
          _count: { _all: true },
        }),
      ]);

      const categoriesById = new Map(categories.map((category) => [category.id, category]));

      const summaries: CategorySummaryShape[] = [];
      let mostUsedCategory: (typeof categories)[number] | null = null;
      let topCount = 0;

      for (const group of grouped) {
        const category = group.categoryId ? categoriesById.get(group.categoryId) : undefined;
        if (!category) continue;

        const itemCount = group._count._all;
        summaries.push({ category, itemCount, total: group._sum.amount ?? 0 });

        if (itemCount > topCount) {
          topCount = itemCount;
          mostUsedCategory = category;
        }
      }

      return {
        totalCategories: categories.length,
        totalTransactions,
        mostUsedCategory,
        summaries,
      };
    },
  }),
}));
