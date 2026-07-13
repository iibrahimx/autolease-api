import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";
import { validate } from "../middlewares/ValidateMiddleware.js";
import { registerSchema, loginSchema } from "../validators/AuthValidators.js";
import { changePasswordSchema, forgotPasswordSchema, resetPasswordSchema } from "../validators/AuthValidators.js";
import { authenticate } from '../middlewares/AuthMiddleware.js';

const router = Router();

router.post("/register", validate(registerSchema), AuthController.register);
router.post("/login", validate(loginSchema), AuthController.login);

// Protected routes
router.post("/change-password", authenticate, validate(changePasswordSchema), AuthController.changePassword);

// Public routes
router.post("/forgot-password", validate(forgotPasswordSchema), AuthController.forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), AuthController.resetPassword);

export default router;
