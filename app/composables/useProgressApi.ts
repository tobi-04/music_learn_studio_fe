/**
 * Progress API composable
 * Handles student progress tracking
 */

import type {
  UserCourseProgressResponse,
  StudentStatsResponse,
  StudentResponse,
  AdminProgressStatsResponse,
  CourseProgressStatsResponse,
} from "~/types/progress";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export function useProgressApi() {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const baseUrl = `${config.public.apiBase}/api/v1/student/progress`;

  const getHeaders = () => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Re-read from authStore at call time (not at composable creation time)
    const user = authStore.user;
    const token = authStore.token;

    if (user?.id) {
      headers["X-User-Id"] = user.id;
    }
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  /**
   * Get all course progress for current user
   */
  const getAllProgress = async (): Promise<UserCourseProgressResponse[]> => {
    const response = await $fetch<ApiResponse<UserCourseProgressResponse[]>>(
      baseUrl,
      {
        headers: getHeaders(),
      }
    );
    return response.data || [];
  };

  /**
   * Get progress for a specific course
   */
  const getCourseProgress = async (
    courseId: string
  ): Promise<UserCourseProgressResponse> => {
    const response = await $fetch<ApiResponse<UserCourseProgressResponse>>(
      `${baseUrl}/courses/${courseId}`,
      {
        headers: getHeaders(),
      }
    );
    return response.data;
  };

  /**
   * Enroll in a course via progress API
   */
  const enrollCourse = async (
    courseId: string
  ): Promise<UserCourseProgressResponse> => {
    const response = await $fetch<ApiResponse<UserCourseProgressResponse>>(
      `${baseUrl}/enroll/${courseId}`,
      {
        method: "POST",
        headers: getHeaders(),
      }
    );
    return response.data;
  };

  /**
   * Mark chapter as completed
   */
  const markChapterComplete = async (chapterId: string): Promise<void> => {
    await $fetch(`${baseUrl}/chapters/${chapterId}/complete`, {
      method: "POST",
      headers: getHeaders(),
    });
  };

  /**
   * Get student statistics
   */
  const getStudentStats = async (): Promise<StudentStatsResponse> => {
    const response = await $fetch<ApiResponse<StudentStatsResponse>>(
      `${baseUrl}/stats`,
      {
        headers: getHeaders(),
      }
    );
    return response.data;
  };

  /**
   * Get all students (Admin)
   */
  const getAllStudents = async (): Promise<StudentResponse[]> => {
    const response = await $fetch<ApiResponse<StudentResponse[]>>(
      `${baseUrl}/admin/students`,
      {
        headers: getHeaders(),
      }
    );
    return response.data || [];
  };

  /**
   * Get admin progress stats
   */
  const getAdminProgressStats =
    async (): Promise<AdminProgressStatsResponse> => {
      const response = await $fetch<ApiResponse<AdminProgressStatsResponse>>(
        `${baseUrl}/admin/stats`,
        {
          headers: getHeaders(),
        }
      );
      return response.data;
    };

  /**
   * Get course progress stats (Admin)
   */
  const getCourseProgressStats = async (): Promise<
    CourseProgressStatsResponse[]
  > => {
    const response = await $fetch<ApiResponse<CourseProgressStatsResponse[]>>(
      `${baseUrl}/admin/courses`,
      {
        headers: getHeaders(),
      }
    );
    return response.data || [];
  };

  return {
    getAllProgress,
    getCourseProgress,
    enrollCourse,
    markChapterComplete,
    getStudentStats,
    getAllStudents,
    getAdminProgressStats,
    getCourseProgressStats,
  };
}
