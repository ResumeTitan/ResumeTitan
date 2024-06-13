import express from "express";
import { createUpdateInterview, getInterviews, getInterview, updateInterview, deleteInterview } from "../controllers/interview.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.post("/", verifyToken, createUpdateInterview);
router.get("/", verifyToken, getInterviews);
router.get("/:id", verifyToken, getInterview);
router.delete("/:id", verifyToken, deleteInterview);
router.put("/:id", verifyToken, updateInterview);

export default router;
