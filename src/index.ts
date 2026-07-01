import "reflect-metadata";
import { env } from "./config/env.js";
import { AppDataSource } from "./config/database.js";
import express from "express";
import { timeStamp } from "console";

const app = express();

app.use(express.json());

// GET Request
app.get("/health", (request, response) => {
  response.json({
    status: "ok",
    message: "AutoLease API running",
    timeStamp: new Date().toISOString(),
  });
});

// Start Server
async function bootstrap() {
  try {
    console.log(`${env.appName} is starting...`);
    console.log(`Environment: ${env.nodeEnv}`);

    await AppDataSource.initialize();
    console.log("Database connected successfully!");

    app.listen(env.port, () => {
      console.log(`Server is running on http://localhost:${env.port}`);
      console.log(`Health is running on http://localhost:${env.port}/health`);
    });
  } catch (error) {
    console.error("Failed to start application:", error);
    process.exit(1);
  }
}

bootstrap();
