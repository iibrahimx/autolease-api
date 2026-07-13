import { Request, Response } from "express";
import { AuthService } from "../services/AuthService.js";

export const AuthController = {
  async register(request: Request, response: Response) {
    try {
      const { email, password, firstName, lastName } = request.body;

      const user = await AuthService.register({
        email,
        password,
        firstName,
        lastName,
      });

      response.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      });
    } catch (error: any) {
      response.status(400).json({
        success: false,
        message: error.message || "Registration failed",
      });
    }
  },

  async login(request: Request, response: Response) {
    try {
      const { email, password } = request.body;

      const result = await AuthService.login(email, password);

      response.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error: any) {
      response.status(401).json({
        success: false,
        message: error.message || "Login failed",
      });
    }
  },

  async changePassword(request: Request, response: Response) {
    try {
      const userId = request.user!.userId;
      const { currentPassword, newPassword } = request.body;

      await AuthService.changePassword(userId, currentPassword, newPassword);

      response.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error: any) {
      response.status(400).json({
        success: false,
        message: error.message || "Failed to change password",
      });
    }
  },

  async forgotPassword(request: Request, response: Response) {
    try {
      const { email } = request.body;

      await AuthService.forgotPassword(email);

      response.status(200).json({
        success: true,
        message: "If the email exists, a reset link has been sent",
      });
    } catch (error: any) {
      response.status(400).json({
        success: false,
        message: error.message || "Failed to process request",
      });
    }
  },

  async resetPassword(request: Request, response: Response) {
    try {
      const { token, newPassword } = request.body;

      await AuthService.resetPassword(token, newPassword);

      response.status(200).json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error: any) {
      response.status(400).json({
        success: false,
        message: error.message || "Failed to reset password",
      });
    }
  },
};
