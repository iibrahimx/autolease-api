import { Request, Response } from "express";
import { ReviewService } from "../services/ReviewService.js";

export const ReviewController = {
  async create(request: Request, response: Response) {
    try {
      const customerId = request.user!.userId;
      const { carId, rating, comment } = request.body;

      const review = await ReviewService.createReview(
        customerId,
        carId,
        rating,
        comment,
      );

      response.status(201).json({
        success: true,
        message: "Review created successfully",
        data: review,
      });
    } catch (error: any) {
      response.status(400).json({
        success: false,
        message: error.message || "Failed to create review",
      });
    }
  },

  async update(request: Request, response: Response) {
    try {
      const customerId = request.user!.userId;
      const { id } = request.params;
      const { rating, comment } = request.body;

      const review = await ReviewService.updateReview(
        id as string,
        customerId,
        rating,
        comment,
      );

      response.status(200).json({
        success: true,
        message: "Review updated successfully",
        data: review,
      });
    } catch (error: any) {
      response.status(400).json({
        success: false,
        message: error.message || "Failed to update review",
      });
    }
  },

  async remove(request: Request, response: Response) {
    try {
      const customerId = request.user!.userId;
      const { id } = request.params;

      await ReviewService.deleteReview(id as string, customerId);

      response.status(200).json({
        success: true,
        message: "Review deleted successfully",
      });
    } catch (error: any) {
      response.status(400).json({
        success: false,
        message: error.message || "Failed to delete review",
      });
    }
  },

  async getCarReviews(request: Request, response: Response) {
    try {
      const { carId } = request.params;
      const result = await ReviewService.getCarReviews(carId as string);

      response.status(200).json({
        success: true,
        message: "Reviews retrieved successfully",
        data: result,
      });
    } catch (error: any) {
      response.status(400).json({
        success: false,
        message: error.message || "Failed to get reviews",
      });
    }
  },
};
