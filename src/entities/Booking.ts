import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User.js";
import { Car } from "./Car.js";

export enum BookingStatus {
  PENDING = "pending",           // Booking created, awaiting payment
  AWAITING_PAYMENT = "awaiting_payment", // Payment link generated
  PAID = "paid",                 // Payment confirmed
  ACTIVE = "active",             // Currently ongoing rental
  COMPLETED = "completed",       // Rental finished
  CANCELLED = "cancelled",       // Booking cancelled
}

@Entity("bookings")
export class Booking {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // Start date of the rental
  @Column({ type: "date" })
  startDate!: Date;

  // End date of the rental
  @Column({ type: "date" })
  endDate!: Date;

  // Total price for the entire rental period
  // Calculated as: dailyPrice × number of days
  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalPrice!: number;

  // Current status of the booking
  @Column({
    type: "enum",
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status!: BookingStatus;

  // Many bookings can belong to one customer
  @ManyToOne(() => User, (user) => user.bookingsAsCustomer)
  @JoinColumn({ name: "customerId" })
  customer!: User;

  // Many bookings can belong to one car
  @ManyToOne(() => Car, (car) => car.bookings)
  @JoinColumn({ name: "carId" })
  car!: Car;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;
}