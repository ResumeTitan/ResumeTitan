import express from 'express';
import { reload, handleClerk } from '../controllers/auth';
import verifyToken from "../middleware/auth";

const router = express.Router();

router.get('/reload', verifyToken, reload);
router.post('/clerk', handleClerk);

export default router;
