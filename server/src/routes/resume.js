import express from "express";
import { createResume, getResume, getResumes, updateResume, deleteResume, getResumeAsPdf } from "../controllers/resume.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", verifyToken, createResume);
router.get("/", verifyToken, getResume);
router.get("/user", verifyToken, getResumes);
router.get("/print/:id", verifyToken, getResumeAsPdf)
router.put("/update", verifyToken, updateResume);
router.delete("/delete", verifyToken, deleteResume);

export default router;
