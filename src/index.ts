import express from "express";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import "reflect-metadata";
import * as env from "dotenv";
env.config();

import { context } from "./util/context";

import schema from "./gql";

async function main() {
  const port = process.env.PORT || 3030;
  const secret = process.env.SECRET;

  const app = express();

  app.use(cookieParser(secret));

  const server = new ApolloServer({
    schema: await schema,
    context,
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen(port, () => {
    console.log(
      `Server ready at http://localhost:${port}${server.graphqlPath}`
    );
  });
}

main();
