import "dotenv/config";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { schema } from "./schema.js";
import { createContext } from "./context.js";
import type { Context } from "./context.js";

async function main() {
  const app = express();

  const apollo = new ApolloServer<Context>({
    schema,
    introspection: true,
  });

  await apollo.start();

  app.use(
    "/graphql",
    cors({
      origin: true,
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
    express.json(),
    expressMiddleware(apollo, {
      context: createContext,
    }),
  );

  const port = Number(process.env.PORT ?? 4000);
  app.listen(port, () => {
    console.log(`Servidor rodando em: http://localhost:${port}/graphql`);
  });
}

main();
