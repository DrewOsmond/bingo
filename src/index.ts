import express from "express";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import { DataSource } from "typeorm";
import "reflect-metadata";
import * as env from "dotenv";
env.config();

import { context } from "./util/context";
import { User } from "./entity/user";
import schema from "./gql";

const dbport = process.env.DBPORT;
const username = process.env.DBUSERNAME;
const password = process.env.DBPASSWORD || "";
const database = process.env.DATABASE;

console.log(dbport, username, database);
if (!dbport || !username || !database) {
  console.log(dbport, username, database);
  throw new Error("Database environment is not setup");
}

export const db = new DataSource({
  username: username,
  password: password,
  database: database,
  port: +dbport,
  type: "postgres",
  host: "localhost",
  logging: false,
  entities: [User],
  migrations: ["src/migration/**/*.ts"],
  subscribers: [],
  synchronize: true,
});

db.initialize()
  .then(() => {
    console.log("Data Source has been initialized successfully.");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

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
