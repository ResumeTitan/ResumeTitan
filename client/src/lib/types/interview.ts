/**
 * Interview Types
 *
 * TypeScript interfaces for interview-related data structures.
 */

export interface InterviewQuestion {
	id: number;
	question: string;
	answer?: string;
	analysis?: string;
	category?: string;
}

export interface InterviewType {
	_id: string;
	userId: string;
	jobTitle: string;
	jobDescription: string;
	questions: InterviewQuestion[];
	createdAt: Date;
	updatedAt: Date;
}

export interface InterviewCreateRequest {
	jobTitle: string;
	jobDescription: string;
}

export interface InterviewAnalyzeRequest {
	question: string;
	answer: string;
	jobTitle: string;
	jobDescription: string;
}

export interface InterviewAnalyzeResponse {
	analysis: string;
	suggestions: string[];
	score?: number;
}
