import { Router } from "express";
import { CarController } from "../controllers/CarController.js";
import { CustomerCarController } from '../controllers/CustomerCarController.js';
import { authenticate } from "../middlewares/AuthMiddleware.js";
import { validate } from "../middlewares/ValidateMiddleware.js";
import { createCarSchema, updateCarSchema } from "../validators/CarValidators.js";
import { upload } from "../middlewares/UploadMiddleware.js";
import { ImageService } from "../services/ImageService.js";

const router = Router();

// Public routes, customers can browse without authentication
router.get("/browse", CustomerCarController.browseCars);
router.get("/:id", CustomerCarController.getCarDetails);

// Protected routes, only authenticated car owners
router.post("/", authenticate, validate(createCarSchema), CarController.register);
router.get("/my-cars", authenticate, CarController.getMyCars);
router.put("/:id", authenticate, validate(updateCarSchema), CarController.update);
router.delete("/:id", authenticate, CarController.delete);
router.patch("/:id/availability", authenticate, CarController.toggleAvailability);

// Image upload endpoint
router.post(
  "/upload-images",
  authenticate,
  upload.array("images", 5), // "images" is the field name, max 5 files
  async (request, response) => {
    try {
      const files = request.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        response.status(400).json({
          success: false,
          message: "No images provided",
        });
        return;
      }

      const imageUrls = await ImageService.uploadMultipleImages(files);

      response.status(200).json({
        success: true,
        message: "Images uploaded successfully",
        data: { urls: imageUrls },
      });
    } catch (error: any) {
      response.status(400).json({
        success: false,
        message: error.message || "Failed to upload images",
      });
    }
  }
);

export default router;