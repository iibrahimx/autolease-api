import { transporter } from "../config/email.js";
import { env } from "../config/env.js";

export const EmailService = {
  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${env.appUrl}/api/auth/verify-email?token=${token}`;

    await transporter.sendMail({
      from: `"${env.appName}" <${env.smtp.user}>`,
      to: email,
      subject: "Verify Your Email Address",
      html: `
        <h1>Welcome to ${env.appName}!</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not create an account, please ignore this email.</p>
      `,
    });
  },

  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${env.frontendUrl}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: `"${env.appName}" <${env.smtp.user}>`,
      to: email,
      subject: "Reset Your Password",
      html: `
        <h1>Password Reset Request</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 30 minutes.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
      `,
    });
  },

  async sendBookingConfirmation(email: string, bookingDetails: {
    carName: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
  }) {
    await transporter.sendMail({
      from: `"${env.appName}" <${env.smtp.user}>`,
      to: email,
      subject: "Booking Confirmed",
      html: `
        <h1>Booking Confirmed!</h1>
        <p>Your booking has been confirmed:</p>
        <ul>
          <li><strong>Car:</strong> ${bookingDetails.carName}</li>
          <li><strong>From:</strong> ${bookingDetails.startDate}</li>
          <li><strong>To:</strong> ${bookingDetails.endDate}</li>
          <li><strong>Total:</strong> ₦${bookingDetails.totalPrice.toLocaleString()}</li>
        </ul>
        <p>Thank you for using ${env.appName}!</p>
      `,
    });
  },
};