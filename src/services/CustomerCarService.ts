import { CarRepository } from "../repositories/CarRepository.js";

export const CustomerCarService = {
  async browseCars(options: {
    page: number;
    limit: number;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    engineType?: string;
    fuelType?: string;
    transmission?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  }) {
    // Convert page/limit to skip/take for the database query
    const skip = (options.page - 1) * options.limit;
    const take = options.limit;

    const result = await CarRepository.browseCars({
      skip,
      take,
      brand: options.brand,
      minPrice: options.minPrice,
      maxPrice: options.maxPrice,
      engineType: options.engineType,
      fuelType: options.fuelType,
      transmission: options.transmission,
      search: options.search,
      sortBy: options.sortBy,
      sortOrder: options.sortOrder,
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(result.total / options.limit);

    return {
      cars: result.cars,
      pagination: {
        page: options.page,
        limit: options.limit,
        total: result.total,
        totalPages,
        hasNextPage: options.page < totalPages,
        hasPreviousPage: options.page > 1,
      },
    };
  },

  async getCarDetails(carId: string) {
    const car = await CarRepository.findById(carId);

    if (!car) {
      throw new Error("Car not found");
    }

    return car;
  },
};
