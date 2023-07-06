import express from "express";
import { createResume } from "../controllers/resume.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.post("/create", verifyToken, createResume);

export default router;