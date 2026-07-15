import { Router } from "express";
import { WebhookController } from "../controllers/WebhookController.js";

const router = Router();

router.post("/stripe", WebhookController.handleStripeWebhook);

export default router;