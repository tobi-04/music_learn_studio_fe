<template>
  <div class="chapter-list space-y-3">
    <div v-if="loading" class="text-center py-8">
      <AppSpinner size="lg" />
    </div>

    <div
      v-else-if="chapters.length === 0"
      class="text-center py-8 text-gray-500">
      Chưa có chương nào. Hãy tạo chương đầu tiên của bạn!
    </div>

    <div v-else class="space-y-2">
      <AppCard
        v-for="(chapter, index) in chapters"
        :key="chapter.id"
        class="hover:shadow-md transition-shadow cursor-pointer">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4 flex-1">
            <!-- YouTube Video Preview -->
            <div
              v-if="getYouTubeVideoId(chapter.videoUrl)"
              class="flex-shrink-0">
              <iframe
                :src="`https://www.youtube.com/embed/${getYouTubeVideoId(
                  chapter.videoUrl
                )}`"
                class="w-40 h-[90px] rounded border border-gray-200"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                loading="lazy" />
            </div>

            <div class="text-2xl font-bold text-gray-400">{{ index + 1 }}</div>
            <div class="flex-1">
              <h3 class="font-semibold">{{ chapter.title }}</h3>
              <p
                v-if="chapter.description"
                class="text-sm text-gray-500 line-clamp-1">
                {{ chapter.description }}
              </p>
              <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span
                  v-if="chapter.durationMinutes"
                  class="flex items-center gap-1">
                  <Clock :size="14" />
                  {{ chapter.durationMinutes }} phút
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <AppBadge
              :color="chapter.isPublished ? 'green' : 'gray'"
              variant="soft">
              {{ chapter.isPublished ? "Đã xuất bản" : "Bản nháp" }}
            </AppBadge>

            <UButton
              size="xs"
              variant="ghost"
              icon="i-heroicons-pencil"
              @click="$emit('edit', chapter)" />
            <UButton
              size="xs"
              variant="ghost"
              :icon="
                chapter.isPublished
                  ? 'i-heroicons-eye-slash'
                  : 'i-heroicons-eye'
              "
              @click="$emit('toggle-publish', chapter)" />
            <UButton
              size="xs"
              variant="ghost"
              color="red"
              icon="i-heroicons-trash"
              @click="$emit('delete', chapter)" />
          </div>
        </div>
      </AppCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Clock, Music, FileText } from "lucide-vue-next";
import type { ChapterResponse } from "~/types";

defineProps<{
  chapters: ChapterResponse[];
  loading?: boolean;
}>();

defineEmits<{
  edit: [chapter: ChapterResponse];
  "toggle-publish": [chapter: ChapterResponse];
  delete: [chapter: ChapterResponse];
}>();

/**
 * Extract YouTube video ID from various YouTube URL formats
 * Supports: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
 */
const getYouTubeVideoId = (url?: string): string | null => {
  if (!url) return null;

  try {
    // Match various YouTube URL patterns
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/, // youtube.com/watch?v=ID
      /(?:youtu\.be\/)([a-zA-Z0-9_-]+)/, // youtu.be/ID
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/, // youtube.com/embed/ID
      /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]+)/, // youtube.com/v/ID
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
  } catch (error) {
    console.error("Error parsing YouTube URL:", error);
  }

  return null;
};
</script>
