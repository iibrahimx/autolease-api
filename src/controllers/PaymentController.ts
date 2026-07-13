import { Request, Response } from "express";
import { PaymentService } from "../services/PaymentService.js";

export const PaymentController = {
  async createPayment(request: Request, response: Response) {
    try {
      const { bookingId } = request.body;

      const result = await PaymentService.createPaymentIntent(bookingId);

      response.status(201).json({
        success: true,
        message: "Payment created successfully",
        data: result,
      });
    } catch (error: any) {
      response.status(400).json({
        success: false,
        message: error.message || "Failed to create payment",
      });
    }
  },
};
