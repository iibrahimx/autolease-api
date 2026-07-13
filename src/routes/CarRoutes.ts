import { Router } from "express";
import { CarController } from "../controllers/CarController.js";
import { authenticate } from "../middlewares/AuthMiddleware.js";
import { validate } from "../middlewares/ValidateMiddleware.js";
import { createCarSchema, updateCarSchema } from "../validators/CarValidators.js";

const router = Router();

// All car owner routes require authentication
router.post("/", authenticate, validate(createCarSchema), CarController.register);
router.get("/my-cars", authenticate, CarController.getMyCars);
router.put("/:id", authenticate, validate(updateCarSchema), CarController.update);
router.delete("/:id", authenticate, CarController.delete);
router.patch("/:id/availability", authenticate, CarController.toggleAvailability);

export default router;