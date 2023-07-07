import express from "express";
import { createResume, getResume } from "../controllers/resume.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.post("/create", verifyToken, createResume);
router.get("/", verifyToken, getResume);

export default router;