import { Router } from "express";
import { WalletController } from "../controllers/WalletController.js";
import { authenticate } from "../middlewares/AuthMiddleware.js";

const router = Router();

router.get("/", authenticate, WalletController.getWallet);

export default router;