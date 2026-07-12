import { z } from "zod";

export const createBookingSchema = z.object({
  carId: z.string().uuid("Invalid car ID"),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid start date",
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid end date",
  }),
});
