<template>
  <div class="audio-player">
    <audio
      ref="audioElement"
      :src="src"
      @loadedmetadata="onLoadedMetadata"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      class="hidden"></audio>

    <div
      class="flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <!-- Play/Pause Button -->
      <UButton
        :icon="isPlaying ? 'i-heroicons-pause' : 'i-heroicons-play'"
        size="lg"
        color="primary"
        @click="togglePlayPause" />

      <!-- Time Display -->
      <div class="text-sm text-gray-600 dark:text-gray-400 min-w-[100px]">
        {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
      </div>

      <!-- Progress Bar -->
      <div class="flex-1">
        <input
          type="range"
          min="0"
          :max="duration"
          :value="currentTime"
          @input="onSeek"
          class="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer" />
      </div>

      <!-- Volume Control -->
      <div class="flex items-center gap-2">
        <UButton
          :icon="
            volume === 0
              ? 'i-heroicons-speaker-x-mark'
              : 'i-heroicons-speaker-wave'
          "
          size="sm"
          variant="ghost"
          @click="toggleMute" />
        <input
          type="range"
          min="0"
          max="100"
          :value="volume"
          @input="onVolumeChange"
          class="w-20 h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  src: string;
}>();

const audioElement = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(100);
const previousVolume = ref(100);

const togglePlayPause = () => {
  if (!audioElement.value) return;

  if (isPlaying.value) {
    audioElement.value.pause();
  } else {
    audioElement.value.play();
  }
  isPlaying.value = !isPlaying.value;
};

const onLoadedMetadata = () => {
  if (audioElement.value) {
    duration.value = audioElement.value.duration;
  }
};

const onTimeUpdate = () => {
  if (audioElement.value) {
    currentTime.value = audioElement.value.currentTime;
  }
};

const onEnded = () => {
  isPlaying.value = false;
  currentTime.value = 0;
};

const onSeek = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const newTime = parseFloat(target.value);
  if (audioElement.value) {
    audioElement.value.currentTime = newTime;
    currentTime.value = newTime;
  }
};

const onVolumeChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const newVolume = parseFloat(target.value);
  volume.value = newVolume;
  if (audioElement.value) {
    audioElement.value.volume = newVolume / 100;
  }
};

const toggleMute = () => {
  if (volume.value === 0) {
    volume.value = previousVolume.value;
  } else {
    previousVolume.value = volume.value;
    volume.value = 0;
  }
  if (audioElement.value) {
    audioElement.value.volume = volume.value / 100;
  }
};

const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// Watch for src changes
watch(
  () => props.src,
  () => {
    isPlaying.value = false;
    currentTime.value = 0;
    duration.value = 0;
  }
);
</script>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgb(var(--color-primary-500));
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgb(var(--color-primary-500));
  cursor: pointer;
  border: none;
}
</style>
