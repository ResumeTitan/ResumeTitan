import express from "express";
import { createResume, getResume, getResumes, updateResume } from "../controllers/resume.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.post("/create", verifyToken, createResume);
router.get("/", verifyToken, getResume);
router.get("/user", verifyToken, getResumes);
router.put("/update", verifyToken, updateResume);

export default router;