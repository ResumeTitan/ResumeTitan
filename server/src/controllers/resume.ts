import { Response, Request } from 'express';
import Resume from '../models/Resume';
import { z } from "zod";
import { ResumeType } from "../types/types";
import { openAiClient } from '../ext/clients';
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

const ResumeDataSchema = z.object({
  summary: z.string(),
  education: z.array(EducationSchema).optional(),
  work: z.array(WorkSchema).optional(),
  skills: SkillsSchema.optional()
});

const resumeData: ResumeType = {};

const summaryModel = openAiClient.withStructuredOutput(SummarySchema);
const educationModel = openAiClient.withStructuredOutput(EducationSchema);
const volunteerModel = openAiClient.withStructuredOutput(VolunteerSchema);
const workModel = openAiClient.withStructuredOutput(WorkSchema);
const skillsModel = openAiClient.withStructuredOutput(SkillsSchema);
const resumeModel = openAiClient.withStructuredOutput(ResumeDataSchema);

const getPrompt = (section: string, data: any) => {
  let prompt = 'You are a hiring manager at a company and you need to generate the perfect resume for a potential candidate.';
  switch (section) {
    case 'summary':
      return prompt + `Generate a JSON representation of the summary for a resume: ${JSON.stringify(data)}.
          Here is an example, "Experienced assistant store manager with strong leadership, problem-solving and organizational skills honed in a customer-focused retail environment. Skilled at hiring, training and mentoring employees into exceptional sales associates."
          The summary must be 2-3 sentences long.
          Use this information only, and not previous information entered.
          Enhance the summary so that it would score well on an ATS system.
          Use those keywords from the information provided and generate a new summary based on the information.
          Be sure to fix any spelling or grammar mistakes if there is existing content being passed in.
      `;
    case 'education':
      return prompt + `Generate a JSON representation of the education section for a resume: ${JSON.stringify(data)}.
          Use this information only, and not previous information entered.
          The response shall include an array of strings with highlights a student has.
          Include at least 4 strings, in full sentences, in both highlights and extraHighlights that could be used on the resume for this person.
          If no highlights are found, create some that would be associated with the major/area of study entered.
          If highlights include instructions on how to create the other highlights, use those instructions as well as you can.
          These strings should include keywords that would score well on an ATS system.
          This content should not repeat the name of the school.
          Be sure to fix any spelling or grammar mistakes if there is existing content being passed in.`;
    case 'work':
      return prompt + `Generate a JSON representation of the work experience section for a resume using this information: ${JSON.stringify(data)}
          Use this information only, and not previous information entered.
          The response shall include an array of strings with highlights an employee has.
          Include at least 4 strings, in full sentences, in both highlights and extraHighlights that could be used on the resume for this person.
          These strings should include keywords that would score well on an ATS system.
          This content should not repeat the name of the employer. 
          If highlights already exists, generate new highlights that would be associated with the job title entered.
          Be sure to fix any spelling or grammar mistakes if there is existing highlights being passed in.`;
    case 'volunteer':
      return prompt + `Generate a JSON representation of the volunteer section for a resume using this information: ${JSON.stringify(data)}
          Use this information only, and not previous information entered.
          The response shall include an array of strings with highlights a volunteer has.
          Include at least 4 strings, in full sentences, in both highlights and extraHighlights that could be used on the resume for this person.
          These strings should include keywords that would score well on an ATS system.
          This content should not repeat the name of the volunteer opportunity. 
          If highlights already exists, generate new highlights that would be associated with the job title entered.
          Be sure to fix any spelling or grammar mistakes if there is existing highlights being passed in.`;
    case 'skills':
      return prompt + `Generate a JSON representation of the skills section for a resume: ${JSON.stringify(data)}.
          Use this information only, and not previous information entered.
          Provide relevant skills given the data provided.
          Return between 4 and 8 skills that would be associated with the work titles, education, volunteer, and summary entered.`;
    default:
      return '';
  }
};

export const postSummary = async (req: Request, res: Response) => {
  const { summary, work, education, skills, volunteer, basics } = req.body;
  resumeData.basics = basics;

  const gptResponse = await summaryModel.invoke(getPrompt('summary', { 
    extraNotes: summary, work, education, skills, volunteer
  }));

  res.status(200).json({ message: 'Summary information added successfully', response: gptResponse });
};

export const postEducation = async (req: Request, res: Response) => {
  try {
    const { education } = req.body;
    resumeData.education = education;

    console.log(education);

    const gptResponse = await educationModel.invoke(getPrompt('education', education));

    res.status(200).json({ message: 'Education information added successfully', response: gptResponse });
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
  const { job } = req.body;
  if (!resumeData.work) {
    resumeData.work = [];
  }
  resumeData.work.push(job);

  const gptResponse = await workModel.invoke(getPrompt('work', job));

  res.status(200).json({ message: 'Job information added successfully', response: gptResponse });
}

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

  const gptResponse = await workModel.invoke(getPrompt('volunteer', vol));

  res.status(200).json({ msg: 'Volunteer information added successfully', response: gptResponse });
}

export const postSkills = async (req: Request, res: Response) => {
  const { skills, work, education, summary, volunteer } = req.body;
  resumeData.skills = skills;

  const gptResponse = await skillsModel.invoke(getPrompt('skills', { skills, work, education, summary, volunteer }));

  res.status(200).json({ msg: 'Skills information added successfully', response: gptResponse });
}

export const postResume = async (req: Request, res: Response) => {
  const gptResponse = await resumeModel.invoke(
    `Generate a complete JSON resume with the following information: ${JSON.stringify(resumeData)}`
  );

  res.status(200).json({ resume: gptResponse });
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
  try {
    const resume = await Resume.findOne({ _id: id });
    res.status(200).json({ resume: resume });
  } catch (err: any) {
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
 * @function render
 * @description Build the html page to send to puppeteer to render
 * @return {String} Page in html
 */
export const render = (name: string, html: string): string => {
  const sheet = new ServerStyleSheet();
  const styles = sheet.getStyleTags();
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${name} - Resume</title>
  <style>
    @font-face {
      font-family: LatinModern;
      font-style: normal;
      font-weight: normal;
      src: url("/fonts/lmroman10-regular.otf") format("opentype");
    }
    @font-face {
      font-family: LatinModern;
      font-weight: bold;
      src: url("/fonts/lmroman10-bold.otf") format("opentype");
    }
    @font-face {
      font-family: LatinModern;
      font-style: italic;
      src: url("/fonts/lmroman10-italic.otf") format("opentype");
    }
    @font-face {
      font-family: LatinModernSans;
      font-style: normal;
      font-weight: normal;
      src: url("/fonts/lmsans10-regular.otf") format("opentype");
    }
    @font-face {
      font-family: LatinModernSans;
      font-weight: bold;
      src: url("/fonts/lmsans10-bold.otf") format("opentype");
    }
    @font-face {
      font-family: LatinModernSans;
      font-style: italic;
      src: url("/fonts/lmsans10-italic.otf") format("opentype");
    }
    html {
      font-family: LatinModern, "Courier New", monospace;
      background: #fff;
      font-size: 10px;
    }
    h2 {
      font-size: 1.65rem;
    }
    p {
      padding: 0;
      margin: 0;
    }
    p, li {
      font-size: 1.4rem;
      line-height: 1.5rem;
    }
    .secondary {
      color: #111;
    }
    a {
      text-decoration: none;
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }
  </style>
  ${styles}
</head>
<body>${html}</body>
</html>`;
};

/**
 * @function printResumeToPdf
 * @descripton Uses puppeteer library to render resume page then save as pdf
 * @param {Request} req
 * @param {Response} res
 */
export const printResumeToPdf = async (req: Request, res: Response) => {
  // @ts-ignore
  const clerkId = req.auth.userId;
  if (!clerkId) {
    return res.status(401).send('User not known, cannot authenticate print');
  }

  try {
    const { name, html, id } = req.body;
    console.log("id", id);
    const htmlRaw = render(name, html);
    const browser = await puppeteer.launch({ 
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      headless: true,
      ignoreHTTPSErrors: true
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    // @ts-ignore
    const tokenOut = await req.auth.getToken();
    await page.setExtraHTTPHeaders({ Authorization: tokenOut });
    // Intercept and log network requests and console messages
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('requestfailed', request => console.error('REQUEST FAILED:', request.url(), request.failure().errorText));
    
    await page.goto(`${CLIENT_URL}/print-resume/${id}`, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf();
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
