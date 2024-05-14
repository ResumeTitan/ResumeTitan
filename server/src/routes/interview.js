import express from "express";
import { createInterview, getInterviews, getInterview, deleteInterview } from "../controllers/interview.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.post("/", verifyToken, createInterview);
router.get("/", verifyToken, getInterviews);
router.get("/:id", verifyToken, getInterview);
router.delete("/:id", verifyToken, deleteInterview);

export default router;
