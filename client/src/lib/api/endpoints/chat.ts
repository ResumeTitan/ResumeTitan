/**
 * Chat API Endpoints
 *
 * Type-safe API functions for AI chat operations.
 */

import { api } from '../client';

interface ChatMessage {
	role: 'user' | 'assistant';
	content: string;
}

interface ChatRequest {
	message: string;
	history?: ChatMessage[];
}

interface ChatResponse {
	response: string;
	message?: string;
}

export const chatApi = {
	/**
	 * Send a chat message to the AI assistant
	 */
	send: (data: ChatRequest) =>
		api.post<ChatResponse>('/chat', data)
};
