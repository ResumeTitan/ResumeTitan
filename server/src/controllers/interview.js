import { ChatGPTAPI } from 'chatgpt';
import Interview from "../models/Interview.js";

import dotenv from "dotenv";
dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const gpt = new ChatGPTAPI({apiKey: OPENAI_API_KEY});

const getPrompt = (jobTitle, jobDescription) => {
  const prompt = `
  You are a hiring manager and you are interviewing me for the position of ${jobTitle}.
  The job description is as follows: ${jobDescription}
  Please provide me with a list of questions you would ask me during the interview.
  Along with the list of questions, please provide me with an example answer to each question.
  Along with the list of questions, please provide guidance on what you are looking for in the answer and how I should respond.
  Your response must be in JSON format. The format shall have a key called "interview" with an array of questions. Each question shall have the following keys: question, example, guidance.
  Here is an example of the JSON format:
  {interview: [
    {
      question: "Can you describe a challenging technical problem you faced in a previous project, and how you solved it?",
      example: "In my previous role, I encountered a scalability issue where our system couldn't handle a sudden spike in user traffic. I led a team to identify the bottleneck in our architecture, implemented optimizations, and introduced load balancing techniques to distribute the traffic efficiently. Through careful monitoring and testing, we successfully resolved the issue and improved our system's performance.",
      guidance: "When answering this question, focus on the specific problem, your approach to solving it, and the outcome of your efforts. Highlight your problem-solving skills, teamwork, and ability to handle challenges effectively."
    }
  ]}`;

  return prompt;
}

/**
 * createInterview
 * @description POST that creates interview questions based on the resume and job description
 * @param {string} token The user token
 * @param {string} id The resume id
 * @returns 
 */
export const createInterview = async (req, res) => {
  try {
    const { jobTitle, jobDescription } = req.body;
    const gptResponse = await gpt.sendMessage(getPrompt(jobTitle, jobDescription));

    // Find the starting and ending positions of the JSON code
    const start = gptResponse.text.indexOf('{');
    const end = gptResponse.text.lastIndexOf('}');

    let interview;
    if (start !== -1 && end !== -1) {
      const jsonStr = gptResponse.text.substring(start, end + 1);
      interview = JSON.parse(jsonStr);
    } else {
      interview = {
        question: [],
        example: [],
        guidance: [],
      };
    }

    // Save the interview to the database
    interview.userId = req.user.id;
    await Interview.create(interview);

    res.status(200).json({ interview: interview });
  } catch (error) {
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
export const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user.id });
    console.log("interviews", interviews);
    res.status(200).json({ interviews });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * getInterview
 * @description GET that retrieves a single interview
 * @param {string} token The user token
 * @param {string} id The interview id
 * @returns 
 */
export const getInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    res.status(200).json({ interview });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: error.message });
  }
}