import { Request, Response } from 'express';
import { openAiClient } from '../ext/clients';
import { z } from 'zod';
import CoverLetter from '../models/CoverLetter';
import Resume from '../models/Resume';
import { ResumeType } from '../types/types';

const coverLetterSchema = z.object({
  letter: z.string(),
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
const getPrompt = (jobTitle: string, jobDescription: string, resume: ResumeType): string => {
  return `
    You are an AI language model tasked with writing a personalized and compelling cover letter. Use the information provided below to craft a cover letter that not only addresses the job requirements but also showcases the candidate's enthusiasm for the role.

    **Job Title:** ${jobTitle}

    **Job Description:** ${jobDescription}

    **Candidate's Resume Highlights:**
    ${resume}

    **Instructions:**
    1. **Introduction**: Start the cover letter with a strong introduction that captures the hiring manager's attention. Mention the job title and where the candidate found the job posting.
    
    2. **Align Skills with Job Requirements**: Highlight how the candidate's skills and experiences align with the specific requirements mentioned in the job description. Use concrete examples from the resume to demonstrate their qualifications.
    
    3. **Show Enthusiasm**: Convey genuine enthusiasm for the role and the company. Explain why the candidate is excited about this particular job and how they can contribute to the company's success.
    
    4. **Closing**: End with a confident closing statement that reiterates the candidate's interest in the role and willingness to discuss how they can add value to the team.

    The cover letter should be professional, concise, and no more than one page long.
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
    const { coverLetter, clerkId } = req.body;
    const resumeId = coverLetter.resumeId;
    console.log(coverLetter);
    if (!resumeId) {
      return res.status(404).json({ msg: "Resume not found" });
    }

    const resume = await Resume.findOne({ _id: resumeId }) as ResumeType;
    const gptResponse = await coverLetterModel.invoke(getPrompt(coverLetter.jobTitle, coverLetter.jobDescription, resume));

    const coverLetterResp = gptResponse.letter;

    // Save the coverLetter to the database
    const coverLetterIn = {
      ...coverLetter,
      letter: coverLetterResp,
      date: new Date(),
      clerkId,
    };

    if (coverLetter._id && coverLetter._id !== "") {
      const coverLetterOut = await CoverLetter.findOneAndUpdate({ _id: coverLetter._id }, coverLetterIn, { new: true });
      return res.status(200).json({ coverLetter: coverLetterOut });
    } else {
      delete coverLetterIn._id;
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
  console.log(id);
  try {
    await CoverLetter.findOneAndDelete({ _id: id });
    return res.status(204).send();
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * @function updateCoverLetter
 * @param {Req} req 
 * @param {Res} res 
 * @returns 
 */
export const updateCoverLetter = async (req: Request, res: Response): Promise<Response> => {
  const id = req.params.id;
  const coverLetter = req.body;
  try {
    console.log(id);
    const updatedCoverLetter = await CoverLetter.findOneAndUpdate({ _id: id }, coverLetter, { new: true });
    return res.status(200).json({ coverLetter: updatedCoverLetter });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
