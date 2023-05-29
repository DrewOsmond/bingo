import { DataSource } from "typeorm";
import { User } from "./entity/user";
import { Clan } from "./entity/clan";

const dbport = process.env.DBPORT;
const username = process.env.DBUSERNAME;
const password = process.env.DBPASSWORD || "";
const database = process.env.DATABASE;

if (!dbport || !username || !database) {
  throw new Error("Database environment is not setup");
}

export const appDataSource = new DataSource({
  username: username,
  password: password,
  database: database,
  port: +dbport,
  type: "postgres",
  host: "localhost",
  logging: false,
  entities: [User, Clan],
  migrations: ["src/migration/**/*.ts"],
  subscribers: [],
  synchronize: true,
});

appDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized successfully.");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

export const db = {
  users: appDataSource.getRepository(User),
  clans: appDataSource.getRepository(Clan),
};
