import { Request, Response } from "express";

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
};
