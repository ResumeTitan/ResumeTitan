import express from "express";
import {
  createWorkshop,
  getWorkshop,
  getWorkshops,
  updateWorkshop,
  deleteWorkshop,
  getWorkshopByShareToken,
  toggleWorkshopSharing,
  addComment,
  replyToComment,
  resolveComment,
} from "../controllers/workshop";
import verifyToken from "../middleware/auth";

const router = express.Router();

// Workshop CRUD
router.post("/", verifyToken, createWorkshop);
router.get("/", verifyToken, getWorkshops);
router.get("/shared/:token", verifyToken, getWorkshopByShareToken);
router.get("/:id", verifyToken, getWorkshop);
router.put("/:id", verifyToken, updateWorkshop);
router.delete("/:id", verifyToken, deleteWorkshop);

// Sharing
router.post("/:id/share", verifyToken, toggleWorkshopSharing);

// Comments
router.post("/:id/comment", verifyToken, addComment);
router.post("/:id/comment/:commentId/reply", verifyToken, replyToComment);
router.patch("/:id/comment/:commentId/resolve", verifyToken, resolveComment);

export default router;