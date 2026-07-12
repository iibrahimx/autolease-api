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
};