import express from "express";
import { 
  postSummary,
  postEducation,
  postWork,
  postSkills,
  postVolunteer,
  postResume,
  getResume, 
  getResumes, 
  updateResume, 
  deleteResume, 
  printResumeToPdf 
} from "../controllers/resume.js";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.get("/", verifyToken, getResume);
router.get("/user", verifyToken, getResumes);
router.post("/print", verifyToken, printResumeToPdf);
router.put("/update", verifyToken, updateResume);
router.delete("/delete/:id", verifyToken, deleteResume);
router.post("/summary", verifyToken, postSummary);
router.post("/education", verifyToken, postEducation);
router.post("/work", verifyToken, postWork);
router.post("/skills", verifyToken, postSkills);
router.post("/volunteer", verifyToken, postVolunteer);
router.post("/resume", verifyToken, postResume);

export default router;
