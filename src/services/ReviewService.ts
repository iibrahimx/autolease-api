import { ReviewRepository } from "../repositories/ReviewRepository.js";
import { BookingRepository } from "../repositories/BookingRepository.js";
import { BookingStatus } from "../entities/Booking.js";

export const ReviewService = {
  async createReview(
    customerId: string,
    carId: string,
    rating: number,
    comment?: string,
  ) {
    // Validate rating range
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    // Verify the customer has completed a booking for this car
    // Only customers who have actually rented the car can review it
    const customerBookings = await BookingRepository.findByCustomer(customerId);
    const hasCompletedBooking = customerBookings.some(
      (booking) =>
        booking.car.id === carId && booking.status === BookingStatus.COMPLETED,
    );

    if (!hasCompletedBooking) {
      throw new Error("You can only review cars you have rented and completed");
    }

    const review = await ReviewRepository.create({
      rating,
      comment: comment || undefined,
      customer: { id: customerId } as any,
      car: { id: carId } as any,
    });

    return review;
  },

  async updateReview(
    reviewId: string,
    customerId: string,
    rating?: number,
    comment?: string,
  ) {
    const review = await ReviewRepository.findById(reviewId);

    if (!review) {
      throw new Error("Review not found");
    }

    // Only the author can edit their review
    if (review.customer.id !== customerId) {
      throw new Error("You can only edit your own reviews");
    }

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      throw new Error("Rating must be between 1 and 5");
    }

    const updateData: any = {};
    if (rating !== undefined) updateData.rating = rating;
    if (comment !== undefined) updateData.comment = comment;

    await ReviewRepository.update(reviewId, updateData);

    return ReviewRepository.findById(reviewId);
  },

  async deleteReview(reviewId: string, customerId: string) {
    const review = await ReviewRepository.findById(reviewId);

    if (!review) {
      throw new Error("Review not found");
    }

    // Only the author can delete their review
    if (review.customer.id !== customerId) {
      throw new Error("You can only delete your own reviews");
    }

    await ReviewRepository.delete(reviewId);
  },

  async getCarReviews(carId: string) {
    const reviews = await ReviewRepository.findByCarId(carId);
    const averageRating = await ReviewRepository.getAverageRating(carId);
    const totalReviews = await ReviewRepository.getTotalReviews(carId);

    return {
      reviews,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews,
    };
  },
};
