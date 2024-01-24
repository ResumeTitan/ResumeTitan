import { ChatGPTAPI } from 'chatgpt';
import Resume from "../models/Resume.js";

import dotenv from "dotenv";
dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const gpt = new ChatGPTAPI({apiKey: OPENAI_API_KEY});

const getPrompt = (resume) => {
  const prompt = `
  Can you extract key information from my resume and return it in a structured format?
  Your reseponse can only by in JSON format, with no other characters or plain text (no notes).
  The responses must be in the past tense.
  Here is the resume in JSON format: 
  ${JSON.stringify({
    jobs: resume.jobs,
    schools: resume.schools,
  })}
  
  \n
  In schools, using the notes, create a content field in the JSON response.
  In schools, the content field shall contain 2 full sentences in an array format, each with accomplishments/skills given by the student. If no accomplishments/skills are found, create some that would be associated with the major entered
  In schools, if a school name is recognized, use the full name of that school in the value of the JSON output.
  In schools, if a major is recognized, use the full name of that major in the value of the JSON output.

  In jobs, using the notes, create an content field in the JSON response.
  In jobs, the content field shall contain 4 full sentences in an array format, each with responsibilities/skills an employee might have.
  In jobs, if a job title is recognized, use the full name of that job title in the value of the JSON output.
  In jobs, if a company is recognized, use the full name of that company in the value of the JSON output.
  In addition, based on the information provided, create an "summary" statement relating to the jobs and education given. Include this in the JSON response.
  In addition, based on the information provided, create a "skills" array that includes the skills gained through the education and work experience provided. Create 6 skills. Include this in the JSON response.
  If the resume provided is blank, provide a generic JSON template based on the keys in the input.`
  ;

  return prompt;
}

/* Generate resume from input */
export const createResume = async (req, res) => {
  try {
    const resume = req.body;
    console.log(resume);
    const gptResponse = await gpt.sendMessage(getPrompt(resume));

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
    resumeWithResponse.jobs.forEach((job) => {
      job.content = job.content.map((sentence) => {
        if (sentence[sentence.length - 1] === '.') {
          return sentence.substring(0, sentence.length - 1);
        } else {
          return sentence;
        }
      })}
    );

    resumeWithResponse.schools.forEach((school) => {
      school.content = school.content.map((sentence) => {
        if (sentence[sentence.length - 1] === '.') {
          return sentence.substring(0, sentence.length - 1);
        } else {
          return sentence;
        }
      })}
    );

    const resumeOut = Object.assign(resume, resumeWithResponse);
    resumeOut.userId = req.user.id;
    
    // Save resume to database
    let newResume;
    if (resumeOut._id) {
      console.log('updating resume');
      newResume = await Resume.findOneAndUpdate({ _id: resumeOut._id }, resumeOut);
    } else {
      delete resumeOut._id;
      console.log('creating resume');
      newResume = new Resume(resumeOut);
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
      resumeOut = await Resume.findOneAndUpdate({ _id: resume._id }, resume);
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
