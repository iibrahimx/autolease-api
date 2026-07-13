import { AppDataSource } from "../config/database.js";
import { Wallet } from "../entities/Wallet.js";

const walletRepository = () => AppDataSource.getRepository(Wallet);

export const WalletRepository = {
  // Find a wallet by the user's ID
  async findByUserId(userId: string): Promise<Wallet | null> {
    return walletRepository().findOne({
      where: { user: { id: userId } },
    });
  },

  // Create a new wallet for a user (called when a user becomes a car owner)
  async create(userId: string): Promise<Wallet> {
    const wallet = walletRepository().create({
      user: { id: userId } as any,
      pendingBalance: 0,
      availableBalance: 0,
      totalEarned: 0,
    });
    return walletRepository().save(wallet);
  },

  // Add money to pending balance
  async creditPending(walletId: string, amount: number): Promise<void> {
    // increment() adds to an existing value directly in the database
    await walletRepository().increment(
      { id: walletId },
      "pendingBalance",
      amount,
    );
  },

  // Move money from pending to available (when rental completes)
  async moveToAvailable(walletId: string, amount: number): Promise<void> {
    const wallet = await walletRepository().findOne({
      where: { id: walletId },
    });
    if (!wallet) return;

    // Decrease pending, increase available, increase total earned
    wallet.pendingBalance = Number(wallet.pendingBalance) - amount;
    wallet.availableBalance = Number(wallet.availableBalance) + amount;
    wallet.totalEarned = Number(wallet.totalEarned) + amount;

    await walletRepository().save(wallet);
  },

  // Remove money from available balance (for withdrawals)
  async deductFromAvailable(walletId: string, amount: number): Promise<void> {
    const wallet = await walletRepository().findOne({
      where: { id: walletId },
    });
    if (!wallet) return;

    if (Number(wallet.availableBalance) < amount) {
      throw new Error("Insufficient balance");
    }

    wallet.availableBalance = Number(wallet.availableBalance) - amount;
    await walletRepository().save(wallet);
  },
};
