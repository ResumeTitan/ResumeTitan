import { Request, Response } from 'express';
import { geminiClient } from '../ext/clients';
import { z } from 'zod';
import Interview from '../models/Interview';
import Resume from '../models/Resume';
import { ResumeType } from '../types/types';
import axios from 'axios';


const interviewQuestionsSchema = z.object({
  questions: z.array(z.object({
    question: z.string(),
    example: z.string(),
    guidance: z.string()
  }))
});

// Helper function to get structured output from Gemini
const getStructuredOutput = async (prompt: string, schema: z.ZodType<any>) => {
  const result = await geminiClient.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  try {
    // Remove markdown code block formatting if present
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
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
  return `Generate 5-7 interview questions for:
Job: ${jobTitle}
Description: ${jobDescription}
Resume: ${JSON.stringify(resume)}

Requirements:
1. Mix of technical and behavioral questions
2. Each question should test specific skills from resume
3. Include sample answers
4. Categorize each question (Technical/Behavioral/Problem-Solving)

Format response as JSON:
{
  "questions": [
    {
      "question": "interview question",
      "example": "sample answer",
      "guidance": "guidance on how to answer the question"
    }
  ]
}
Respond ONLY with valid JSON. Do not include any explanations, introductions, or extra text.`;
};

// New prompt for HTML extraction
const getPromptFromHtml = (html: string, resume: ResumeType): string => {
  return `You are an expert at reading job postings. Given the following HTML of a job posting, extract:
- The job title (e.g., 'Software Engineer')
- The company name (e.g., 'Cisco')
- The job description

Instructions:
1. Look for the job title in <h1>, <h2>, or elements with class names containing 'title'.
2. Look for the company name in elements with class names containing 'company', 'employer', or similar. Do NOT use the <title> tag unless it contains both the job title and company name.
3. If the company name is not found, just use the job title.
4. Return the job title in the format 'Job Title at Company', e.g., 'Software Engineer at Cisco'.
5. Extract the main job description text.
6. Use the provided resume to tailor the questions.
7. Generate 5-7 interview questions (mix of technical and behavioral), each with a sample answer and guidance, and categorize each question.

Job Posting HTML:
${html}

Resume: ${JSON.stringify(resume)}

Format response as JSON:
{
  "jobTitle": "extracted job title",
  "company": "extracted company name",
  "jobDescription": "extracted job description",
  "questions": [
    {
      "question": "interview question",
      "example": "sample answer",
      "guidance": "guidance on how to answer the question"
    }
  ]
}
Respond ONLY with valid JSON. Do not include any explanations, introductions, or extra text.`;
};

const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY;

export const generateInterviewQuestions = async (req: Request, res: Response) => {
  try {
    const { jobTitle, jobDescription, resumeId } = req.body;
    let typedResume: ResumeType | undefined = undefined;

    if (resumeId) {
      const resume = await Resume.findById(resumeId);
      if (resume) {
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
        typedResume = {
          ...resumeData,
          _id: resumeData._id.toString(),
          basics
        } as unknown as ResumeType;
      }
    }

    const prompt = getPrompt(jobTitle, jobDescription, typedResume || {});
    const response = await getStructuredOutput(prompt, interviewQuestionsSchema);

    res.status(200).json({ questions: response.questions });
  } catch (error) {
    console.error('Error generating interview questions:', error);
    res.status(500).json({ error: 'Failed to generate interview questions' });
  }
};

/**
 * createUpdateInterview
 * @description POST that creates interview questions based on the resume and job description
 * @param {string} token The user token
 * @param {string} id The resume id
 * @returns 
 */
export const createUpdateInterview = async (req: Request, res: Response) => {
  try {
    const { jobTitle, jobDescription, jobUrl, interviewId, clerkId, resumeId } = req.body;
    let typedResume: ResumeType | undefined = undefined;
    let finalJobTitle = jobTitle;
    let finalJobDescription = jobDescription;
    let finalJobUrl = jobUrl;
    let finalCompany = '';
    let htmlForPrompt = '';

    if (resumeId) {
      const resume = await Resume.findById(resumeId);
      if (resume) {
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
        typedResume = {
          ...resumeData,
          _id: resumeData._id.toString(),
          basics
        } as unknown as ResumeType;
      }
    }

    let prompt = '';
    let response;
    if (jobUrl) {
      try {
        const apiUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(jobUrl)}`;
        const { data: html } = await axios.get(apiUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        htmlForPrompt = html;
        prompt = getPromptFromHtml(htmlForPrompt, typedResume || {});
        response = await getStructuredOutput(prompt, z.object({
          jobTitle: z.string(),
          jobDescription: z.string(),
          company: z.string(),
          questions: interviewQuestionsSchema.shape.questions
        }));
        finalJobTitle = response.jobTitle;
        finalJobDescription = response.jobDescription;
        finalCompany = response.company;
      } catch (err) {
        console.log("Error: ", err);
        return res.status(400).json({ error: 'Failed to parse job posting from URL' });
      }
    } else {
      prompt = getPrompt(finalJobTitle, finalJobDescription, typedResume || {});
      response = await getStructuredOutput(prompt, interviewQuestionsSchema);
    }

    // Save the interview to the database
    const interviewIn = {
      questions: response.questions,
      jobTitle: finalJobTitle,
      jobDescription: finalJobDescription,
      jobUrl: finalJobUrl,
      company: finalCompany,
      clerkId,
    }

    let interviewOut;
    if (interviewId) {
      interviewOut = await Interview.findOneAndUpdate({ _id: interviewId }, interviewIn, { new: true });
    } else {
      interviewOut = await Interview.create(interviewIn);
    }

    res.status(200).json({
      interview: {
        ...interviewOut.toObject(),
        jobTitle: finalJobTitle,
        jobDescription: finalJobDescription,
        company: finalCompany,
        jobUrl: finalJobUrl,
      }
    });
  } catch (error: any) {
    console.log("Error: ", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * getInterviews
 * @description GET that retrieves all interviews for a user
 * @param {string} token The user token
 * @param {string} userId The user id
 * @returns 
 */
export const getInterviews = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.auth.userId;
    const interviews = await Interview.find({ clerkId: userId });
    res.status(200).json({ interviews });
  } catch (error: any) {
    console.log("Error: ", error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * getInterview
 * @description GET that retrieves a single interview
 * @param {Request} req
 * @param {Response} res
 */
export const getInterview = async (req: Request, res: Response) => {
  try {
    const interview = await Interview.findById(req.params.id);
    res.status(200).json({ interview });
  } catch (error: any) {
    console.log("Error: ", error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * @function deleteInterview
 * @description Delete an interview from an id
 * @param {Request} req
 * @param {Response} res
 */
export const deleteInterview = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await Interview.findOneAndDelete({ _id: id });
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * @fuction updateInterview
 * @description Update an interview
 * @param {Request} req
 * @param {Response} res
 */
export const updateInterview = async (req: Request, res: Response) => {
  const id = req.params.id;
  const interview = req.body;
  try {
    await Interview.findOneAndUpdate({ _id: id }, interview);
    res.status(200).json({ interview });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * @function analyzeInterview
 * @description Analyze a user's answer to an interview question using AI
 * @param {Request} req
 * @param {Response} res
 */
export const analyzeInterview = async (req: Request, res: Response) => {
  try {
    const { answer, example, guidance } = req.body;
    if (!answer || !example || !guidance) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const prompt = `You are an expert interview coach. Analyze the following answer to an interview question. 

Question Guidance: ${guidance}
Example Answer: ${example}
User's Answer: ${answer}

Give specific, actionable feedback on how the answer could be improved, what is good about it, and how well it matches the guidance and example. Respond in 3-5 sentences.`;
    const result = await geminiClient.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.status(200).json({ analysis: text });
  } catch (error) {
    console.error('Error analyzing interview answer:', error);
    res.status(500).json({ error: 'Failed to analyze answer' });
  }
};
