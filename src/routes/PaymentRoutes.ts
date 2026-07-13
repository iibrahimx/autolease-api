import { Router } from "express";
import { PaymentController } from "../controllers/PaymentController.js";
import { authenticate } from "../middlewares/AuthMiddleware.js";

const router = Router();

router.post("/create", authenticate, PaymentController.createPayment);

export default router;
