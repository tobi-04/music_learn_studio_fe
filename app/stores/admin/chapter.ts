/**
 * Chapter Store - Admin
 * Manages chapter state with 5-minute cache
 */

import { defineStore } from "pinia";
import type {
  ChapterResponse,
  CreateChapterRequest,
  UpdateChapterRequest,
  ChapterQueryParams,
} from "~/types";
import { useChapterApi } from "~/composables/api/useChapterApi";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export const useChapterStore = defineStore("admin-chapter", () => {
  // State
  const chapters = ref<ChapterResponse[]>([]);
  const currentChapter = ref<ChapterResponse | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Cache with 5-minute expiration
  const CACHE_DURATION = 5 * 60 * 1000;
  const chaptersCache = ref<Map<string, CacheEntry<ChapterResponse[]>>>(
    new Map()
  );
  const chapterCache = ref<Map<string, CacheEntry<ChapterResponse>>>(new Map());

  const api = useChapterApi();

  // Helpers
  const isCacheValid = (timestamp: number): boolean => {
    return Date.now() - timestamp < CACHE_DURATION;
  };

  const clearCache = () => {
    chaptersCache.value.clear();
    chapterCache.value.clear();
  };

  // Actions
  const fetchChaptersByCourse = async (
    courseId: string,
    params?: ChapterQueryParams,
    forceRefresh = false
  ) => {
    const cacheKey = `${courseId}-${JSON.stringify(params || {})}`;
    const cached = chaptersCache.value.get(cacheKey);

    if (!forceRefresh && cached && isCacheValid(cached.timestamp)) {
      console.log(`📦 Using cached chapters for course ${courseId}`);
      chapters.value = cached.data;
      return cached.data;
    }

    loading.value = true;
    error.value = null;

    try {
      console.log(`🌐 Fetching chapters for course ${courseId}`);
      const response = await api.getChaptersByCourse(courseId, params);
      chapters.value = response.data;

      chaptersCache.value.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });

      return response.data;
    } catch (err: unknown) {
      error.value = (err as Error).message || "Failed to fetch chapters";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchChapterById = async (id: string, forceRefresh = false) => {
    const cached = chapterCache.value.get(id);

    if (!forceRefresh && cached && isCacheValid(cached.timestamp)) {
      console.log(`📦 Using cached chapter ${id}`);
      currentChapter.value = cached.data;
      return cached.data;
    }

    loading.value = true;
    error.value = null;

    try {
      console.log(`🌐 Fetching chapter ${id}`);
      const response = await api.getChapterById(id);
      currentChapter.value = response.data;

      chapterCache.value.set(id, {
        data: response.data,
        timestamp: Date.now(),
      });

      return response.data;
    } catch (err: unknown) {
      error.value = (err as Error).message || "Failed to fetch chapter";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createChapter = async (
    courseId: string,
    data: CreateChapterRequest
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.createChapter(courseId, data);
      clearCache();
      await fetchChaptersByCourse(courseId, undefined, true);
      return response.data;
    } catch (err: unknown) {
      error.value = (err as Error).message || "Failed to create chapter";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateChapter = async (id: string, data: UpdateChapterRequest) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.updateChapter(id, data);
      clearCache();

      if (currentChapter.value?.id === id) {
        currentChapter.value = response.data;
      }

      return response.data;
    } catch (err: unknown) {
      error.value = (err as Error).message || "Failed to update chapter";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteChapter = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      await api.deleteChapter(id);
      clearCache();
      chapters.value = chapters.value.filter((c) => c.id !== id);

      if (currentChapter.value?.id === id) {
        currentChapter.value = null;
      }
    } catch (err: unknown) {
      error.value = (err as Error).message || "Failed to delete chapter";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const togglePublishChapter = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.togglePublish(id);
      clearCache();

      const index = chapters.value.findIndex((c) => c.id === id);
      if (index !== -1) {
        chapters.value[index] = response.data;
      }

      if (currentChapter.value?.id === id) {
        currentChapter.value = response.data;
      }

      return response.data;
    } catch (err: unknown) {
      error.value = (err as Error).message || "Failed to toggle publish status";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    chapters,
    currentChapter,
    loading,
    error,
    fetchChaptersByCourse,
    fetchChapterById,
    createChapter,
    updateChapter,
    deleteChapter,
    togglePublishChapter,
    clearCache,
  };
});
