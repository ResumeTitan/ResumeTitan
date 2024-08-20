import { Response, Request } from 'express';
import Resume from '@/models/Resume';
import { z } from "zod";
import { IResumeType } from "@/types/types";
import { openAiClient } from '@/ext/clients';
import puppeteer from 'puppeteer';

const EducationSchema = z.object({
  institution: z.string(),
  studyType: z.string(),
  area: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  highlights: z.array(z.string()),
  extraHighlights: z.array(z.string())
});

const JobSchema = z.object({
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
  jobs: z.array(JobSchema).optional(),
  skills: SkillsSchema.optional()
});

const resumeData: IResumeType = {};

const summaryModel = openAiClient.withStructuredOutput(SummarySchema);
const educationModel = openAiClient.withStructuredOutput(EducationSchema);
const jobModel = openAiClient.withStructuredOutput(JobSchema);
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
          These strings should include keywords that would score well on an ATS system.
          This content should not repeat the name of the school.
          Be sure to fix any spelling or grammar mistakes if there is existing content being passed in.`;
    case 'job':
      return prompt + `Generate a JSON representation of the job experience section for a resume using this information: ${JSON.stringify(data)}
          Use this information only, and not previous information entered.
          The response shall include an array of strings with highlights an employee has.
          Include at least 4 strings, in full sentences, in both highlights and extraHighlights that could be used on the resume for this person.
          These strings should include keywords that would score well on an ATS system.
          This content should not repeat the name of the employer. 
          If content already exists, generate new content that would be associated with the job title entered.
          Be sure to fix any spelling or grammar mistakes if there is existing content being passed in.`;
    case 'skills':
      return prompt + `Generate a JSON representation of the skills section for a resume: ${JSON.stringify(data)}.
          Use this information only, and not previous information entered.
          Provide relevant skills given the data provided.
          Return between 6 and 10 skills that would be associated with the job titles, education, and summary entered.`;
    default:
      return '';
  }
};

export const postSummary = async (req: Request, res: Response) => {
  const { summary, work, education, skills } = req.body;
  resumeData.summary = summary;

  const gptResponse = await summaryModel.invoke(getPrompt('summary', {  extraNotes: summary, work, education, skills }));

  res.status(200).json({ message: 'Summary information added successfully', response: gptResponse });
};

export const postEducation = async (req: Request, res: Response) => {
  try {
    const { education } = req.body;
    resumeData.education = education;

    const gptResponse = await educationModel.invoke(getPrompt('education', education));

    res.status(200).json({ message: 'Education information added successfully', response: gptResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generating education information' });
  }
};

export const postJob = async (req: Request, res: Response) => {
  const { job } = req.body;
  if (!resumeData.work) {
    resumeData.work = [];
  }
  resumeData.work.push(job);

  const gptResponse = await jobModel.invoke(getPrompt('job', job));

  res.status(200).json({ message: 'Job information added successfully', response: gptResponse });
}

export const postSkills = async (req: Request, res: Response) => {
  const { skills, work, education, summary } = req.body;
  resumeData.skills = skills;

  const gptResponse = await skillsModel.invoke(getPrompt('skills', { skills, work, education, summary }));

  res.status(200).json({ message: 'Skills information added successfully', response: gptResponse });
}

export const postResume = async (req: Request, res: Response) => {
  const gptResponse = await resumeModel.invoke(`Generate a complete JSON resume with the following information: ${JSON.stringify(resumeData)}`);

  res.status(200).json({ resume: gptResponse });
};

/* Update resume from input */
export const updateResume = async (req: Request, res: Response) => {
  try {
    const resume = req.body;

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
    res.status(500).json({ error: err.message });
  }
};

/* Get resumes */
export const getResumes = async (req: Request, res: Response) => {
  const userId = req.query.userId;
  try {
    const resumes = await Resume.find({ clerkId: userId }).sort({ createdAt: -1 });
    res.status(200).json({ resumes });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/* Get resume by id */
export const getResume = async (req: Request, res: Response) => {
  const id = req.query.id;
  try {
    const resume = await Resume.findOne({ _id: id });
    res.status(200).json({ resume: resume });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/* Delete resume by id */
export const deleteResume = async (req: Request, res: Response) => {
  const id = req.query.id;
  try {
    const resume = await Resume.findOneAndDelete({ _id: id });
    res.status(200).json({ resume: resume });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @function getResumeAsPdf
 * @descripton Uses puppeteer library to render resume page then save as pdf
 * @param {Request} req
 * @param {Response} res
 */
export const getResumeAsPdf = async (req: Request, res: Response) => {
  const id = req.params.id;

  // Authenticate data
  const resume = await Resume.findById(id);
  if (!resume) {
    return res.status(400).send('Resume not found, cannot authenticate print');
  }
  if (!resume.clerkId) {
    return res.status(401).send('User not known, cannot authenticate print');
  }

  try {
    // TODO fix this, use html skeleton
    // const executablePath = await new Promise(resolve => locateChrome((arg: any) => resolve(arg))) || '';
    // const browser = await puppeteer.launch({ 
    //   args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    //   headless: true,
    //   executablePath,
    //   ignoreHTTPSErrors: true
    // });
    // const page = await browser.newPage();
    // await page.setViewport({ width: 1920, height: 1080 });
    // await page.setExtraHTTPHeaders({ Authorization: req.headers['authorization'] });
    // console.log('Authorization:', req.headers['authorization']);
    // console.log("url", `${CLIENT_URL}/print-resume/${id}`);
    // await page.goto(`${CLIENT_URL}/print-resume/${id}`, { waitUntil: 'networkidle0' });
    // const pdfBuffer = await page.pdf();
    // await browser.close();

    // Return the PDF buffer
    // res.set({
    //   'Content-Type': 'application/pdf',
    //   'Content-Disposition': 'attachment; filename="resume.pdf"',
    // });
    // res.send(pdfBuffer);
    res.send(200);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Internal Server Error');
  }
}
