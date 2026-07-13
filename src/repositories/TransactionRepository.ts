import { AppDataSource } from "../config/database.js";
import { Transaction, TransactionType, TransactionStatus } from "../entities/Transaction.js";

const transactionRepository = () => AppDataSource.getRepository(Transaction);

export const TransactionRepository = {
  async create(transactionData: Partial<Transaction>): Promise<Transaction> {
    const transaction = transactionRepository().create(transactionData);
    return transactionRepository().save(transaction);
  },

  async findByWalletId(walletId: string): Promise<Transaction[]> {
    return transactionRepository().find({
      where: { wallet: { id: walletId } },
      order: { createdAt: "DESC" },
    });
  },

  async getTotalEarnings(walletId: string): Promise<number> {
    const result = await transactionRepository()
      .createQueryBuilder("transaction")
      .select("SUM(transaction.amount)", "total")
      .where("transaction.walletId = :walletId", { walletId })
      .andWhere("transaction.type = :type", { type: TransactionType.CREDIT })
      .andWhere("transaction.status = :status", { status: TransactionStatus.COMPLETED })
      .getRawOne();
    
    return result?.total ? parseFloat(result.total) : 0;
  },
};