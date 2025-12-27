/**
 * Auth Routes
 *
 * Authentication endpoints for user management via Clerk webhooks.
 *
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         clerkId:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 */

import express from 'express';
import { reload, handleClerk } from '../controllers/auth';
import verifyToken from "../middleware/auth";

const router = express.Router();

/**
 * @openapi
 * /auth/reload:
 *   get:
 *     summary: Reload user data
 *     description: Fetches the current user's data from the database.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: User not found
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.get('/reload', verifyToken, reload);

/**
 * @openapi
 * /auth/clerk:
 *   post:
 *     summary: Clerk webhook handler
 *     description: Handles Clerk webhook events for user lifecycle (created, updated, deleted).
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - data
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [user.created, user.updated, user.deleted]
 *               data:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   email:
 *                     type: string
 *     responses:
 *       200:
 *         description: Webhook processed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 msg:
 *                   type: string
 *       404:
 *         description: Unknown event type or user not found
 *       500:
 *         description: Server error
 */
router.post('/clerk', handleClerk);

export default router;
