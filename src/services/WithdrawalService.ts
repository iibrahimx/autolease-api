import { AppDataSource } from "../config/database.js";
import { Withdrawal, WithdrawalStatus } from "../entities/Withdrawal.js";
import { WalletRepository } from "../repositories/WalletRepository.js";

const withdrawalRepository = () => AppDataSource.getRepository(Withdrawal);

export const WithdrawalService = {
  async requestWithdrawal(userId: string, amount: number, bankAccountId: string) {
    const wallet = await WalletRepository.findByUserId(userId);
    
    if (!wallet) {
      throw new Error("Wallet not found");
    }

    if (Number(wallet.availableBalance) < amount) {
      throw new Error("Insufficient available balance");
    }

    // Deduct from available balance immediately
    await WalletRepository.deductFromAvailable(wallet.id, amount);

    // Create withdrawal request
    const withdrawal = withdrawalRepository().create({
      amount,
      status: WithdrawalStatus.PENDING,
      user: { id: userId } as any,
      bankAccount: { id: bankAccountId } as any,
    });

    return withdrawalRepository().save(withdrawal);
  },

  async approveWithdrawal(withdrawalId: string) {
    const withdrawal = await withdrawalRepository().findOne({
      where: { id: withdrawalId },
    });

    if (!withdrawal) {
      throw new Error("Withdrawal not found");
    }

    if (withdrawal.status !== WithdrawalStatus.PENDING) {
      throw new Error("Withdrawal is not pending");
    }

    await withdrawalRepository().update(withdrawalId, {
      status: WithdrawalStatus.APPROVED,
    });
  },

  async rejectWithdrawal(withdrawalId: string) {
    const withdrawal = await withdrawalRepository().findOne({
      where: { id: withdrawalId },
      relations: { user: true },
    });

    if (!withdrawal) {
      throw new Error("Withdrawal not found");
    }

    if (withdrawal.status !== WithdrawalStatus.PENDING) {
      throw new Error("Withdrawal is not pending");
    }

    // Refund the amount back to wallet
    const wallet = await WalletRepository.findByUserId(withdrawal.user.id);
    if (wallet) {
      await WalletRepository.creditPending(wallet.id, withdrawal.amount);
      // Move to available immediately
      await WalletRepository.moveToAvailable(wallet.id, withdrawal.amount);
    }

    await withdrawalRepository().update(withdrawalId, {
      status: WithdrawalStatus.REJECTED,
    });
  },

  async getUserWithdrawals(userId: string) {
    return withdrawalRepository().find({
      where: { user: { id: userId } },
      relations: { bankAccount: true },
      order: { createdAt: "DESC" },
    });
  },

  async getAllWithdrawals() {
    return withdrawalRepository().find({
      relations: { user: true, bankAccount: true },
      order: { createdAt: "DESC" },
    });
  },
};