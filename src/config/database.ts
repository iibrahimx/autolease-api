import { DataSource } from "typeorm";
import { env } from "./env.js";
import { User } from "../entities/User.js";
import { Car } from "../entities/Car.js";
import { Booking } from '@/entities/Booking.js';
import { Review } from '@/entities/Review.js';

export const AppDataSource = new DataSource({
  type: "postgres",

  host: env.database.host,
  port: env.database.port,
  username: env.database.username,
  password: env.database.password,
  database: env.database.name,

  synchronize: !env.isProduction,

  logging: !env.isProduction,

  entities: [User, Car, Booking, Review],

  migrations: ["src/database/migrations/**/*.ts"],

  subscribers: ["src/subscribers/**/*.ts"],
});
