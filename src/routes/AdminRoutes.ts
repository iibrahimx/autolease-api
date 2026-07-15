import { Router } from "express";
import { AdminController } from "../controllers/AdminController.js";
import { authenticate } from "../middlewares/AuthMiddleware.js";
import { authorize } from "../middlewares/AuthorizationMiddleware.js";
import { UserRole } from "../entities/User.js";

const router = Router();

// ALL admin routes require authentication AND admin role
router.use(authenticate);
router.use(authorize(UserRole.ADMIN));

router.get("/dashboard", AdminController.getDashboard);
router.patch("/users/:userId/suspend", AdminController.suspendUser);
router.patch("/users/:userId/activate", AdminController.activateUser);
router.patch("/users/:userId/verify", AdminController.verifyOwner);
router.patch("/vehicles/:carId/suspend", AdminController.suspendVehicle);
router.patch("/vehicles/:carId/activate", AdminController.activateVehicle);
router.get("/withdrawals", AdminController.getAllWithdrawals);
router.patch("/withdrawals/:withdrawalId/approve", AdminController.approveWithdrawal);
router.patch("/withdrawals/:withdrawalId/reject", AdminController.rejectWithdrawal);

export default router;