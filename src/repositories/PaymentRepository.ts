import { AppDataSource } from "../config/database.js";
import { Payment, PaymentStatus } from "../entities/Payment.js";

const paymentRepository = () => AppDataSource.getRepository(Payment);

export const PaymentRepository = {
  // Create a new payment record
  async create(paymentData: Partial<Payment>): Promise<Payment> {
    const payment = paymentRepository().create(paymentData);
    return paymentRepository().save(payment);
  },

  // Find a payment by its Stripe payment intent ID
  async findByStripeId(stripePaymentIntentId: string): Promise<Payment | null> {
    return paymentRepository().findOne({
      where: { stripePaymentIntentId },
      relations: { booking: true },
    });
  },

  // Update just the status of a payment
  async updateStatus(id: string, status: PaymentStatus): Promise<void> {
    await paymentRepository().update(id, { status });
  },
};
