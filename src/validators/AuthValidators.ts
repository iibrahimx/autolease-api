import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must not exceed 100 characters"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must not exceed 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must not exceed 50 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(1, "Password is required"),
});
