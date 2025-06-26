import express from "express";
import verifyToken from "../middleware/auth";
import { createCheckoutSession, webhook } from "../controllers/stripe.js";
const router = express.Router();

router.post("/session", verifyToken, createCheckoutSession);
router.post("/webhook", webhook);

export default router;
