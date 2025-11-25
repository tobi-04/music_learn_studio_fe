/**
 * Enrollment API Composable
 * Handles enrollment-related API calls
 */

import type { BaseResponse } from "~/types";

export interface EnrollmentResponse {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  status: "active" | "completed" | "cancelled";
}

export interface EnrollmentStatsResponse {
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
}

export const useEnrollmentApi = () => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBase || "http://localhost:6888";

  /**
   * Create a new enrollment
   */
  const createEnrollment = async (courseId: string, userId: string) => {
    return await $fetch<BaseResponse<EnrollmentResponse>>(
      `${baseUrl}/api/v1/enrollments`,
      {
        method: "POST",
        body: {
          courseId,
          userId,
        },
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId,
        },
      }
    );
  };

  /**
   * Get user enrollments
   */
  const getUserEnrollments = async (userId: string) => {
    return await $fetch<BaseResponse<EnrollmentResponse[]>>(
      `${baseUrl}/api/v1/enrollments/user/${userId}`,
      {
        method: "GET",
        headers: {
          "X-User-Id": userId,
        },
      }
    );
  };

  /**
   * Get course enrollments
   */
  const getCourseEnrollments = async (courseId: string, userId: string) => {
    return await $fetch<BaseResponse<EnrollmentResponse[]>>(
      `${baseUrl}/api/v1/enrollments/course/${courseId}`,
      {
        method: "GET",
        headers: {
          "X-User-Id": userId,
        },
      }
    );
  };

  /**
   * Check if user is enrolled in a course
   */
  const checkEnrollment = async (
    userId: string,
    courseId: string
  ): Promise<boolean> => {
    try {
      const response = await getUserEnrollments(userId);
      return (
        response.data?.some(
          (enrollment) =>
            enrollment.courseId === courseId && enrollment.status === "active"
        ) || false
      );
    } catch (error) {
      console.error("Error checking enrollment:", error);
      return false;
    }
  };

  /**
   * Get enrollment statistics
   */
  const getEnrollmentStats = async (userId: string) => {
    return await $fetch<BaseResponse<EnrollmentStatsResponse>>(
      `${baseUrl}/api/v1/enrollments/stats`,
      {
        method: "GET",
        headers: {
          "X-User-Id": userId,
        },
      }
    );
  };

  /**
   * Cancel an enrollment
   */
  const cancelEnrollment = async (enrollmentId: string, userId: string) => {
    return await $fetch<BaseResponse<EnrollmentResponse>>(
      `${baseUrl}/api/v1/enrollments/${enrollmentId}`,
      {
        method: "DELETE",
        headers: {
          "X-User-Id": userId,
        },
      }
    );
  };

  return {
    createEnrollment,
    getUserEnrollments,
    getCourseEnrollments,
    checkEnrollment,
    getEnrollmentStats,
    cancelEnrollment,
  };
};
