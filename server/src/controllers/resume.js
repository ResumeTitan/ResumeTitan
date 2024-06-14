import { ChatGPTAPI } from 'chatgpt';
import puppeteer from 'puppeteer';
import locateChrome from 'locate-chrome';
import Resume from "../models/Resume.js";

import dotenv from "dotenv";
dotenv.config();
const CLIENT_URL = process.env.CLIENT_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const gpt = new ChatGPTAPI({apiKey: OPENAI_API_KEY});

const getPrompt = (resume, jobDescription) => {
  const prompt = `
  Can you extract key information from my resume and return it in a structured format?
  Your reseponse can only by in JSON format, with no other characters or plain text (no notes).
  The responses must be in the past tense.
  Your response must include the following keys: work, education, summary, skills.
  The work and education keys must contain an array. Each of these arrays will contain an array of strings called "content".
  There should be one array of strings for each job or school.
  The skills key must contain a string array of at least 6 skills.
  The summary key must contain a string.

  Here is the resume in JSON format: 
  ${JSON.stringify({
    work: resume.work,
    education: resume.education,
  })}
  
  \n
  In education, the content field shall contain an array of strings with accomplishments/skills given by the student. The array should contain at least 4 strings, in full sentences.
  This content should not repeat the name of the school. If no accomplishments/skills are found, create some that would be associated with the major entered
  In education, if a school name is recognized, use the full name of that school in the value of the JSON output.
  In education, if a major is recognized, use the full name of that major in the value of the JSON output.

  In work, the content field shall be an array of strings with responsibilities/skills an employee has. The array must contain at least 4 strings, in full sentences. This content should not repeat the name of the employer. If content already exists, generate new content that would be associated with the job title entered.
  In work, if a job title is recognized, use the full name of that job title in the value of the JSON output.
  In work, if a company is recognized, use the full name of that company in the value of the JSON output.

  Based on the information provided, fill the "summary" key with a statement relating to the jobs and education given. This should write like an objective statement for the beginning of the resume. Do not repeat the name of any company or school in the summary.
  Based on the information provided, fill the "skills" key with an array of strings that includes the skills gained through the education and work experience provided.
  If the resume provided is blank, provide a generic JSON template based on the keys in the input.
  
  ${jobDescription ? `When generating the content for the resume, use relevant keywords from the following job description to maximize the score from an applicant tracking system: 
  ${jobDescription}` : ''}`
  ;

  return prompt;
}

/* Generate resume from input */
export const createResume = async (req, res) => {
  try {
    const { resume, jobDescription } = req.body;
    const gptResponse = await gpt.sendMessage(getPrompt(resume, jobDescription));
    console.log("response: ", gptResponse.text);

    // Find the starting and ending positions of the JSON code
    const start = gptResponse.text.indexOf('{');
    const end = gptResponse.text.lastIndexOf('}');

    let resumeWithResponse;
    if (start !== -1 && end !== -1) {
      const jsonStr = gptResponse.text.substring(start, end + 1);
      resumeWithResponse = JSON.parse(jsonStr);
    } else {
      throw new Error('Could not parse JSON response');
    }

    // Get rid of periods at the end of each sentence
    resumeWithResponse.work.forEach((job, index) => {
      job.id = index + 1;
      resume.work[index].content = job.content.map((sentence) => {
        if (sentence[sentence.length - 1] === '.') {
          return sentence.substring(0, sentence.length - 1);
        } else {
          return sentence;
        }
      })}
    );

    resumeWithResponse.education.forEach((school, index) => {
      school.id = index + 1;
      resume.education[index].content = school.content.map((sentence) => {
        if (sentence[sentence.length - 1] === '.') {
          return sentence.substring(0, sentence.length - 1);
        } else {
          return sentence;
        }
      })}
    );

    resume.basics.summary = resumeWithResponse.summary;
    resume.skills = resumeWithResponse.skills;
    delete resume.summary;
    resume.userId = req.user.id;

    // Save resume to database
    let newResume;
    if (resume._id) {
      console.log('updating resume');
      newResume = await Resume.findOneAndUpdate({ _id: resume._id }, resume);
    } else {
      delete resume._id;
      console.log('creating resume');
      newResume = new Resume(resume);
      await newResume.save();
    }

    res.status(200).json( { resume: newResume });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

/* Update resume from input */
export const updateResume = async (req, res) => {
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
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

/* Get resumes */
export const getResumes = async (req, res) => {
  const userId = req.query.userId;
  try {
    const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ resumes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* Get resume by id */
export const getResume = async (req, res) => {
  const id = req.query.id;
  try {
    const resume = await Resume.findOne({ _id: id });
    res.status(200).json({ resume: resume });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* Delete resume by id */
export const deleteResume = async (req, res) => {
  const id = req.query.id;
  try {
    const resume = await Resume.findOneAndDelete({ _id: id });
    res.status(200).json({ resume: resume });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @function getResumeAsPdf
 * @descripton Uses puppeteer library to render resume page then save as pdf
 * @param {Request} req
 * @param {Response} res
 */
export const getResumeAsPdf = async (req, res) => {
  const id = req.params.id;

  // Authenticate data
  const resume = await Resume.findById(id);
  if (!resume) {
    return res.status(400).send('Resume not found, cannot authenticate print');
  }
  if (!resume.userId) {
    return res.status(401).send('User not known, cannot authenticate print');
  }

  try {
    const executablePath = await new Promise(resolve => locateChrome((arg) => resolve(arg))) || '';
    const browser = await puppeteer.launch({ 
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      headless: true,
      executablePath,
      ignoreHTTPSErrors: true
    });
    const page = await browser.newPage();

    // Login and load page
    await page.goto(CLIENT_URL);
    await page.click('#loginBtn');
    await page.type('#email', 'test@test.com');
    await page.type('#password', 'test');
    await page.click('#submitLogin');
    await page.waitForNavigation();

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
