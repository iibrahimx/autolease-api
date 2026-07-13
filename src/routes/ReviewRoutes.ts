import { Router } from "express";
import { ReviewController } from "../controllers/ReviewController.js";
import { authenticate } from "../middlewares/AuthMiddleware.js";
import { validate } from "../middlewares/ValidateMiddleware.js";
import { createReviewSchema, updateReviewSchema } from "../validators/ReviewValidators.js";

const router = Router();

// Public, anyone can see reviews for a car
router.get("/car/:carId", ReviewController.getCarReviews);

// Protected, only authenticated customers can create/edit/delete
router.post("/", authenticate, validate(createReviewSchema), ReviewController.create);
router.put("/:id", authenticate, validate(updateReviewSchema), ReviewController.update);
router.delete("/:id", authenticate, ReviewController.remove);

export default router;