import { builder } from "../../builder.js";

builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    email: t.exposeString("email"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
  }),
});

export const AuthPayload = builder.objectRef<{ token: string; userId: string }>("AuthPayload").implement({
  fields: (t) => ({
    token: t.exposeString("token"),
    user: t.prismaField({
      type: "User",
      resolve: (query, parent, _args, ctx) => ctx.prisma.user.findUniqueOrThrow({ ...query, where: { id: parent.userId } }),
    }),
  }),
});

export const SignUpInput = builder.inputType("SignUpInput", {
  fields: (t) => ({
    name: t.string({ required: true }),
    email: t.string({ required: true }),
    password: t.string({ required: true }),
  }),
});

export const SignInInput = builder.inputType("SignInInput", {
  fields: (t) => ({
    email: t.string({ required: true }),
    password: t.string({ required: true }),
  }),
});

export const UpdateUserInput = builder.inputType("UpdateUserInput", {
  fields: (t) => ({
    name: t.string({ required: true }),
  }),
});
