/**
 * Resume API Endpoints
 *
 * Type-safe API functions for resume operations.
 */

import { api } from '../client';
import type {
	ResumeType,
	WorkType,
	EducationType,
	VolunteerType,
	ProjectType,
	SkillType
} from '$types';

interface ResumeListResponse {
	resumes: ResumeType[];
}

interface ResumeResponse {
	resume: ResumeType;
}

interface AIHighlightsResponse {
	response: {
		highlights: string[];
	};
}

interface AISummaryResponse {
	response: {
		summary: string;
	};
}

interface AISkillsResponse {
	response: {
		skills: SkillType[];
	};
}

interface AIProjectsResponse {
	response: {
		projects: ProjectType[];
	};
}

export const resumeApi = {
	/**
	 * Get all resumes for a user
	 */
	getByUser: (userId: string) =>
		api.get<ResumeListResponse>(`/resume/user?userId=${encodeURIComponent(userId)}`),

	/**
	 * Get a single resume by ID
	 */
	getById: (id: string) =>
		api.get<ResumeResponse>(`/resume?id=${encodeURIComponent(id)}`),

	/**
	 * Create a new resume
	 */
	create: (resume: Partial<ResumeType>, jobDescription?: string) =>
		api.post<ResumeType>('/resume/create', { resume, jobDescription }),

	/**
	 * Update an existing resume
	 */
	update: (resume: ResumeType) =>
		api.put<ResumeResponse>('/resume/update', resume),

	/**
	 * Delete a resume
	 */
	delete: (id: string) =>
		api.delete(`/resume/delete/${encodeURIComponent(id)}`),

	/**
	 * Upload and parse a PDF resume
	 */
	uploadPdf: async (file: File) => {
		const formData = new FormData();
		formData.append('file', file);

		// Special handling for file upload - don't use JSON content type
		const response = await fetch(`${import.meta.env.VITE_API_URL}/resume/upload-pdf`, {
			method: 'POST',
			body: formData
		});

		if (!response.ok) {
			throw new Error('Failed to upload PDF');
		}

		return response.json() as Promise<ResumeType>;
	},

	/**
	 * AI: Generate work highlights
	 */
	generateWorkHighlights: (job: WorkType, userInput?: string, operationType?: string) =>
		api.post<AIHighlightsResponse>('/resume/work', {
			job,
			userInput,
			operationType
		}),

	/**
	 * AI: Generate education highlights
	 */
	generateEducationHighlights: (education: EducationType, userInput?: string, operationType?: string) =>
		api.post<AIHighlightsResponse>('/resume/education', {
			education,
			userInput,
			operationType
		}),

	/**
	 * AI: Generate volunteer highlights
	 */
	generateVolunteerHighlights: (volunteer: VolunteerType, userInput?: string, operationType?: string) =>
		api.post<AIHighlightsResponse>('/resume/volunteer', {
			volunteer,
			userInput,
			operationType
		}),

	/**
	 * AI: Generate project highlights
	 */
	generateProjectHighlights: (project: ProjectType, userInput?: string, operationType?: string) =>
		api.post<AIHighlightsResponse>('/resume/project', {
			project,
			userInput,
			operationType
		}),

	/**
	 * AI: Generate summary
	 */
	generateSummary: (resume: ResumeType, userInput?: string) =>
		api.post<AISummaryResponse>('/resume/summary', {
			resume,
			userInput
		}),

	/**
	 * AI: Generate skills
	 */
	generateSkills: (resume: ResumeType, userInput?: string) =>
		api.post<AISkillsResponse>('/resume/skills', {
			resume,
			userInput
		}),

	/**
	 * AI: Generate projects
	 */
	generateProjects: (resume: ResumeType, userInput?: string) =>
		api.post<AIProjectsResponse>('/resume/projects', {
			resume,
			userInput
		})
};
