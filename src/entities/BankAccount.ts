import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

@Entity("bank_accounts")
export class BankAccount {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100 })
  bankName!: string;

  @Column({ type: "varchar", length: 20 })
  accountNumber!: string;

  @Column({ type: "varchar", length: 100 })
  accountName!: string;

  @ManyToOne("User", "bankAccounts")
  @JoinColumn({ name: "userId" })
  user!: any;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;
}