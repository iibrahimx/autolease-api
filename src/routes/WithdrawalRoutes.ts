import { Router } from "express";
import { WithdrawalController } from "../controllers/WithdrawalController.js";
import { authenticate } from "../middlewares/AuthMiddleware.js";

const router = Router();

router.post("/", authenticate, WithdrawalController.requestWithdrawal);
router.get("/", authenticate, WithdrawalController.getMyWithdrawals);

export default router;