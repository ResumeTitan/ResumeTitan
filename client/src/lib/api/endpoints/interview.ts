/**
 * Interview API Endpoints
 *
 * Type-safe API functions for interview operations.
 */

import { api } from '../client';
import type { InterviewType, InterviewCreateRequest, InterviewAnalyzeRequest, InterviewAnalyzeResponse } from '$types';

interface InterviewListResponse {
    interviews: InterviewType[];
}

interface InterviewResponse {
    interview: InterviewType;
}

export const interviewApi = {
    /**
     * Get all interviews for the current user
     */
    getAll: () => api.get<InterviewListResponse>('/interview'),

    /**
     * Get a single interview by ID
     */
    getById: (id: string) => api.get<InterviewResponse>(`/interview/${encodeURIComponent(id)}`),

    /**
     * Create a new interview (generates questions)
     */
    create: (data: InterviewCreateRequest) => api.post<InterviewResponse>('/interview', data),

    /**
     * Update an existing interview
     */
    update: (id: string, data: Partial<InterviewType>) => api.put<InterviewResponse>(`/interview/${encodeURIComponent(id)}`, data),

    /**
     * Delete an interview
     */
    delete: (id: string) => api.delete(`/interview/${encodeURIComponent(id)}`),

    /**
     * AI: Analyze an interview answer
     */
    analyzeAnswer: (data: InterviewAnalyzeRequest) => api.post<InterviewAnalyzeResponse>('/interview/analyze', data),
};
