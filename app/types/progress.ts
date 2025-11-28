/**
 * Progress tracking types
 */

export interface UserCourseProgressResponse {
  id: string;
  userId: string;
  courseId: string;
  courseTitle?: string;
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

export interface StudentResponse {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  enrolledCourses: number;
  isLocked: boolean;
}

export interface AdminProgressStatsResponse {
  totalStudents: number;
  completedLessons: number;
  avgHours: number;
  avgQuizScore: number;
}

export interface CourseProgressStatsResponse {
  id: string;
  name: string;
  enrolledStudents: number;
  completionRate: number;
}

export interface MarkChapterCompleteRequest {
  timeSpentMinutes?: number;
}
