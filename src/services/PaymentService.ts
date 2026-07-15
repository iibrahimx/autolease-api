import { stripe } from "../config/stripe.js";
import { PaymentRepository } from "../repositories/PaymentRepository.js";
import { BookingRepository } from "../repositories/BookingRepository.js";
import { PaymentStatus } from "../entities/Payment.js";
import { BookingStatus } from "../entities/Booking.js";
import { env } from "../config/env.js";

// AutoLease takes 10% commission on each rental
const COMMISSION_RATE = 0.1;

export const PaymentService = {
  async createPaymentIntent(bookingId: string) {
    if (!stripe) {
      throw new Error("Payment service is not configured");
    }

    const booking = await BookingRepository.findById(bookingId);

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new Error("Booking is not in pending status");
    }

    // Create a Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      // Amount in cents (Stripe uses smallest currency unit)
      amount: Math.round(Number(booking.totalPrice) * 100),
      currency: "ngn",
      metadata: {
        bookingId: booking.id,
      },
    });

    // Save the payment in our database
    const payment = await PaymentRepository.create({
      stripePaymentIntentId: paymentIntent.id,
      amount: booking.totalPrice,
      status: PaymentStatus.PENDING,
      booking: { id: bookingId } as any,
    });

    // Update booking status to show payment is expected
    await BookingRepository.updateStatus(
      bookingId,
      BookingStatus.AWAITING_PAYMENT,
    );

    // Return the client secret so the frontend can complete payment
    return {
      payment,
      clientSecret: paymentIntent.client_secret,
    };
  },

  async confirmPayment(stripePaymentIntentId: string) {
    if (!stripe) {
      throw new Error("Payment service is not configured");
    }

    const payment = await PaymentRepository.findByStripeId(
      stripePaymentIntentId,
    );

    if (!payment) {
      throw new Error("Payment not found");
    }

    // Verify with Stripe directly
    const paymentIntent = await stripe.paymentIntents.retrieve(
      stripePaymentIntentId,
    );

    if (paymentIntent.status !== "succeeded") {
      throw new Error("Payment not succeeded in Stripe");
    }

    // Update payment status
    await PaymentRepository.updateStatus(payment.id, PaymentStatus.COMPLETED);

    // Update booking status
    await BookingRepository.updateStatus(
      payment.booking.id,
      BookingStatus.PAID,
    );

    return payment;
  },

  async handleWebhook(rawBody: Buffer, signature: string) {
    if (!stripe) {
      throw new Error("Stripe not configured");
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        env.stripe.webhookSecret || "whsec_test",
      );
    } catch (error: any) {
      throw new Error(`Webhook signature verification failed`);
    }

    // Handle different event types from Stripe
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        await this.confirmPayment(paymentIntent.id);
        break;

      case "payment_intent.payment_failed":
        const failedIntent = event.data.object;
        await this.failPayment(failedIntent.id);
        break;
    }
  },

  async failPayment(stripePaymentIntentId: string) {
    const payment = await PaymentRepository.findByStripeId(
      stripePaymentIntentId,
    );
    if (!payment) return;

    await PaymentRepository.updateStatus(payment.id, PaymentStatus.FAILED);
    await BookingRepository.updateStatus(
      payment.booking.id,
      BookingStatus.PENDING,
    );
  },
};
