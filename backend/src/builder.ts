import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import { Prisma } from "@prisma/client";
import { DateTimeResolver } from "graphql-scalars";
import { prisma } from "./lib/prisma.js";
import type { Context } from "./context.js";

export const builder = new SchemaBuilder<{
  Context: Context;
  PrismaTypes: PrismaTypes;
  Scalars: {
    DateTime: { Input: Date; Output: Date };
  };
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
    dmmf: Prisma.dmmf,
  },
});

builder.addScalarType("DateTime", DateTimeResolver);

builder.queryType({});
builder.mutationType({});
