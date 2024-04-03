import express from "express";
import { createInterview } from "../controllers/interview.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.post("/", verifyToken, createInterview);

export default router;
