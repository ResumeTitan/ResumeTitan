import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import CoverLetter from "../models/CoverLetter.js";

import dotenv from "dotenv";
dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const model = new ChatOpenAI({ model: "gpt-4o", apiKey: OPENAI_API_KEY });
const coverLetterModel = model.withStructuredOutput(z.object({
  coverLetter: z.array(z.object({
    question: z.string(),
    example: z.string(),
    guidance: z.string()
  }))
}));

const getPrompt = (jobTitle, jobDescription) => {
  const prompt = `
  Create a professional cover lettor for the position of ${jobTitle}.
  The job description is as follows: ${jobDescription}
  Please provide me with a list of questions you would ask me during the coverLetter.
  Along with the list of questions, please provide me with an example answer to each question.
  Along with the list of questions, please provide guidance on what you are looking for in the answer and how I should respond.
  Your response must be in JSON format. The format shall have a key called "coverLetter" with an array of questions. Each question shall have the following keys: question, example, guidance.
  Give at least 10 questions.`;

  return prompt;
}

/**
 * createUpdateCoverLetter
 * @description POST that creates coverLetter questions based on the resume and job description
 * @param {string} token The user token
 * @param {string} id The resume id
 * @returns 
 */
export const createUpdateCoverLetter = async (req, res) => {
  try {
    const { jobTitle, jobDescription, coverLetterId } = req.body;
    const gptResponse = await coverLetterModel.invoke(getPrompt(jobTitle, jobDescription));

    const coverLetter = gptResponse.coverLetter;

    // Save the coverLetter to the database
    const coverLetterIn = {
      coverLetter,
      jobTitle,
      jobDescription,
      userId: req.user.id,
    }
    coverLetter.userId = req.user.id;
    if (coverLetterId) {
      const coverLetterOut = await CoverLetter.findOneAndUpdate({ _id: coverLetterId }, coverLetterIn);
      res.status(200).json({ coverLetter: coverLetterOut });
      return;
    }

    const coverLetterOut = await CoverLetter.create(coverLetterIn);
    res.status(200).json({ coverLetter: coverLetterOut });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * getCoverLetters
 * @description GET that retrieves all coverLetters for a user
 * @param {string} token The user token
 * @param {string} userId The user id
 * @returns 
 */
export const getCoverLetters = async (req, res) => {
  try {
    const coverLetters = await CoverLetter.find({ userId: req.user.id });
    res.status(200).json({ coverLetters });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * getCoverLetter
 * @description GET that retrieves a single coverLetter
 * @param {Request} req
 * @param {Response} res
 */
export const getCoverLetter = async (req, res) => {
  try {
    const coverLetter = await CoverLetter.findById(req.params.id);
    res.status(200).json({ coverLetter });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * @function deleteCoverLetter
 * @description Delete an coverLetter from an id
 * @param {Request} req
 * @param {Response} res
 */
export const deleteCoverLetter = async (req, res) => {
  const id = req.params.id;
  try {
    await CoverLetter.findOneAndDelete({ _id: id });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * @fuction updateCoverLetter
 * @description Update an coverLetter
 * @param {Request} req
 * @param {Response} res
 */
export const updateCoverLetter = async (req, res) => {
  const id = req.params.id;
  const coverLetter = req.body;
  try {
    await CoverLetter.findOneAndUpdate({ _id: id }, coverLetter);
    res.status(200).json({ coverLetter });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
