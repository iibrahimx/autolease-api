import { Request, Response } from "express";
import { CustomerCarService } from "../services/CustomerCarService.js";

export const CustomerCarController = {
  async browseCars(request: Request, response: Response) {
    try {
      // Extract query parameters from the URL
      // Example: /api/cars/browse?page=1&limit=20&search=toyota&minPrice=10000
      const {
        page = "1",
        limit = "20",
        brand,
        minPrice,
        maxPrice,
        engineType,
        fuelType,
        transmission,
        search,
        sortBy,
        sortOrder,
      } = request.query;

      const result = await CustomerCarService.browseCars({
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        brand: brand as string | undefined,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        engineType: engineType as string | undefined,
        fuelType: fuelType as string | undefined,
        transmission: transmission as string | undefined,
        search: search as string | undefined,
        sortBy: sortBy as string | undefined,
        sortOrder: sortOrder as "ASC" | "DESC" | undefined,
      });

      response.status(200).json({
        success: true,
        message: "Cars retrieved successfully",
        data: result,
      });
    } catch (error: any) {
      response.status(400).json({
        success: false,
        message: error.message || "Failed to browse cars",
      });
    }
  },

  async getCarDetails(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const car = await CustomerCarService.getCarDetails(id as string);

      response.status(200).json({
        success: true,
        message: "Car details retrieved successfully",
        data: car,
      });
    } catch (error: any) {
      response.status(404).json({
        success: false,
        message: error.message || "Car not found",
      });
    }
  },
};