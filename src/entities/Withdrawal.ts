import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

export enum WithdrawalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

@Entity("withdrawals")
export class Withdrawal {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: "enum", enum: WithdrawalStatus, default: WithdrawalStatus.PENDING })
  status!: WithdrawalStatus;

  @ManyToOne("User", "withdrawals")
  @JoinColumn({ name: "userId" })
  user!: any;

  @ManyToOne("BankAccount", "withdrawals")
  @JoinColumn({ name: "bankAccountId" })
  bankAccount!: any;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;
}