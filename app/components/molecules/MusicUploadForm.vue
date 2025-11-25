<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Upload Music</h3>
        <UButton color="neutral" variant="ghost" @click="$emit('close')">
          <X class="w-5 h-5" />
        </UButton>
      </div>
    </template>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- File upload -->
      <div
        class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
        <input
          ref="fileInput"
          type="file"
          accept="audio/mp3,audio/mpeg"
          class="hidden"
          @change="handleFileChange" />

        <div v-if="!selectedFile" class="space-y-2">
          <Upload class="w-12 h-12 mx-auto text-gray-400" />
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Click to upload or drag and drop
          </p>
          <p class="text-xs text-gray-500">MP3 files only, max 50MB</p>
          <UButton color="primary" @click="() => fileInput?.click()">
            Select File
          </UButton>
        </div>

        <div v-else class="space-y-2">
          <Music class="w-12 h-12 mx-auto text-primary-500" />
          <p class="text-sm font-medium">{{ selectedFile.name }}</p>
          <p class="text-xs text-gray-500">
            {{ formatFileSize(selectedFile.size) }}
          </p>
          <UButton color="gray" variant="outline" size="sm" @click="clearFile">
            Change File
          </UButton>
        </div>
      </div>

      <!-- Title -->
      <UFormField label="Title" name="title" required>
        <UInput
          v-model="formData.title"
          placeholder="Enter track title"
          required />
      </UFormField>

      <!-- Description -->
      <UFormField label="Description" name="description">
        <UTextarea
          v-model="formData.description"
          placeholder="Describe your track..."
          :rows="3" />
      </UFormField>

      <!-- Genre -->
      <UFormField label="Genre" name="genre" required>
        <USelect
          v-model="formData.genre"
          :options="genreOptions"
          placeholder="Select genre" />
      </UFormField>

      <!-- Tags -->
      <UFormField label="Tags" name="tags">
        <UInput
          v-model="tagsInput"
          placeholder="e.g., piano, original, instrumental" />
      </UFormField>

      <!-- Upload progress -->
      <div v-if="uploading" class="space-y-2">
        <div class="flex items-center justify-between text-sm">
          <span>Uploading...</span>
          <span>{{ uploadProgress }}%</span>
        </div>
        <div
          class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            class="h-full bg-primary-500 transition-all"
            :style="{ width: `${uploadProgress}%` }" />
        </div>
      </div>

      <!-- Submit button -->
      <div class="flex justify-end gap-2">
        <UButton
          color="gray"
          variant="outline"
          @click="$emit('close')"
          :disabled="uploading">
          Cancel
        </UButton>
        <UButton
          type="submit"
          color="primary"
          :disabled="!selectedFile || !formData.title || uploading"
          :loading="uploading">
          <Upload class="w-4 h-4 mr-2" />
          Upload Track
        </UButton>
      </div>
    </form>
  </UCard>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Upload, Music, X } from "lucide-vue-next";

interface UploadFormData {
  title: string;
  description: string;
  genre: string;
}

const emit = defineEmits<{
  close: [];
  success: [];
}>();

const { uploadTrack } = useMusicApi();

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const uploading = ref(false);
const uploadProgress = ref(0);
const tagsInput = ref("");

const formData = ref<UploadFormData>({
  title: "",
  description: "",
  genre: "",
});

const genreOptions = [
  { label: "Classical", value: "Classical" },
  { label: "Jazz", value: "Jazz" },
  { label: "Pop", value: "Pop" },
  { label: "Rock", value: "Rock" },
  { label: "Electronic", value: "Electronic" },
  { label: "Hip Hop", value: "Hip Hop" },
  { label: "R&B", value: "R&B" },
  { label: "Country", value: "Country" },
  { label: "Other", value: "Other" },
];

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file && file.type.includes("audio")) {
    selectedFile.value = file;

    // Auto-fill title from filename if empty
    if (!formData.value.title) {
      formData.value.title = file.name.replace(/\.[^/.]+$/, "");
    }
  }
}

function clearFile() {
  selectedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
}

async function handleSubmit() {
  if (!selectedFile.value || !formData.value.title) return;

  uploading.value = true;
  uploadProgress.value = 0;

  try {
    // Simulate progress (in real implementation, use XMLHttpRequest for progress)
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10;
      }
    }, 200);

    const tags = tagsInput.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    // Get audio duration
    const audio = new Audio();
    const duration = await new Promise<number>((resolve) => {
      audio.addEventListener("loadedmetadata", () => {
        resolve(audio.duration / 60); // Convert to minutes
      });
      audio.src = URL.createObjectURL(selectedFile.value!);
    });

    await uploadTrack(selectedFile.value, {
      title: formData.value.title,
      description: formData.value.description,
      genre: formData.value.genre,
      tags,
      isPublic: true,
      duration,
      fileSize: selectedFile.value.size,
    });

    clearInterval(progressInterval);
    uploadProgress.value = 100;

    // Show success and close
    setTimeout(() => {
      emit("success");
      emit("close");
    }, 500);
  } catch (error) {
    console.error("Upload failed:", error);
    alert("Failed to upload track. Please try again.");
  } finally {
    uploading.value = false;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
</script>
