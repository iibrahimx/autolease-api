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

@Entity("reviews")
export class Review {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // Rating from 1 to 5
  @Column({ type: "integer" })
  rating!: number;

  // Written review text
  @Column({ type: "text", nullable: true })
  comment!: string;

  // The customer who wrote the review
  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: "customerId" })
  customer!: User;

  // The car being reviewed
  @ManyToOne(() => Car, (car) => car.reviews)
  @JoinColumn({ name: "carId" })
  car!: Car;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;
}