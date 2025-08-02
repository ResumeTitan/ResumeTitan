import express from 'express';
import { getTotalMetrics, getAllMetrics, updateMetric, getMetricsByKey, getDateRangeMetrics } from '../controllers/metrics';
import verifyToken from '../middleware/auth';

const router = express.Router();

router.get('/', verifyToken, getAllMetrics);
router.get('/total', getTotalMetrics);
router.get('/date-range', verifyToken, getDateRangeMetrics);
router.get('/:key', verifyToken, getMetricsByKey);
router.post('/', verifyToken, updateMetric);

export default router;
