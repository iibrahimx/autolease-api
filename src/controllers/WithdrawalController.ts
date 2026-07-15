import { Request, Response } from "express";
import { WithdrawalService } from "../services/WithdrawalService.js";

export const WithdrawalController = {
  async requestWithdrawal(request: Request, response: Response) {
    try {
      const userId = request.user!.userId;
      const { amount, bankAccountId } = request.body;

      const withdrawal = await WithdrawalService.requestWithdrawal(
        userId, amount, bankAccountId
      );

      response.status(201).json({
        success: true,
        message: "Withdrawal request submitted",
        data: withdrawal,
      });
    } catch (error: any) {
      response.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  async getMyWithdrawals(request: Request, response: Response) {
    try {
      const userId = request.user!.userId;
      const withdrawals = await WithdrawalService.getUserWithdrawals(userId);

      response.status(200).json({
        success: true,
        data: withdrawals,
      });
    } catch (error: any) {
      response.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};