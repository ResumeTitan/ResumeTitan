import { Request, Response } from 'express';
import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';
import CoverLetter from '../models/CoverLetter';

import dotenv from 'dotenv';
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY as string;

const model = new ChatOpenAI({ model: 'gpt-4o', apiKey: OPENAI_API_KEY });

const coverLetterSchema = z.object({
  coverLetter: z.array(z.object({
    question: z.string(),
    example: z.string(),
    guidance: z.string(),
  })),
});

const coverLetterModel = model.withStructuredOutput(coverLetterSchema);

const getPrompt = (jobTitle: string, jobDescription: string): string => {
  return `
  Create a professional cover letter for the position of ${jobTitle}.
  The job description is as follows: ${jobDescription}
  Please provide me with a list of questions you would ask me during the cover letter.
  Along with the list of questions, please provide me with an example answer to each question.
  Along with the list of questions, please provide guidance on what you are looking for in the answer and how I should respond.
  Your response must be in JSON format. The format shall have a key called "coverLetter" with an array of questions. Each question shall have the following keys: question, example, guidance.
  Give at least 10 questions.`;
};

interface CustomRequest extends Request {
  user?: {
    id: string;
  };
}

export const createUpdateCoverLetter = async (req: CustomRequest, res: Response): Promise<Response> => {
  try {
    const { jobTitle, jobDescription, coverLetterId } = req.body;
    const gptResponse = await coverLetterModel.invoke(getPrompt(jobTitle, jobDescription));

    const coverLetter = gptResponse.coverLetter;

    // Save the coverLetter to the database
    const coverLetterIn = {
      coverLetter,
      jobTitle,
      jobDescription,
      userId: req.user?.id,
    };

    if (coverLetterId) {
      const coverLetterOut = await CoverLetter.findOneAndUpdate({ _id: coverLetterId }, coverLetterIn, { new: true });
      return res.status(200).json({ coverLetter: coverLetterOut });
    }

    const coverLetterOut = await CoverLetter.create(coverLetterIn);
    return res.status(200).json({ coverLetter: coverLetterOut });
  } catch (error: any) {
    console.log('Error: ', error);
    return res.status(500).json({ error: error.message });
  }
};

export const getCoverLetters = async (req: CustomRequest, res: Response): Promise<Response> => {
  try {
    const coverLetters = await CoverLetter.find({ userId: req.user?.id });
    return res.status(200).json({ coverLetters });
  } catch (error: any) {
    console.log('Error: ', error);
    return res.status(500).json({ error: error.message });
  }
};

export const getCoverLetter = async (req: Request, res: Response): Promise<Response> => {
  try {
    const coverLetter = await CoverLetter.findById(req.params.id);
    return res.status(200).json({ coverLetter });
  } catch (error: any) {
    console.log('Error: ', error);
    return res.status(500).json({ error: error.message });
  }
};

export const deleteCoverLetter = async (req: Request, res: Response): Promise<Response> => {
  const id = req.params.id;
  try {
    await CoverLetter.findOneAndDelete({ _id: id });
    return res.status(204).send();
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateCoverLetter = async (req: Request, res: Response): Promise<Response> => {
  const id = req.params.id;
  const coverLetter = req.body;
  try {
    const updatedCoverLetter = await CoverLetter.findOneAndUpdate({ _id: id }, coverLetter, { new: true });
    return res.status(200).json({ coverLetter: updatedCoverLetter });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
