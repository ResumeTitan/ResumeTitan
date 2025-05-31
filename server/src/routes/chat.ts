import express from 'express';
import { z } from 'zod';
import { geminiClient } from '../ext/clients';
import verifyToken from '../middleware/auth';

const router = express.Router();

// Chat endpoint
router.post('/', verifyToken, async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemPrompt = `You are the ResumeTitan Assistant, a helpful guide for the ResumeTitan application. Your role is to:
1. Help users understand and use ResumeTitan's features
2. Guide users through creating and managing their resumes
3. Explain how to use the resume builder, interview preparation, and cover letter features
4. Provide tips for creating effective resumes within the ResumeTitan platform
5. Answer questions about ResumeTitan's functionality and features

Important: Only discuss features and functionality available within the ResumeTitan application. Do not suggest external services or tools.

User question: ${message}`;

    const result = await geminiClient.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

export default router; 