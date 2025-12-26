/**
 * Constants
 *
 * Centralized constants for the application.
 * Eliminates duplicate arrays scattered across components.
 */

// AI Suggestions - shared across all editor components
export const AI_SUGGESTIONS = [
	'Check the spelling and grammar of the second highlight',
	'Revise the top two highlights to make them more concise and impactful',
	'Add quantifiable results to the first highlight to better showcase accomplishments',
	'Remove any vague or non-specific terms from the third highlight',
	'Reorder the highlights to ensure the most impressive achievements are listed first',
	'Shorten the second highlight while retaining its key points to improve readability'
] as const;

// Volunteer-specific placeholder suggestions
export const VOLUNTEER_PLACEHOLDERS = [
	'Tell me about your role...',
	'What skills did you develop?',
	'What impact did you make?',
	'What accomplishments are you proud of?',
	'What challenges did you overcome?'
] as const;

// Summary suggestions
export const SUMMARY_SUGGESTIONS = [
	'Make the summary more concise while keeping key achievements',
	'Add more specific technical skills mentioned in the resume',
	'Highlight leadership experience more prominently',
	'Include quantifiable achievements from work experience',
	'Make the tone more professional and confident',
	'Tailor the summary for a specific industry or role'
] as const;

// Skills suggestions
export const SKILLS_SUGGESTIONS = [
	'Add more technical skills relevant to the job market',
	'Group similar skills together under appropriate categories',
	'Remove outdated or irrelevant skills',
	'Add soft skills that complement technical abilities',
	'Include specific tools and technologies used',
	'Prioritize skills most relevant to target positions'
] as const;

// Animation timing constants (in ms)
export const ANIMATION_TIMING = {
	PLACEHOLDER_ROTATION: 5000,
	PLACEHOLDER_FADE: 300,
	TOAST_DURATION: 5000,
	MODAL_TRANSITION: 200
} as const;

// API configuration
export const API_CONFIG = {
	TIMEOUT: 30000,
	MAX_RETRIES: 3,
	RETRY_DELAY: 1000
} as const;

// ChatBot configuration
export const CHATBOT_CONFIG = {
	MAX_CHARS: 500,
	MAX_RESPONSE_CHARS: 2000,
	MAX_MESSAGES: 50
} as const;

// Resume configuration
export const RESUME_CONFIG = {
	A4_WIDTH_MM: 210,
	A4_HEIGHT_MM: 297,
	MIN_SCALE: 0.25,
	MAX_SCALE: 1.0
} as const;

// US States for state picker
export const US_STATES = [
	{ value: '', label: 'Select State' },
	{ value: 'AL', label: 'Alabama' },
	{ value: 'AK', label: 'Alaska' },
	{ value: 'AZ', label: 'Arizona' },
	{ value: 'AR', label: 'Arkansas' },
	{ value: 'CA', label: 'California' },
	{ value: 'CO', label: 'Colorado' },
	{ value: 'CT', label: 'Connecticut' },
	{ value: 'DE', label: 'Delaware' },
	{ value: 'FL', label: 'Florida' },
	{ value: 'GA', label: 'Georgia' },
	{ value: 'HI', label: 'Hawaii' },
	{ value: 'ID', label: 'Idaho' },
	{ value: 'IL', label: 'Illinois' },
	{ value: 'IN', label: 'Indiana' },
	{ value: 'IA', label: 'Iowa' },
	{ value: 'KS', label: 'Kansas' },
	{ value: 'KY', label: 'Kentucky' },
	{ value: 'LA', label: 'Louisiana' },
	{ value: 'ME', label: 'Maine' },
	{ value: 'MD', label: 'Maryland' },
	{ value: 'MA', label: 'Massachusetts' },
	{ value: 'MI', label: 'Michigan' },
	{ value: 'MN', label: 'Minnesota' },
	{ value: 'MS', label: 'Mississippi' },
	{ value: 'MO', label: 'Missouri' },
	{ value: 'MT', label: 'Montana' },
	{ value: 'NE', label: 'Nebraska' },
	{ value: 'NV', label: 'Nevada' },
	{ value: 'NH', label: 'New Hampshire' },
	{ value: 'NJ', label: 'New Jersey' },
	{ value: 'NM', label: 'New Mexico' },
	{ value: 'NY', label: 'New York' },
	{ value: 'NC', label: 'North Carolina' },
	{ value: 'ND', label: 'North Dakota' },
	{ value: 'OH', label: 'Ohio' },
	{ value: 'OK', label: 'Oklahoma' },
	{ value: 'OR', label: 'Oregon' },
	{ value: 'PA', label: 'Pennsylvania' },
	{ value: 'RI', label: 'Rhode Island' },
	{ value: 'SC', label: 'South Carolina' },
	{ value: 'SD', label: 'South Dakota' },
	{ value: 'TN', label: 'Tennessee' },
	{ value: 'TX', label: 'Texas' },
	{ value: 'UT', label: 'Utah' },
	{ value: 'VT', label: 'Vermont' },
	{ value: 'VA', label: 'Virginia' },
	{ value: 'WA', label: 'Washington' },
	{ value: 'WV', label: 'West Virginia' },
	{ value: 'WI', label: 'Wisconsin' },
	{ value: 'WY', label: 'Wyoming' },
	{ value: 'DC', label: 'District of Columbia' }
] as const;

// Degree types for degree picker
export const DEGREE_TYPES = [
	{ value: '', label: 'Select Degree' },
	{ value: 'High School Diploma', label: 'High School Diploma' },
	{ value: 'GED', label: 'GED' },
	{ value: 'Associate of Arts', label: 'Associate of Arts (AA)' },
	{ value: 'Associate of Science', label: 'Associate of Science (AS)' },
	{ value: 'Bachelor of Arts', label: 'Bachelor of Arts (BA)' },
	{ value: 'Bachelor of Science', label: 'Bachelor of Science (BS)' },
	{ value: 'Bachelor of Fine Arts', label: 'Bachelor of Fine Arts (BFA)' },
	{ value: 'Bachelor of Business Administration', label: 'Bachelor of Business Administration (BBA)' },
	{ value: 'Master of Arts', label: 'Master of Arts (MA)' },
	{ value: 'Master of Science', label: 'Master of Science (MS)' },
	{ value: 'Master of Business Administration', label: 'Master of Business Administration (MBA)' },
	{ value: 'Master of Fine Arts', label: 'Master of Fine Arts (MFA)' },
	{ value: 'Doctor of Philosophy', label: 'Doctor of Philosophy (PhD)' },
	{ value: 'Doctor of Medicine', label: 'Doctor of Medicine (MD)' },
	{ value: 'Juris Doctor', label: 'Juris Doctor (JD)' },
	{ value: 'Other', label: 'Other' }
] as const;

// Available resume themes
export const RESUME_THEMES = [
	{ value: 'professional', label: 'Professional' },
	{ value: 'harvard', label: 'Harvard' },
	{ value: 'macchiato', label: 'Macchiato' },
	{ value: 'stratton', label: 'Stratton' },
	{ value: 'onepage', label: 'One Page' },
	{ value: 'student-classic', label: 'Student Classic' },
	{ value: 'academic-modern', label: 'Academic Modern' }
] as const;

// Available fonts
export const RESUME_FONTS = [
	{ value: 'times-new-roman', label: 'Times New Roman' },
	{ value: 'arial', label: 'Arial' },
	{ value: 'georgia', label: 'Georgia' },
	{ value: 'calibri', label: 'Calibri' },
	{ value: 'cambria', label: 'Cambria' },
	{ value: 'sans-serif', label: 'Sans Serif' }
] as const;

// Available resume sections
export const RESUME_SECTIONS: ReadonlyArray<{ value: string; label: string; required?: boolean }> = [
	{ value: 'Basics', label: 'Contact Information', required: true },
	{ value: 'Summary', label: 'Summary' },
	{ value: 'Work', label: 'Work Experience' },
	{ value: 'Education', label: 'Education' },
	{ value: 'Skills', label: 'Skills' },
	{ value: 'Projects', label: 'Projects' },
	{ value: 'Volunteer', label: 'Volunteer Experience' },
	{ value: 'Awards', label: 'Awards' },
	{ value: 'Certificates', label: 'Certificates' },
	{ value: 'Languages', label: 'Languages' },
	{ value: 'Interests', label: 'Interests' },
	{ value: 'References', label: 'References' }
];
