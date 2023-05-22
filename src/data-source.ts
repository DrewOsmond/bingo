import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/user";
import * as env from "dotenv";

env.config();

const port = process.env.DBPORT;
const username = process.env.DBUSERNAME;
const password = process.env.DBPASSWORD;
const database = process.env.DATABASE;

console.log(port, username, database);
if (!port || !username || !database) {
  console.log(port, username, database);
  throw new Error("Database environment is not setup");
}

export const AppDataSource = new DataSource({
  username,
  password,
  database,
  port: +port,
  type: "postgres",
  host: "localhost",
  logging: false,
  entities: [User],
  migrations: ["src/migration/**/*.ts"],
  subscribers: [],
  synchronize: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized successfully.");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
