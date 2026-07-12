import { Request, Response } from "express";
import { BookingService } from "../services/BookingService.js";

export const BookingController = {
  async create(request: Request, response: Response) {
    try {
      const { carId, startDate, endDate } = request.body;
      const customerId = request.user!.userId;

      const booking = await BookingService.createBooking(
        customerId,
        carId,
        new Date(startDate),
        new Date(endDate)
      );

      response.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: booking,
      });
    } catch (error: any) {
      response.status(400).json({
        success: false,
        message: error.message || "Failed to create booking",
      });
    }
  },

  async cancel(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const userId = request.user!.userId;

      await BookingService.cancelBooking(id as string, userId);

      response.status(200).json({
        success: true,
        message: "Booking cancelled successfully",
      });
    } catch (error: any) {
      response.status(400).json({
        success: false,
        message: error.message || "Failed to cancel booking",
      });
    }
  },
};