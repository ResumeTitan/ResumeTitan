import express from 'express';
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
        "You are a helpful AI assistant for ResumeTitan, a resume building application. Help users with their resume-related questions and provide guidance on resume writing best practices."
      ),
      HumanMessagePromptTemplate.fromTemplate("{input}")
    ]);

    const formattedPrompt = await prompt.formatMessages({
      input: message
    });

    const response = await openAiClient.invoke(formattedPrompt);
    res.json({ response: response.content });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

export default router; 