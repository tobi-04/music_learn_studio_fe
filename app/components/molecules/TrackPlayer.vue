<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <UButton
          color="primary"
          variant="ghost"
          size="lg"
          @click="$emit('togglePlay')">
          <component :is="isPlaying ? Pause : Play" class="w-8 h-8" />
        </UButton>

        <div class="min-w-0 flex-1">
          <p class="text-xs text-gray-500">
            {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <UButton color="neutral" variant="ghost" @click="$emit('toggleLike')">
          <Heart
            :class="{ 'fill-red-500 text-red-500': isLiked }"
            class="w-5 h-5" />
        </UButton>
        <UButton
          :color="isLooping ? 'primary' : 'neutral'"
          variant="ghost"
          @click="$emit('toggleLoop')">
          <Repeat class="w-5 h-5" />
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
      <USlider v-model="localVolume" :min="0" :max="100" class="flex-1" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Play, Pause, Heart, Volume2, Repeat } from "lucide-vue-next";

interface Props {
  isPlaying?: boolean;
  isLiked?: boolean;
  isLooping?: boolean;
  currentTime?: number;
  duration?: number;
  volume?: number;
}

const props = withDefaults(defineProps<Props>(), {
  isPlaying: false,
  isLiked: false,
  isLooping: false,
  currentTime: 0,
  duration: 0,
  volume: 80,
});

const emit = defineEmits<{
  togglePlay: [];
  toggleLike: [];
  toggleLoop: [];
  share: [];
  seek: [time: number];
  volumeChange: [volume: number];
}>();

const localVolume = ref(props.volume);

watch(
  () => props.volume,
  (newVal) => {
    localVolume.value = newVal;
  }
);

watch(localVolume, (newVal) => {
  emit("volumeChange", newVal);
});

const progress = computed(() => {
  if (props.duration === 0) return 0;
  return (props.currentTime / props.duration) * 100;
});

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function seek(event: MouseEvent) {
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const percentage = (event.clientX - rect.left) / rect.width;
  const seekTime = percentage * props.duration;
  emit("seek", seekTime);
}
</script>
