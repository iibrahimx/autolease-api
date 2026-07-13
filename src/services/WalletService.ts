import { WalletRepository } from "../repositories/WalletRepository.js";
import { TransactionRepository } from "../repositories/TransactionRepository.js";
import { TransactionType, TransactionStatus } from "../entities/Transaction.js";

const COMMISSION_RATE = 0.10;

export const WalletService = {
  async getOrCreateWallet(userId: string) {
    let wallet = await WalletRepository.findByUserId(userId);
    
    if (!wallet) {
      wallet = await WalletRepository.create(userId);
    }
    
    return wallet;
  },

  async creditWallet(userId: string, amount: number, description: string) {
    const wallet = await this.getOrCreateWallet(userId);
    
    // Calculate commission
    const commission = amount * COMMISSION_RATE;
    const netAmount = amount - commission;

    // Add to pending balance
    await WalletRepository.creditPending(wallet.id, netAmount);

    // Record transaction
    await TransactionRepository.create({
      amount: netAmount,
      type: TransactionType.CREDIT,
      status: TransactionStatus.PENDING,
      description,
      wallet: { id: wallet.id } as any,
    });

    return wallet;
  },

  async releaseFunds(walletId: string, amount: number) {
    await WalletRepository.moveToAvailable(walletId, amount);
  },

  async getWalletDetails(userId: string) {
    const wallet = await this.getOrCreateWallet(userId);
    const transactions = await TransactionRepository.findByWalletId(wallet.id);
    const totalEarnings = await TransactionRepository.getTotalEarnings(wallet.id);

    return {
      pendingBalance: Number(wallet.pendingBalance),
      availableBalance: Number(wallet.availableBalance),
      totalEarned: Number(wallet.totalEarned),
      transactions,
    };
  },
};