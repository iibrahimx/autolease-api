import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository.js";

export const UserController = {
  async getProfile(request: Request, response: Response) {
    try {
      const userId = request.user?.userId;

      response.status(200).json({
        success: true,
        message: "Profile retrieved successfully",
        data: {
          userId,
          message:
            "This is a protected route. Only authenticated users can see this.",
        },
      });
    } catch (error: any) {
      response.status(500).json({
        success: false,
        message: error.message || "Failed to get profile",
      });
    }
  },

  async updateProfile(request: Request, response: Response) {
    try {
      const userId = request.user!.userId;
      const { firstName, lastName, phoneNumber, address } = request.body;

      await UserRepository.update(userId, {
        firstName,
        lastName,
        phoneNumber,
        address,
      });

      const updatedUser = await UserRepository.findById(userId);

      response.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedUser,
      });
    } catch (error: any) {
      response.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};
