/**
 * Chat Routes
 *
 * AI chatbot endpoint for ResumeTitan assistant.
 * Uses Gemini with documentation context to answer user questions.
 *
 * @openapi
 * /chat:
 *   post:
 *     summary: Chat with ResumeTitan assistant
 *     description: |
 *       AI-powered chatbot that answers questions about ResumeTitan features.
 *       Uses Gemini with documentation context. Rate limited and cached.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: User's question or message
 *     responses:
 *       200:
 *         description: AI response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   description: Markdown-formatted response
 *       400:
 *         description: Message is required
 *       401:
 *         description: Not authenticated
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: AI processing failed
 */

import express from 'express';
import { geminiClient } from '../ext/clients';
import { cacheMiddleware } from '../middleware/cache';
import { chatRateLimiter } from '../middleware/rateLimit';
import { timeout } from '../middleware/timeout';
import verifyToken from '../middleware/auth';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// --- Markdown Docs Loader ---
const DOCS_DIR = path.join(__dirname, '../docs');
let docsCache: { [filename: string]: string } = {};
let docsSummary = '';

function loadDocs() {
    const files = fs.readdirSync(DOCS_DIR).filter(f => f.endsWith('.md'));
    docsCache = {};
    let summaryLines: string[] = [];
    for (const file of files) {
        const content = fs.readFileSync(path.join(DOCS_DIR, file), 'utf8');
        docsCache[file] = content;
        // Use first heading as topic summary
        const firstHeading = content.match(/^#\s+(.+)$/m);
        summaryLines.push(`- ${firstHeading ? firstHeading[1] : file.replace('.md', '')}`);
    }
    docsSummary = summaryLines.join('\n');
}

// Load docs on server start
loadDocs();

// Discord webhook URL
const DISCORD_WEBHOOK_URL =
    'https://discord.com/api/webhooks/1380697490973659236/hTdMb8iO5Ge4fov_rYKhjBcs_YsHGBAbqvegR1faRqf-MfWOZhDg-v586kaRaq5Etsi0';

// Function to send message to Discord
async function sendToDiscord(content: string, isUser: boolean) {
    try {
        await axios.post(DISCORD_WEBHOOK_URL, {
            content: `**${isUser ? 'User' : 'Bot'}**: ${content}`,
            username: isUser ? 'User Message' : 'ResumeTitan Bot',
        });
    } catch (error) {
        console.error('Error sending to Discord:', error);
    }
}

// Chat endpoint
router.post(
    '/',
    verifyToken,
    chatRateLimiter,
    timeout(12),
    cacheMiddleware(3600), // Cache responses for 1 hour
    async (req, res) => {
        try {
            const { message } = req.body;

            if (!message) {
                return res.status(400).json({ error: 'Message is required' });
            }

            // Send user message to Discord
            await sendToDiscord(message, true);

            // Try to find relevant docs for the user message
            let relevantDocs = '';
            for (const [filename, content] of Object.entries(docsCache)) {
                const topic = filename.replace('.md', '').toLowerCase();
                if (message.toLowerCase().includes(topic)) {
                    relevantDocs += `\n\n[${topic} guide]\n` + content.substring(0, 2000); // Limit to 2000 chars per doc
                }
            }

            const systemPrompt = `You are the ResumeTitan Assistant, a helpful guide for the ResumeTitan application. Your role is to:
1. Help users understand and use ResumeTitan's features
2. Guide users through creating and managing their resumes
3. Explain how to use the resume builder, interview preparation, and cover letter features
4. Provide tips for creating effective resumes within the ResumeTitan platform
5. Answer questions about ResumeTitan's functionality and features

You have access to the following documentation topics:\n${docsSummary}\n
${relevantDocs ? 'Relevant documentation for this question is included below:\n' + relevantDocs : ''}

Important guidelines:
- Keep responses extremely concise (1-2 paragraphs maximum)
- For step-by-step instructions, use bullet points (•) instead of numbers
- Each bullet point should be a single, clear action
- Use numbered lists only for ranking or priority
- Focus on the most essential information only
- Skip obvious or redundant information
- Only discuss features and functionality available within the ResumeTitan platform
- Do not suggest external services or tools
- NEVER start with generic introductions
- ALWAYS start with a clear heading and get straight to the point
- For best practices, use bullet points with key points only
- When explaining complex features, reference our documentation at /docs
- Be specific about feature names and locations in the UI
- For documentation links, use markdown format: [Guide Name](/docs/feature-name)
- Always include a specific documentation link for complex features
- Use bold for UI elements and important terms
- Always use proper markdown formatting for documentation links

Format your responses using markdown:
- Use **bold** for emphasis
- Use bullet points (•) for step-by-step instructions
- Each bullet point must be on its own line with a blank line between points
- Use numbered lists only for ranking
- Use headings (##) for main sections only
- Keep paragraphs to 2-3 sentences maximum
- Use code blocks only for specific commands
- Use [documentation links](/docs) for detailed guides

Example format for a how-to question:
## Adding a Job

• Navigate to your resume

• Click the **Experience** section

• Click **Add Job**

• Fill in the details

• Click **Save**

Example format for best practices:
## Resume Summary Best Practices

• Keep it to 3-4 sentences

• Focus on **key achievements**

• Include **quantifiable results**

• Match job requirements

Example format for complex features:
## AI Interview Prep

• Open the **Interview Prep** section

• Select your target role

• Choose interview type

• Click **Start Practice**

For detailed tips and strategies, see our [Interview Prep Guide](/docs/interview)

User question: ${message}`;

            const result = await geminiClient.generateContent(systemPrompt);
            const response = await result.response;
            const text = response.text();

            // Send bot response to Discord
            await sendToDiscord(text, false);

            res.json({ response: text });
        } catch (error) {
            console.error('Chat error:', error);
            res.status(500).json({ error: 'Failed to process chat message' });
        }
    }
);

export default router;
