/**
 * Interview Routes
 *
 * API endpoints for interview preparation and practice.
 *
 * @openapi
 * components:
 *   schemas:
 *     Interview:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         clerkId:
 *           type: string
 *         resumeId:
 *           type: string
 *         jobTitle:
 *           type: string
 *         company:
 *           type: string
 *         questions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               answer:
 *                 type: string
 *               feedback:
 *                 type: string
 */

import express from 'express';
import {
    createUpdateInterview,
    getInterviews,
    getInterview,
    updateInterview,
    deleteInterview,
    analyzeInterview,
} from '../controllers/interview';
import verifyToken from '../middleware/auth';

const router = express.Router();

/**
 * @openapi
 * /interview:
 *   post:
 *     summary: Create or update an interview session
 *     description: Creates a new interview prep session or updates existing.
 *     tags: [Interview]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Interview'
 *     responses:
 *       200:
 *         description: Interview created/updated
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.post('/', verifyToken, createUpdateInterview);

/**
 * @openapi
 * /interview:
 *   get:
 *     summary: Get all interviews for user
 *     tags: [Interview]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of interviews
 *       401:
 *         description: Not authenticated
 */
router.get('/', verifyToken, getInterviews);

/**
 * @openapi
 * /interview/{id}:
 *   get:
 *     summary: Get interview by ID
 *     tags: [Interview]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Interview found
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Interview not found
 */
router.get('/:id', verifyToken, getInterview);

/**
 * @openapi
 * /interview/{id}:
 *   delete:
 *     summary: Delete interview
 *     tags: [Interview]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Interview deleted
 *       401:
 *         description: Not authenticated
 */
router.delete('/:id', verifyToken, deleteInterview);

/**
 * @openapi
 * /interview/{id}:
 *   put:
 *     summary: Update interview
 *     tags: [Interview]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Interview'
 *     responses:
 *       200:
 *         description: Interview updated
 *       401:
 *         description: Not authenticated
 */
router.put('/:id', verifyToken, updateInterview);

/**
 * @openapi
 * /interview/analyze:
 *   post:
 *     summary: Analyze interview response with AI
 *     description: Uses AI to analyze and provide feedback on interview answers.
 *     tags: [Interview, AI Generation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               answer:
 *                 type: string
 *               jobTitle:
 *                 type: string
 *     responses:
 *       200:
 *         description: AI feedback on answer
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: AI analysis failed
 */
router.post('/analyze', verifyToken, analyzeInterview);

export default router;
