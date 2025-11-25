/**
 * Chapter API Composable
 * Handles all chapter-related API calls
 */

import type {
  ChapterResponse,
  CreateChapterRequest,
  UpdateChapterRequest,
  ChapterQueryParams,
  BaseResponse,
} from "~/types";

export const useChapterApi = () => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBase || "http://localhost:6888";

  /**
   * Get all chapters for a course
   */
  const getChaptersByCourse = async (
    courseId: string,
    params?: ChapterQueryParams
  ) => {
    return await $fetch<BaseResponse<ChapterResponse[]>>(
      `${baseUrl}/api/v1/admin/courses/${courseId}/chapters`,
      {
        method: "GET",
        params,
        headers: {
          "X-User-Id": "admin-123",
        },
      }
    );
  };

  /**
   * Get chapter by ID
   */
  const getChapterById = async (id: string) => {
    return await $fetch<BaseResponse<ChapterResponse>>(
      `${baseUrl}/api/v1/admin/chapters/${id}`,
      {
        method: "GET",
        headers: {
          "X-User-Id": "admin-123",
        },
      }
    );
  };

  /**
   * Create new chapter
   */
  const createChapter = async (
    courseId: string,
    data: CreateChapterRequest
  ) => {
    return await $fetch<BaseResponse<ChapterResponse>>(
      `${baseUrl}/api/v1/admin/courses/${courseId}/chapters`,
      {
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": "admin-123",
        },
      }
    );
  };

  /**
   * Update chapter
   */
  const updateChapter = async (id: string, data: UpdateChapterRequest) => {
    return await $fetch<BaseResponse<ChapterResponse>>(
      `${baseUrl}/api/v1/admin/chapters/${id}`,
      {
        method: "PUT",
        body: data,
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": "admin-123",
        },
      }
    );
  };

  /**
   * Delete chapter
   */
  const deleteChapter = async (id: string) => {
    return await $fetch<BaseResponse<void>>(
      `${baseUrl}/api/v1/admin/chapters/${id}`,
      {
        method: "DELETE",
        headers: {
          "X-User-Id": "admin-123",
        },
      }
    );
  };

  /**
   * Toggle chapter publish status
   */
  const togglePublish = async (id: string) => {
    return await $fetch<BaseResponse<ChapterResponse>>(
      `${baseUrl}/api/v1/admin/chapters/${id}/publish`,
      {
        method: "PATCH",
        headers: {
          "X-User-Id": "admin-123",
        },
      }
    );
  };

  /**
   * Reorder chapter
   */
  const reorderChapter = async (id: string, newOrderIndex: number) => {
    return await $fetch<BaseResponse<ChapterResponse>>(
      `${baseUrl}/api/v1/admin/chapters/${id}/reorder`,
      {
        method: "PATCH",
        params: { newOrderIndex },
        headers: {
          "X-User-Id": "admin-123",
        },
      }
    );
  };

  return {
    getChaptersByCourse,
    getChapterById,
    createChapter,
    updateChapter,
    deleteChapter,
    togglePublish,
    reorderChapter,
  };
};
