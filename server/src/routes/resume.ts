import express from "express";
import multer from "multer";
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
  printResumeToPdf,
  uploadPdfResume,
  atsAnalyze
} from "../controllers/resume.js";
import verifyToken from "../middleware/auth";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

router.get("/", verifyToken, getResume);
router.get("/user", verifyToken, getResumes);
router.post("/print", verifyToken, printResumeToPdf);
router.post("/upload-pdf", verifyToken, upload.single('pdf'), uploadPdfResume);
router.put("/update", verifyToken, updateResume);
router.delete("/delete/:id", verifyToken, deleteResume);
router.post("/summary", verifyToken, postSummary);
router.post("/education", verifyToken, postEducation);
router.post("/work", verifyToken, postWork);
router.post("/skills", verifyToken, postSkills);
router.post("/volunteer", verifyToken, postVolunteer);
router.post("/resume", verifyToken, postResume);
router.post('/ats-analyze', verifyToken, atsAnalyze);

export default router;