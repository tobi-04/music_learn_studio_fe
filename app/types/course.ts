/**
 * Course related types
 */

import type { ChapterResponse } from "./chapter";

export type CourseLevel = "beginner" | "intermediate" | "advanced";

export interface CourseResponse {
  id: string;
  title: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
  level: CourseLevel;
  isPublished: boolean;
  orderIndex: number;
  totalChapters: number;
  price?: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseWithDetailsResponse extends CourseResponse {
  chapters: ChapterResponse[];
}

export interface CreateCourseRequest {
  title: string;
  description?: string;
  thumbnailUrl?: string;
  level: CourseLevel;
  orderIndex?: number;
  price?: number;
}

export interface UpdateCourseRequest {
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  level?: CourseLevel;
  orderIndex?: number;
  price?: number;
}

export interface CourseQueryParams {
  page?: number;
  size?: number;
  level?: CourseLevel;
  published?: boolean;
  search?: string;
  sort?: string;
}
