import { Request, Response } from 'express';
import { openAiClient } from '../ext/clients';
import { z } from 'zod';
import CoverLetter from '../models/CoverLetter';

const coverLetterSchema = z.object({
  coverLetter: z.string(),
  companyName: z.string(),
  companyAddress: z.string(),
});

const coverLetterModel = openAiClient.withStructuredOutput(coverLetterSchema);

/**
 * @function getPrompt
 * @description Build text prompt to send to AI model
 * @param {string} jobTitle 
 * @param {string} jobDescription 
 * @returns 
 */
const getPrompt = (jobTitle: string, jobDescription: string): string => {
  return `
  Create a professional cover letter for the position of ${jobTitle}.
  The job description is as follows: ${jobDescription}.
  Only include the content of the cover letter, do not add anything for entering a users name, email, etc.
  Just return the cover letter. Do not include the salutations or closings.
  Do not include personal information in the cover letter, even as placeholders.
  This means in your response for the coverLetter, do not include things like [Your Name], [Your Address], [Date], etc
  `;
};

/**
 * @function createUpdateCoverLetter
 * @param {Req} req 
 * @param {Res} res 
 * @returns 
 */
export const createUpdateCoverLetter = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { jobTitle, jobDescription, coverLetterId, clerkId } = req.body;
    const gptResponse = await coverLetterModel.invoke(getPrompt(jobTitle, jobDescription));

    const coverLetter = gptResponse.coverLetter;

    // Save the coverLetter to the database
    const coverLetterIn = {
      coverLetter,
      jobTitle,
      jobDescription,
      clerkId,
    };

    if (coverLetterId) {
      const coverLetterOut = await CoverLetter.findOneAndUpdate({ _id: coverLetterId }, coverLetterIn, { new: true });
      return res.status(200).json({ coverLetter: coverLetterOut });
    }

    const coverLetterOut = await CoverLetter.create(coverLetterIn);
    console.log(coverLetterOut);
    return res.status(200).json({ coverLetter: coverLetterOut });
  } catch (error: any) {
    console.log('Error: ', error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * @function getCoverLetters
 * @param {Req} req 
 * @param {Res} res 
 * @returns 
 */
export const getCoverLetters = async (req: Request, res: Response): Promise<Response> => {
  try {
    // @ts-ignore
    const id = req.auth.id
    const coverLetters = await CoverLetter.find({ userId: id });
    return res.status(200).json({ coverLetters });
  } catch (error: any) {
    console.log('Error: ', error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * @function getCoverLetter
 * @param {Req} req 
 * @param {Res} res 
 * @returns 
 */
export const getCoverLetter = async (req: Request, res: Response): Promise<Response> => {
  try {
    const coverLetter = await CoverLetter.findById(req.params.id);
    return res.status(200).json({ coverLetter });
  } catch (error: any) {
    console.log('Error: ', error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * @function deleteCoverLetter
 * @param {Req} req 
 * @param {Res} res 
 * @returns 
 */
export const deleteCoverLetter = async (req: Request, res: Response): Promise<Response> => {
  const id = req.params.id;
  try {
    await CoverLetter.findOneAndDelete({ _id: id });
    return res.status(204).send();
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * @function deleteCoverLetter
 * @param {Req} req 
 * @param {Res} res 
 * @returns 
 */
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
