/**
 * Workshop Routes
 *
 * API endpoints for collaborative resume editing sessions.
 * Workshops allow multiple users to view and comment on resumes.
 *
 * @openapi
 * components:
 *   schemas:
 *     Workshop:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB document ID
 *         name:
 *           type: string
 *           description: Workshop name/title
 *         clerkId:
 *           type: string
 *           description: Owner's Clerk user ID
 *         resumeId:
 *           type: string
 *           description: Associated resume ID
 *         ownerName:
 *           type: string
 *         ownerEmail:
 *           type: string
 *         shareEnabled:
 *           type: boolean
 *           description: Whether sharing is enabled
 *         shareToken:
 *           type: string
 *           description: UUID token for share links
 *         participants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Participant'
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *     Participant:
 *       type: object
 *       properties:
 *         clerkId:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         initials:
 *           type: string
 *           description: 2-letter initials for avatar
 *         color:
 *           type: string
 *           description: Hex color for avatar
 *         isOnline:
 *           type: boolean
 *         isActive:
 *           type: boolean
 *         joinedAt:
 *           type: string
 *           format: date-time
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: UUID
 *         authorClerkId:
 *           type: string
 *         authorName:
 *           type: string
 *         authorInitials:
 *           type: string
 *         authorColor:
 *           type: string
 *         text:
 *           type: string
 *         section:
 *           type: string
 *           description: Resume section this comment refers to
 *         timestamp:
 *           type: string
 *           format: date-time
 *         resolved:
 *           type: boolean
 *         resolvedBy:
 *           type: string
 *         replies:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 */

import express from 'express';
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
} from '../controllers/workshop';
import verifyToken from '../middleware/auth';

const router = express.Router();

/**
 * @openapi
 * /workshop:
 *   post:
 *     summary: Create a new workshop
 *     description: Creates a collaborative editing session for a resume. Owner is auto-added as participant.
 *     tags: [Workshop]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resumeId
 *             properties:
 *               resumeId:
 *                 type: string
 *                 description: ID of resume to link
 *               name:
 *                 type: string
 *                 description: Workshop name (defaults to resume name)
 *               ownerName:
 *                 type: string
 *               ownerEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Workshop created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 workshop:
 *                   $ref: '#/components/schemas/Workshop'
 *       400:
 *         description: Missing resumeId
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Resume not found
 *       500:
 *         description: Server error
 */
router.post('/', verifyToken, createWorkshop);

/**
 * @openapi
 * /workshop:
 *   get:
 *     summary: Get all workshops
 *     description: Retrieves all workshops the user owns or has been invited to.
 *     tags: [Workshop]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lists of owned and shared workshops
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 owned:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Workshop'
 *                 shared:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Workshop'
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.get('/', verifyToken, getWorkshops);

/**
 * @openapi
 * /workshop/shared/{token}:
 *   get:
 *     summary: Access workshop via share link
 *     description: Retrieves a workshop using its share token. Adds user as participant if not already present. Redirects owners to main workshop page.
 *     tags: [Workshop]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Share token UUID
 *       - in: query
 *         name: userName
 *         schema:
 *           type: string
 *         description: Display name for participant
 *       - in: query
 *         name: userEmail
 *         schema:
 *           type: string
 *         description: Email for participant
 *     responses:
 *       200:
 *         description: Workshop data (or redirect instruction for owners)
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     workshop:
 *                       $ref: '#/components/schemas/Workshop'
 *                     resume:
 *                       $ref: '#/components/schemas/Resume'
 *                     role:
 *                       type: string
 *                       enum: [commenter]
 *                     canEdit:
 *                       type: boolean
 *                 - type: object
 *                   properties:
 *                     redirectToWorkshop:
 *                       type: boolean
 *                     workshopId:
 *                       type: string
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Workshop not found or sharing disabled
 *       500:
 *         description: Server error
 */
router.get('/shared/:token', verifyToken, getWorkshopByShareToken);

/**
 * @openapi
 * /workshop/{id}:
 *   get:
 *     summary: Get workshop by ID
 *     description: Retrieves a workshop. Returns role info (owner vs commenter).
 *     tags: [Workshop]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Workshop ID
 *     responses:
 *       200:
 *         description: Workshop found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 workshop:
 *                   $ref: '#/components/schemas/Workshop'
 *                 role:
 *                   type: string
 *                   enum: [owner, commenter]
 *                 canEdit:
 *                   type: boolean
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Workshop not found
 *       500:
 *         description: Server error
 */
router.get('/:id', verifyToken, getWorkshop);

/**
 * @openapi
 * /workshop/{id}:
 *   put:
 *     summary: Update workshop
 *     description: Updates workshop metadata. Owner only.
 *     tags: [Workshop]
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Workshop updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 workshop:
 *                   $ref: '#/components/schemas/Workshop'
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Workshop not found or not owner
 *       500:
 *         description: Server error
 */
router.put('/:id', verifyToken, updateWorkshop);

/**
 * @openapi
 * /workshop/{id}:
 *   delete:
 *     summary: Delete workshop
 *     description: Permanently deletes a workshop. Owner only.
 *     tags: [Workshop]
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
 *         description: Workshop deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 workshop:
 *                   $ref: '#/components/schemas/Workshop'
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Workshop not found or not owner
 *       500:
 *         description: Server error
 */
router.delete('/:id', verifyToken, deleteWorkshop);

/**
 * @openapi
 * /workshop/{id}/share:
 *   post:
 *     summary: Toggle workshop sharing
 *     description: Enables or disables sharing. Generates share token if enabling for first time.
 *     tags: [Workshop]
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
 *             type: object
 *             required:
 *               - enabled
 *             properties:
 *               enabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Sharing toggled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 workshop:
 *                   $ref: '#/components/schemas/Workshop'
 *                 shareUrl:
 *                   type: string
 *                   nullable: true
 *                   description: Share URL if enabled, null if disabled
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Workshop not found or not owner
 *       500:
 *         description: Server error
 */
router.post('/:id/share', verifyToken, toggleWorkshopSharing);

/**
 * @openapi
 * /workshop/{id}/comment:
 *   post:
 *     summary: Add a comment
 *     description: Adds a new top-level comment. Available to owners and participants.
 *     tags: [Workshop, Comments]
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
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *               section:
 *                 type: string
 *                 description: Resume section this comment refers to
 *               authorName:
 *                 type: string
 *               authorEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Workshop not found or access denied
 *       500:
 *         description: Server error
 */
router.post('/:id/comment', verifyToken, addComment);

/**
 * @openapi
 * /workshop/{id}/comment/{commentId}/reply:
 *   post:
 *     summary: Reply to a comment
 *     description: Adds a reply to an existing comment.
 *     tags: [Workshop, Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *               authorName:
 *                 type: string
 *               authorEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reply added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reply:
 *                   $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Workshop or comment not found
 *       500:
 *         description: Server error
 */
router.post('/:id/comment/:commentId/reply', verifyToken, replyToComment);

/**
 * @openapi
 * /workshop/{id}/comment/{commentId}/resolve:
 *   patch:
 *     summary: Resolve or unresolve a comment
 *     description: Marks a comment as resolved or unresolved. Only owner or comment author can do this.
 *     tags: [Workshop, Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resolved
 *             properties:
 *               resolved:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Comment resolution status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized to resolve this comment
 *       404:
 *         description: Workshop or comment not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/comment/:commentId/resolve', verifyToken, resolveComment);

export default router;
