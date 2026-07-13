import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Wallet } from "./Wallet.js";

export enum TransactionType {
  CREDIT = "credit",
  DEBIT = "debit",
  WITHDRAWAL = "withdrawal",
  COMMISSION = "commission",
}

export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: "enum", enum: TransactionType })
  type!: TransactionType;

  @Column({ type: "enum", enum: TransactionStatus, default: TransactionStatus.COMPLETED })
  status!: TransactionStatus;

  @Column({ type: "varchar", length: 500, nullable: true })
  description?: string;

  @ManyToOne("Wallet", "transactions")
  @JoinColumn({ name: "walletId" })
  wallet!: any;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;
}