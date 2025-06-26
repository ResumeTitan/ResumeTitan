import { Request, Response } from 'express';
import { geminiClient } from '../ext/clients';
import { z } from 'zod';
import Interview from '../models/Interview';
import Resume from '../models/Resume';
import { ResumeType } from '../types/types';
import axios from 'axios';
import puppeteer from 'puppeteer';
import { callPythonScraper, isPythonAvailable } from '../utils/pythonScraper';

// Comprehensive Zod schemas
const interviewQuestionSchema = z.object({
  question: z.string().min(10, "Question must be at least 10 characters"),
  example: z.string().min(20, "Example answer must be at least 20 characters"),
  guidance: z.string().min(15, "Guidance must be at least 15 characters"),
});

const interviewQuestionsSchema = z.object({
  questions: z.array(interviewQuestionSchema).min(5).max(8)
});

const htmlExtractionSchema = z.object({
  jobTitle: z.string().min(2, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  jobDescription: z.string().min(50, "Job description must be substantial"),
  questions: z.array(interviewQuestionSchema).min(5).max(8)
});

const scraperApiKey = process.env.SCRAPER_API_KEY;

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

/**
 * @function getPrompt
 * @description Build enhanced text prompt to send to AI model for manual job input
 * @param {string} jobTitle 
 * @param {string} jobDescription 
 * @param {ResumeType} resume
 * @returns 
 */
const getPrompt = (jobTitle: string, jobDescription: string, resume: ResumeType): string => {
  const userExperience = resume?.work || [];
  const userSkills = resume?.skills || [];
  const userEducation = resume?.education || [];
  const experienceLevel = userExperience.length > 5 ? 'Senior' : userExperience.length > 2 ? 'Mid' : 'Entry';
  
  return `You are an expert interview coach and hiring manager. Generate 6-7 highly tailored interview questions for this specific job and candidate.

**JOB DETAILS:**
Position: ${jobTitle}
Job Description: ${jobDescription}

**CANDIDATE PROFILE:**
Experience Level: ${experienceLevel}
Work Experience: ${JSON.stringify(userExperience.slice(0, 3))}
Key Skills: ${JSON.stringify(userSkills.slice(0, 10))}
Education: ${JSON.stringify(userEducation)}

**REQUIREMENTS:**
1. Create questions that directly test skills mentioned in BOTH the job description AND the candidate's resume
2. Mix question types: 2-3 technical/industry-specific, 2-3 behavioral (STAR method), 1-2 problem-solving
3. Tailor difficulty to candidate's experience level (${experienceLevel})
4. Include specific examples that relate to the candidate's background
5. Focus on skills gaps - ask about job requirements not clearly demonstrated in their resume
6. Make questions realistic for this specific role and company type

**QUESTION CATEGORIES:**
- Technical: Test specific technical skills, tools, or industry knowledge
- Behavioral: Past experiences using STAR method (Situation, Task, Action, Result)
- Problem-Solving: Hypothetical scenarios relevant to the role
- Leadership: Management or influence situations (for Mid/Senior roles)
- Industry-Specific: Knowledge of industry trends, regulations, or best practices

**OUTPUT FORMAT:**
For each question provide:
- A specific, realistic interview question
- A strong example answer that demonstrates best practices
- Detailed guidance on what interviewers look for and how to structure the response
- Question category and difficulty level
- Key skills being tested

Format response as JSON:
{
  "questions": [
    {
      "question": "specific interview question tailored to job and candidate",
      "example": "comprehensive example answer with specific details and metrics",
      "guidance": "detailed guidance on answer structure, what interviewers want to hear, and tips for success",
    }
  ]
}

Respond ONLY with valid JSON. No explanations or extra text.`;
};

/**
 * @function getPromptFromHtml
 * @description Enhanced prompt for HTML extraction with guaranteed job details
 * @param {string} html 
 * @param {ResumeType} resume
 * @param {boolean} isIndeed - Whether this is an Indeed job posting
 * @returns 
 */
const getPromptFromHtml = (html: string, resume: ResumeType, isIndeed: boolean = false): string => {
  const userExperience = resume?.work || [];
  const userSkills = resume?.skills || [];
  const userEducation = resume?.education || [];
  const experienceLevel = userExperience.length > 5 ? 'Senior' : userExperience.length > 2 ? 'Mid' : 'Entry';

  const indeedSpecificInstructions = isIndeed ? `

**INDEED-SPECIFIC EXTRACTION:**
This is an Indeed job posting. Pay special attention to:
- Job title: Look for elements with 'jobsearch-JobInfoHeader-title', 'it-jobsPageHeader-title', or 'jobsearch-DesktopStickyContainer-title'
- Company: Look for '[data-testid="inlineHeader-companyName"]', 'jobsearch-InlineCompanyRating', or elements with 'companyName' in class
- Location: Elements with 'jobsearch-JobInfoHeader-subtitle' or '[data-testid="job-location"]'  
- Description: Look for 'jobsearch-jobDescriptionText', 'jobDescriptionText', or '[id="jobDescriptionText"]'
- Salary: Elements with 'jobsearch-JobMetadataHeader-item' or 'icl-u-xs-mr--xs'
- Job type: Look for 'jobsearch-JobMetadataHeader' section

Indeed may have dynamic content, so also check for:
- JSON-LD structured data containing job information
- Meta tags with job details
- Text content that mentions job requirements even if not in obvious containers` : '';

  return `You are an expert at analyzing job postings and creating tailored interview questions. Extract job information and generate personalized interview questions.

**CANDIDATE PROFILE:**
Experience Level: ${experienceLevel}
Work Experience: ${JSON.stringify(userExperience.slice(0, 3))}
Key Skills: ${JSON.stringify(userSkills.slice(0, 10))}
Education: ${JSON.stringify(userEducation)}

**EXTRACTION INSTRUCTIONS:**
1. **Job Title**: Look for the main position title in:
   ${isIndeed ? '- Indeed: Elements with "jobsearch-JobInfoHeader-title", "it-jobsPageHeader-title", or similar Indeed-specific classes' : ''}
   - <h1>, <h2>, elements with 'title', 'job-title', 'position' in class/id names
   - Extract clean title (e.g., "Senior Software Engineer", "Marketing Manager")

2. **Company Name**: Search for company name in:
   ${isIndeed ? '- Indeed: [data-testid="inlineHeader-companyName"], "jobsearch-InlineCompanyRating", or "companyName" classes' : ''}
   - Elements with 'company', 'employer', 'organization' in class/id names
   - Meta tags, structured data (JSON-LD)
   - Header sections
   - If not found clearly, extract from context clues in the posting
   - MUST provide a company name (use "Company" as fallback if absolutely nothing found)

3. **Job Description**: Extract comprehensive job details including:
   ${isIndeed ? '- Indeed: Look for "jobsearch-jobDescriptionText", "jobDescriptionText", or "[id=\'jobDescriptionText\']"' : ''}
   - Responsibilities and duties
   - Required qualifications and skills
   - Experience requirements
   - Preferred qualifications
   - Company/role context
   - Benefits and compensation if mentioned
   - Combine multiple sections if needed for completeness${indeedSpecificInstructions}

**INTERVIEW QUESTION REQUIREMENTS:**
1. Generate 6-7 questions specifically tailored to this job posting AND candidate background
2. Focus on skills mentioned in job posting that align with or test candidate's experience
3. Include questions about job requirements the candidate hasn't clearly demonstrated
4. Mix technical, behavioral, and situational questions appropriate for the role level
5. Tailor difficulty to candidate's experience level (${experienceLevel})
6. Make questions specific to the industry and role type

**JOB POSTING HTML:**
${html}

**OUTPUT FORMAT:**
{
  "jobTitle": "extracted clean job title (REQUIRED)",
  "company": "extracted company name (REQUIRED - use 'Company' if not found)",
  "jobDescription": "comprehensive job description with key requirements and responsibilities (REQUIRED - minimum 50 characters)",
  "questions": [
    {
      "question": "specific interview question tailored to both job posting and candidate background",
      "example": "comprehensive example answer with metrics and specific details relevant to the role",
      "guidance": "detailed guidance on what the interviewer wants to hear, answer structure, and success tips"
    }
  ]
}

**CRITICAL REQUIREMENTS:**
- jobTitle MUST be a clean, professional job title
- company MUST be provided (never empty/null)
- jobDescription MUST be substantial and comprehensive
- Questions MUST be tailored to both the job posting AND candidate's background
- Each question MUST test specific skills relevant to the role

Respond ONLY with valid JSON. No explanations or extra text.`;
};


/**
 * @function isIndeedUrl
 * @description Check if a URL is from Indeed
 * @param {string} url 
 * @returns {boolean}
 */
const isIndeedUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('indeed.com') || 
           urlObj.hostname.includes('indeed.') ||
           url.includes('indeed.com') ||
           url.includes('/viewjob');
  } catch {
    return false;
  }
};

/**
 * @function fetchJobPostingHtml
 * @description Fetch HTML from job posting URL - tries direct fetch first, then Puppeteer fallback
 * @param {string} jobUrl 
 * @returns {Promise<string>}
 */
const fetchJobPostingHtml = async (jobUrl: string): Promise<string> => {
  const isIndeed = isIndeedUrl(jobUrl);
  
  // Standard headers that work for most sites
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
  };

  // Add Indeed-specific headers if it's an Indeed URL
  if (isIndeed) {
    Object.assign(headers, {
      'Referer': 'https://www.indeed.com/',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'same-origin',
    });
  }

  console.log(`Attempting direct fetch for URL: ${jobUrl}`);
  
  try {
    // FIRST: Try direct axios.get (free and fast)
    const { data } = await axios.get(jobUrl, {
      headers,
      timeout: 15000,
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 400,
    });
    
    // Validate we got meaningful content (not a block/error page)
    const isValidContent = data && 
                          data.length > 1000 && 
                          !data.includes('blocked') && 
                          !data.includes('captcha') &&
                          !data.includes('Access Denied') &&
                          !data.includes('robot') &&
                          !data.includes('Please verify you are a human');
    
    if (isValidContent) {
      console.log(`✅ Direct fetch successful - got ${data.length} characters`);
      return data;
    } else {
      console.log('❌ Direct fetch returned blocked/insufficient content');
      throw new Error('Direct fetch returned blocked or insufficient content');
    }
    
  } catch (directError) {
    console.log(`❌ Direct fetch failed: ${directError.message}`);
    
    // SECOND: Fallback to Puppeteer
    console.log(`🔄 Trying Puppeteer fallback...`);
    
    let browser;
    try {
      // Launch browser with appropriate settings
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          ...(isIndeed ? [
            '--disable-blink-features=AutomationControlled',
            '--disable-features=VizDisplayCompositor'
          ] : [])
        ],
        defaultViewport: {
          width: 1366,
          height: 768
        }
      });

      const page = await browser.newPage();
      
      // Set user agent and additional headers
      await page.setUserAgent(headers['User-Agent']);
      
      // Set additional headers for Indeed
      if (isIndeed) {
        await page.setExtraHTTPHeaders({
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://www.indeed.com/'
        });
        
        // Add cookies for Indeed to appear more legitimate
        await page.setCookie({
          name: 'CTK',
          value: '1',
          domain: '.indeed.com'
        }, {
          name: 'CO',
          value: 'US',
          domain: '.indeed.com'
        });
      }

      // Navigate to the page
      console.log(`Navigating to ${jobUrl} with Puppeteer...`);
      const response = await page.goto(jobUrl, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      if (!response || response.status() >= 400) {
        throw new Error(`Page returned status ${response?.status()}`);
      }

      // Wait for content to load (especially for SPAs like Indeed)
      if (isIndeed) {
        try {
          // Wait for Indeed-specific elements to load
          await page.waitForSelector('[data-testid="jobsearch-JobComponent"]', { timeout: 10000 });
        } catch {
          // Fallback: just wait a bit more for dynamic content
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      } else {
        // For other sites, wait a moment for dynamic content
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Get the page content
      const html = await page.content();
      
      // Close browser
      await browser.close();
      
      // Validate content quality
      if (html.length < 1000) {
        throw new Error('Insufficient content retrieved');
      }
      
      console.log(`✅ Puppeteer successful - got ${html.length} characters`);
      return html;
      
    } catch (puppeteerError) {
      // Make sure browser is closed even if there's an error
      if (browser) {
        try {
          await browser.close();
        } catch (closeError) {
          console.error('Error closing browser:', closeError.message);
        }
      }
      
      console.error('❌ Puppeteer also failed:', puppeteerError.message);
      console.log(`🔄 Trying ScraperAPI fallback...`);
      try {
        const scraperUrl = `https://api.scraperapi.com?api_key=${scraperApiKey}&url=${jobUrl}`;
        const { data } = await axios.get(scraperUrl, {
          headers,
          timeout: 30000,
        });
        console.log(`✅ ScraperAPI successful - got ${data.length} characters`);
        return data;
      } catch (scraperError) {
        console.error('❌ ScraperAPI also failed:', scraperError.message);
        throw new Error(`Direct fetch, Puppeteer and ScraperAPI failed. Please check the URL or use manual entry. Error: ${puppeteerError.message}`);
      }
    }
  }
};

/**
 * @function fetchJobPostingHtmlWithPython
 * @description Fetch HTML from job posting URL using Python scraper with fallback to existing methods
 * @param {string} jobUrl 
 * @returns {Promise<string>}
 */
const fetchJobPostingHtmlWithPython = async (jobUrl: string): Promise<string> => {
  // First, try Python scraper
  try {
    const pythonAvailable = await isPythonAvailable();
    if (pythonAvailable) {
      console.log('🐍 Using Python scraper...');
      const result = await callPythonScraper(jobUrl);
      
      if (result.success && result.html) {
        console.log(`✅ Python scraper successful - got ${result.html.length} characters`);
        return result.html;
      } else {
        console.log(`❌ Python scraper failed: ${result.error}`);
      }
    } else {
      console.log('⚠️ Python not available, falling back to existing methods');
    }
  } catch (error) {
    console.log(`❌ Python scraper error: ${error}`);
  }

  return '';
};

export const generateInterviewQuestions = async (req: Request, res: Response) => {
  try {
    const { jobTitle, jobDescription, resumeId } = req.body;
    let typedResume: ResumeType | undefined = undefined;

    if (resumeId) {
      const resume = await Resume.findById(resumeId);
      if (resume) {
        const resumeData = resume.toObject();
        const basics = {
          ...resumeData.basics,
          label: resumeData.basics.label || '',
          image: resumeData.basics.image || '',
          phone: resumeData.basics.phone || '',
          url: resumeData.basics.url || '',
          summary: resumeData.basics.summary || '',
          location: {
            address: resumeData.basics.location?.address || '',
            postalCode: resumeData.basics.location?.postalCode || '',
            city: resumeData.basics.location?.city || '',
            countryCode: resumeData.basics.location?.countryCode || '',
            region: resumeData.basics.location?.region || '',
          },
          profiles: resumeData.basics.profiles || [],
        };
        typedResume = {
          ...resumeData,
          _id: resumeData._id.toString(),
          basics
        } as unknown as ResumeType;
      }
    }

    const prompt = getPrompt(jobTitle, jobDescription, typedResume || {} as ResumeType);
    const response = await getStructuredOutput(prompt, interviewQuestionsSchema);

    res.status(200).json({ questions: response.questions });
  } catch (error) {
    console.error('Error generating interview questions:', error);
    res.status(500).json({ error: 'Failed to generate interview questions' });
  }
};

/**
 * createUpdateInterview
 * @description POST that creates interview questions based on the resume and job description
 * @param {string} token The user token
 * @param {string} id The resume id
 * @returns 
 */
export const createUpdateInterview = async (req: Request, res: Response) => {
  try {
    const { jobTitle, jobDescription, jobUrl, interviewId, clerkId, resumeId, company, useJobUrl } = req.body;
    let typedResume: ResumeType | undefined = undefined;
    let finalJobTitle = jobTitle;
    let finalJobDescription = jobDescription;
    let finalJobUrl = jobUrl;
    let finalCompany = company || '';
    let htmlForPrompt = '';

    if (resumeId) {
      const resume = await Resume.findById(resumeId);
      if (resume) {
        const resumeData = resume.toObject();
        const basics = {
          ...resumeData.basics,
          label: resumeData.basics.label || '',
          image: resumeData.basics.image || '',
          phone: resumeData.basics.phone || '',
          url: resumeData.basics.url || '',
          summary: resumeData.basics.summary || '',
          location: {
            address: resumeData.basics.location?.address || '',
            postalCode: resumeData.basics.location?.postalCode || '',
            city: resumeData.basics.location?.city || '',
            countryCode: resumeData.basics.location?.countryCode || '',
            region: resumeData.basics.location?.region || '',
          },
          profiles: resumeData.basics.profiles || [],
        };
        typedResume = {
          ...resumeData,
          _id: resumeData._id.toString(),
          basics
        } as unknown as ResumeType;
      }
    }

    let prompt = '';
    let response;
    if (useJobUrl && jobUrl) {
      try {
        const isIndeed = isIndeedUrl(jobUrl);
        console.log(`Processing ${isIndeed ? 'Indeed' : 'generic'} job URL: ${jobUrl}`);
        
        // Use the new Python-based scraper with fallback
        const html = await fetchJobPostingHtmlWithPython(jobUrl);
        htmlForPrompt = html;
        if (!html) {
          return res.status(400).json({ error: 'Failed to parse job posting from URL' });
        }

        // Use Indeed-specific prompt if it's an Indeed URL
        prompt = getPromptFromHtml(htmlForPrompt, typedResume || {} as ResumeType, isIndeed);
        response = await getStructuredOutput(prompt, htmlExtractionSchema);
        
        // Validate that required fields are present and meaningful
        if (!response.jobTitle || response.jobTitle.length < 2) {
          return res.status(400).json({ error: 'Could not extract a valid job title from the URL' });
        }
        if (!response.company || response.company.length < 1) {
          response.company = 'Company'; // Fallback as specified in prompt
        }
        if (!response.jobDescription || response.jobDescription.length < 50) {
          return res.status(400).json({ error: 'Could not extract sufficient job description from the URL' });
        }
        
        console.log(`Successfully extracted: ${response.jobTitle} at ${response.company}`);
        finalJobTitle = response.jobTitle;
        finalJobDescription = response.jobDescription;
        finalCompany = response.company;
      } catch (err: any) {
        console.error("URL parsing error: ", err);
        return res.status(400).json({ 
          error: `Failed to parse job posting from URL: ${err.message}`,
          errorType: 'URL_PARSE_ERROR'
        });
      }
    } else {
      // Use provided jobTitle, jobDescription, and company to generate questions
      if (!finalJobTitle || !finalJobDescription) {
        return res.status(400).json({ error: 'Job title and description are required when not using URL extraction' });
      }
      prompt = getPrompt(finalJobTitle, finalJobDescription, typedResume || {} as ResumeType);
      response = await getStructuredOutput(prompt, interviewQuestionsSchema);
    }

    // Save the interview to the database
    const interviewIn = {
      questions: response.questions,
      jobTitle: finalJobTitle,
      jobDescription: finalJobDescription,
      jobUrl: finalJobUrl,
      company: finalCompany,
      clerkId,
    }

    let interviewOut;
    if (interviewId) {
      interviewOut = await Interview.findOneAndUpdate({ _id: interviewId }, interviewIn, { new: true });
    } else {
      interviewOut = await Interview.create(interviewIn);
    }

    res.status(200).json({
      interview: {
        ...interviewOut.toObject(),
        jobTitle: finalJobTitle,
        jobDescription: finalJobDescription,
        company: finalCompany,
        jobUrl: finalJobUrl,
      }
    });
  } catch (error: any) {
    console.log("Error: ", error);
    if (error.message.includes('validation')) {
      res.status(400).json({ error: 'Invalid data format in AI response. Please try again.' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

/**
 * getInterviews
 * @description GET that retrieves all interviews for a user
 * @param {string} token The user token
 * @param {string} userId The user id
 * @returns 
 */
export const getInterviews = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.auth.userId;
    const interviews = await Interview.find({ clerkId: userId }).sort({ createdAt: -1 });
    res.status(200).json({ interviews });
  } catch (error: any) {
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
export const getInterview = async (req: Request, res: Response) => {
  try {
    const interview = await Interview.findById(req.params.id);
    res.status(200).json({ interview });
  } catch (error: any) {
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
export const deleteInterview = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await Interview.findOneAndDelete({ _id: id });
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * @fuction updateInterview
 * @description Update an interview
 * @param {Request} req
 * @param {Response} res
 */
export const updateInterview = async (req: Request, res: Response) => {
  const id = req.params.id;
  const interview = req.body;
  try {
    await Interview.findOneAndUpdate({ _id: id }, interview);
    res.status(200).json({ interview });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * @function analyzeInterview
 * @description Analyze a user's answer to an interview question using AI
 * @param {Request} req
 * @param {Response} res
 */
export const analyzeInterview = async (req: Request, res: Response) => {
  try {
    const { answer, question } = req.body;
    if (!answer || !question) {
      return res.status(400).json({ error: 'Missing required fields: answer and question' });
    }
    const prompt = `You are an expert interview coach. Analyze the following answer to an interview question. 

Interview Question: ${question}
User's Answer: ${answer}

Give specific, actionable feedback on how the answer could be improved, what strengths it demonstrates, and how well it addresses the interview question. Focus on structure, content, and delivery suggestions. Respond in 3-5 sentences.`;
    const result = await geminiClient.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.status(200).json({ analysis: text });
  } catch (error) {
    console.error('Error analyzing interview answer:', error);
    res.status(500).json({ error: 'Failed to analyze answer' });
  }
};
