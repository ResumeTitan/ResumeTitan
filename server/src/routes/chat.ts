import express from 'express';
import { z } from 'zod';
import { openAiClient } from '../ext/clients';
import verifyToken from '../middleware/auth';
import { cacheMiddleware } from '../middleware/cache';
import { chatRateLimiter } from '../middleware/rateLimit';
import { timeout } from '../middleware/timeout';
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from '@langchain/core/prompts';

const router = express.Router();

// Chat endpoint with rate limiting, caching, and timeout
router.post('/', 
  verifyToken, 
  chatRateLimiter,
  timeout(5), // 5 second timeout
  cacheMiddleware(3600), 
  async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Simplified system prompt for faster processing
      const prompt = ChatPromptTemplate.fromMessages([
        SystemMessagePromptTemplate.fromTemplate(
          `You are the ResumeTitan Assistant. Help users with resume creation, interview prep, and cover letters. Keep responses concise and focused on ResumeTitan features only.`
        ),
        HumanMessagePromptTemplate.fromTemplate("{input}")
      ]);

      const messages = await prompt.formatMessages({
        input: message
      });

      const response = await openAiClient.invoke(messages);
      res.json({ response: response.content });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: 'Failed to process chat message' });
    }
  }
);

export default router; 