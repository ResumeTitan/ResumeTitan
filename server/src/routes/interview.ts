import express from "express";
import { 
  createUpdateInterview, 
  getInterviews, 
  getInterview, 
  updateInterview, 
  deleteInterview,
  analyzeInterview
} from "../controllers/interview";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.post("/", verifyToken, createUpdateInterview);
router.get("/", verifyToken, getInterviews);
router.get("/:id", verifyToken, getInterview);
router.delete("/:id", verifyToken, deleteInterview);
router.put("/:id", verifyToken, updateInterview);
router.post("/analyze", verifyToken, analyzeInterview);

export default router;
