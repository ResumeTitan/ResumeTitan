import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import Interview from "../models/Interview.js";

import dotenv from "dotenv";
dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const model = new ChatOpenAI({ model: "gpt-4o", apiKey: OPENAI_API_KEY });
const interviewModel = model.withStructuredOutput(z.object({
  interview: z.array(z.object({
    question: z.string(),
    example: z.string(),
    guidance: z.string()
  }))
}));

const getPrompt = (jobTitle, jobDescription) => {
  const prompt = `
  You are a hiring manager and you are interviewing me for the position of ${jobTitle}.
  The job description is as follows: ${jobDescription}
  Please provide me with a list of questions you would ask me during the interview.
  Along with the list of questions, please provide me with an example answer to each question.
  Along with the list of questions, please provide guidance on what you are looking for in the answer and how I should respond.
  Your response must be in JSON format. The format shall have a key called "interview" with an array of questions. Each question shall have the following keys: question, example, guidance.
  Give at least 10 questions.`;

  return prompt;
}

/**
 * createInterview
 * @description POST that creates interview questions based on the resume and job description
 * @param {string} token The user token
 * @param {string} id The resume id
 * @returns 
 */
export const createUpdateInterview = async (req, res) => {
  try {
    const { jobTitle, jobDescription, interviewId } = req.body;
    const gptResponse = await interviewModel.invoke(getPrompt(jobTitle, jobDescription));

    const interview = gptResponse.interview;

    // Save the interview to the database
    const interviewIn = {
      interview,
      jobTitle,
      jobDescription,
      userId: req.user.id,
    }
    interview.userId = req.user.id;
    if (interviewId) {
      const interviewOut = await Interview.findOneAndUpdate({ _id: interviewId }, interviewIn);
      res.status(200).json({ interview: interviewOut });
      return;
    }

    const interviewOut = await Interview.create(interviewIn);
    res.status(200).json({ interview: interviewOut });
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
    res.status(200).json({ interviews });
  } catch (error) {
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
export const getInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    res.status(200).json({ interview });
  } catch (error) {
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
export const deleteInterview = async (req, res) => {
  const id = req.params.id;
  try {
    await Interview.findOneAndDelete({ _id: id });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * @fuction updateInterview
 * @description Update an interview
 * @param {Request} req
 * @param {Response} res
 */
export const updateInterview = async (req, res) => {
  const id = req.params.id;
  const interview = req.body;
  try {
    await Interview.findOneAndUpdate({ _id: id }, interview);
    res.status(200).json({ interview });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
