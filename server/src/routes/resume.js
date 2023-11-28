import express from "express";
import { createResume, getResume, getResumes } from "../controllers/resume.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.post("/create", verifyToken, createResume);
router.get("/", verifyToken, getResume);
router.get("/user", verifyToken, getResumes);

export default router;