/**
 * Interview API Endpoints
 *
 * Type-safe API functions for interview operations.
 */

import { api } from '../client';
import type {
  WorkshopType,
  WorkshopComment,
  WorkshopUser
} from '$types';

interface WorkshopListResponse {
  workshops: WorkshopType[];
}

interface WorkshopResponse {
  workshop: WorkshopType
}

export const workshopApi = {
  /**
   * Get all interviews for the current user
   */
  getAll: () =>
    api.get<WorkshopListResponse>('/workshop'),

  /**
   * Get a single interview by ID
   */
  getById: (id: string) =>
    api.get<WorkshopResponse>(`/workshop/${encodeURIComponent(id)}`),

  /**
   * Create a new interview (generates questions)
   */
  create: (data: any) =>
    api.post<WorkshopResponse>('/workshop', data),

  /**
   * Update an existing interview
   */
  update: (id: string, data: Partial<WorkshopType>) =>
    api.put<WorkshopResponse>(`/workshop/${encodeURIComponent(id)}`, data),

  /**
   * Delete an interview
   */
  delete: (id: string) =>
    api.delete(`/workshop/${encodeURIComponent(id)}`),
};
