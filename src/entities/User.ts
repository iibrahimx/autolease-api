import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";

export enum UserRole {
  CUSTOMER = "customer",
  CAR_OWNER = "car_owner",
  ADMIN = "admin",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Column({ type: "varchar", length: 100 })
  firstName!: string;

  @Column({ type: "varchar", length: 100 })
  lastName!: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.CUSTOMER })
  role!: UserRole;

  @Column({ type: "boolean", default: false })
  isEmailVerified!: boolean;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @Column({ type: "varchar", length: 20, nullable: true })
  phoneNumber?: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  profilePicture?: string;

  @Column({ type: "text", nullable: true })
  address?: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  refreshToken?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  googleId?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  emailVerificationToken?: string;

  @Column({ type: "timestamp", nullable: true })
  emailVerificationTokenExpires?: Date;

  @Column({ type: "varchar", length: 255, nullable: true })
  passwordResetToken?: string;

  @Column({ type: "timestamp", nullable: true })
  passwordResetTokenExpires?: Date;

  @OneToMany("Car", "owner")
  cars!: any[];

  @OneToMany("Booking", "customer")
  bookingsAsCustomer!: any[];

  @OneToMany("Review", "customer")
  reviews!: any[];

  @OneToMany("BankAccount", "user")
  bankAccounts!: any[];

  @OneToMany("Withdrawal", "user")
  withdrawals!: any[];

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;
}