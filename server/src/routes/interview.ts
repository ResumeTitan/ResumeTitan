import express from "express";
import { 
  createUpdateInterview, 
  getInterviews, 
  getInterview, 
  updateInterview, 
  deleteInterview 
} from "../controllers/interview";
import verifyToken from "../middleware/auth";
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';


const router = express.Router();


const verify = ClerkExpressWithAuth({
  jwtKey: process.env.CLERK_JWT_SECRET,
  authorizedParties: ["http://localhost:3000"],
  signInUrl: "/"
});

router.post("/", verify, createUpdateInterview);
router.get("/", verify, getInterviews);
router.get("/:id", verify, getInterview);
router.delete("/:id", verify, deleteInterview);
router.put("/:id", verify, updateInterview);

export default router;
