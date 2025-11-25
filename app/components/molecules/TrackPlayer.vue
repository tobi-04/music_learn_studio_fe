<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <UButton
          icon
          :color="isPlaying ? 'primary' : 'gray'"
          size="lg"
          @click="togglePlay">
          <Pause v-if="isPlaying" class="w-5 h-5" />
          <Play v-else class="w-5 h-5" />
        </UButton>

        <div class="min-w-0 flex-1">
          <p class="text-xs text-gray-500">
            {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <UButton icon color="gray" variant="ghost" @click="$emit('toggleLike')">
          <Heart
            :class="{ 'fill-red-500 text-red-500': isLiked }"
            class="w-5 h-5" />
        </UButton>

        <UButton icon color="gray" variant="ghost" @click="$emit('share')">
          <Share2 class="w-5 h-5" />
        </UButton>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="group cursor-pointer" @click="seek">
      <div
        class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          class="h-full bg-primary-500 transition-all"
          :style="{ width: `${progress}%` }" />
      </div>
    </div>

    <!-- Volume control -->
    <div class="flex items-center gap-2">
      <Volume2 class="w-4 h-4 text-gray-500" />
      <input
        type="range"
        min="0"
        max="100"
        :value="volume"
        class="flex-1 h-1 accent-primary-500"
        @input="updateVolume" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Play, Pause, Heart, Share2, Volume2 } from "lucide-vue-next";
import { ref, computed } from "vue";

interface Props {
  isPlaying?: boolean;
  isLiked?: boolean;
  currentTime?: number;
  duration?: number;
  volume?: number;
}

const props = withDefaults(defineProps<Props>(), {
  isPlaying: false,
  isLiked: false,
  currentTime: 0,
  duration: 0,
  volume: 80,
});

defineEmits<{
  togglePlay: [];
  toggleLike: [];
  share: [];
  seek: [time: number];
  volumeChange: [volume: number];
}>();

const progress = computed(() => {
  if (props.duration === 0) return 0;
  return (props.currentTime / props.duration) * 100;
});

function togglePlay() {
  // Emit handled by parent
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function seek(event: MouseEvent) {
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const percentage = (event.clientX - rect.left) / rect.width;
  // Emit seek event - parent will handle
}

function updateVolume(event: Event) {
  const target = event.target as HTMLInputElement;
  const volume = parseInt(target.value, 10);
  // Emit volume change - parent will handle
}
</script>
