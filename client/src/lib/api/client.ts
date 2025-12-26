/**
 * Unified API Client
 *
 * Single API client that replaces mixed fetch/axios approach.
 * Handles authentication, error handling, and request/response processing.
 */

import { browser } from '$app/environment';
import { authStore } from '$stores/auth';
import { getClerk } from '$lib/utils/clerk.client';
import { get } from 'svelte/store';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const DEFAULT_TIMEOUT = 30000;

export interface RequestConfig {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: unknown;
	headers?: Record<string, string>;
	timeout?: number;
	includeAuth?: boolean;
}

export interface ApiError extends Error {
	status?: number;
	code?: string;
	details?: unknown;
}

function createApiError(message: string, status?: number, code?: string): ApiError {
	const error = new Error(message) as ApiError;
	error.status = status;
	error.code = code;
	return error;
}

class ApiClient {
	private baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	private async getAuthHeaders(): Promise<Record<string, string>> {
		const headers: Record<string, string> = {
			'Content-Type': 'application/json'
		};

		if (browser) {
			const clerk = await getClerk();
			const sessionToken = await clerk?.session?.getToken();
			if (sessionToken) {
				authStore.setToken(sessionToken);
				headers['Authorization'] = `Bearer ${sessionToken}`;
				return headers;
			}

			const auth = get(authStore);
			if (auth.token) {
				headers['Authorization'] = auth.token.startsWith('Bearer ')
					? auth.token
					: `Bearer ${auth.token}`;
			}
		}

		return headers;
	}

	async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
		const {
			method = 'GET',
			body,
			headers = {},
			timeout = DEFAULT_TIMEOUT,
			includeAuth = true
		} = config;

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeout);

		try {
			const authHeaders = includeAuth ? await this.getAuthHeaders() : { 'Content-Type': 'application/json' };

			const response = await fetch(`${this.baseUrl}${endpoint}`, {
				method,
				headers: { ...authHeaders, ...headers },
				body: body ? JSON.stringify(body) : undefined,
				signal: controller.signal
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({
					message: response.statusText
				}));
				throw createApiError(
					errorData.message || `HTTP ${response.status}`,
					response.status,
					errorData.code
				);
			}

			// Handle empty responses
			const text = await response.text();
			if (!text) {
				return {} as T;
			}

			return JSON.parse(text);
		} catch (error) {
			if (error instanceof Error && error.name === 'AbortError') {
				throw createApiError('Request timeout', 408, 'TIMEOUT');
			}
			throw error;
		} finally {
			clearTimeout(timeoutId);
		}
	}

	// Convenience methods
	get<T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<T> {
		return this.request<T>(endpoint, { ...config, method: 'GET' });
	}

	post<T>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, 'method'>): Promise<T> {
		return this.request<T>(endpoint, { ...config, method: 'POST', body });
	}

	put<T>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, 'method'>): Promise<T> {
		return this.request<T>(endpoint, { ...config, method: 'PUT', body });
	}

	patch<T>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, 'method'>): Promise<T> {
		return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
	}

	delete<T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<T> {
		return this.request<T>(endpoint, { ...config, method: 'DELETE' });
	}
}

// Singleton instance
export const api = new ApiClient(API_URL);

// Alias for compatibility
export const apiClient = api;

// Export for testing or custom instances
export { ApiClient };
