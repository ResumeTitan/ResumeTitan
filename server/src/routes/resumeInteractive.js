import express from "express";
import { postPersonalInfo, postEducation, postJob, postSkills, postResume } from "../controllers/resumeInteractive.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/personal", verifyToken, postPersonalInfo);
router.post("/education", verifyToken, postEducation);
router.post("/job", verifyToken, postJob);
router.post("/skills", verifyToken, postSkills);
router.post("/resume", verifyToken, postResume);

export default router;
