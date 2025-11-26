<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">
          {{ initialData ? "Edit Track" : "Upload Music" }}
        </h3>
        <UButton color="neutral" variant="ghost" @click="$emit('close')">
          <X class="w-5 h-5" />
        </UButton>
      </div>
    </template>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <!-- File upload (disabled in edit mode) -->
      <div
        v-if="!initialData"
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
          <UButton
            color="neutral"
            variant="outline"
            size="sm"
            @click="clearFile">
            Change File
          </UButton>
        </div>
      </div>

      <!-- File info display in edit mode -->
      <div v-else class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          <Music class="w-4 h-4 inline mr-2" />
          Audio file cannot be changed when editing
        </p>
      </div>

      <!-- Cover Image upload -->
      <div class="space-y-2">
        <label class="block text-sm font-medium">Cover Image (Optional)</label>
        <div class="flex items-center gap-4">
          <div
            v-if="imagePreviewUrl"
            class="w-16 h-16 rounded overflow-hidden bg-gray-100 border">
            <img
              :src="imagePreviewUrl"
              class="w-full h-full object-cover"
              alt="Preview" />
          </div>
          <div class="flex-1">
            <input
              ref="imageInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleImageChange" />
            <UButton
              color="neutral"
              variant="outline"
              size="sm"
              icon="i-lucide-image"
              @click="() => imageInput?.click()">
              {{ imagePreviewUrl ? "Change Cover" : "Upload Cover" }}
            </UButton>
            <span v-if="selectedImage" class="ml-2 text-sm text-gray-500">
              {{ selectedImage.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- Title -->
      <UFormField label="Title" name="title" required>
        <UInput
          v-model="formData.title"
          placeholder="Enter track title"
          required
          class="w-full" />
      </UFormField>

      <!-- Description -->
      <UFormField label="Description" name="description">
        <UTextarea
          v-model="formData.description"
          placeholder="Describe your track..."
          :rows="3"
          class="w-full" />
      </UFormField>

      <!-- Genre -->
      <UFormField label="Genre" name="genre" required>
        <USelect
          v-model="formData.genre"
          :items="genreOptions"
          placeholder="Select genre"
          class="w-full" />
      </UFormField>

      <!-- Tags -->
      <UFormField label="Tags" name="tags">
        <UInput
          v-model="tagsInput"
          placeholder="e.g., piano, original, instrumental"
          class="w-full" />
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
          color="neutral"
          variant="outline"
          :disabled="uploading"
          @click="$emit('close')">
          Cancel
        </UButton>
        <UButton
          type="submit"
          color="primary"
          :disabled="
            (!selectedFile && !initialData) || !formData.title || uploading
          "
          :loading="uploading">
          <Upload class="w-4 h-4 mr-2" />
          {{ initialData ? "Save Changes" : "Upload Track" }}
        </UButton>
      </div>
    </form>
  </UCard>
</template>

<script setup lang="ts">
import { Upload, Music, X } from "lucide-vue-next";
import type { MusicTrack } from "~/types/music";

interface UploadFormData {
  title: string;
  description: string;
  genre: string;
}

const props = defineProps<{
  initialData?: MusicTrack | null;
}>();

const emit = defineEmits<{
  close: [];
  success: [];
}>();

const { uploadTrack, updateTrack } = useMusicApi();

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

// Initialize form with existing data if editing
onMounted(() => {
  if (props.initialData) {
    formData.value.title = props.initialData.title;
    formData.value.description = props.initialData.description || "";
    formData.value.genre = props.initialData.genre || "";
    tagsInput.value = props.initialData.tags
      ? props.initialData.tags.join(", ")
      : "";
    if (props.initialData.coverImageUrl) {
      imagePreviewUrl.value = props.initialData.coverImageUrl;
    }
  }
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

const imageInput = ref<HTMLInputElement | null>(null);
const selectedImage = ref<File | null>(null);
const imagePreviewUrl = ref("");

function handleImageChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file && file.type.includes("image")) {
    selectedImage.value = file;
    imagePreviewUrl.value = URL.createObjectURL(file);
  }
}

async function handleSubmit() {
  if ((!selectedFile.value && !props.initialData) || !formData.value.title)
    return;

  uploading.value = true;
  uploadProgress.value = 0;

  try {
    // Simulate progress
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10;
      }
    }, 200);

    const tags = tagsInput.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    if (props.initialData) {
      // Update existing track
      await updateTrack(
        props.initialData.id,
        {
          title: formData.value.title,
          description: formData.value.description,
          genre: formData.value.genre,
          tags,
          isPublic: true,
        },
        selectedImage.value || undefined
      );
    } else {
      // Upload new track
      // Get audio duration
      const audio = new Audio();
      const duration = await new Promise<number>((resolve) => {
        audio.addEventListener("loadedmetadata", () => {
          resolve(audio.duration / 60); // Convert to minutes
        });
        audio.src = URL.createObjectURL(selectedFile.value!);
      });

      await uploadTrack(
        selectedFile.value!,
        {
          title: formData.value.title,
          description: formData.value.description,
          genre: formData.value.genre,
          tags,
          isPublic: true,
          duration,
          fileSize: selectedFile.value!.size,
        },
        selectedImage.value || undefined
      );
    }

    clearInterval(progressInterval);
    uploadProgress.value = 100;

    // Show success and close
    setTimeout(() => {
      emit("success");
      emit("close");
    }, 500);
  } catch (error) {
    console.error("Upload/Update failed:", error);
    alert("Failed to save track. Please try again.");
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
