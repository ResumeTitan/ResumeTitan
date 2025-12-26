/**
 * Workshop Types
 *
 * Types for collaborative resume editing features.
 */

export interface WorkshopUser {
	id: string;
	name: string;
	avatar?: string;
	initials: string;
	color: string;
	isOnline: boolean;
	isActive: boolean; // Currently has focus on document
}

export interface WorkshopComment {
	id: string;
	author: WorkshopUser;
	text: string;
	timestamp: Date;
	section?: string; // e.g., "Professional Summary"
	resolved: boolean;
	replies: WorkshopComment[];
}

export interface WorkshopType {
	_id: string;
	resumeId: string;
	name: string;
	participants: WorkshopUser[];
	comments: WorkshopComment[];
	createdAt: Date;
}

export type CommentFilter = 'all' | 'open' | 'resolved';
