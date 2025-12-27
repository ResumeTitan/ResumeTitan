/**
 * Workshop Types
 *
 * Types for collaborative resume editing features.
 */

export interface WorkshopUser {
    clerkId: string;
    name: string;
    email?: string;
    avatar?: string;
    initials: string;
    color: string;
    isOnline: boolean;
    isActive: boolean;
    joinedAt?: Date;
}

export interface WorkshopComment {
    id: string;
    authorClerkId: string;
    authorName: string;
    authorEmail?: string;
    authorInitials: string;
    authorColor: string;
    text: string;
    timestamp: Date;
    section?: string;
    resolved: boolean;
    resolvedBy?: string;
    replies: WorkshopComment[];
}

export interface WorkshopType {
    _id: string;
    clerkId: string;
    ownerName?: string;
    ownerEmail?: string;
    resumeId: string;
    name: string;
    shareToken?: string;
    shareEnabled: boolean;
    participants: WorkshopUser[];
    comments: WorkshopComment[];
    createdAt: Date;
    updatedAt?: Date;
}

export type WorkshopRole = 'owner' | 'commenter';

export type CommentFilter = 'all' | 'open' | 'resolved';
