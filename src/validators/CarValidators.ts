import { z } from "zod";

export const createCarSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int().min(1900, "Invalid year").max(2030, "Invalid year"),
  vin: z.string().length(17, "VIN must be 17 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  engineType: z.enum(["v4", "v6", "v8", "v12", "electric", "hybrid"]),
  fuelType: z.enum(["petrol", "diesel", "electric", "hybrid"]),
  transmission: z.enum(["manual", "automatic"]),
  dailyPrice: z.number().positive("Price must be positive"),
  address: z.string().min(1, "Address is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  images: z.array(z.string()).optional(),
});

export const updateCarSchema = z.object({
  brand: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
  year: z.number().int().min(1900).max(2030).optional(),
  description: z.string().min(10).optional(),
  dailyPrice: z.number().positive().optional(),
  address: z.string().min(1).optional(),
  images: z.array(z.string()).optional(),
});
