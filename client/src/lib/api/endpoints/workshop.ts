/**
 * Workshop API Endpoints
 *
 * Type-safe API functions for workshop operations.
 */

import { api } from '../client';
import type {
  WorkshopType,
  WorkshopComment,
  WorkshopRole,
  ResumeType
} from '$types';

interface WorkshopListResponse {
  owned: WorkshopType[];
  shared: WorkshopType[];
}

interface WorkshopResponse {
  workshop: WorkshopType;
  role?: WorkshopRole;
  canEdit?: boolean;
}

interface SharedWorkshopResponse {
  workshop: WorkshopType;
  resume: ResumeType;
  role: WorkshopRole;
  canEdit: boolean;
  redirectToWorkshop: boolean;
  workshopId: string;
}

interface ShareResponse {
  workshop: WorkshopType;
  shareUrl: string | null;
}

interface CommentResponse {
  comment: WorkshopComment;
}

interface ReplyResponse {
  reply: WorkshopComment;
}

export const workshopApi = {
  /**
   * Get all workshops (owned + shared)
   */
  getAll: () =>
    api.get<WorkshopListResponse>('/workshop'),

  /**
   * Get a single workshop by ID
   */
  getById: (id: string) =>
    api.get<WorkshopResponse>(`/workshop/${encodeURIComponent(id)}`),

  /**
   * Get a workshop by share token
   */
  getByShareToken: (token: string, userName?: string, userEmail?: string) => {
    const params = new URLSearchParams();
    if (userName) params.append('userName', userName);
    if (userEmail) params.append('userEmail', userEmail);
    const query = params.toString() ? `?${params.toString()}` : '';
    return api.get<SharedWorkshopResponse>(`/workshop/shared/${encodeURIComponent(token)}${query}`);
  },

  /**
   * Create a new workshop
   */
  create: (data: { resumeId: string; name?: string; ownerName?: string; ownerEmail?: string }) =>
    api.post<WorkshopResponse>('/workshop', data),

  /**
   * Update an existing workshop
   */
  update: (id: string, data: Partial<WorkshopType>) =>
    api.put<WorkshopResponse>(`/workshop/${encodeURIComponent(id)}`, data),

  /**
   * Delete a workshop
   */
  delete: (id: string) =>
    api.delete(`/workshop/${encodeURIComponent(id)}`),

  /**
   * Toggle workshop sharing
   */
  toggleSharing: (id: string, enabled: boolean) =>
    api.post<ShareResponse>(`/workshop/${encodeURIComponent(id)}/share`, { enabled }),

  /**
   * Add a comment to a workshop
   */
  addComment: (workshopId: string, data: { text: string; section?: string; authorName?: string; authorEmail?: string }) =>
    api.post<CommentResponse>(`/workshop/${encodeURIComponent(workshopId)}/comment`, data),

  /**
   * Reply to a comment
   */
  replyToComment: (workshopId: string, commentId: string, data: { text: string; authorName?: string; authorEmail?: string }) =>
    api.post<ReplyResponse>(`/workshop/${encodeURIComponent(workshopId)}/comment/${encodeURIComponent(commentId)}/reply`, data),

  /**
   * Resolve or unresolve a comment
   */
  resolveComment: (workshopId: string, commentId: string, resolved: boolean) =>
    api.patch<CommentResponse>(`/workshop/${encodeURIComponent(workshopId)}/comment/${encodeURIComponent(commentId)}/resolve`, { resolved }),
};