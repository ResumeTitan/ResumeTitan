/**
 * Cover Letter Routes
 *
 * API endpoints for cover letter management and generation.
 *
 * @openapi
 * components:
 *   schemas:
 *     CoverLetter:
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
 *         content:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

import express from 'express';
import verifyToken from '../middleware/auth';
import { getCoverLetters, getCoverLetter, createUpdateCoverLetter, updateCoverLetter, deleteCoverLetter } from '../controllers/coverLetter';

const router = express.Router();

/**
 * @openapi
 * /cover-letter:
 *   get:
 *     summary: Get all cover letters for user
 *     tags: [Cover Letter]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cover letters
 *       401:
 *         description: Not authenticated
 */
router.get('/', verifyToken, getCoverLetters);

/**
 * @openapi
 * /cover-letter/{id}:
 *   get:
 *     summary: Get cover letter by ID
 *     tags: [Cover Letter]
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
 *         description: Cover letter found
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Cover letter not found
 */
router.get('/:id', verifyToken, getCoverLetter);

/**
 * @openapi
 * /cover-letter:
 *   post:
 *     summary: Create or update a cover letter
 *     description: Creates a new cover letter or updates existing. Can use AI to generate content.
 *     tags: [Cover Letter]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CoverLetter'
 *     responses:
 *       200:
 *         description: Cover letter created/updated
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.post('/', verifyToken, createUpdateCoverLetter);

/**
 * @openapi
 * /cover-letter/{id}:
 *   put:
 *     summary: Update cover letter
 *     tags: [Cover Letter]
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
 *             $ref: '#/components/schemas/CoverLetter'
 *     responses:
 *       200:
 *         description: Cover letter updated
 *       401:
 *         description: Not authenticated
 */
router.put('/:id', verifyToken, updateCoverLetter);

/**
 * @openapi
 * /cover-letter/{id}:
 *   delete:
 *     summary: Delete cover letter
 *     tags: [Cover Letter]
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
 *         description: Cover letter deleted
 *       401:
 *         description: Not authenticated
 */
router.delete('/:id', verifyToken, deleteCoverLetter);

export default router;
