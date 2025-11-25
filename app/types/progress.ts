/**
 * Progress tracking types
 */

export interface UserCourseProgressResponse {
  id: string;
  userId: string;
  courseId: string;
  progressPercentage: number;
  completedChapters: number;
  totalChapters: number;
  enrolledAt: string;
  lastAccessedAt: string;
  completedAt?: string;
}

export interface UserChapterProgressResponse {
  id: string;
  userId: string;
  chapterId: string;
  isCompleted: boolean;
  timeSpentMinutes: number;
  completedAt?: string;
  lastAccessedAt: string;
}

export interface StudentStatsResponse {
  totalCoursesEnrolled: number;
  completedCourses: number;
  inProgressCourses: number;
  totalChaptersCompleted: number;
  totalTimeSpentMinutes: number;
  completionRate: number;
}

export interface MarkChapterCompleteRequest {
  timeSpentMinutes?: number;
}
