/**
 * Enrollment API composable
 * Handles course enrollment for students
 */

import type { CourseResponse } from "~/types";

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  completedAt?: string;
  progress: number;
  isActive: boolean;
}

export interface EnrollmentWithCourse extends Enrollment {
  course?: CourseResponse;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export function useEnrollmentApi() {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const baseUrl = `${config.public.apiBase}/api/v1/student/enrollments`;

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
   * Get all enrollments for current user
   */
  const getMyEnrollments = async (): Promise<Enrollment[]> => {
    const response = await $fetch<ApiResponse<Enrollment[]>>(baseUrl, {
      headers: getHeaders(),
    });
    return response.data || [];
  };

  /**
   * Check if user is enrolled in a specific course
   */
  const checkEnrollment = async (
    courseId: string
  ): Promise<{ enrolled: boolean }> => {
    const response = await $fetch<ApiResponse<{ enrolled: boolean }>>(
      `${baseUrl}/check/${courseId}`,
      {
        headers: getHeaders(),
      }
    );
    return response.data;
  };

  /**
   * Enroll in a course (for free courses)
   */
  const enrollInCourse = async (courseId: string): Promise<Enrollment> => {
    const response = await $fetch<ApiResponse<Enrollment>>(baseUrl, {
      method: "POST",
      headers: getHeaders(),
      body: { courseId },
    });
    return response.data;
  };

  /**
   * Update enrollment progress
   */
  const updateProgress = async (
    enrollmentId: string,
    progress: number
  ): Promise<void> => {
    await $fetch(`${baseUrl}/${enrollmentId}/progress`, {
      method: "PATCH",
      headers: getHeaders(),
      body: { progress },
    });
  };

  /**
   * Get enrollments with course details
   * Fetches enrollments and their associated course data
   */
  const getEnrollmentsWithCourses = async (): Promise<
    EnrollmentWithCourse[]
  > => {
    const enrollments = await getMyEnrollments();

    // Fetch course details for each enrollment from public API
    const courseApi = `${config.public.apiBase}/api/v1/public/courses`;

    const enrollmentsWithCourses = await Promise.all(
      enrollments.map(async (enrollment) => {
        try {
          const courseResponse = await $fetch<ApiResponse<CourseResponse>>(
            `${courseApi}/${enrollment.courseId}`,
            {
              headers: getHeaders(),
            }
          );
          return {
            ...enrollment,
            course: courseResponse.data,
          };
        } catch {
          // Course may have been deleted
          return {
            ...enrollment,
            course: undefined,
          };
        }
      })
    );

    return enrollmentsWithCourses.filter((e) => e.course);
  };

  return {
    getMyEnrollments,
    checkEnrollment,
    enrollInCourse,
    updateProgress,
    getEnrollmentsWithCourses,
  };
}
