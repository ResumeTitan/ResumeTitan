import express from "express";
import { 
  postSummary, 
  postEducation, 
  postJob, 
  postSkills, 
  postResume, 
  getResume, 
  getResumes, 
  updateResume, 
  deleteResume, 
  getResumeAsPdf 
} from "../controllers/resume.js";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.get("/", verifyToken, getResume);
router.get("/user", verifyToken, getResumes);
router.get("/print/:id", verifyToken, getResumeAsPdf);
router.put("/update", verifyToken, updateResume);
router.delete("/delete", verifyToken, deleteResume);
router.post("/summary", verifyToken, postSummary);
router.post("/education", verifyToken, postEducation);
router.post("/job", verifyToken, postJob);
router.post("/skills", verifyToken, postSkills);
router.post("/resume", verifyToken, postResume);

export default router;
