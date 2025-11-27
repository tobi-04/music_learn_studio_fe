<template>
  <div class="audio-uploader">
    <UForm :label="label" :error="error" :required="required">
      <div class="space-y-3">
        <!-- File Input -->
        <div
          class="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
          :class="{
            'border-red-500': error,
            'border-gray-300 dark:border-gray-700': !error,
          }"
          @click="triggerFileInput"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop">
          <input
            ref="fileInput"
            type="file"
            accept="audio/mpeg,audio/mp3"
            class="hidden"
            @change="handleFileChange" />

          <div v-if="!file && !currentAudioUrl">
            <div class="mb-2 flex justify-center">
              <Music :size="48" class="text-gray-400" />
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Click to upload or drag & drop
            </p>
            <p class="text-xs text-gray-500 mt-1">MP3 (Max 50MB)</p>
          </div>

          <div v-else class="space-y-2">
            <div class="flex justify-center">
              <CheckCircle :size="32" class="text-green-500" />
            </div>
            <p class="text-sm font-medium">
              {{ file?.name || "Current Audio File" }}
            </p>
            <p v-if="file" class="text-xs text-gray-500">
              {{ formatFileSize(file.size) }}
            </p>
            <UButton size="sm" color="red" @click.stop="clearFile">
              Remove
            </UButton>
          </div>
        </div>

        <!-- Audio Preview -->
        <div v-if="previewUrl || currentAudioUrl" class="mt-3">
          <audio :src="previewUrl || currentAudioUrl" controls class="w-full" />
        </div>

        <!-- Upload Progress -->
        <div v-if="uploadProgress !== null" class="space-y-1">
          <div
            class="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>Uploading...</span>
            <span>{{ uploadProgress }}%</span>
          </div>
          <UProgress :value="uploadProgress" />
        </div>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { Music, CheckCircle } from "lucide-vue-next";

const _props = defineProps<{
  label?: string;
  error?: string;
  required?: boolean;
  currentAudioUrl?: string;
  uploadProgress?: number | null;
}>();

const emit = defineEmits<{
  "file-selected": [file: File];
  "file-removed": [];
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const file = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const isDragging = ref(false);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const selectedFile = target.files?.[0];
  if (selectedFile) {
    validateAndSetFile(selectedFile);
  }
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  const droppedFile = event.dataTransfer?.files[0];
  if (droppedFile) {
    validateAndSetFile(droppedFile);
  }
};

const validateAndSetFile = (selectedFile: File) => {
  // Validate file type
  if (!selectedFile.type.startsWith("audio/")) {
    alert("Please select an audio file (MP3)");
    return;
  }

  // Validate file size (50MB)
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (selectedFile.size > maxSize) {
    alert("File size must be less than 50MB");
    return;
  }

  file.value = selectedFile;
  previewUrl.value = URL.createObjectURL(selectedFile);
  emit("file-selected", selectedFile);
};

const clearFile = () => {
  file.value = null;
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
  }
  if (fileInput.value) {
    fileInput.value.value = "";
  }
  emit("file-removed");
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>
