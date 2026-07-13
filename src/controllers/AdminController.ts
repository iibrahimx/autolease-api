import { Request, Response } from "express";
import { AdminService } from "../services/AdminService.js";

export const AdminController = {
  async getDashboard(request: Request, response: Response) {
    try {
      const stats = await AdminService.getDashboardStats();

      response.status(200).json({
        success: true,
        message: "Dashboard data retrieved",
        data: stats,
      });
    } catch (error: any) {
      response.status(500).json({
        success: false,
        message: error.message || "Failed to get dashboard",
      });
    }
  },

  async suspendUser(request: Request, response: Response) {
    try {
      const { userId } = request.params;

      await AdminService.suspendUser(userId as string);

      response.status(200).json({
        success: true,
        message: "User suspended successfully",
      });
    } catch (error: any) {
      response.status(400).json({
        success: false,
        message: error.message || "Failed to suspend user",
      });
    }
  },

  async activateUser(request: Request, response: Response) {
    try {
      const { userId } = request.params;

      await AdminService.activateUser(userId as string);

      response.status(200).json({
        success: true,
        message: "User activated successfully",
      });
    } catch (error: any) {
      response.status(400).json({
        success: false,
        message: error.message || "Failed to activate user",
      });
    }
  },

  async verifyOwner(request: Request, response: Response) {
    try {
      const { userId } = request.params;

      await AdminService.verifyOwner(userId as string);

      response.status(200).json({
        success: true,
        message: "Owner verified successfully",
      });
    } catch (error: any) {
      response.status(400).json({
        success: false,
        message: error.message || "Failed to verify owner",
      });
    }
  },

  async suspendVehicle(request: Request, response: Response) {
    try {
      const { carId } = request.params;

      await AdminService.suspendVehicle(carId as string);

      response.status(200).json({
        success: true,
        message: "Vehicle suspended successfully",
      });
    } catch (error: any) {
      response.status(400).json({
        success: false,
        message: error.message || "Failed to suspend vehicle",
      });
    }
  },

  async activateVehicle(request: Request, response: Response) {
    try {
      const { carId } = request.params;

      await AdminService.activateVehicle(carId as string);

      response.status(200).json({
        success: true,
        message: "Vehicle activated successfully",
      });
    } catch (error: any) {
      response.status(400).json({
        success: false,
        message: error.message || "Failed to activate vehicle",
      });
    }
  },
};
