import { UserRepository } from "../repositories/UserRepository.js";
import { CarRepository } from "../repositories/CarRepository.js";
import { BookingRepository } from "../repositories/BookingRepository.js";
import { CarStatus } from "../entities/Car.js";
import { UserRole } from "../entities/User.js";
import { BookingStatus } from "../entities/Booking.js";

export const AdminService = {
  // ------------------------------------------
  // PLATFORM ANALYTICS
  // ------------------------------------------
  async getDashboardStats() {
    const [totalUsers, totalCars, totalBookings, activeRentals] =
      await Promise.all([
        UserRepository.count(),
        CarRepository.count(),
        BookingRepository.count(),
        BookingRepository.countByStatus(BookingStatus.ACTIVE),
      ]);

    const recentBookings = await BookingRepository.findRecent(5);

    return {
      totalUsers,
      totalCars,
      totalBookings,
      activeRentals,
      recentBookings,
    };
  },

  // ------------------------------------------
  // USER MANAGEMENT
  // ------------------------------------------
  async suspendUser(userId: string) {
    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role === UserRole.ADMIN) {
      throw new Error("Cannot suspend an admin");
    }

    await UserRepository.softDelete(userId);
  },

  async activateUser(userId: string) {
    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    await UserRepository.update(userId, { isActive: true });
  },

  async verifyOwner(userId: string) {
    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role !== UserRole.CAR_OWNER) {
      throw new Error("User is not a car owner");
    }

    await UserRepository.update(userId, { isEmailVerified: true });
  },

  // ------------------------------------------
  // VEHICLE MANAGEMENT
  // ------------------------------------------
  async suspendVehicle(carId: string) {
    const car = await CarRepository.findById(carId);

    if (!car) {
      throw new Error("Car not found");
    }

    await CarRepository.updateStatus(carId, CarStatus.SUSPENDED);
  },

  async activateVehicle(carId: string) {
    const car = await CarRepository.findById(carId);

    if (!car) {
      throw new Error("Car not found");
    }

    await CarRepository.updateStatus(carId, CarStatus.AVAILABLE);
  },
};
