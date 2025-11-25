<template>
  <UCard>
    <div class="space-y-3">
      <!-- Cover Image / Placeholder -->
      <div
        class="h-40 bg-linear-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
        <div class="text-white text-4xl">🎵</div>
      </div>

      <!-- Title and Info -->
      <div>
        <h3 class="font-semibold text-lg truncate">{{ composition.title }}</h3>
        <p class="text-sm text-gray-500 truncate">
          {{ composition.bpm }} BPM •
          {{ composition.tracks?.length || 0 }} tracks
        </p>
        <div class="flex items-center gap-2 mt-1">
          <span
            :class="[
              'text-xs px-2 py-1 rounded-full',
              composition.status === 'PUBLISHED'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
            ]">
            {{ composition.status }}
          </span>
          <span
            v-if="composition.isPublic"
            class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Public
          </span>
        </div>
      </div>

      <!-- Description -->
      <p
        v-if="composition.description"
        class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
        {{ composition.description }}
      </p>

      <!-- Dates -->
      <div class="text-xs text-gray-500">
        <div>Created: {{ formatDate(composition.createdAt) }}</div>
        <div>Updated: {{ formatDate(composition.updatedAt) }}</div>
      </div>

      <!-- Actions -->
      <div class="flex gap-2 pt-2">
        <UButton
          v-if="showPlay && composition.audioFileUrl"
          icon="i-lucide-play"
          size="sm"
          color="primary"
          @click="$emit('play', composition.id)">
          Play
        </UButton>
        <UButton
          icon="i-lucide-edit"
          size="sm"
          color="neutral"
          variant="outline"
          @click="$emit('edit', composition.id)">
          Edit
        </UButton>
        <UButton
          icon="i-lucide-copy"
          size="sm"
          color="neutral"
          variant="outline"
          @click="$emit('duplicate', composition.id)">
          Duplicate
        </UButton>
        <UButton
          icon="i-lucide-trash-2"
          size="sm"
          color="error"
          variant="outline"
          @click="$emit('delete', composition.id)">
          Delete
        </UButton>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { MusicComposition } from "~/types";

interface Props {
  composition: MusicComposition;
  showPlay?: boolean;
}

defineProps<Props>();

defineEmits<{
  play: [id: string];
  edit: [id: string];
  delete: [id: string];
  duplicate: [id: string];
}>();

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
</script>
