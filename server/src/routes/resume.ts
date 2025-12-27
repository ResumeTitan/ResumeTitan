/**
 * Resume Routes
 *
 * API endpoints for resume CRUD operations and AI-powered content generation.
 * All routes require authentication via Clerk JWT token.
 *
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Clerk session token
 *   schemas:
 *     Resume:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB document ID
 *         name:
 *           type: string
 *           description: Resume title/name
 *         theme:
 *           type: string
 *           enum: [professional, harvard, macchiato, stratton, onepage, student-classic, academic-modern]
 *         font:
 *           type: string
 *           enum: [times-new-roman, arial, georgia, calibri, cambria, sans-serif]
 *         sections:
 *           type: array
 *           items:
 *             type: string
 *           description: Active sections to display
 *         basics:
 *           $ref: '#/components/schemas/Basics'
 *         education:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Education'
 *         work:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Work'
 *         projects:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Project'
 *         skills:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Skill'
 *         volunteer:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Volunteer'
 *     Basics:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         summary:
 *           type: string
 *         location:
 *           type: object
 *           properties:
 *             city:
 *               type: string
 *             region:
 *               type: string
 *     Education:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         institution:
 *           type: string
 *         studyType:
 *           type: string
 *         area:
 *           type: string
 *         startDate:
 *           type: string
 *         endDate:
 *           type: string
 *         highlights:
 *           type: array
 *           items:
 *             type: string
 *     Work:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         name:
 *           type: string
 *           description: Company name
 *         position:
 *           type: string
 *         startDate:
 *           type: string
 *         endDate:
 *           type: string
 *         highlights:
 *           type: array
 *           items:
 *             type: string
 *     Project:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         name:
 *           type: string
 *         startDate:
 *           type: string
 *         endDate:
 *           type: string
 *         url:
 *           type: string
 *         highlights:
 *           type: array
 *           items:
 *             type: string
 *     Skill:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         level:
 *           type: string
 *         keywords:
 *           type: array
 *           items:
 *             type: string
 *     Volunteer:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         organization:
 *           type: string
 *         position:
 *           type: string
 *         startDate:
 *           type: string
 *         endDate:
 *           type: string
 *         highlights:
 *           type: array
 *           items:
 *             type: string
 *     AIGenerationRequest:
 *       type: object
 *       properties:
 *         userInput:
 *           type: string
 *           description: User instructions for AI generation/editing
 *         operationType:
 *           type: string
 *           enum: [generate, edit, brainstorm]
 *           description: Type of AI operation
 *     Error:
 *       type: object
 *       properties:
 *         msg:
 *           type: string
 *         error:
 *           type: string
 */

import express from "express";
import multer from "multer";
import {
  postSummary,
  postEducation,
  postWork,
  postProjects,
  postSkills,
  postVolunteer,
  postResume,
  getResume,
  getResumes,
  updateResume,
  deleteResume,
  printResumeToPdf,
  uploadPdfResume
} from "../controllers/resume.js";
import verifyToken from "../middleware/auth";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

/**
 * @openapi
 * /resume:
 *   get:
 *     summary: Get a resume by ID
 *     description: Retrieves a single resume. Only returns if the authenticated user owns it.
 *     tags: [Resume]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resume MongoDB ID
 *     responses:
 *       200:
 *         description: Resume found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resume:
 *                   $ref: '#/components/schemas/Resume'
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Resume not found
 *       500:
 *         description: Server error
 */
router.get("/", verifyToken, getResume);

/**
 * @openapi
 * /resume/user:
 *   get:
 *     summary: Get all resumes for a user
 *     description: Retrieves all resumes owned by the user, sorted by most recently modified.
 *     tags: [Resume]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Clerk user ID
 *     responses:
 *       200:
 *         description: List of resumes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resumes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Resume'
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.get("/user", verifyToken, getResumes);

/**
 * @openapi
 * /resume/print:
 *   post:
 *     summary: Export resume to PDF
 *     description: Renders the resume using headless Puppeteer and returns a PDF file.
 *     tags: [Resume]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: Resume ID to print
 *     responses:
 *       200:
 *         description: PDF file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: PDF generation failed
 */
router.post("/print", verifyToken, printResumeToPdf);

/**
 * @openapi
 * /resume/upload-pdf:
 *   post:
 *     summary: Upload and parse a PDF resume
 *     description: Uses Gemini AI to extract structured data from an uploaded PDF resume.
 *     tags: [Resume]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - pdf
 *             properties:
 *               pdf:
 *                 type: string
 *                 format: binary
 *                 description: PDF file (max 10MB)
 *     responses:
 *       200:
 *         description: Extracted resume data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resume'
 *       400:
 *         description: No file uploaded or file too large
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: AI parsing failed
 */
router.post("/upload-pdf", verifyToken, upload.single('pdf'), uploadPdfResume);

/**
 * @openapi
 * /resume/update:
 *   put:
 *     summary: Create or update a resume
 *     description: Creates a new resume if no _id provided, updates existing otherwise. Increments metrics on new creation.
 *     tags: [Resume]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Resume'
 *     responses:
 *       200:
 *         description: Resume saved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resume:
 *                   $ref: '#/components/schemas/Resume'
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.put("/update", verifyToken, updateResume);

/**
 * @openapi
 * /resume/delete/{id}:
 *   delete:
 *     summary: Delete a resume
 *     description: Permanently deletes a resume by ID.
 *     tags: [Resume]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resume ID to delete
 *     responses:
 *       200:
 *         description: Resume deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resume:
 *                   $ref: '#/components/schemas/Resume'
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.delete("/delete/:id", verifyToken, deleteResume);

/**
 * @openapi
 * /resume/summary:
 *   post:
 *     summary: Generate or edit resume summary
 *     description: Uses AI to generate a professional summary or edit an existing one based on user instructions.
 *     tags: [Resume, AI Generation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/AIGenerationRequest'
 *               - type: object
 *                 properties:
 *                   basics:
 *                     $ref: '#/components/schemas/Basics'
 *                   work:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Work'
 *                   education:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Education'
 *     responses:
 *       200:
 *         description: Generated summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 response:
 *                   type: object
 *                   properties:
 *                     summary:
 *                       type: string
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: AI generation failed
 */
router.post("/summary", verifyToken, postSummary);

/**
 * @openapi
 * /resume/education:
 *   post:
 *     summary: Generate or edit education highlights
 *     description: Uses AI to generate education achievements or edit existing highlights.
 *     tags: [Resume, AI Generation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/AIGenerationRequest'
 *               - type: object
 *                 properties:
 *                   education:
 *                     $ref: '#/components/schemas/Education'
 *     responses:
 *       200:
 *         description: Generated education entry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 response:
 *                   $ref: '#/components/schemas/Education'
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: AI generation failed
 */
router.post("/education", verifyToken, postEducation);

/**
 * @openapi
 * /resume/work:
 *   post:
 *     summary: Generate or edit work experience highlights
 *     description: Uses AI to generate work achievements or edit existing highlights.
 *     tags: [Resume, AI Generation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/AIGenerationRequest'
 *               - type: object
 *                 properties:
 *                   job:
 *                     $ref: '#/components/schemas/Work'
 *     responses:
 *       200:
 *         description: Generated work entry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 response:
 *                   $ref: '#/components/schemas/Work'
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: AI generation failed
 */
router.post("/work", verifyToken, postWork);

/**
 * @openapi
 * /resume/projects:
 *   post:
 *     summary: Generate or edit project highlights
 *     description: Uses AI to generate project descriptions or edit existing highlights.
 *     tags: [Resume, AI Generation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/AIGenerationRequest'
 *               - type: object
 *                 properties:
 *                   project:
 *                     $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: Generated project entry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 response:
 *                   $ref: '#/components/schemas/Project'
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: AI generation failed
 */
router.post("/projects", verifyToken, postProjects);

/**
 * @openapi
 * /resume/skills:
 *   post:
 *     summary: Generate or organize skills
 *     description: Uses AI to generate skills based on experience or organize/categorize existing skills.
 *     tags: [Resume, AI Generation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/AIGenerationRequest'
 *               - type: object
 *                 properties:
 *                   skills:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Skill'
 *                   work:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Work'
 *                   education:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Education'
 *     responses:
 *       200:
 *         description: Generated skills
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 response:
 *                   type: object
 *                   properties:
 *                     skills:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Skill'
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: AI generation failed
 */
router.post("/skills", verifyToken, postSkills);

/**
 * @openapi
 * /resume/volunteer:
 *   post:
 *     summary: Generate or edit volunteer highlights
 *     description: Uses AI to generate volunteer experience highlights or edit existing ones.
 *     tags: [Resume, AI Generation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/AIGenerationRequest'
 *               - type: object
 *                 properties:
 *                   volunteer:
 *                     $ref: '#/components/schemas/Volunteer'
 *     responses:
 *       200:
 *         description: Generated volunteer entry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 response:
 *                   $ref: '#/components/schemas/Volunteer'
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: AI generation failed
 */
router.post("/volunteer", verifyToken, postVolunteer);

/**
 * @openapi
 * /resume/resume:
 *   post:
 *     summary: Generate complete resume
 *     description: Uses AI to generate a complete resume from accumulated data.
 *     tags: [Resume, AI Generation]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Generated resume
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resume:
 *                   $ref: '#/components/schemas/Resume'
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: AI generation failed
 */
router.post("/resume", verifyToken, postResume);

export default router;