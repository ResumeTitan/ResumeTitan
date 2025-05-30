import express from 'express';
import { z } from 'zod';
import { openAiClient } from '../ext/clients';
import verifyToken from '../middleware/auth';
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from '@langchain/core/prompts';

const router = express.Router();

// Chat endpoint
router.post('/', verifyToken, async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const prompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(
        `You are the ResumeTitan Assistant, a helpful guide for the ResumeTitan application. Your role is to:
        1. Help users understand and use ResumeTitan's features
        2. Guide users through creating and managing their resumes
        3. Explain how to use the resume builder, interview preparation, and cover letter features
        4. Provide tips for creating effective resumes within the ResumeTitan platform
        5. Answer questions about ResumeTitan's functionality and features
        
        Important: Only discuss features and functionality available within the ResumeTitan application. Do not suggest external services or tools.`
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
});

export default router; 