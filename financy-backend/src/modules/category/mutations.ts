import { z } from "zod";
import { builder } from "../../builder.js";
import { badRequestError, conflictError, notFoundError } from "../../lib/errors.js";
import { requireAuth } from "../../lib/require-auth.js";
import { CreateCategoryInput, UpdateCategoryInput } from "./types.js";

const createCategorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
});

const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
});

builder.mutationFields((t) => ({
  createCategory: t.prismaField({
    type: "Category",
    args: { input: t.arg({ type: CreateCategoryInput, required: true }) },
    resolve: async (query, _parent, { input }, ctx) => {
      const currentUser = requireAuth(ctx);
      const parsed = createCategorySchema.safeParse(input);
      if (!parsed.success) throw badRequestError(parsed.error.issues[0].message);

      const existing = await ctx.prisma.category.findUnique({
        where: { userId_name: { userId: currentUser.id, name: parsed.data.name } },
      });
      if (existing) throw conflictError("Categoria já existe");

      return ctx.prisma.category.create({
        ...query,
        data: {
          name: parsed.data.name,
          description: parsed.data.description ?? undefined,
          color: parsed.data.color ?? undefined,
          icon: parsed.data.icon ?? undefined,
          userId: currentUser.id,
        },
      });
    },
  }),

  updateCategory: t.prismaField({
    type: "Category",
    args: {
      id: t.arg.id({ required: true }),
      input: t.arg({ type: UpdateCategoryInput, required: true }),
    },
    resolve: async (query, _parent, { id, input }, ctx) => {
      const currentUser = requireAuth(ctx);
      const parsed = updateCategorySchema.safeParse(input);
      if (!parsed.success) throw badRequestError(parsed.error.issues[0].message);

      const { count } = await ctx.prisma.category.updateMany({
        where: { id: String(id), userId: currentUser.id },
        data: {
          name: parsed.data.name,
          description: parsed.data.description ?? undefined,
          color: parsed.data.color ?? undefined,
          icon: parsed.data.icon ?? undefined,
        },
      });
      if (count === 0) throw notFoundError("Categoria");

      return ctx.prisma.category.findUniqueOrThrow({ ...query, where: { id: String(id) } });
    },
  }),

  deleteCategory: t.field({
    type: "Boolean",
    args: { id: t.arg.id({ required: true }) },
    resolve: async (_parent, { id }, ctx) => {
      const currentUser = requireAuth(ctx);
      const { count } = await ctx.prisma.category.deleteMany({
        where: { id: String(id), userId: currentUser.id },
      });
      if (count === 0) throw notFoundError("Categoria");
      return true;
    },
  }),
}));
