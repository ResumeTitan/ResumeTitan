import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

const EducationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  fieldOfStudy: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  accomplishments: z.array(z.string()),
  extraAccomplishments: z.array(z.string())
});

const JobSchema = z.object({
  title: z.string(),
  company: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  responsibilities: z.array(z.string()),
  extraResponsibilities: z.array(z.string())
});

const SkillsSchema = z.object({
  skills: z.array(z.string())
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

const resumeData = {};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const model = new ChatOpenAI({ model: "gpt-4o", apiKey: OPENAI_API_KEY });
const summaryModel = model.withStructuredOutput(SummarySchema);
const educationModel = model.withStructuredOutput(EducationSchema);
const jobModel = model.withStructuredOutput(JobSchema);
const skillsModel = model.withStructuredOutput(SkillsSchema);
const resumeModel = model.withStructuredOutput(ResumeDataSchema);

const getPrompt = (section, data) => {
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
              The response shall include an array of strings with accomplishments a student has.
              Include at least 4 strings, in full sentences, in both accomplishments and extraAccomplishments that could be used on the resume for this person.
              If no accomplishments are found, create some that would be associated with the major/area of study entered.
              These strings should include keywords that would score well on an ATS system.
              This content should not repeat the name of the school.
              Be sure to fix any spelling or grammar mistakes if there is existing content being passed in.`;
    case 'job':
      return prompt + `Generate a JSON representation of the job experience section for a resume using this information: ${JSON.stringify(data)}
              Use this information only, and not previous information entered.
              The response shall include an array of strings with responsibilities an employee has.
              Include at least 4 strings, in full sentences, in both responsibilities and extraResponsibilities that could be used on the resume for this person.
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

export const postSummary = async (req, res) => {
  const { summary, work, education, skills, certificates } = req.body;
  resumeData.summary = summary;

  const gptResponse = await summaryModel.invoke(getPrompt('summary', {
    extraNotes: summary,
    work,
    education,
    skills,
    certificates
  }));

  res.status(200).json({ message: 'Summary information added successfully', response: gptResponse });
};

export const postEducation = async (req, res) => {
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

export const postJob = async (req, res) => {
  const { job } = req.body;
  if (!resumeData.jobs) {
    resumeData.jobs = [];
  }
  resumeData.jobs.push(job);

  const gptResponse = await jobModel.invoke(getPrompt('job', job));

  res.status(200).json({ message: 'Job information added successfully', response: gptResponse });
}

export const postSkills = async (req, res) => {
  const { skills, work, education, summary } = req.body;
  resumeData.skills = skills;

  const gptResponse = await skillsModel.invoke(getPrompt('skills', { skills, work, education, summary }));

  res.status(200).json({ message: 'Skills information added successfully', response: gptResponse });
}

export const postResume = async (req, res) => {
  const gptResponse = await resumeModel.invoke(`Generate a complete JSON resume with the following information: ${JSON.stringify(resumeData)}`);

  res.status(200).json({ resume: gptResponse });
};
