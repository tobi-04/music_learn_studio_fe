/**
 * Course API Composable
 * Handles all course-related API calls
 */

import type {
  CourseResponse,
  CourseWithDetailsResponse,
  CreateCourseRequest,
  UpdateCourseRequest,
  CourseQueryParams,
  BaseResponse,
  PageResponse,
} from "~/types";

export const useCourseApi = () => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBase || "http://localhost:6888";

  /**
   * Get all courses with pagination and filters
   */
  const getCourses = async (params?: CourseQueryParams) => {
    return await $fetch<PageResponse<CourseResponse>>(
      `${baseUrl}/api/v1/admin/courses`,
      {
        method: "GET",
        params,
        headers: {
          "X-User-Id": "admin-123", // TODO: Get from auth store
        },
      }
    );
  };

  /**
   * Get course by ID
   */
  const getCourseById = async (id: string) => {
    return await $fetch<BaseResponse<CourseResponse>>(
      `${baseUrl}/api/v1/admin/courses/${id}`,
      {
        method: "GET",
        headers: {
          "X-User-Id": "admin-123",
        },
      }
    );
  };

  /**
   * Get course with chapters
   */
  const getCourseWithDetails = async (id: string) => {
    return await $fetch<BaseResponse<CourseWithDetailsResponse>>(
      `${baseUrl}/api/v1/admin/courses/${id}/with-details`,
      {
        method: "GET",
        headers: {
          "X-User-Id": "admin-123",
        },
      }
    );
  };

  /**
   * Create new course
   */
  const createCourse = async (data: FormData) => {
    return await $fetch<BaseResponse<CourseResponse>>(
      `${baseUrl}/api/v1/admin/courses`,
      {
        method: "POST",
        body: data,
        headers: {
          "X-User-Id": "admin-123",
        },
      }
    );
  };

  /**
   * Update course
   */
  const updateCourse = async (id: string, data: FormData) => {
    return await $fetch<BaseResponse<CourseResponse>>(
      `${baseUrl}/api/v1/admin/courses/${id}`,
      {
        method: "PUT",
        body: data,
        headers: {
          "X-User-Id": "admin-123",
        },
      }
    );
  };

  /**
   * Delete course
   */
  const deleteCourse = async (id: string) => {
    return await $fetch<BaseResponse<void>>(
      `${baseUrl}/api/v1/admin/courses/${id}`,
      {
        method: "DELETE",
        headers: {
          "X-User-Id": "admin-123",
        },
      }
    );
  };

  /**
   * Toggle course publish status
   */
  const togglePublish = async (id: string) => {
    return await $fetch<BaseResponse<CourseResponse>>(
      `${baseUrl}/api/v1/admin/courses/${id}/publish`,
      {
        method: "PATCH",
        headers: {
          "X-User-Id": "admin-123",
        },
      }
    );
  };

  return {
    getCourses,
    getCourseById,
    getCourseWithDetails,
    createCourse,
    updateCourse,
    deleteCourse,
    togglePublish,
  };
};
