import { AppDataSource } from "../config/database.js";
import { Review } from "../entities/Review.js";

const reviewRepository = () => AppDataSource.getRepository(Review);

export const ReviewRepository = {
  async create(reviewData: Partial<Review>): Promise<Review> {
    const review = reviewRepository().create(reviewData);
    return reviewRepository().save(review);
  },

  async findByCarId(carId: string): Promise<Review[]> {
    return reviewRepository().find({
      where: { car: { id: carId } },
      relations: { customer: true },
      order: { createdAt: "DESC" },
    });
  },

  async findById(id: string): Promise<Review | null> {
    return reviewRepository().findOne({
      where: { id },
      relations: { customer: true, car: true },
    });
  },

  async update(id: string, reviewData: Partial<Review>): Promise<void> {
    await reviewRepository().update(id, reviewData);
  },

  async delete(id: string): Promise<void> {
    await reviewRepository().delete(id);
  },

  async getAverageRating(carId: string): Promise<number> {
    const result = await reviewRepository()
      .createQueryBuilder("review")
      .select("AVG(review.rating)", "average")
      .where("review.carId = :carId", { carId })
      .getRawOne();

    return result?.average ? parseFloat(result.average) : 0;
  },

  async getTotalReviews(carId: string): Promise<number> {
    return reviewRepository().count({
      where: { car: { id: carId } },
    });
  },
};
