import { Request, Response } from 'express';
import { geminiClient } from '../ext/clients';
import { z } from 'zod';
import CoverLetter from '../models/CoverLetter';
import Resume from '../models/Resume';
import { ResumeType } from '../types/types';
import { callPythonScraper, isPythonAvailable } from '../utils/pythonScraper';
import axios from 'axios';
import Metric from '../models/Metric';

const coverLetterSchema = z.object({
  letter: z.string()
});

// Helper function to get structured output from Gemini
const getStructuredOutput = async (prompt: string, schema: z.ZodType<any>) => {
  const result = await geminiClient.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  try {
    // Remove markdown code block formatting if present
    const cleanText = text.replace(/```json\n?|```/g, '').trim();
    const json = JSON.parse(cleanText);
    return schema.parse(json);
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    throw new Error('Failed to parse AI response');
  }
};

/**
 * @function getPrompt
 * @description Build text prompt to send to AI model
 * @param {string} jobTitle 
 * @param {string} jobDescription 
 * @returns 
 */
const getPrompt = (jobTitle: string, jobDescription: string, resume: ResumeType): string => {
  return `Write a professional cover letter for:
Job: ${jobTitle}
Description: ${jobDescription}
Resume: ${JSON.stringify(resume)}

Requirements:
1. Start with "Dear Hiring Manager"
2. Match skills to job requirements
3. Show enthusiasm
4. Keep it under 300 words
5. End with a call to action

Format response as JSON:
{
  "letter": "cover letter text"
}`;
};

/* Insert a new prompt (getPromptFromHtml) for extracting job info from HTML, similar to interview helper. */
const getPromptFromHtml = (html: string, resume: ResumeType): string => {
  return `You are an expert at reading job postings. Given the following HTML of a job posting, extract:
– The job title (e.g., 'Software Engineer')
– The company name (e.g., 'Cisco')
– The job description

Instructions:
1. Look for the job title in <h1>, <h2>, or elements with class names containing 'title'.
2. Look for the company name in elements with class names containing 'company', 'employer', or similar. Do NOT use the <title> tag unless it contains both the job title and company name.
3. If the company name is not found, just use the job title.
4. Return the job title in the format 'Job Title', e.g., 'Software Engineer'.
5. Extract the main job description text.

Job Posting HTML:
${html}

Resume: ${JSON.stringify(resume)}

Format response as JSON:
{
  "jobTitle": "extracted job title",
  "company": "extracted company name",
  "jobDescription": "extracted job description"
}
Respond ONLY with valid JSON. Do not include any explanations, introductions, or extra text.`;
};

// Deprecated
// export const generateCoverLetter = async (req: Request, res: Response) => {
//   try {
//     const { jobTitle, jobDescription, resumeId } = req.body;
//     const resume = await Resume.findById(resumeId);
    
//     if (!resume) {
//       return res.status(404).json({ error: 'Resume not found' });
//     }

//     // Convert Mongoose document to plain object and ensure required fields
//     const resumeData = resume.toObject();
//     const basics = {
//       ...resumeData.basics,
//       label: resumeData.basics.label || '',
//       image: resumeData.basics.image || '',
//       phone: resumeData.basics.phone || '',
//       url: resumeData.basics.url || '',
//       summary: resumeData.basics.summary || '',
//       location: {
//         address: resumeData.basics.location?.address || '',
//         postalCode: resumeData.basics.location?.postalCode || '',
//         city: resumeData.basics.location?.city || '',
//         countryCode: resumeData.basics.location?.countryCode || '',
//         region: resumeData.basics.location?.region || '',
//       },
//       profiles: resumeData.basics.profiles || [],
//     };
//     const typedResume = {
//       ...resumeData,
//       _id: resumeData._id.toString(),
//       basics
//     } as unknown as ResumeType;

//     const prompt = getPrompt(jobTitle, jobDescription, typedResume);
//     const response = await getStructuredOutput(prompt, coverLetterSchema);

//     console.log("Response: ", response);

//     res.status(200).json({ coverLetter: response });
//   } catch (error) {
//     console.error('Error generating cover letter:', error);
//     res.status(500).json({ error: 'Failed to generate cover letter' });
//   }
// };

/**
 * @function getCoverLetters
 * @param {Req} req 
 * @param {Res} res 
 * @returns 
 */
export const getCoverLetters = async (req: Request, res: Response): Promise<Response> => {
  try {
    // @ts-ignore
    const id = req.auth.userId;
    const coverLetters = await CoverLetter.find({ clerkId: id }).sort({ createdAt: -1 });
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
 * @function updateCoverLetter
 * @param {Req} req 
 * @param {Res} res 
 * @returns 
 */
export const updateCoverLetter = async (req: Request, res: Response): Promise<Response> => {
  const id = req.params.id;
  const coverLetter = req.body;
  
  console.log('🔍 updateCoverLetter - Received data:');
  console.log('ID:', id);
  console.log('Request body:', JSON.stringify(coverLetter, null, 2));
  console.log('Letter field:', coverLetter.letter);
  
  try {
    // Use $set to ensure all fields are properly updated
    const updatedCoverLetter = await CoverLetter.findOneAndUpdate(
      { _id: id }, 
      { $set: coverLetter }, 
      { new: true, runValidators: true }
    );
    
    console.log('✅ Updated cover letter:', JSON.stringify(updatedCoverLetter, null, 2));
    console.log('Updated letter field:', updatedCoverLetter?.letter);
    return res.status(200).json({ coverLetter: updatedCoverLetter });
  } catch (err: any) {
    console.error('❌ Error updating cover letter:', err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * @function fetchJobPostingHtmlWithPython
 * @description Fetch HTML from job posting URL using Python scraper with fallback to existing methods
 * @param {string} jobUrl 
 * @returns {Promise<string>}
 */
const fetchJobPostingHtmlWithPython = async (jobUrl: string): Promise<string> => {
  // First, try Python scraper
  try {
    const pythonAvailable = await isPythonAvailable();
    if (pythonAvailable) {
      console.log('🐍 Using Python scraper...');
      const result = await callPythonScraper(jobUrl);
      
      if (result.success && result.html) {
        console.log(`✅ Python scraper successful - got ${result.html.length} characters`);
        return result.html;
      } else {
        console.log(`❌ Python scraper failed: ${result.error}`);
      }
    } else {
      console.log('⚠️ Python not available, falling back to existing methods');
    }
  } catch (error) {
    console.log(`❌ Python scraper error: ${error}`);
  }

  return '';
};

/**
 * @function createUpdateCoverLetter
 * @description POST Creates or updates a cover letter
 * @param {Request} req 
 * @param {Response} res 
 * @returns 
 */
export const createUpdateCoverLetter = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { coverLetter, clerkId } = req.body;
    let { jobTitle, jobDescription, company, resumeId, jobUrl, useJobUrl } = coverLetter;

    // Generate the cover letter content
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Convert Mongoose document to plain object and ensure required fields
    const resumeData = resume.toObject();
    const basics = {
      ...resumeData.basics,
      label: resumeData.basics.label || '',
      image: resumeData.basics.image || '',
      phone: resumeData.basics.phone || '',
      url: resumeData.basics.url || '',
      summary: resumeData.basics.summary || '',
      location: {
        address: resumeData.basics.location?.address || '',
        postalCode: resumeData.basics.location?.postalCode || '',
        city: resumeData.basics.location?.city || '',
        countryCode: resumeData.basics.location?.countryCode || '',
        region: resumeData.basics.location?.region || '',
      },
      profiles: resumeData.basics.profiles || [],
    };
    const typedResume = {
      ...resumeData,
      _id: resumeData._id.toString(),
      basics
    } as unknown as ResumeType;

    let prompt = '';
    let response;
    if (useJobUrl && jobUrl) {
      try {
        const html = await fetchJobPostingHtmlWithPython(jobUrl);
        if (!html) {
          return res.status(400).json({ error: 'Failed to parse job posting from URL', errorType: 'URL_PARSE_ERROR' });
        }

        prompt = getPromptFromHtml(html, typedResume);
        const jobInfoResponse = await getStructuredOutput(prompt, z.object({ jobTitle: z.string(), company: z.string(), jobDescription: z.string() }));
        jobTitle = jobInfoResponse.jobTitle;
        company = jobInfoResponse.company;
        jobDescription = jobInfoResponse.jobDescription;
      } catch (err) {
        console.error("Error fetching job info from URL:", err);
        return res.status(400).json({ error: 'Failed to parse job posting from URL', errorType: 'URL_PARSE_ERROR' });
      }
    }

    prompt = getPrompt(jobTitle, jobDescription, typedResume);
    response = await getStructuredOutput(prompt, coverLetterSchema);

    // Create or update the cover letter
    const coverLetterIn = {
      ...coverLetter,
      jobTitle,
      jobDescription,
      company,
      ...response,
      clerkId,
    };

    // Remove _id if it's an empty string
    if (coverLetterIn._id === '') {
      delete coverLetterIn._id;
    }

    if (coverLetter._id) {
      const updatedCoverLetter = await CoverLetter.findOneAndUpdate(
        { _id: coverLetter._id },
        coverLetterIn,
        { new: true }
      );
      return res.status(200).json({ coverLetter: updatedCoverLetter });
    }

    const newCoverLetter = await CoverLetter.create(coverLetterIn);

    // update metrics
    await Metric.updateOne({ key: 'COVERLETTERS_TOTAL' }, { $inc: { value: 1 } });

    return res.status(201).json({ coverLetter: newCoverLetter });
  } catch (error: any) {
    console.error('Error creating/updating cover letter:', error);
    return res.status(500).json({ error: error.message });
  }
};
