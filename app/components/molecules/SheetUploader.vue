<template>
  <div class="sheet-uploader">
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
            accept="application/pdf,image/png,image/jpeg"
            class="hidden"
            @change="handleFileChange" />

          <div v-if="!file && !currentSheetUrl">
            <div class="text-4xl mb-2">📄</div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Click to upload or drag & drop
            </p>
            <p class="text-xs text-gray-500 mt-1">PDF or Image (Max 10MB)</p>
          </div>

          <div v-else class="space-y-2">
            <div class="text-3xl">✅</div>
            <p class="text-sm font-medium">
              {{ file?.name || "Current Sheet File" }}
            </p>
            <p v-if="file" class="text-xs text-gray-500">
              {{ formatFileSize(file.size) }}
            </p>
            <UButton size="sm" color="red" @click.stop="clearFile">
              Remove
            </UButton>
          </div>
        </div>

        <!-- Preview -->
        <div
          v-if="previewUrl || currentSheetUrl"
          class="mt-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div class="flex items-center justify-between">
            <span class="text-sm">Sheet Music Preview</span>
            <a
              :href="previewUrl || currentSheetUrl"
              target="_blank"
              class="text-primary text-sm hover:underline">
              Open in new tab
            </a>
          </div>
          <div v-if="isImage" class="mt-3">
            <img
              :src="previewUrl || currentSheetUrl"
              alt="Sheet Preview"
              class="max-w-full h-auto rounded" />
          </div>
          <div v-else class="mt-3 text-center text-sm text-gray-500">
            PDF Preview (Click "Open in new tab" to view)
          </div>
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
const props = defineProps<{
  label?: string;
  error?: string;
  required?: boolean;
  currentSheetUrl?: string;
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

const isImage = computed(() => {
  if (file.value) {
    return file.value.type.startsWith("image/");
  }
  if (props.currentSheetUrl) {
    return /\.(png|jpg|jpeg)$/i.test(props.currentSheetUrl);
  }
  return false;
});

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
  const validTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
  ];
  if (!validTypes.includes(selectedFile.type)) {
    alert("Please select a PDF or Image file (PNG, JPG)");
    return;
  }

  // Validate file size (10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (selectedFile.size > maxSize) {
    alert("File size must be less than 10MB");
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
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>
