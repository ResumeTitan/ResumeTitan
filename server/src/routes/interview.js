import express from "express";
import { createInterview, getInterviews, getInterview } from "../controllers/interview.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.post("/", verifyToken, createInterview);
router.get("/", verifyToken, getInterviews);
router.get("/:id", verifyToken, getInterview);

export default router;
