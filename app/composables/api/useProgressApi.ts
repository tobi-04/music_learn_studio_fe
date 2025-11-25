/**
 * Progress API Composable
 * Handles all progress tracking API calls
 */

import type {
  UserCourseProgressResponse,
  UserChapterProgressResponse,
  StudentStatsResponse,
  MarkChapterCompleteRequest,
  BaseResponse,
} from "~/types";

export const useProgressApi = () => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBase || "http://localhost:6888";

  /**
   * Enroll in a course
   */
  const enrollCourse = async (courseId: string, userId: string) => {
    return await $fetch<BaseResponse<UserCourseProgressResponse>>(
      `${baseUrl}/api/v1/student/progress/enroll/${courseId}`,
      {
        method: "POST",
        headers: {
          "X-User-Id": userId,
        },
      }
    );
  };

  /**
   * Get course progress
   */
  const getCourseProgress = async (courseId: string, userId: string) => {
    return await $fetch<BaseResponse<UserCourseProgressResponse>>(
      `${baseUrl}/api/v1/student/progress/courses/${courseId}`,
      {
        method: "GET",
        headers: {
          "X-User-Id": userId,
        },
      }
    );
  };

  /**
   * Mark chapter as complete
   */
  const markChapterComplete = async (
    chapterId: string,
    userId: string,
    data?: MarkChapterCompleteRequest
  ) => {
    return await $fetch<BaseResponse<UserChapterProgressResponse>>(
      `${baseUrl}/api/v1/student/progress/chapters/${chapterId}/complete`,
      {
        method: "POST",
        body: data || {},
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId,
        },
      }
    );
  };

  /**
   * Get chapter progress
   */
  const getChapterProgress = async (chapterId: string, userId: string) => {
    return await $fetch<BaseResponse<UserChapterProgressResponse>>(
      `${baseUrl}/api/v1/student/progress/chapters/${chapterId}`,
      {
        method: "GET",
        headers: {
          "X-User-Id": userId,
        },
      }
    );
  };

  /**
   * Get student overall statistics
   */
  const getStudentStats = async (userId: string) => {
    return await $fetch<BaseResponse<StudentStatsResponse>>(
      `${baseUrl}/api/v1/student/progress/stats`,
      {
        method: "GET",
        headers: {
          "X-User-Id": userId,
        },
      }
    );
  };

  return {
    enrollCourse,
    getCourseProgress,
    markChapterComplete,
    getChapterProgress,
    getStudentStats,
  };
};
