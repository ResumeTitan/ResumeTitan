import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { login, register, reload } from "../controllers/auth.js";
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/reload", verifyToken, reload);

export default router;