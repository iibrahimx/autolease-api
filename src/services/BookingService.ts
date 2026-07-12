import { BookingRepository } from "../repositories/BookingRepository.js";
import { CarRepository } from "../repositories/CarRepository.js";
import { BookingStatus } from "../entities/Booking.js";
import { CarStatus } from "../entities/Car.js";

export const BookingService = {
  async createBooking(customerId: string, carId: string, startDate: Date, endDate: Date) {
    // Verify car exists and is available
    const car = await CarRepository.findById(carId);
    if (!car) {
      throw new Error("Car not found");
    }
    if (car.status !== CarStatus.AVAILABLE) {
      throw new Error("Car is not available for booking");
    }

    // Validate dates
    if (startDate >= endDate) {
      throw new Error("End date must be after start date");
    }
    if (startDate < new Date()) {
      throw new Error("Start date cannot be in the past");
    }

    // Check for overlapping bookings
    const hasOverlap = await BookingRepository.checkOverlap(carId, startDate, endDate);
    if (hasOverlap) {
      throw new Error("Car is already booked for these dates");
    }

    // Calculate total price
    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = Number(car.dailyPrice) * days;

    // Create booking
    const booking = await BookingRepository.create({
      customer: { id: customerId } as any,
      car: { id: carId } as any,
      startDate,
      endDate,
      totalPrice,
      status: BookingStatus.PENDING,
    });

    return booking;
  },

  async cancelBooking(bookingId: string, userId: string) {
    const booking = await BookingRepository.findById(bookingId);
    
    if (!booking) {
      throw new Error("Booking not found");
    }
    
    if (booking.customer.id !== userId) {
      throw new Error("You can only cancel your own bookings");
    }
    
    if (booking.status === BookingStatus.ACTIVE || booking.status === BookingStatus.COMPLETED) {
      throw new Error("Cannot cancel an active or completed booking");
    }

    await BookingRepository.updateStatus(bookingId, BookingStatus.CANCELLED);
  },
};