import "reflect-metadata";
import { env } from "./config/env.js";
import { AppDataSource } from "./config/database.js";
import { errorHandler } from "./middlewares/ErrorMiddleware.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import AuthRoutes from "./routes/AuthRoutes.js";
import UserRoutes from './routes/UserRoutes.js';
import BookingRoutes from './routes/BookingRoutes.js';
import PaymentRoutes from './routes/PaymentRoutes.js';
import CarRoutes from './routes/CarRoutes.js';
import ReviewRoutes from './routes/ReviewRoutes.js';
import AdminRoutes from './routes/AdminRoutes.js';

const app = express();

// SECURITY MIDDLEWARE (runs on every request)

// Helmet to sets security-related HTTP headers
app.use(helmet());

// CORS to control which domains can access the API
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  }),
);

// Rate limiting 
const limiter = rateLimit({
  // Allow 100 requests per 15 minutes from each IP address
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});
app.use("/api", limiter);

app.use(express.json());

// Health check
app.get("/health", (request, response) => {
  response.json({
    status: "ok",
    message: "AutoLease API running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", AuthRoutes);

app.use("/api/users", UserRoutes);

app.use("/api/bookings", BookingRoutes);

app.use("/api/payments", PaymentRoutes);

app.use("/api/cars", CarRoutes);

app.use("/api/reviews", ReviewRoutes);

app.use("/api/admin", AdminRoutes);

app.use(errorHandler);

// START SERVER
async function bootstrap() {
  try {
    console.log(`${env.appName} is starting...`);
    console.log(`Environment: ${env.nodeEnv}`);

    await AppDataSource.initialize();
    console.log("Database connected successfully!");

    app.listen(env.port, () => {
      console.log(`Server is running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start application:", error);
    process.exit(1);
  }
}

bootstrap();
