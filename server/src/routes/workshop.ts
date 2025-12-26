import express from "express";
import { 
  createWorkshop,
  getWorkshop,
  getWorkshops,
  deleteWorkshop,
} from "../controllers/workshop";
import verifyToken from "../middleware/auth";


const router = express.Router();

router.post("/", verifyToken, createWorkshop);
router.get("/", verifyToken, getWorkshops);
router.get("/:id", verifyToken, getWorkshop);
router.delete("/:id", verifyToken, deleteWorkshop);

export default router;
