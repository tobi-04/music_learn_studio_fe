/**
 * Public Course API Composable
 * Handles all public course-related API calls (no authentication required)
 */

import type {
  CourseResponse,
  CourseWithDetailsResponse,
  BaseResponse,
  PageResponse,
  CourseQueryParams,
} from "~/types";

export const usePublicCourseApi = () => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBase || "http://localhost:6888";

  /**
   * Get all published courses (public endpoint)
   */
  const getPublicCourses = async (params?: CourseQueryParams) => {
    return await $fetch<PageResponse<CourseResponse>>(
      `${baseUrl}/api/v1/public/courses`,
      {
        method: "GET",
        params: {
          ...params,
          published: true, // Only show published courses
        },
      }
    );
  };

  /**
   * Get course details with chapters (public endpoint)
   */
  const getPublicCourseDetails = async (id: string) => {
    return await $fetch<BaseResponse<CourseWithDetailsResponse>>(
      `${baseUrl}/api/v1/public/courses/${id}`,
      {
        method: "GET",
      }
    );
  };

  /**
   * Check if user is enrolled in a course
   */
  const checkEnrollment = async (courseId: string, userId?: string) => {
    if (!userId) return false;

    try {
      const response = await $fetch<BaseResponse<{ enrolled: boolean }>>(
        `${baseUrl}/api/v1/student/enrollments/check/${courseId}`,
        {
          method: "GET",
          headers: {
            "X-User-Id": userId,
          },
        }
      );
      return response.data.enrolled;
    } catch {
      return false;
    }
  };

  /**
   * Enroll in a free course
   */
  const enrollInCourse = async (courseId: string, userId: string) => {
    return await $fetch<BaseResponse<{ enrollmentId: string }>>(
      `${baseUrl}/api/v1/student/enrollments`,
      {
        method: "POST",
        headers: {
          "X-User-Id": userId,
        },
        body: {
          courseId,
        },
      }
    );
  };

  return {
    getPublicCourses,
    getPublicCourseDetails,
    checkEnrollment,
    enrollInCourse,
  };
};
