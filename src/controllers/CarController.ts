import { Request, Response } from "express";
import { CarService } from "../services/CarService.js";

export const CarController = {
  async register(request: Request, response: Response) {
    try {
      const ownerId = request.user!.userId;
      const carData = request.body;

      const car = await CarService.registerCar(ownerId, carData);

      response.status(201).json({
        success: true,
        message: "Car registered successfully",
        data: car,
      });
    } catch (error: any) {
      response.status(400).json({
        success: false,
        message: error.message || "Failed to register car",
      });
    }
  },

  async getMyCars(request: Request, response: Response) {
    try {
      const ownerId = request.user!.userId;
      const cars = await CarService.getMyCars(ownerId);

      response.status(200).json({
        success: true,
        message: "Cars retrieved successfully",
        data: cars,
      });
    } catch (error: any) {
      response.status(400).json({
        success: false,
        message: error.message || "Failed to get cars",
      });
    }
  },

  async update(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const ownerId = request.user!.userId;
      const updateData = request.body;

      const car = await CarService.updateCar(id as string, ownerId, updateData);

      response.status(200).json({
        success: true,
        message: "Car updated successfully",
        data: car,
      });
    } catch (error: any) {
      response.status(400).json({
        success: false,
        message: error.message || "Failed to update car",
      });
    }
  },

  async delete(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const ownerId = request.user!.userId;

      await CarService.deleteCar(id as string, ownerId);

      response.status(200).json({
        success: true,
        message: "Car deleted successfully",
      });
    } catch (error: any) {
      response.status(400).json({
        success: false,
        message: error.message || "Failed to delete car",
      });
    }
  },

  async toggleAvailability(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const ownerId = request.user!.userId;

      const car = await CarService.toggleAvailability(id as string, ownerId);

      response.status(200).json({
        success: true,
        message: "Car availability updated",
        data: car,
      });
    } catch (error: any) {
      response.status(400).json({
        success: false,
        message: error.message || "Failed to update availability",
      });
    }
  },
};
