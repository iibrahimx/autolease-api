import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";

export enum EngineType {
  V4 = "v4",
  V6 = "v6",
  V8 = "v8",
  V12 = "v12",
  ELECTRIC = "electric",
  HYBRID = "hybrid",
}

export enum FuelType {
  PETROL = "petrol",
  DIESEL = "diesel",
  ELECTRIC = "electric",
  HYBRID = "hybrid",
}

export enum TransmissionType {
  MANUAL = "manual",
  AUTOMATIC = "automatic",
}

export enum CarStatus {
  AVAILABLE = "available",
  RENTED = "rented",
  SUSPENDED = "suspended",
  PAUSED = "paused",
  MAINTENANCE = "maintenance",
}

@Entity("cars")
export class Car {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100 })
  brand!: string;

  @Column({ type: "varchar", length: 100 })
  model!: string;

  @Column({ type: "integer" })
  year!: number;

  @Column({ type: "varchar", length: 17, unique: true })
  vin!: string;

  @Column({ type: "varchar", length: 500 })
  description!: string;

  @Column({ type: "enum", enum: EngineType })
  engineType!: EngineType;

  @Column({ type: "enum", enum: FuelType })
  fuelType!: FuelType;

  @Column({ type: "enum", enum: TransmissionType })
  transmission!: TransmissionType;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  dailyPrice!: number;

  @Column({ type: "simple-json", nullable: true })
  images?: string[];

  @Column({ type: "text" })
  address!: string;

  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  latitude?: number;

  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  longitude?: number;

  @Column({ type: "enum", enum: CarStatus, default: CarStatus.AVAILABLE })
  status!: CarStatus;

  @ManyToOne("User", "cars", { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "ownerId" })
  owner!: any;

  @OneToMany("Booking", "car")
  bookings!: any[];

  @OneToMany("Review", "car")
  reviews!: any[];

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;
}