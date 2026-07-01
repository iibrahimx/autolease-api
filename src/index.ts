import "reflect-metadata";
import { env } from "./config/env.js";
import { AppDataSource } from "./config/database.js";

async function bootstrap() {
  try {
    console.log(`${env.appName} is starting...`);
    console.log(`Environment: ${env.nodeEnv}`);

    await AppDataSource.initialize();
    console.log("Database connected successfully!");

    console.log(`Server will run on port ${env.port}`);
  } catch (error) {
    console.error("Failed to start application:", error);
    process.exit(1);
  }
}

bootstrap();
