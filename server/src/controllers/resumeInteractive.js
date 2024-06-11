import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

const PersonalInfoSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  address: z.string()
});

const EducationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  fieldOfStudy: z.string(),
  startDate: z.string(),
  endDate: z.string()
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

const ResumeDataSchema = z.object({
  personal: PersonalInfoSchema.optional(),
  education: z.array(EducationSchema).optional(),
  jobs: z.array(JobSchema).optional(),
  skills: SkillsSchema.optional()
});

const resumeData = {};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const model = new ChatOpenAI({ model: "gpt-4o", apiKey: OPENAI_API_KEY });
const personalModel = model.withStructuredOutput(PersonalInfoSchema);
const educationModel = model.withStructuredOutput(EducationSchema);
const jobModel = model.withStructuredOutput(JobSchema);
const skillsModel = model.withStructuredOutput(SkillsSchema);
const resumeModel = model.withStructuredOutput(ResumeDataSchema);

const getPrompt = (section, data) => {
  let prompt = 'You are a hiring manager at a company and you need to generate the perfect resume for a potential candidate.';
  switch (section) {
    case 'personal':
      return `Generate a JSON representation of the personal information for a resume: ${JSON.stringify(data)}`;
    case 'education':
      return `Generate a JSON representation of the education section for a resume: ${JSON.stringify(data)}`;
    case 'job':
      return `Generate a JSON representation of the job experience section for a resume using this information: ${JSON.stringify(data)}
              The content field shall be an array of strings with responsibilities/skills an employee has.
              Include at least 4 strings, in full sentences, in both responsibilities and extraResponsibilities that could be used on the resume for this person.
              These strings should include keywords that would score well on an ATS system.
              This content should not repeat the name of the employer. 
              If content already exists, generate new content that would be associated with the job title entered.
              Be sure to fix any spelling or grammar mistakes if there is existing content being passed in.`;
    case 'skills':
      return `Generate a JSON representation of the skills section for a resume: ${JSON.stringify(data)}`;
    default:
      return '';
  }
};

export const postPersonalInfo = async (req, res) => {
  const { personalInfo } = req.body;
  resumeData.personal = personalInfo;

  const gptResponse = await personalModel.invoke(getPrompt('personal', personalInfo));

  res.status(200).json({ message: 'Personal information added successfully', response: gptResponse });
};

export const postEducation = async (req, res) => {
  const { education } = req.body;
  resumeData.education = education;

  const gptResponse = await educationModel.invoke(getPrompt('education', education));

  res.status(200).json({ message: 'Education information added successfully', response: gptResponse });
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
  const { skills } = req.body;
  resumeData.skills = skills;

  const gptResponse = await skillsModel.invoke(getPrompt('skills', skills));

  res.status(200).json({ message: 'Skills information added successfully', response: gptResponse });
}

export const postResume = async (req, res) => {
  const gptResponse = await resumeModel.invoke(`Generate a complete JSON resume with the following information: ${JSON.stringify(resumeData)}`);

  res.status(200).json({ resume: gptResponse });
};
