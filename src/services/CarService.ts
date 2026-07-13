import { CarRepository } from "../repositories/CarRepository.js";
import { CarStatus, EngineType, FuelType, TransmissionType } from "../entities/Car.js";

export const CarService = {
  async registerCar(ownerId: string, carData: {
    brand: string;
    model: string;
    year: number;
    vin: string;
    description: string;
    engineType: EngineType;
    fuelType: FuelType;
    transmission: TransmissionType;
    dailyPrice: number;
    address: string;
    latitude?: number;
    longitude?: number;
    images?: string[];
  }) {
    // Create the car record in the database
    const car = await CarRepository.create({
      ...carData,
      owner: { id: ownerId } as any,
      status: CarStatus.AVAILABLE,
      images: carData.images || [],
    });

    return car;
  },

  async getMyCars(ownerId: string) {
    return CarRepository.findByOwner(ownerId);
  },

  async updateCar(carId: string, ownerId: string, updateData: {
    brand?: string;
    model?: string;
    year?: number;
    description?: string;
    dailyPrice?: number;
    address?: string;
    images?: string[];
  }) {
    // First, verify this car belongs to this owner
    const car = await CarRepository.findById(carId);

    if (!car) {
      throw new Error("Car not found");
    }

    // Check ownership - only the owner can edit their car
    if (car.owner.id !== ownerId) {
      throw new Error("You can only edit your own cars");
    }

    // Update the car with the new data
    await CarRepository.update(carId, updateData);

    // Return the updated car
    return CarRepository.findById(carId);
  },

  async deleteCar(carId: string, ownerId: string) {
    const car = await CarRepository.findById(carId);

    if (!car) {
      throw new Error("Car not found");
    }

    if (car.owner.id !== ownerId) {
      throw new Error("You can only delete your own cars");
    }

    // Check if the car has active bookings
    // We shouldn't delete a car that someone is currently renting
    if (car.status === CarStatus.RENTED) {
      throw new Error("Cannot delete a car that is currently rented");
    }

    // Soft delete - just mark as suspended
    await CarRepository.softDelete(carId);
  },

  async toggleAvailability(carId: string, ownerId: string) {
    const car = await CarRepository.findById(carId);

    if (!car) {
      throw new Error("Car not found");
    }

    if (car.owner.id !== ownerId) {
      throw new Error("You can only manage your own cars");
    }

    // Toggle between AVAILABLE and PAUSED
    const newStatus = car.status === CarStatus.AVAILABLE
      ? CarStatus.PAUSED
      : CarStatus.AVAILABLE;

    await CarRepository.updateStatus(carId, newStatus);

    return CarRepository.findById(carId);
  },
};