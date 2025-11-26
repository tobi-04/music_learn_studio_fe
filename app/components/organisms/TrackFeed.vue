<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold">{{ title }}</h2>
        <p v-if="description" class="text-gray-600 dark:text-gray-400">
          {{ description }}
        </p>
      </div>

      <UButton v-if="showUploadButton" color="primary" @click="$emit('upload')">
        <Upload class="w-4 h-4 mr-2" />
        Upload Track
      </UButton>
    </div>

    <!-- Loading state -->
    <div
      v-if="loading"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="n in 8" :key="n" class="animate-pulse">
        <div
          class="bg-gray-200 dark:bg-gray-800 aspect-square rounded-lg mb-3" />
        <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2" />
        <div class="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="tracks.length === 0" class="text-center py-12">
      <Music class="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        No tracks found
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        {{ emptyMessage }}
      </p>
      <UButton v-if="showUploadButton" color="primary" @click="$emit('upload')">
        <Upload class="w-4 h-4 mr-2" />
        Upload Your First Track
      </UButton>
    </div>

    <!-- Track grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <TrackCard
        v-for="track in tracks"
        :key="track.id"
        :track="track"
        :show-delete="showDelete"
        @play="handlePlay"
        @edit="$emit('edit', $event)"
        @delete="handleDelete" />
    </div>

    <!-- Load more -->
    <div v-if="hasMore && !loading" class="flex justify-center">
      <UButton
        color="neutral"
        variant="outline"
        :loading="loadingMore"
        @click="$emit('loadMore')">
        Load More
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Upload, Music } from "lucide-vue-next";
import type { MusicTrack } from "~/types/music";

interface Props {
  title?: string;
  description?: string;
  tracks: MusicTrack[];
  loading?: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  showUploadButton?: boolean;
  showDelete?: boolean;
  emptyMessage?: string;
}

withDefaults(defineProps<Props>(), {
  loading: false,
  loadingMore: false,
  hasMore: false,
  showUploadButton: false,
  showDelete: false,
  emptyMessage: "Start exploring music or upload your own tracks",
});

const emit = defineEmits<{
  play: [trackId: string];
  upload: [];
  loadMore: [];
  delete: [trackId: string];
  edit: [track: MusicTrack];
}>();

function handlePlay(trackId: string) {
  emit("play", trackId);
}

function handleDelete(trackId: string) {
  emit("delete", trackId);
}
</script>
