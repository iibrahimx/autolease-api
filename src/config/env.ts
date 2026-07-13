// We import dotenv to load the .env file
// dotenv reads the .env file and puts all values into process.env
import dotenv from "dotenv";

// Load the .env file
// This must happen BEFORE we try to read any environment variables
dotenv.config();

// ============================================
// This is our configuration object
// We group all settings together so they're easy to find
// and TypeScript can check that we're using correct names
// ============================================
export const env = {
  port: parseInt(process.env.PORT || "3000", 10),

  // NODE_ENV defaults to "development" if not specified
  nodeEnv: process.env.NODE_ENV || "development",

  // Check if NODE_ENV is exactly "production"
  // This returns true or false
  isProduction: process.env.NODE_ENV === "production",

  appName: process.env.APP_NAME || "AutoLease",
  appUrl: process.env.APP_URL || "http://localhost:3000",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",

  // DATABASE SETTINGS
  database: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    name: process.env.DB_NAME || "autolease",
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "default-access-secret",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "default-refresh-secret",
    accessExpiration: parseInt(process.env.JWT_ACCESS_EXPIRATION || "900", 10),
    refreshExpiration: parseInt(
      process.env.JWT_REFRESH_EXPIRATION || "604800",
      10,
    ),
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "",
  },

  smtp: {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
} as const;
