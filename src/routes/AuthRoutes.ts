import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";
import { validate } from "../middlewares/ValidateMiddleware.js";
import { registerSchema, loginSchema } from "../validators/AuthValidators.js";

const router = Router();

router.post("/register", validate(registerSchema), AuthController.register);
router.post("/login", validate(loginSchema), AuthController.login);

export default router;
