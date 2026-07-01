import { DataSource } from "typeorm";
import { env } from "./env.js";

// ============================================
// The DataSource is like a "connection blueprint"
// It tells TypeORM everything it needs to know
// to connect to our database and work with our entities
// ============================================
export const AppDataSource = new DataSource({
  // The type of database we're using
  type: "postgres",

  // Connection details from our environment variables
  host: env.database.host,
  port: env.database.port,
  username: env.database.username,
  password: env.database.password,
  database: env.database.name,

  // synchronize: When true, TypeORM automatically updates the database
  // schema to match our entities. This is DANGEROUS in production
  // because it can delete data! We only use it in development.
  // In production, we use migrations instead.
  synchronize: !env.isProduction,

  // logging: When true, TypeORM logs all SQL queries to the console
  // We only want this in development for debugging
  logging: !env.isProduction,

  // Entities: The classes that map to database tables
  // We'll create these in the entities folder
  // This path tells TypeORM where to find entity files
  entities: ["src/entities/**/*.ts"],

  // Migrations: Database migration files
  // These track changes to our database structure
  migrations: ["src/database/migrations/**/*.ts"],

  // Subscribers: Event listeners for TypeORM events
  // We'll use these for audit logging
  subscribers: ["src/subscribers/**/*.ts"],
});
