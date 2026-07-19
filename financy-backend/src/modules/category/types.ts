import type { Category } from "@prisma/client";
import { builder } from "../../builder.js";

export const CategoryType = builder.prismaObject("Category", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    description: t.exposeString("description", { nullable: true }),
    color: t.exposeString("color", { nullable: true }),
    icon: t.exposeString("icon", { nullable: true }),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    transactions: t.relation("transactions"),
  }),
});

export const CreateCategoryInput = builder.inputType("CreateCategoryInput", {
  fields: (t) => ({
    name: t.string({ required: true }),
    description: t.string({ required: false }),
    color: t.string({ required: false }),
    icon: t.string({ required: false }),
  }),
});

export const UpdateCategoryInput = builder.inputType("UpdateCategoryInput", {
  fields: (t) => ({
    name: t.string({ required: false }),
    description: t.string({ required: false }),
    color: t.string({ required: false }),
    icon: t.string({ required: false }),
  }),
});

export interface CategorySummaryShape {
  category: Category;
  itemCount: number;
  total: number;
}

export const CategorySummaryType = builder
  .objectRef<CategorySummaryShape>("CategorySummary")
  .implement({
    fields: (t) => ({
      category: t.field({ type: CategoryType, resolve: (parent) => parent.category }),
      itemCount: t.exposeInt("itemCount"),
      total: t.exposeInt("total"),
    }),
  });

export interface CategoriesOverviewShape {
  totalCategories: number;
  totalTransactions: number;
  mostUsedCategory: Category | null;
  summaries: CategorySummaryShape[];
}

export const CategoriesOverviewType = builder
  .objectRef<CategoriesOverviewShape>("CategoriesOverview")
  .implement({
    fields: (t) => ({
      totalCategories: t.exposeInt("totalCategories"),
      totalTransactions: t.exposeInt("totalTransactions"),
      mostUsedCategory: t.field({
        type: CategoryType,
        nullable: true,
        resolve: (parent) => parent.mostUsedCategory,
      }),
      summaries: t.field({
        type: [CategorySummaryType],
        resolve: (parent) => parent.summaries,
      }),
    }),
  });
