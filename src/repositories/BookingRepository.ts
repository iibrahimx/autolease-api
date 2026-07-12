import { AppDataSource } from "../config/database.js";
import { Booking, BookingStatus } from "../entities/Booking.js";

const bookingRepository = () => AppDataSource.getRepository(Booking);

export const BookingRepository = {
  async findById(id: string): Promise<Booking | null> {
    return bookingRepository().findOne({
      where: { id },
      relations: { customer: true, car: true },
    });
  },

  async findByCustomer(customerId: string): Promise<Booking[]> {
    return bookingRepository().find({
      where: { customer: { id: customerId } },
      relations: { car: true },
      order: { createdAt: "DESC" },
    });
  },

  async findByCarOwner(ownerId: string): Promise<Booking[]> {
    return bookingRepository().find({
      where: { car: { owner: { id: ownerId } } },
      relations: { customer: true, car: true },
      order: { createdAt: "DESC" },
    });
  },

  async create(bookingData: Partial<Booking>): Promise<Booking> {
    const booking = bookingRepository().create(bookingData);
    return bookingRepository().save(booking);
  },

  async updateStatus(id: string, status: BookingStatus): Promise<void> {
    await bookingRepository().update(id, { status });
  },

  async checkOverlap(
    carId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<boolean> {
    const overlapping = await bookingRepository()
      .createQueryBuilder("booking")
      .where("booking.carId = :carId", { carId })
      .andWhere("booking.status NOT IN (:...statuses)", {
        statuses: [BookingStatus.CANCELLED],
      })
      .andWhere(
        "booking.startDate <= :endDate AND booking.endDate >= :startDate",
        { startDate, endDate },
      )
      .getCount();

    return overlapping > 0;
  },
};
