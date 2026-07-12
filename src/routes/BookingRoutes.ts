import { Router } from "express";
import { BookingController } from "../controllers/BookingController.js";
import { authenticate } from "../middlewares/AuthMiddleware.js";

const router = Router();

router.post("/", authenticate, BookingController.create);
router.put("/:id/cancel", authenticate, BookingController.cancel);

export default router;
