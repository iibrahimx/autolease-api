import { Request, Response } from "express";
import { WalletService } from "../services/WalletService.js";

export const WalletController = {
  async getWallet(request: Request, response: Response) {
    try {
      const userId = request.user!.userId;
      const wallet = await WalletService.getWalletDetails(userId);

      response.status(200).json({
        success: true,
        message: "Wallet retrieved successfully",
        data: wallet,
      });
    } catch (error: any) {
      response.status(400).json({
        success: false,
        message: error.message || "Failed to get wallet",
      });
    }
  },
};