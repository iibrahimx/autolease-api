import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User.js";

@Entity("wallets")
export class Wallet {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // Money earned but not yet withdrawable
  // This is money from bookings that are PAID but not yet COMPLETED
  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  pendingBalance!: number;

  // Money available for withdrawal
  // This becomes available after a rental is completed
  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  availableBalance!: number;

  // Total amount ever earned
  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  totalEarned!: number;

  // One wallet belongs to ONE user (the car owner)
  // OneToOne means each user can only have one wallet
  @OneToOne(() => User)
  @JoinColumn({ name: "userId" })
  user!: User;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;
}
