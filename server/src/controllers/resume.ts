import { Response, Request } from 'express';
import Resume from '../models/Resume';
import { z } from "zod";
import { ResumeType } from "../types/types";
import { geminiClient } from '../ext/clients';
import puppeteer from 'puppeteer';

import "dotenv/config";
import Metric from '../models/Metric';
const CLIENT_URL = process.env.CLIENT_URL;

const EducationSchema = z.object({
  institution: z.string().nullish(),
  studyType: z.string().nullish(),
  area: z.string().nullish(),
  startDate: z.string().nullish(),
  endDate: z.string().nullish(),
  highlights: z.array(z.string()).optional()
});

const VolunteerSchema = z.object({
  organization: z.string().nullish(),
  position: z.string().nullish(),
  url: z.string().nullish(),
  startDate: z.string().nullish(),
  endDate: z.string().nullish(),
  highlights: z.array(z.string()).optional()
});

const WorkSchema = z.object({
  position: z.string().nullish(),
  name: z.string().nullish(),
  startDate: z.string().nullish(),
  endDate: z.string().nullish(),
  highlights: z.array(z.string()).optional()
});

const ProjectsSchema = z.object({
  name: z.string().nullish(),
  startDate: z.string().nullish(),
  endDate: z.string().nullish(),
  description: z.string().nullish(),
  highlights: z.array(z.string()).optional(),
  url: z.string().nullish()
});

const SkillsSchema = z.object({
  skills: z.array(z.object({
    name: z.string(),
    level: z.string().nullish(),
    keywords: z.array(z.string()).optional()
  })).optional()
});

const SummarySchema = z.object({
  summary: z.string()
});

const AwardsSchema = z.object({
  title: z.string().nullish(),
  date: z.string().nullish(),
  awarder: z.string().nullish(),
  summary: z.string().nullish()
});

const ResumeDataSchema = z.object({
  summary: z.string(),
  education: z.array(EducationSchema).nullish(),
  work: z.array(WorkSchema).nullish(),
  skills: SkillsSchema.nullish(),
  awards: z.array(AwardsSchema).nullish()
});

const UploadedResumeSchema = z.object({
  name: z.string().optional(),
  basics: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    url: z.string().optional(),
    summary: z.string().optional(),
    location: z.object({
      address: z.string().optional(),
      city: z.string().optional(),
      region: z.string().optional()
    }).optional(),
    profiles: z.array(z.object({
      network: z.string().optional(),
      username: z.string().optional(),
      url: z.string().optional()
    })).optional()
  }).optional(),
  education: z.array(EducationSchema.extend({ id: z.number().optional() })).optional(),
  work: z.array(WorkSchema.extend({ id: z.number().optional() })).optional(),
  projects: z.array(ProjectsSchema.extend({ id: z.number().optional() })).optional(),
  skills: z.array(z.object({
    name: z.string().optional(),
    level: z.string().optional(),
    keywords: z.array(z.string()).optional()
  })).optional(),
  volunteer: z.array(VolunteerSchema.extend({ id: z.number().optional() })).optional(),
  awards: z.array(AwardsSchema.extend({ id: z.number().optional() })).optional(),
  sections: z.array(z.string()).optional(),
  theme: z.string().optional(),
  font: z.string().optional()
});

const resumeData: ResumeType = {};

// Helper function to get structured output from Gemini
const getStructuredOutput = async (prompt: string, schema: z.ZodType<any>) => {
  const result = await geminiClient.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  try {
    // Remove markdown code block formatting if present
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    const json = JSON.parse(cleanText);
    return schema.parse(json);
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    throw new Error('Failed to parse AI response');
  }
};

const getPrompt = (section: string, data: any, operationType: string = 'generate') => {
  switch (section) {
    case 'summary':
      if (operationType === 'edit' && data.userInput) {
        return `You are an AI assistant helping to edit a resume summary. Analyze the current summary and apply the user's instructions intelligently.

Current Resume Data: ${JSON.stringify(data)}
Current Summary: "${data.summary || data.extraNotes || ''}"
User Instructions: "${data.userInput}"

INSTRUCTIONS FOR AI ASSISTANT:
The user wants you to modify their resume summary based on their specific request. You should:

1. **Carefully read the user's instructions** and understand what they want to change

2. **Common editing requests and how to handle them:**
   
   **LENGTH ADJUSTMENTS:**
   - "Make this more concise/shorter/brief" → Condense to 1-2 sentences, remove redundant words, keep only the most impactful points
   - "Make this more detailed/longer/comprehensive" → Expand to 3-4 sentences, add specific skills, quantifiable achievements, or industry keywords
   - "Make this punchier/more impactful" → Use stronger action words, add metrics, focus on unique value proposition
   
   **CONTENT MODIFICATIONS:**
   - "Add [specific skill/experience]" → Incorporate the mentioned elements naturally into the summary
   - "Remove [something]" → Eliminate specified content while maintaining flow
   - "Focus more on [area]" → Emphasize the specified area while de-emphasizing others
   - "Make it sound more [adjective]" → Adjust tone and word choice accordingly
   
   **TARGETING & OPTIMIZATION:**
   - "Tailor for [industry/role]" → Use industry-specific keywords and relevant skills
   - "Make it more ATS-friendly" → Include relevant keywords from their background
   - "Improve grammar/flow" → Fix any issues while maintaining meaning

3. **Length Guidelines:**
   - **Concise version**: 1-2 sentences (30-50 words)
   - **Standard version**: 2-3 sentences (50-80 words) 
   - **Detailed version**: 3-4 sentences (80-120 words)
   - **Never exceed 4 sentences** - recruiters prefer brevity

4. **Maintain professional resume language** and ensure the summary:
   - Starts with their professional title or key strength
   - Includes quantifiable experience when available
   - Highlights 2-3 key skills or specializations
   - Ends with their current goal or value proposition

5. **Preserve important information** unless specifically asked to remove it

6. **Use the user's work/education background** for context and relevant keywords

7. **Return ONLY valid JSON**, no additional text or markdown formatting

Requirements:
- Apply the user's specific instructions precisely
- Include key skills and experience from their background
- Optimize for ATS compatibility
- Fix any grammar/spelling issues
- Match the requested length/detail level

Format as JSON:
{
  "summary": "summary text"
}`;
      } else {
        return `Generate a professional resume summary for:
Data: ${JSON.stringify(data)}

Requirements:
1. 2-3 sentences
2. Include key skills and experience
3. Optimize for ATS
4. Fix any grammar/spelling

Format as JSON:
{
  "summary": "summary text"
}`;
      }

    case 'education':
      if (operationType === 'brainstorm' && data.userInput) {
        return `Generate education highlights based on brainstorming input:
Education Details: ${JSON.stringify(data)}
Brainstorm Input: "${data.userInput}"

Requirements:
1. Transform the brainstorm ideas into 3-6 professional education highlights
2. Focus on academic achievements, projects, coursework, and extracurricular activities
3. Make each highlight specific and quantifiable where possible
4. Optimize for ATS
5. No school name repetition
6. Each highlight should be unique and impactful
7. Return ONLY valid JSON, no additional text or markdown formatting

Format as JSON:
{
  "institution": "school name",
  "studyType": "degree type", 
  "area": "major",
  "startDate": "start date",
  "endDate": "end date",
  "highlights": ["achievement 1", "achievement 2", ...]
}`;
      } else if (operationType === 'edit' && data.userInput) {
        return `You are an AI assistant helping to edit resume highlights. Analyze the existing highlights and apply the user's instructions intelligently.

Current Education Entry: ${JSON.stringify(data)}
User Instructions: "${data.userInput}"
Current Highlights: ${JSON.stringify(data.highlights || [])}

INSTRUCTIONS FOR AI ASSISTANT:
The user wants you to modify their education highlights based on their specific request. You should:
1. Carefully read the user's instructions and understand what they want to change
2. Look at the existing highlights and determine how to best apply the user's request
3. The user might want you to:
   - Rewrite specific highlights for better impact or clarity
   - Add new highlights they forgot to mention
   - Remove highlights that aren't relevant
   - Improve grammar, tone, or professional language
   - Reorganize highlights for better flow
   - Make highlights more quantifiable or specific
   - Ensure consistency across all highlights
4. Apply the user's instructions while maintaining professional resume language
5. Keep the total number of highlights reasonable (3-6)
6. Preserve any highlights the user didn't specifically ask to change
7. Return ONLY valid JSON, no additional text or markdown formatting

Format as JSON:
{
  "institution": "school name",
  "studyType": "degree type",
  "area": "major", 
  "startDate": "start date",
  "endDate": "end date",
  "highlights": ["achievement 1", "achievement 2", ...]
}`;
      } else {
        return `Generate education highlights for:
Data: ${JSON.stringify(data)}

Requirements:
1. Generate 2-6 relevant highlights based on the education details
2. Include academic achievements and key projects
3. Optimize for ATS
4. No school name repetition
5. Each highlight should be unique and impactful
6. Return ONLY valid JSON, no additional text or markdown formatting

Format as JSON:
{
  "institution": "school name",
  "studyType": "degree type",
  "area": "major",
  "startDate": "start date", 
  "endDate": "end date",
  "highlights": ["achievement 1", "achievement 2", ...]
}`;
      }

    case 'work':
      if (operationType === 'brainstorm' && data.userInput) {
        return `Generate work experience highlights based on brainstorming input:
Work Details: ${JSON.stringify(data)}
Brainstorm Input: "${data.userInput}"

Requirements:
1. Transform the brainstorm ideas into 4-7 professional work highlights
2. Focus on quantifiable achievements, impact, and responsibilities
3. Make each highlight action-oriented and results-focused
4. Optimize for ATS
5. No company name repetition
6. Each highlight should demonstrate unique value
7. Return ONLY valid JSON, no additional text or markdown formatting

Format as JSON:
{
  "position": "job title",
  "name": "company name",
  "startDate": "start date",
  "endDate": "end date", 
  "highlights": ["achievement 1", "achievement 2", ...],
  "summary": "brief role description"
}`;
      } else if (operationType === 'edit' && data.userInput) {
        return `You are an AI assistant helping to edit resume highlights. Analyze the existing highlights and apply the user's instructions intelligently.

Current Work Entry: ${JSON.stringify(data)}
User Instructions: "${data.userInput}"
Current Highlights: ${JSON.stringify(data.highlights || [])}

INSTRUCTIONS FOR AI ASSISTANT:
The user wants you to modify their work highlights based on their specific request. You should:
1. Carefully read the user's instructions and understand what they want to change
2. Look at the existing highlights and determine how to best apply the user's request
3. The user might want you to:
   - Rewrite specific highlights for better impact or clarity
   - Add new highlights they forgot to mention
   - Remove highlights that aren't relevant
   - Improve grammar, tone, or professional language
   - Reorganize highlights for better flow
   - Make highlights more quantifiable or specific
   - Ensure consistency across all highlights
4. Apply the user's instructions while maintaining professional resume language
5. Keep the total number of highlights reasonable (3-7)
6. Preserve any highlights the user didn't specifically ask to change
7. Return ONLY valid JSON, no additional text or markdown formatting

Format as JSON:
{
  "position": "job title", 
  "name": "company name",
  "startDate": "start date",
  "endDate": "end date",
  "highlights": ["achievement 1", "achievement 2", ...],
  "summary": "brief role description"
}`;
      } else {
        return `Generate work experience highlights for:
Data: ${JSON.stringify(data)}

Requirements:
1. Generate 3-7 relevant highlights based on the role and responsibilities
2. Focus on quantifiable achievements and impact
3. Optimize for ATS
4. No company name repetition
5. Each highlight should demonstrate unique value
6. Return ONLY valid JSON, no additional text or markdown formatting

Format as JSON:
{
  "position": "job title",
  "name": "company name", 
  "startDate": "start date",
  "endDate": "end date",
  "highlights": ["achievement 1", "achievement 2", ...],
  "summary": "brief role description"
}`;
      }

    case 'volunteer':
      if (operationType === 'brainstorm' && data.userInput) {
        return `Generate volunteer experience highlights based on brainstorming input:
Volunteer Details: ${JSON.stringify(data)}
Brainstorm Input: "${data.userInput}"

Requirements:
1. Transform the brainstorm ideas into 3-6 professional volunteer highlights
2. Focus on impact, skills gained, and community contribution
3. Make each highlight specific and meaningful
4. Optimize for ATS
5. No organization name repetition
6. Each highlight should show unique contribution
7. Return ONLY valid JSON, no additional text or markdown formatting

Format as JSON:
{
  "organization": "org name",
  "position": "role",
  "url": "website",
  "startDate": "start date",
  "endDate": "end date",
  "highlights": ["achievement 1", "achievement 2", ...]
}`;
      } else if (operationType === 'edit' && data.userInput) {
        return `You are an AI assistant helping to edit resume highlights. Analyze the existing highlights and apply the user's instructions intelligently.

Current Volunteer Entry: ${JSON.stringify(data)}
User Instructions: "${data.userInput}"
Current Highlights: ${JSON.stringify(data.highlights || [])}

INSTRUCTIONS FOR AI ASSISTANT:
The user wants you to modify their volunteer highlights based on their specific request. You should:
1. Carefully read the user's instructions and understand what they want to change
2. Look at the existing highlights and determine how to best apply the user's request
3. The user might want you to:
   - Rewrite specific highlights for better impact or clarity
   - Add new highlights they forgot to mention
   - Remove highlights that aren't relevant
   - Improve grammar, tone, or professional language
   - Reorganize highlights for better flow
   - Make highlights more quantifiable or specific
   - Ensure consistency across all highlights
4. Apply the user's instructions while maintaining professional resume language
5. Keep the total number of highlights reasonable (3-6)
6. Preserve any highlights the user didn't specifically ask to change
7. Return ONLY valid JSON, no additional text or markdown formatting

Format as JSON:
{
  "organization": "org name",
  "position": "role", 
  "url": "website",
  "startDate": "start date",
  "endDate": "end date",
  "highlights": ["achievement 1", "achievement 2", ...]
}`;
      } else {
        return `Generate volunteer experience highlights for:
Data: ${JSON.stringify(data)}

Requirements:
1. Generate 2-5 relevant highlights based on the volunteer role
2. Focus on impact and skills gained
3. Optimize for ATS
4. No organization name repetition
5. Each highlight should show unique contribution
6. Return ONLY valid JSON, no additional text or markdown formatting

Format as JSON:
{
  "organization": "org name",
  "position": "role",
  "url": "website", 
  "startDate": "start date",
  "endDate": "end date",
  "highlights": ["achievement 1", "achievement 2", ...]
}`;
      }

    case 'projects':
      if (operationType === 'brainstorm' && data.userInput) {
        return `Generate project highlights based on brainstorming input:
Project Details: ${JSON.stringify(data)}
Brainstorm Input: "${data.userInput}"

Requirements:
1. Transform the brainstorm ideas into 3-6 professional project highlights
2. Focus on technical achievements, problem-solving, and project outcomes
3. Make each highlight specific and quantifiable where possible
4. Optimize for ATS
5. No project name repetition
6. Each highlight should demonstrate unique technical or creative value
7. Return ONLY valid JSON, no additional text or markdown formatting

Format as JSON:
{
  "name": "project name",
  "startDate": "start date",
  "endDate": "end date",
  "highlights": ["achievement 1", "achievement 2", ...],
  "url": "project url"
}`;
      } else if (operationType === 'edit' && data.userInput) {
        return `You are an AI assistant helping to edit resume project highlights. Analyze the existing highlights and apply the user's instructions intelligently.

Current Project Entry: ${JSON.stringify(data)}
User Instructions: "${data.userInput}"
Current Highlights: ${JSON.stringify(data.highlights || [])}

INSTRUCTIONS FOR AI ASSISTANT:
The user wants you to modify their project highlights based on their specific request. You should:
1. Carefully read the user's instructions and understand what they want to change
2. Look at the existing highlights and determine how to best apply the user's request
3. The user might want you to:
   - Rewrite specific highlights for better impact or clarity
   - Add new highlights they forgot to mention
   - Remove highlights that aren't relevant
   - Improve grammar, tone, or professional language
   - Reorganize highlights for better flow
   - Make highlights more quantifiable or specific
   - Ensure consistency across all highlights
4. Apply the user's instructions while maintaining professional resume language
5. Keep the total number of highlights reasonable (3-6)
6. Preserve any highlights the user didn't specifically ask to change
7. Return ONLY valid JSON, no additional text or markdown formatting

Format as JSON:
{
  "name": "project name",
  "startDate": "start date",
  "endDate": "end date",
  "highlights": ["achievement 1", "achievement 2", ...],
  "url": "project url"
}`;
      } else {
        return `Generate project highlights for:
Data: ${JSON.stringify(data)}

Requirements:
1. Generate 3-6 relevant highlights based on the project details
2. Focus on technical achievements, problem-solving, and outcomes
3. Optimize for ATS
4. No project name repetition
5. Each highlight should demonstrate unique value
6. Return ONLY valid JSON, no additional text or markdown formatting

Format as JSON:
{
  "name": "project name",
  "startDate": "start date",
  "endDate": "end date",
  "highlights": ["achievement 1", "achievement 2", ...],
  "url": "project url"
}`;
      }

    case 'skills':
      if (operationType === 'edit' && data.userInput) {
        return `You are an AI assistant helping to edit and organize resume skills. You can handle various skill operations including organizing, grouping, adding, removing, or restructuring skills.

Current Skills Data: ${JSON.stringify(data)}
User Request: "${data.userInput}"
Existing Skills: ${JSON.stringify(data.skills || [])}

INSTRUCTIONS FOR AI ASSISTANT:
The user wants you to modify their skills based on their specific request. You should intelligently interpret what they want and apply it. Common requests include:

1. **Grouping/Categorizing**: "group these skills into sets of subskills", "organize by category", "create skill groups"
   - Create logical skill categories (e.g. "Programming Languages", "Web Technologies", "Databases")
   - Group related skills together under appropriate categories
   - Use the skill name as the category and keywords as the subskills

2. **Adding Skills**: "add Python", "include project management skills"
   - Add new skills to the existing list
   - Assign appropriate proficiency levels
   - Add relevant keywords/subskills

3. **Removing Skills**: "remove outdated skills", "take out basic skills"
   - Remove specified or outdated skills
   - Keep only relevant, current skills

4. **Reorganizing**: "prioritize most important", "reorder by proficiency"
   - Reorder skills by importance, proficiency, or relevance
   - Keep the most valuable skills prominent

5. **Improving**: "make these more specific", "add proficiency levels"
   - Enhance existing skills with better descriptions
   - Add or update proficiency levels
   - Add relevant keywords/technologies

6. **Reformatting**: "break down into subcategories", "consolidate similar skills"
   - Restructure how skills are presented
   - Combine or separate skills as needed

For **grouping operations specifically**:
- Use the main category as the skill "name" (e.g., "Programming Languages")
- Put the specific technologies in "keywords" array (e.g., ["JavaScript", "Python", "Java"])
- Set appropriate proficiency levels for the category
- Common skill groups: Programming Languages, Web Technologies, Databases, Cloud Platforms, Tools & Software, Frameworks, Operating Systems

Apply the user's instructions while maintaining professional resume language. Return ONLY valid JSON, no additional text or markdown formatting.

Format as JSON:
{
  "skills": [
    {
      "name": "skill name or category name",
      "level": "proficiency level (Beginner/Intermediate/Advanced/Expert)",
      "keywords": ["specific skills", "technologies", "or subskills"]
    }
  ]
}`;
      } else {
        return `Generate relevant skills for:
Data: ${JSON.stringify(data)}

Requirements:
1. Generate 4-10 relevant skills based on work/education background
2. Include proficiency levels for each skill
3. Add relevant keywords for each skill
4. Match work/education background
5. Prioritize most important skills first
6. Consider grouping related skills into categories if appropriate
7. Return ONLY valid JSON, no additional text or markdown formatting

Format as JSON:
{
  "skills": [
    {
      "name": "skill name",
      "level": "proficiency", 
      "keywords": ["keyword1", "keyword2"]
    }
  ]
}`;
      }

    default:
      return '';
  }
};

export const postSummary = async (req: Request, res: Response) => {
  const { summary, work, education, skills, volunteer, basics, userInput, operationType } = req.body;
  resumeData.basics = basics;

  try {
    // Determine operation type based on request data
    let opType = operationType || 'generate';
    if (!opType && userInput) {
      // If userInput exists but no operationType specified, it's likely editing
      opType = 'edit';
    }

    console.log(basics?.summary || summary);
    console.log(userInput);
    console.log(opType);

    const prompt = getPrompt('summary', { 
      summary: basics?.summary || summary, 
      work, 
      education, 
      skills, 
      volunteer, 
      userInput 
    }, opType);

    const response = await getStructuredOutput(prompt, SummarySchema);
    res.status(200).json({ message: 'Summary information added successfully', response });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
};

export const postEducation = async (req: Request, res: Response) => {
  try {
    const { education, userInput, operationType } = req.body;
    if (!resumeData.education) {
      resumeData.education = [];
    }
    resumeData.education.push(education);

    // Determine operation type based on request data
    let opType = operationType || 'generate';
    if (!opType && userInput) {
      // If userInput exists but no operationType specified, determine based on context
      if (education.highlights && education.highlights.length > 0) {
        opType = 'edit'; // Has existing highlights, likely editing
      } else {
        opType = 'brainstorm'; // No existing highlights, likely brainstorming
      }
    }

    const prompt = getPrompt('education', { ...education, userInput }, opType);
    const response = await getStructuredOutput(prompt, EducationSchema);

    res.status(200).json({ message: 'Education information added successfully', response });
  } catch (error) {
    console.error('Error generating education information:', error);
    res.status(500).json({ error: 'Failed to generate education information' });
  }
};

/**
 * @function postWork
 * @description POST Handle AI call for work highlights
 * @param {Request} req
 * @param {Response} res
 */
export const postWork = async (req: Request, res: Response) => {
  try {
    const { job, userInput, operationType } = req.body;
    if (!resumeData.work) {
      resumeData.work = [];
    }
    resumeData.work.push(job);

    // Determine operation type based on request data
    let opType = operationType || 'generate';
    if (!opType && userInput) {
      // If userInput exists but no operationType specified, determine based on context
      if (job.highlights && job.highlights.length > 0) {
        opType = 'edit'; // Has existing highlights, likely editing
      } else {
        opType = 'brainstorm'; // No existing highlights, likely brainstorming
      }
    }

    const prompt = getPrompt('work', { ...job, userInput }, opType);
    const response = await getStructuredOutput(prompt, WorkSchema);

    res.status(200).json({ message: 'Job information added successfully', response });
  } catch (error) {
    console.error('Error generating work information:', error);
    res.status(500).json({ error: 'Failed to generate work information' });
  }
};

/**
 * @function postVolunteer
 * @description POST Handle AI call for volunteer highlights
 * @param {Request} req
 * @param {Response} res
 */
export const postVolunteer = async (req: Request, res: Response) => {
  try {
    const { volunteer, userInput, operationType } = req.body;
    if (!resumeData.volunteer) {
      resumeData.volunteer = [];
    }
    resumeData.volunteer.push(volunteer);

    // Determine operation type based on request data
    let opType = operationType || 'generate';
    if (!opType && userInput) {
      // If userInput exists but no operationType specified, determine based on context
      if (volunteer.highlights && volunteer.highlights.length > 0) {
        opType = 'edit'; // Has existing highlights, likely editing
      } else {
        opType = 'brainstorm'; // No existing highlights, likely brainstorming
      }
    }

    const prompt = getPrompt('volunteer', { ...volunteer, userInput }, opType);
    const response = await getStructuredOutput(prompt, VolunteerSchema);

    res.status(200).json({ message: 'Volunteer information added successfully', response });
  } catch (error) {
    console.error('Error generating volunteer information:', error);
    res.status(500).json({ error: 'Failed to generate volunteer information' });
  }
};

export const postProjects = async (req: Request, res: Response) => {
  try {
    const { project, userInput, operationType } = req.body;
    if (!resumeData.projects) {
      resumeData.projects = [];
    }
    resumeData.projects.push(project);

    // Determine operation type based on request data
    let opType = operationType || 'generate';
    if (!opType && userInput) {
      // If userInput exists but no operationType specified, determine based on context
      if (project.highlights && project.highlights.length > 0) {
        opType = 'edit'; // Has existing highlights, likely editing
      } else {
        opType = 'brainstorm'; // No existing highlights, likely brainstorming
      }
    }

    const prompt = getPrompt('projects', { ...project, userInput }, opType);
    const response = await getStructuredOutput(prompt, ProjectsSchema);

    res.status(200).json({ message: 'Project information added successfully', response });
  } catch (error) {
    console.error('Error generating project information:', error);
    res.status(500).json({ error: 'Failed to generate project information' });
  }
};

export const postSkills = async (req: Request, res: Response) => {
  const { skills, work, education, summary, volunteer, userInput, operationType } = req.body;
  resumeData.skills = skills;

  try {
    // Determine operation type based on request data
    let opType = operationType || 'generate';
    if (!opType && userInput) {
      // If userInput exists but no operationType specified, it's likely editing
      opType = 'edit';
    }

    const prompt = getPrompt('skills', { skills, work, education, summary, volunteer, userInput }, opType);
    const response = await getStructuredOutput(prompt, SkillsSchema);

    res.status(200).json({ msg: 'Skills information added successfully', response });
  } catch (error) {
    console.error('Error generating skills information:', error);
    res.status(500).json({ error: 'Failed to generate skills information' });
  }
};

export const postResume = async (req: Request, res: Response) => {
  try {
    const prompt = `Generate a complete JSON resume with the following information: ${JSON.stringify(resumeData)}`;
    const response = await getStructuredOutput(prompt, ResumeDataSchema);

    res.status(200).json({ resume: response });
  } catch (error) {
    console.error('Error generating complete resume:', error);
    res.status(500).json({ error: 'Failed to generate complete resume' });
  }
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

      // update metrics
      await Metric.updateOne({ key: 'RESUMES_TOTAL' }, { $inc: { value: 1 } });
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
    const resumes = await Resume.find({ clerkId: userId }).sort({ modifiedAt: -1 });
    res.status(200).json({ resumes });
  } catch (err: any) {
    res.status(500).json({ msg: err.message });
  }
};

/* Get resume by id */
export const getResume = async (req: Request, res: Response) => {
  const id = req.query.id;
  // @ts-ignore
  const clerkId = req.auth?.userId;
  
  try {
    const resume = await Resume.findOne({ _id: id, clerkId: clerkId });
    
    if (!resume) {
      return res.status(404).json({ msg: "Resume not found" });
    }
    
    res.status(200).json({ resume: resume });
  } catch (err: any) {
    console.error('Error getting resume:', err);
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
 * @function printResumeToPdf
 * @descripton Uses puppeteer library to render resume page then save as pdf
 * @param {Request} req
 * @param {Response} res
 */
export const printResumeToPdf = async (req: Request, res: Response) => {
  // @ts-ignore
  const clerkId = req.auth?.userId;
  if (!clerkId) {
    return res.status(401).send('User not known, cannot authenticate print');
  }

  try {
    const { id } = req.body;
    const browser = await puppeteer.launch({ 
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      headless: true,
      ignoreHTTPSErrors: true
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Get the token from the request
    // @ts-ignore
    const token = req.auth.getToken();
    
    // Set the Authorization header
    await page.setExtraHTTPHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    console.log("Navigating to", `${CLIENT_URL}/print-resume/${id}?clerkId=${clerkId}`);
    
    // Navigate to the print-resume URL and wait for content
    await page.goto(`${CLIENT_URL}/print-resume/${id}?clerkId=${clerkId}`, {
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 30000
    });

    // Wait for the resume container using data attribute
    await page.waitForSelector('[data-resume="print-container"]', { timeout: 10000 });
    
    // Wait for any animations or dynamic content to settle
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
    
    // Additional wait to ensure React components are fully rendered
    await page.waitForFunction(`
      () => {
        const container = document.querySelector('[data-resume="print-container"]');
        return container && container.children.length > 0;
      }
    `, { timeout: 10000 });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: false,
      margin: {
        top: '0.4in',
        right: '0.4in',
        bottom: '0.4in',
        left: '0.4in'
      },
      preferCSSPageSize: true
    });
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

export const uploadPdfResume = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    console.log('PDF Upload Debug Info:');
    console.log('- File size:', req.file.size, 'bytes');
    console.log('- File mimetype:', req.file.mimetype);
    console.log('- File name:', req.file.originalname);

    // Check file size (Gemini has limits for inline data)
    const maxSizeInline = 20 * 1024 * 1024; // 20MB limit for inline data
    if (req.file.size > maxSizeInline) {
      return res.status(400).json({ 
        error: 'PDF file too large', 
        details: `File size ${req.file.size} bytes exceeds limit of ${maxSizeInline} bytes` 
      });
    }

    // Use the inline data approach instead of file manager
    const prompt = `Analyze this resume PDF and extract all information in a structured format. Return the data as a JSON object with the following exact structure:

{
  "name": "extracted resume name/title",
  "basics": {
    "name": "full name",
    "email": "email address",
    "phone": "phone number", 
    "url": "website/portfolio URL",
    "summary": "professional summary or objective",
    "location": {
      "city": "city",
      "region": "state/province"
    },
    "profiles": [
      {
        "network": "platform name (LinkedIn, GitHub, etc.)",
        "username": "username",
        "url": "profile URL"
      }
    ]
  },
  "education": [
    {
      "id": 1,
      "institution": "school name",
      "studyType": "degree type",
      "area": "field of study", 
      "startDate": "start date",
      "endDate": "end date",
      "highlights": ["achievement 1", "achievement 2"]
    }
  ],
  "work": [
    {
      "id": 1,
      "position": "job title",
      "name": "company name",
      "startDate": "start date", 
      "endDate": "end date",
      "highlights": ["responsibility/achievement 1", "responsibility/achievement 2"]
    }
  ],
  "projects": [
    {
      "id": 1,
      "name": "project name",
      "startDate": "start date",
      "endDate": "end date",
      "highlights": ["achievement 1", "achievement 2"],
      "url": "project URL"
    }
  ],
  "skills": [
    {
      "name": "skill name",
      "level": "proficiency level",
      "keywords": ["related", "terms"]
    }
  ],
  "volunteer": [
    {
      "id": 1,
      "organization": "organization name",
      "position": "role/title",
      "startDate": "start date",
      "endDate": "end date", 
      "highlights": ["contribution 1", "contribution 2"]
    }
  ],
  "awards": [
    {
      "id": 1,
      "title": "award name",
      "date": "award date",
      "awarder": "awarding organization",
      "summary": "award description"
    }
  ],
  "sections": ["Basics", "Education", "Work", "Skills", "Volunteer", "Awards"],
  "theme": "professional"
}

Important guidelines:
1. Extract ALL available information from the resume
2. If a field is not present, use empty string "" or empty array []
3. Assign sequential IDs starting from 1 for education, work, volunteer, and awards
4. Include only sections that have actual content in the "sections" array
5. Format dates consistently (e.g., "2020-01-01")
6. Return ONLY valid JSON, no additional text or markdown formatting
7. If you cannot extract certain information, use empty values rather than making assumptions
8. Return the date type as a string in the format "YYYY-MM-DD"

If you cannot read the PDF content, return this exact JSON structure with empty values:
{
  "name": "",
  "basics": {"name": "", "email": "", "phone": "", "url": "", "summary": "", "location": {"city": "", "region": ""}, "profiles": []},
  "education": [],
  "work": [],
  "skills": [],
  "volunteer": [],
  "awards": [],
  "sections": ["Basics"],
  "theme": "professional"
}`;

    console.log('Sending PDF to Gemini for analysis...');
    
    try {
      const result = await geminiClient.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: req.file.mimetype,
            data: req.file.buffer.toString('base64')
          }
        }
      ]);

      const response = await result.response;
      const text = response.text();

      console.log('Gemini Response Debug:');
      console.log('- Response received:', !!text);
      console.log('- Response length:', text?.length || 0);
      console.log('- Raw response preview:', text?.substring(0, 200) + '...');

      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from Gemini');
      }

      try {
        // Parse and validate the JSON response using Zod
        const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
        console.log('- Cleaned text preview:', cleanText.substring(0, 200) + '...');
        
        const rawData = JSON.parse(cleanText);
        console.log('- JSON parsed successfully');
        
        // Validate the extracted data using our Zod schema
        const extractedData = UploadedResumeSchema.parse(rawData);
        console.log('- Schema validation passed');

        // Ensure we have the basic structure
        if (!extractedData.basics) {
          console.log('- Warning: No basics found, creating empty structure');
          extractedData.basics = {
            name: "", email: "", phone: "", url: "", summary: "",
            location: { address: "", city: "", region: "" },
            profiles: []
          };
        }

        if (!extractedData.sections || extractedData.sections.length === 0) {
          console.log('- Warning: No sections found, setting default');
          extractedData.sections = ["Basics"];
        }

        console.log('- Successfully extracted data from PDF');
        res.json(extractedData);
      } catch (parseError) {
        console.error('JSON/Schema parsing error:', parseError);
        console.error('Raw response that failed to parse:', text);
        
        if (parseError instanceof z.ZodError) {
          console.error('Zod validation errors:', parseError.errors);
          res.status(500).json({ 
            error: 'Failed to validate extracted resume data',
            details: 'The extracted data does not match the expected format.',
            validationErrors: parseError.errors,
            rawResponse: text.substring(0, 500) // First 500 chars for debugging
          });
        } else {
          res.status(500).json({ 
            error: 'Failed to parse extracted resume data',
            details: 'The AI response could not be processed. Please try again.',
            rawResponse: text.substring(0, 500) // First 500 chars for debugging
          });
        }
      }
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError);
      res.status(500).json({ 
        error: 'Failed to analyze PDF with AI',
        details: geminiError instanceof Error ? geminiError.message : 'Unknown AI service error'
      });
    }
  } catch (error) {
    console.error('Error processing PDF upload:', error);
    res.status(500).json({ 
      error: 'Failed to process PDF upload',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};
