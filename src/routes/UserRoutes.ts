import { Router } from "express";
import { UserController } from "../controllers/UserController.js";
import { authenticate } from "../middlewares/AuthMiddleware.js";

const router = Router();

// Protected route - only authenticated users can access
router.get("/profile", authenticate, UserController.getProfile);

export default router;
