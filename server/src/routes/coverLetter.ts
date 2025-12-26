import express from "express";
import verifyToken from "../middleware/auth";
import { getCoverLetters, getCoverLetter, createUpdateCoverLetter, updateCoverLetter, deleteCoverLetter } from "../controllers/coverLetter";
const router = express.Router();

router.get("/", verifyToken, getCoverLetters);
router.get("/:id", verifyToken, getCoverLetter);
router.post("/", verifyToken, createUpdateCoverLetter);
router.put("/:id", verifyToken, updateCoverLetter);
router.delete("/:id", verifyToken, deleteCoverLetter);

export default router;
