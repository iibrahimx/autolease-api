import { DataSource } from "typeorm";
import { env } from "./env.js";
import { User } from "../entities/User.js";

export const AppDataSource = new DataSource({
  type: "postgres",

  host: env.database.host,
  port: env.database.port,
  username: env.database.username,
  password: env.database.password,
  database: env.database.name,

  synchronize: !env.isProduction,

  logging: !env.isProduction,

  entities: [User],

  migrations: ["src/database/migrations/**/*.ts"],

  subscribers: ["src/subscribers/**/*.ts"],
});
