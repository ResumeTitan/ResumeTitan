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
  Here is the resume in JSON format: 
  ${JSON.stringify({
    jobs: resume.jobs,
    schools: resume.schools,
  })}
  
  \n
  In schools, using the notes, create an accomplishments field in the JSON response.
  In schools, the accomplishments field shall contain 2 full sentences in an array format, comprising of accomplishments given by the student.
  In schools, if a school name is recognized, use the full name of that school in the value of the JSON output.
  In schools, if a major is recognized, use the full name of that major in the value of the JSON output.

  In jobs, using the notes, create an responsibilities field in the JSON response.
  In jobs, the responsibilities field shall contain 4 full sentences in an array format, comprising of responsibilities an employee might have.
  In jobs, if a job title is recognized, use the full name of that job title in the value of the JSON output.
  In jobs, if a company is recognized, use the full name of that company in the value of the JSON output.
  In addition, based on the information provided, create an "objective" statement relating to the jobs and education given. Include this in the JSON response.
  In addition, based on the information provided, create a "skills" array that includes the skills gained through the education and work experience provided. Include this in the JSON response.
  If the resume provided is blank, provide a generic JSON template based on the keys in the input.`
  ;

  return prompt;
}

/* Generate resume from input */
export const createResume = async (req, res) => {
  try {
    const resume = req.body;
    const gptResponse = await gpt.sendMessage(getPrompt(resume));

    // Find the starting and ending positions of the JSON code
    const start = gptResponse.text.indexOf('{');
    const end = gptResponse.text.lastIndexOf('}');
    console.log(gptResponse.text);

    let resumeWithResponse;
    if (start !== -1 && end !== -1) {
      const jsonStr = gptResponse.text.substring(start, end + 1);
      resumeWithResponse = JSON.parse(jsonStr);
    } else {
      throw new Error('Could not parse JSON response');
    }

    const resumeOut = Object.assign(resume, resumeWithResponse);
    resumeOut.userId = req.user.id;
    
    // Save resume to database
    const newResume = new Resume(resumeOut);
    await newResume.save();

    res.status(200).json( { resume: newResume });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

/* Get resumes */
export const getResume = async (req, res) => {
  const userId = req.query.userId;
  try {
    const resume = await Resume.findOne({ userId: userId });
    res.status(200).json({ resume: resume });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
