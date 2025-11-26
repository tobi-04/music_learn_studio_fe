<template>
  <UCard class="overflow-hidden hover:shadow-lg transition-shadow duration-200">
    <template #header>
      <div class="relative aspect-square bg-gray-200 dark:bg-gray-800">
        <img
          v-if="track.coverImageUrl"
          :src="track.coverImageUrl"
          :alt="track.title"
          class="w-full h-full object-cover" />
        <div v-else class="w-full h-full flex items-center justify-center">
          <Music class="w-16 h-16 text-gray-400" />
        </div>

        <!-- Edit/Delete buttons -->
        <div v-if="showDelete" class="absolute top-2 right-2 flex gap-2 z-10">
          <UButton color="neutral" size="sm" @click.stop="$emit('edit', track)">
            <Pencil class="w-4 h-4" />
          </UButton>
          <UButton
            color="error"
            size="sm"
            @click.stop="$emit('delete', track.id)">
            <Trash2 class="w-4 h-4" />
          </UButton>
        </div>

        <!-- Play button overlay -->
        <div
          class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
          <UButton color="primary" size="xl" @click="$emit('play', track.id)">
            <Play class="w-8 h-8" />
          </UButton>
        </div>
      </div>
    </template>

    <div class="space-y-3">
      <div>
        <h3 class="font-semibold text-lg line-clamp-1">{{ track.title }}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ track.description }}
        </p>
      </div>

      <div class="flex items-center gap-4 text-sm text-gray-500">
        <div class="flex items-center gap-1">
          <Play class="w-4 h-4" />
          <span>{{ formatNumber(track.playCount) }}</span>
        </div>
        <div class="flex items-center gap-1">
          <Heart class="w-4 h-4" />
          <span>{{ formatNumber(track.likeCount) }}</span>
        </div>
        <div class="flex items-center gap-1">
          <Clock class="w-4 h-4" />
          <span>{{ track.duration.toFixed(1) }} min</span>
        </div>
      </div>

      <div class="flex flex-wrap gap-2">
        <UBadge
          v-for="tag in track.tags.slice(0, 3)"
          :key="tag"
          color="neutral"
          variant="subtle"
          size="xs">
          {{ tag }}
        </UBadge>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { Play, Music, Heart, Clock, Trash2, Pencil } from "lucide-vue-next";
import type { MusicTrack } from "~/types/music";

interface Props {
  track: MusicTrack;
  showDelete?: boolean;
}

withDefaults(defineProps<Props>(), {
  showDelete: false,
});

defineEmits<{
  play: [trackId: string];
  delete: [trackId: string];
  edit: [track: MusicTrack];
}>();

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}
</script>
