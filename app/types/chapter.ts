/**
 * Chapter related types
 */

export interface ChapterResponse {
  id: string;
  courseId: string;
  title: string;
  slug: string;
  description?: string;
  contentMarkdown?: string;
  videoUrl?: string;
  durationMinutes?: number;
  isPublished: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChapterRequest {
  title: string;
  description?: string;
  contentMarkdown?: string;
  videoUrl?: string;
  durationMinutes?: number;
  orderIndex?: number;
}

export interface UpdateChapterRequest {
  title?: string;
  description?: string;
  contentMarkdown?: string;
  videoUrl?: string;
  durationMinutes?: number;
  orderIndex?: number;
}

export interface ChapterQueryParams {
  publishedOnly?: boolean;
  sort?: string;
}
