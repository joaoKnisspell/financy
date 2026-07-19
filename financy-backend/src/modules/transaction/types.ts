import { builder } from "../../builder.js";

export const TransactionType = builder.enumType("TransactionType", {
  values: ["INCOME", "EXPENSE"] as const,
});

builder.prismaObject("Transaction", {
  fields: (t) => ({
    id: t.exposeID("id"),
    amount: t.exposeInt("amount"),
    type: t.field({
      type: TransactionType,
      resolve: (parent) => parent.type as "INCOME" | "EXPENSE",
    }),
    date: t.expose("date", { type: "DateTime" }),
    description: t.exposeString("description"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    category: t.relation("category", { nullable: true }),
  }),
});

export const TransactionFilter = builder.inputType("TransactionFilter", {
  fields: (t) => ({
    type: t.field({ type: TransactionType, required: false }),
    categoryId: t.id({ required: false }),
    startDate: t.field({ type: "DateTime", required: false }),
    endDate: t.field({ type: "DateTime", required: false }),
  }),
});

export const CreateTransactionInput = builder.inputType("CreateTransactionInput", {
  fields: (t) => ({
    amount: t.int({ required: true }),
    type: t.field({ type: TransactionType, required: true }),
    date: t.field({ type: "DateTime", required: true }),
    description: t.string({ required: true }),
    categoryId: t.id({ required: false }),
  }),
});

export const UpdateTransactionInput = builder.inputType("UpdateTransactionInput", {
  fields: (t) => ({
    amount: t.int({ required: false }),
    type: t.field({ type: TransactionType, required: false }),
    date: t.field({ type: "DateTime", required: false }),
    description: t.string({ required: false }),
    categoryId: t.id({ required: false }),
  }),
});
