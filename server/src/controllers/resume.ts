import { Response, Request } from 'express';
import Resume from '../models/Resume';
import { z } from "zod";
import { ResumeType } from "../types/types";
import { geminiClient } from '../ext/clients';
import { ServerStyleSheet } from 'styled-components';
import puppeteer from 'puppeteer';

import "dotenv/config";
const CLIENT_URL = process.env.CLIENT_URL;

const EducationSchema = z.object({
  institution: z.string(),
  studyType: z.string(),
  area: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  highlights: z.array(z.string()),
  extraHighlights: z.array(z.string())
});

const VolunteerSchema = z.object({
  organization: z.string(),
  position: z.string(),
  url: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  highlights: z.array(z.string()),
  extraHighlights: z.array(z.string())
});

const WorkSchema = z.object({
  position: z.string(),
  name: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  highlights: z.array(z.string()),
  summary: z.string(),
  extraHighlights: z.array(z.string())
});

const SkillsSchema = z.object({
  skills: z.array(z.object({
    name: z.string(),
    level: z.string(),
    keywords: z.array(z.string())
  }))
});

const SummarySchema = z.object({
  summary: z.string()
});

const AwardsSchema = z.object({
  title: z.string(),
  date: z.string(),
  awarder: z.string(),
  summary: z.string()
});

const ResumeDataSchema = z.object({
  summary: z.string(),
  education: z.array(EducationSchema).optional(),
  work: z.array(WorkSchema).optional(),
  skills: SkillsSchema.optional(),
  awards: z.array(AwardsSchema).optional()
});

const resumeData: ResumeType = {};

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

const getPrompt = (section: string, data: any) => {
  switch (section) {
    case 'summary':
      return `Generate a professional resume summary for:
Data: ${JSON.stringify(data)}

Requirements:
1. 2-3 sentences
2. Include key skills and experience
3. Optimize for ATS
4. Fix any grammar/spelling

Format as JSON:
{
  "summary": "summary text"
}`;

    case 'education':
      return `Generate education highlights for:
Data: ${JSON.stringify(data)}

Requirements:
1. Generate 2-6 relevant highlights based on the education details
2. Include academic achievements and key projects
3. Optimize for ATS
4. No school name repetition
5. Each highlight should be unique and impactful

Format as JSON:
{
  "institution": "school name",
  "studyType": "degree type",
  "area": "major",
  "startDate": "start date",
  "endDate": "end date",
  "highlights": ["achievement 1", "achievement 2", ...],
  "extraHighlights": ["extra 1", "extra 2", ...]
}`;

    case 'work':
      return `Generate work experience highlights for:
Data: ${JSON.stringify(data)}

Requirements:
1. Generate 3-7 relevant highlights based on the role and responsibilities
2. Focus on quantifiable achievements and impact
3. Optimize for ATS
4. No company name repetition
5. Each highlight should demonstrate unique value

Format as JSON:
{
  "position": "job title",
  "name": "company name",
  "startDate": "start date",
  "endDate": "end date",
  "highlights": ["achievement 1", "achievement 2", ...],
  "summary": "brief role description",
  "extraHighlights": ["extra 1", "extra 2", ...]
}`;

    case 'volunteer':
      return `Generate volunteer experience highlights for:
Data: ${JSON.stringify(data)}

Requirements:
1. Generate 2-5 relevant highlights based on the volunteer role
2. Focus on impact and skills gained
3. Optimize for ATS
4. No organization name repetition
5. Each highlight should show unique contribution

Format as JSON:
{
  "organization": "org name",
  "position": "role",
  "url": "website",
  "startDate": "start date",
  "endDate": "end date",
  "highlights": ["achievement 1", "achievement 2", ...],
  "extraHighlights": ["extra 1", "extra 2", ...]
}`;

    case 'skills':
      return `Generate relevant skills for:
Data: ${JSON.stringify(data)}

Requirements:
1. If userInput is provided, generate 1-2 skills related to "${data.userInput}" with appropriate proficiency levels and keywords
2. If no userInput is provided, generate 4-10 relevant skills based on work/education background
3. Include proficiency levels for each skill
4. Add relevant keywords for each skill
5. Match work/education background
6. Prioritize most important skills first

Format as JSON:
{
  "skills": [
    {
      "name": "skill name",
      "level": "proficiency",
      "keywords": ["keyword1", "keyword2"]
    }
  ]
}`;

    default:
      return '';
  }
};

export const postSummary = async (req: Request, res: Response) => {
  const { summary, work, education, skills, volunteer, basics } = req.body;
  resumeData.basics = basics;

  const prompt = getPrompt('summary', { 
    extraNotes: summary, work, education, skills, volunteer
  });

  try {
    const response = await getStructuredOutput(prompt, SummarySchema);
    res.status(200).json({ message: 'Summary information added successfully', response });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
};

export const postEducation = async (req: Request, res: Response) => {
  try {
    const { education } = req.body;
    resumeData.education = education;

    const prompt = getPrompt('education', education);
    const response = await getStructuredOutput(prompt, EducationSchema);

    res.status(200).json({ message: 'Education information added successfully', response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generating education information' });
  }
};

/**
 * @function postWork
 * @description POST Handle AI call for work highlights
 * @param {Request} req
 * @param {Response} res
 */
export const postWork = async (req: Request, res: Response) => {
  try {
    const { job } = req.body;
    if (!resumeData.work) {
      resumeData.work = [];
    }
    resumeData.work.push(job);

    const prompt = getPrompt('work', job);
    const response = await getStructuredOutput(prompt, WorkSchema);

    res.status(200).json({ message: 'Job information added successfully', response });
  } catch (error) {
    console.error('Error generating work information:', error);
    res.status(500).json({ error: 'Failed to generate work information' });
  }
};

/**
 * @function postVolunteer
 * @description POST Handle AI call for volunteer highlights
 * @param {Request} req
 * @param {Response} res
 */
export const postVolunteer = async (req: Request, res: Response) => {
  const { vol } = req.body;
  if (!resumeData.volunteer) {
    resumeData.volunteer = [];
  }
  resumeData.volunteer.push(vol);

  try {
    const prompt = getPrompt('volunteer', vol);
    const response = await getStructuredOutput(prompt, VolunteerSchema);

    res.status(200).json({ msg: 'Volunteer information added successfully', response });
  } catch (error) {
    console.error('Error generating volunteer information:', error);
    res.status(500).json({ error: 'Failed to generate volunteer information' });
  }
};

export const postSkills = async (req: Request, res: Response) => {
  const { skills, work, education, summary, volunteer } = req.body;
  resumeData.skills = skills;

  try {
    const prompt = getPrompt('skills', { skills, work, education, summary, volunteer });
    const response = await getStructuredOutput(prompt, SkillsSchema);

    res.status(200).json({ msg: 'Skills information added successfully', response });
  } catch (error) {
    console.error('Error generating skills information:', error);
    res.status(500).json({ error: 'Failed to generate skills information' });
  }
};

export const postResume = async (req: Request, res: Response) => {
  try {
    const prompt = `Generate a complete JSON resume with the following information: ${JSON.stringify(resumeData)}`;
    const response = await getStructuredOutput(prompt, ResumeDataSchema);

    res.status(200).json({ resume: response });
  } catch (error) {
    console.error('Error generating complete resume:', error);
    res.status(500).json({ error: 'Failed to generate complete resume' });
  }
};

/**
 * @function updateResume
 * @description PUT Update resume from user edits
 * @param {Request} req
 * @param {Response} res
 */
export const updateResume = async (req: Request, res: Response) => {
  try {
    const resume = req.body;
    // @ts-ignore
    const clerkId = req.auth.userId;
    resume.clerkId = clerkId;

    if (!clerkId) {
      return res.status(401).json({ msg: "User not authenticated"});
    }

    let resumeOut;
    if (!resume._id) {
      const resumeModel = new Resume(resume);
      resumeOut = await resumeModel.save();
    } else {
      resumeOut = await Resume.findOneAndUpdate({ _id: resume._id }, resume, { new: true, upsert: true });
    }

    res.status(200).json( { resume: resumeOut });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};

/* Get resumes */
export const getResumes = async (req: Request, res: Response) => {
  const userId = req.query.userId;
  try {
    const resumes = await Resume.find({ clerkId: userId }).sort({ createdAt: -1 });
    res.status(200).json({ resumes });
  } catch (err: any) {
    res.status(500).json({ msg: err.message });
  }
};

/* Get resume by id */
export const getResume = async (req: Request, res: Response) => {
  const id = req.query.id;
  // @ts-ignore
  const clerkId = req.auth?.userId;
  
  try {
    const resume = await Resume.findOne({ _id: id, clerkId: clerkId });
    
    if (!resume) {
      return res.status(404).json({ msg: "Resume not found" });
    }
    
    res.status(200).json({ resume: resume });
  } catch (err: any) {
    console.error('Error getting resume:', err);
    res.status(500).json({ msg: err.message });
  }
};

/* Delete resume by id */
export const deleteResume = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const resume = await Resume.findOneAndDelete({ _id: id });
    res.status(200).json({ resume: resume });
  } catch (err: any) {
    res.status(500).json({ msg: err.message });
  }
};

/**
 * @function printResumeToPdf
 * @descripton Uses puppeteer library to render resume page then save as pdf
 * @param {Request} req
 * @param {Response} res
 */
export const printResumeToPdf = async (req: Request, res: Response) => {
  // @ts-ignore
  const clerkId = req.auth?.userId;
  if (!clerkId) {
    return res.status(401).send('User not known, cannot authenticate print');
  }

  try {
    const { id } = req.body;
    const browser = await puppeteer.launch({ 
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      headless: true,
      ignoreHTTPSErrors: true
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Get the token from the request
    // @ts-ignore
    const token = req.auth.getToken();
    
    // Set the Authorization header
    await page.setExtraHTTPHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    console.log("Navigating to", `${CLIENT_URL}/print-resume/${id}?clerkId=${clerkId}`);
    
    // Navigate to the print-resume URL and wait for content
    await page.goto(`${CLIENT_URL}/print-resume/${id}?clerkId=${clerkId}`, {
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 30000
    });

    // Wait for the resume container using data attribute
    await page.waitForSelector('[data-resume="print-container"]', { timeout: 5000 });
    
    // Wait for any animations or dynamic content to settle
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: false,
      margin: {
        top: '0.4in',
        right: '0.4in',
        bottom: '0.4in',
        left: '0.4in'
      }
    });
    await browser.close();

    // Return the PDF buffer
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="resume.pdf"',
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Internal Server Error');
  }
}
