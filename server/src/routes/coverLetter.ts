import express from "express";
import verifyToken from "../middleware/auth";
import { getCoverLetters, getCoverLetter, createUpdateCoverLetter } from "../controllers/coverLetter";
const router = express.Router();

router.get("/", verifyToken, getCoverLetters);
router.get("/:id", verifyToken, getCoverLetter);
router.post("/", verifyToken, createUpdateCoverLetter);

export default router;
