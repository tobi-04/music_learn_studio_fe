/**
 * Course Store - Admin
 * Manages course state with 5-minute cache
 */

import { defineStore } from "pinia";
import type {
  CourseResponse,
  CourseWithDetailsResponse,
  CreateCourseRequest,
  UpdateCourseRequest,
  CourseQueryParams,
  PageResponse,
} from "~/types";
import { useCourseApi } from "~/composables/api/useCourseApi";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export const useCourseStore = defineStore("admin-course", () => {
  // State
  const courses = ref<CourseResponse[]>([]);
  const currentCourse = ref<CourseResponse | null>(null);
  const currentCourseWithDetails = ref<CourseWithDetailsResponse | null>(null);
  const pagination = ref<Omit<PageResponse<CourseResponse>, "content"> | null>(
    null
  );
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Cache with 5-minute expiration
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
  const coursesCache = ref<CacheEntry<PageResponse<CourseResponse>> | null>(
    null
  );
  const courseCache = ref<Map<string, CacheEntry<CourseResponse>>>(new Map());

  const api = useCourseApi();

  // Helpers
  const isCacheValid = (timestamp: number): boolean => {
    return Date.now() - timestamp < CACHE_DURATION;
  };

  const clearCache = () => {
    coursesCache.value = null;
    courseCache.value.clear();
  };

  // Actions
  const fetchCourses = async (
    params?: CourseQueryParams,
    forceRefresh = false
  ) => {
    // Check cache
    if (
      !forceRefresh &&
      coursesCache.value &&
      isCacheValid(coursesCache.value.timestamp)
    ) {
      console.log("📦 Using cached courses");
      courses.value = coursesCache.value.data.content;
      pagination.value = {
        pageNumber: coursesCache.value.data.pageNumber,
        pageSize: coursesCache.value.data.pageSize,
        totalElements: coursesCache.value.data.totalElements,
        totalPages: coursesCache.value.data.totalPages,
        first: coursesCache.value.data.first,
        last: coursesCache.value.data.last,
        empty: coursesCache.value.data.empty,
      };
      return courses.value;
    }

    loading.value = true;
    error.value = null;

    try {
      console.log("🌐 Fetching courses from API");
      const response = await api.getCourses(params);
      courses.value = response.content;
      pagination.value = {
        pageNumber: response.pageNumber,
        pageSize: response.pageSize,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        first: response.first,
        last: response.last,
        empty: response.empty,
      };

      // Update cache
      coursesCache.value = {
        data: response,
        timestamp: Date.now(),
      };

      return courses.value;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch courses";
      error.value = errorMessage;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchCourseById = async (id: string, forceRefresh = false) => {
    // Check cache
    const cached = courseCache.value.get(id);
    if (!forceRefresh && cached && isCacheValid(cached.timestamp)) {
      console.log(`📦 Using cached course ${id}`);
      currentCourse.value = cached.data;
      return cached.data;
    }

    loading.value = true;
    error.value = null;

    try {
      console.log(`🌐 Fetching course ${id} from API`);
      const response = await api.getCourseById(id);
      currentCourse.value = response.data;

      // Update cache
      courseCache.value.set(id, {
        data: response.data,
        timestamp: Date.now(),
      });

      return response.data;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch course";
      error.value = errorMessage;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchCourseWithDetails = async (id: string, _forceRefresh = false) => {
    loading.value = true;
    error.value = null;

    try {
      console.log(`🌐 Fetching course ${id} with details from API`);
      const response = await api.getCourseWithDetails(id);
      currentCourseWithDetails.value = response.data;
      return response.data;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch course details";
      error.value = errorMessage;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createCourse = async (data: FormData) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.createCourse(data);

      // Invalidate cache
      clearCache();

      // Refresh courses list
      await fetchCourses(undefined, true);

      return response.data;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create course";
      error.value = errorMessage;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateCourse = async (id: string, data: FormData) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.updateCourse(id, data);

      // Invalidate cache
      clearCache();

      // Update current course if it's the one being edited
      if (currentCourse.value?.id === id) {
        currentCourse.value = response.data;
      }

      return response.data;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update course";
      error.value = errorMessage;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteCourse = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      await api.deleteCourse(id);

      // Invalidate cache
      clearCache();

      // Remove from current list
      courses.value = courses.value.filter((c) => c.id !== id);

      // Clear current course if it's the one being deleted
      if (currentCourse.value?.id === id) {
        currentCourse.value = null;
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete course";
      error.value = errorMessage;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const togglePublish = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.togglePublish(id);

      // Invalidate cache
      clearCache();

      // Update in current list
      const index = courses.value.findIndex((c) => c.id === id);
      if (index !== -1) {
        courses.value[index] = response.data;
      }

      // Update current course if it's the one being toggled
      if (currentCourse.value?.id === id) {
        currentCourse.value = response.data;
      }

      return response.data;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to toggle publish status";
      error.value = errorMessage;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    // State
    courses,
    currentCourse,
    currentCourseWithDetails,
    pagination,
    loading,
    error,

    // Actions
    fetchCourses,
    fetchCourseById,
    fetchCourseWithDetails,
    createCourse,
    updateCourse,
    deleteCourse,
    togglePublish,
    clearCache,
  };
});
