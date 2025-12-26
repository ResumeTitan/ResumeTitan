/**
 * Cover Letter Types
 *
 * TypeScript interfaces for cover letter data structures.
 */

export interface CoverLetterType {
	_id: string;
	resumeId: string;
	letter: string;
	name: string;
	date: Date;
	city: string;
	state: string;
	jobTitle: string;
	jobDescription: string;
	company: string;
}

export interface CoverLetterCreateRequest {
	resumeId?: string;
	jobTitle: string;
	jobDescription: string;
	company: string;
}

export interface CoverLetterGenerateResponse {
	letter: string;
	coverLetter?: CoverLetterType;
}
