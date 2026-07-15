import { Request, Response } from "express";
import { PaymentService } from "../services/PaymentService.js";

export const WebhookController = {
  async handleStripeWebhook(request: Request, response: Response) {
    try {
      const signature = request.headers["stripe-signature"] as string;

      if (!signature) {
        response.status(400).json({ 
          success: false, 
          message: "Missing Stripe signature" 
        });
        return;
      }

      await PaymentService.handleWebhook(request.body, signature);

      response.status(200).json({ received: true });
    } catch (error: any) {
      console.error("Webhook error:", error.message);
      response.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
  },
};