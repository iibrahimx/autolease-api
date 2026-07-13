import { AppDataSource } from "../config/database.js";
import { Car, CarStatus } from "../entities/Car.js";

// Get the TypeORM repository for the Car entity
const carRepository = () => AppDataSource.getRepository(Car);

export const CarRepository = {
  async count(): Promise<number> {
    return carRepository().count();
  },

  async findById(id: string): Promise<Car | null> {
    return carRepository().findOne({
      where: { id },
      relations: { owner: true },
    });
  },

  async findAvailable(options: {
    skip: number;
    take: number;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  }): Promise<{ cars: Car[]; total: number }> {
    const where: any = { status: CarStatus.AVAILABLE };

    if (options.brand) {
      where.brand = options.brand;
    }

    const queryBuilder = carRepository()
      .createQueryBuilder("car")
      .leftJoinAndSelect("car.owner", "owner")
      .where("car.status = :status", { status: CarStatus.AVAILABLE });

    if (options.brand) {
      queryBuilder.andWhere("LOWER(car.brand) = LOWER(:brand)", {
        brand: options.brand,
      });
    }

    if (options.minPrice !== undefined) {
      queryBuilder.andWhere("car.dailyPrice >= :minPrice", {
        minPrice: options.minPrice,
      });
    }

    if (options.maxPrice !== undefined) {
      queryBuilder.andWhere("car.dailyPrice <= :maxPrice", {
        maxPrice: options.maxPrice,
      });
    }

    // Apply sorting
    const sortBy = options.sortBy || "createdAt";
    const sortOrder = options.sortOrder || "DESC";
    queryBuilder.orderBy(`car.${sortBy}`, sortOrder);

    // Get total count (before pagination)
    const total = await queryBuilder.getCount();

    // Apply pagination
    queryBuilder.skip(options.skip).take(options.take);

    // Execute query
    const cars = await queryBuilder.getMany();

    return { cars, total };
  },

  // ----------------------------------------------------------
  // FIND CARS BY OWNER
  // ----------------------------------------------------------
  async findByOwner(ownerId: string): Promise<Car[]> {
    return carRepository().find({
      where: { owner: { id: ownerId } },
      order: { createdAt: "DESC" },
    });
  },

  // ----------------------------------------------------------
  // CREATE CAR
  // ----------------------------------------------------------
  async create(carData: Partial<Car>): Promise<Car> {
    const car = carRepository().create(carData);
    return carRepository().save(car);
  },

  // ----------------------------------------------------------
  // UPDATE CAR
  // ----------------------------------------------------------
  async update(id: string, carData: Partial<Car>): Promise<void> {
    await carRepository().update(id, carData);
  },

  // ----------------------------------------------------------
  // SOFT DELETE CAR
  // ----------------------------------------------------------
  async softDelete(id: string): Promise<void> {
    await carRepository().update(id, { status: CarStatus.SUSPENDED });
  },

  // ----------------------------------------------------------
  // UPDATE CAR STATUS
  // ----------------------------------------------------------
  async updateStatus(id: string, status: CarStatus): Promise<void> {
    await carRepository().update(id, { status });
  },

  // ----------------------------------------------------------
  // SEARCH CARS
  // ----------------------------------------------------------
  async search(
    query: string,
    options: { skip: number; take: number },
  ): Promise<{ cars: Car[]; total: number }> {
    const queryBuilder = carRepository()
      .createQueryBuilder("car")
      .leftJoinAndSelect("car.owner", "owner")
      .where("car.status = :status", { status: CarStatus.AVAILABLE })
      .andWhere(
        "(LOWER(car.brand) LIKE LOWER(:query) OR LOWER(car.model) LIKE LOWER(:query) OR LOWER(car.description) LIKE LOWER(:query))",
        { query: `%${query}%` },
      )
      .skip(options.skip)
      .take(options.take);

    const total = await queryBuilder.getCount();
    const cars = await queryBuilder.getMany();

    return { cars, total };
  },

  // ----------------------------------------------------------
  // BROWSE CARS
  // ----------------------------------------------------------
  async browseCars(options: {
    skip: number;
    take: number;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    engineType?: string;
    fuelType?: string;
    transmission?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  }): Promise<{ cars: Car[]; total: number }> {
    // Start building a query for available cars only
    const queryBuilder = carRepository()
      .createQueryBuilder("car")
      .leftJoinAndSelect("car.owner", "owner")
      .where("car.status = :status", { status: CarStatus.AVAILABLE });

    // SEARCH - Look for keywords in brand, model, or description
    if (options.search) {
      queryBuilder.andWhere(
        "(LOWER(car.brand) LIKE LOWER(:search) OR LOWER(car.model) LIKE LOWER(:search) OR LOWER(car.description) LIKE LOWER(:search))",
        { search: `%${options.search}%` },
      );
    }

    // FILTERS - Narrow down results by specific criteria
    if (options.brand) {
      queryBuilder.andWhere("LOWER(car.brand) = LOWER(:brand)", {
        brand: options.brand,
      });
    }

    if (options.engineType) {
      queryBuilder.andWhere("car.engineType = :engineType", {
        engineType: options.engineType,
      });
    }

    if (options.fuelType) {
      queryBuilder.andWhere("car.fuelType = :fuelType", {
        fuelType: options.fuelType,
      });
    }

    if (options.transmission) {
      queryBuilder.andWhere("car.transmission = :transmission", {
        transmission: options.transmission,
      });
    }

    // Price range filter
    if (options.minPrice !== undefined) {
      queryBuilder.andWhere("car.dailyPrice >= :minPrice", {
        minPrice: options.minPrice,
      });
    }

    if (options.maxPrice !== undefined) {
      queryBuilder.andWhere("car.dailyPrice <= :maxPrice", {
        maxPrice: options.maxPrice,
      });
    }

    // SORTING - Order the results
    const sortBy = options.sortBy || "createdAt";
    const sortOrder = options.sortOrder || "DESC";
    queryBuilder.orderBy(`car.${sortBy}`, sortOrder);

    // PAGINATION
    const total = await queryBuilder.getCount();

    // Apply skip/take for the current page
    queryBuilder.skip(options.skip).take(options.take);

    // Execute the query to get the actual data
    const cars = await queryBuilder.getMany();

    // Return both the data and the total count
    return { cars, total };
  },
};
