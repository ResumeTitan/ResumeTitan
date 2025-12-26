/**
 * Types Index
 *
 * Barrel export for all TypeScript types.
 */

// Resume types
export * from './resume';

// Interview types
export * from './interview';

// Cover letter types
export * from './coverLetter';

// Editor types
export * from './editor';

// Workshop types (collaborative editing)
export * from './workshop';

// Common types
export interface ApiResponse<T> {
	data?: T;
	error?: string;
	message?: string;
}

export interface PaginatedResponse<T> {
	items: T[];
	total: number;
	page: number;
	pageSize: number;
	hasMore: boolean;
}

export interface User {
	id: string;
	email: string;
	firstName?: string;
	lastName?: string;
	imageUrl?: string;
	isPremium: boolean;
}

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

export type ButtonSize = 'sm' | 'md' | 'lg';
