/**
 * Cover Letter API Endpoints
 *
 * Type-safe API functions for cover letter operations.
 */

import { api } from '../client';
import type {
	CoverLetterType,
	CoverLetterCreateRequest,
	CoverLetterGenerateResponse
} from '$types';

interface CoverLetterListResponse {
	coverLetters: CoverLetterType[];
}

interface CoverLetterResponse {
	coverLetter: CoverLetterType;
}

export const coverLetterApi = {
	/**
	 * Get all cover letters for the current user
	 */
	getAll: () =>
		api.get<CoverLetterListResponse>('/cover-letter'),

	/**
	 * Get a single cover letter by ID
	 */
	getById: (id: string) =>
		api.get<CoverLetterResponse>(`/cover-letter/${encodeURIComponent(id)}`),

	/**
	 * Generate a new cover letter
	 */
	generate: (data: CoverLetterCreateRequest) =>
		api.post<CoverLetterGenerateResponse>('/cover-letter', data),

	/**
	 * Update an existing cover letter
	 */
	update: (id: string, data: Partial<CoverLetterType>) =>
		api.put<CoverLetterResponse>(`/cover-letter/${encodeURIComponent(id)}`, data),

	/**
	 * Delete a cover letter
	 */
	delete: (id: string) =>
		api.delete(`/cover-letter/${encodeURIComponent(id)}`)
};
