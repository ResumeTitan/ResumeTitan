import express from "express";
import { createCheckoutSession, webhook } from "../controllers/stripe.js";
const router = express.Router();

router.post("/session", createCheckoutSession);
router.post("/webhook", webhook);

export default router;
