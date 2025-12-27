/**
 * Metrics Routes
 *
 * API endpoints for usage analytics and metrics tracking.
 *
 * @openapi
 * components:
 *   schemas:
 *     Metric:
 *       type: object
 *       properties:
 *         key:
 *           type: string
 *           description: Metric identifier (e.g., RESUMES_TOTAL, AI_CALLS)
 *         value:
 *           type: number
 *         date:
 *           type: string
 *           format: date-time
 */

import express from 'express';
import { getTotalMetrics, getAllMetrics, updateMetric, getMetricsByKey, getDateRangeMetrics } from '../controllers/metrics';
import verifyToken from '../middleware/auth';

const router = express.Router();

/**
 * @openapi
 * /metrics:
 *   get:
 *     summary: Get all metrics
 *     tags: [Metrics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All metrics
 *       401:
 *         description: Not authenticated
 */
router.get('/', verifyToken, getAllMetrics);

/**
 * @openapi
 * /metrics/total:
 *   get:
 *     summary: Get total/aggregate metrics
 *     description: Public endpoint for displaying total counts.
 *     tags: [Metrics]
 *     responses:
 *       200:
 *         description: Total metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalResumes:
 *                   type: number
 *                 totalUsers:
 *                   type: number
 */
router.get('/total', getTotalMetrics);

/**
 * @openapi
 * /metrics/date-range:
 *   get:
 *     summary: Get metrics within date range
 *     tags: [Metrics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Metrics in range
 *       401:
 *         description: Not authenticated
 */
router.get('/date-range', verifyToken, getDateRangeMetrics);

/**
 * @openapi
 * /metrics/{key}:
 *   get:
 *     summary: Get metrics by key
 *     tags: [Metrics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: Metric key (e.g., RESUMES_TOTAL)
 *     responses:
 *       200:
 *         description: Metric data
 *       401:
 *         description: Not authenticated
 */
router.get('/:key', verifyToken, getMetricsByKey);

/**
 * @openapi
 * /metrics:
 *   post:
 *     summary: Update/increment a metric
 *     tags: [Metrics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *             properties:
 *               key:
 *                 type: string
 *               value:
 *                 type: number
 *                 default: 1
 *     responses:
 *       200:
 *         description: Metric updated
 *       401:
 *         description: Not authenticated
 */
router.post('/', verifyToken, updateMetric);

export default router;
