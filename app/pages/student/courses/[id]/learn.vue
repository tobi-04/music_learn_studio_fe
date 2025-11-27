<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="border-muted border-b sticky top-0 z-10 bg-muted">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <UButton
              variant="ghost"
              icon="i-heroicons-arrow-left"
              @click="exitCourse">
              Exit Course
            </UButton>
            <div>
              <h1 class="font-semibold">{{ course?.title }}</h1>
              <p class="text-xs text-gray-500">{{ currentChapter?.title }}</p>
            </div>
          </div>

          <!-- Progress -->
          <div class="flex items-center gap-4">
            <div class="text-sm text-gray-600">
              Progress: {{ courseProgress }}%
            </div>
            <div
              class="w-48 h-2 border border-muted rounded-full overflow-hidden">
              <div
                class="h-full bg-primary-600 transition-all"
                :style="{ width: `${courseProgress}%` }" />
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="flex h-[calc(100vh-64px)]">
      <!-- Sidebar - Chapter Navigation -->
      <aside class="w-80 border-muted border-r overflow-y-auto">
        <div class="p-4 border-b border-muted">
          <h2 class="font-semibold text-lg">Course Content</h2>
        </div>

        <div class="p-4 space-y-2">
          <div
            v-for="(chapter, index) in chapters"
            :key="chapter.id"
            class="border border-muted rounded-lg overflow-hidden"
            :class="{
              'border-primary': currentChapterIndex === index,
            }">
            <button
              class="w-full p-3 text-left hover:bg-gray-50 transition-colors"
              @click="selectChapter(index)">
              <div class="flex items-center gap-3">
                <div
                  class="shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm">
                  {{ index + 1 }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-sm truncate">
                    {{ chapter.title }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ chapter.durationMinutes || 0 }} min
                  </div>
                </div>
                <span
                  v-if="completedChapters.has(chapter.id)"
                  class="text-green-500"
                  >✓</span
                >
              </div>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto">
        <div class="max-w-4xl mx-auto p-8">
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-12">
            <UProgress animation="carousel" />
            <p class="text-gray-500 mt-4">Loading chapter content...</p>
          </div>

          <!-- Chapter Content -->
          <div v-else-if="currentChapter">
            <!-- Chapter Info -->
            <div class="mb-6">
              <h1 class="text-3xl font-bold mb-3">
                {{ currentChapter.title }}
              </h1>
              <p v-if="currentChapter.description" class="text-gray-600">
                {{ currentChapter.description }}
              </p>
            </div>

            <!-- Video Player (if videoUrl exists) -->
            <UCard v-if="currentChapter.videoUrl" class="mb-6">
              <template #header>
                <h2 class="text-xl font-semibold flex items-center gap-2">
                  <UIcon name="i-heroicons-play-circle" />
                  Video Lesson
                </h2>
              </template>

              <div class="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  v-if="youtubeEmbedUrl"
                  :src="youtubeEmbedUrl"
                  class="w-full h-full"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen />
                <video
                  v-else
                  :src="currentChapter.videoUrl"
                  controls
                  class="w-full h-full" />
              </div>
            </UCard>

            <!-- Markdown Content -->
            <UCard v-if="currentChapter.contentMarkdown" class="mb-6">
              <template #header>
                <h2 class="text-xl font-semibold flex items-center gap-2">
                  <UIcon name="i-heroicons-document-text" />
                  Lesson Content
                </h2>
              </template>

              <!-- eslint-disable-next-line vue/no-v-html -->
              <div class="prose prose-lg max-w-none" v-html="renderedContent" />
            </UCard>

            <!-- No Content Fallback -->
            <UCard
              v-if="!currentChapter.videoUrl && !currentChapter.contentMarkdown"
              class="mb-6">
              <div class="text-center py-8 text-gray-500">
                <UIcon
                  name="i-heroicons-document"
                  class="w-12 h-12 mx-auto mb-4" />
                <p>Content for this chapter is being prepared...</p>
              </div>
            </UCard>

            <!-- Chapter Actions -->
            <UCard class="mb-6">
              <div class="flex justify-between items-center">
                <div class="text-sm text-gray-500">
                  <span v-if="currentChapter.durationMinutes">
                    Duration: {{ currentChapter.durationMinutes }} minutes
                  </span>
                </div>
                <UButton
                  v-if="!completedChapters.has(currentChapter.id)"
                  color="primary"
                  :loading="markingComplete"
                  @click="markChapterComplete">
                  <UIcon name="i-heroicons-check" class="mr-1" />
                  Mark as Complete
                </UButton>
                <UBadge v-else color="success" size="lg">
                  <UIcon name="i-heroicons-check-circle" class="mr-1" />
                  Completed
                </UBadge>
              </div>
            </UCard>

            <!-- Navigation Buttons -->
            <div class="flex justify-between">
              <UButton
                v-if="currentChapterIndex > 0"
                variant="outline"
                @click="selectChapter(currentChapterIndex - 1)">
                ← Previous Chapter
              </UButton>
              <div v-else />

              <UButton
                v-if="currentChapterIndex < chapters.length - 1"
                color="primary"
                @click="selectChapter(currentChapterIndex + 1)">
                Next Chapter →
              </UButton>
              <UButton
                v-else-if="courseProgress === 100"
                color="success"
                @click="completeCourse">
                Complete Course 🎉
              </UButton>
            </div>
          </div>

          <!-- No Chapters -->
          <div v-else class="text-center py-12">
            <p class="text-gray-500">No chapters available for this course.</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { marked } from "marked";
import { useCourseStore } from "~/stores/admin/course";
import { useChapterStore } from "~/stores/admin/chapter";
import { useProgressApi } from "~/composables/useProgressApi";
import useConfirmDialog from "~/composables/useConfirmDialog";
import type { CourseResponse } from "~/types";

const route = useRoute();
const router = useRouter();
const courseStore = useCourseStore();
const chapterStore = useChapterStore();
const progressApi = useProgressApi();
const confirmDialog = useConfirmDialog();
const toast = useToast();

const courseId = route.params.id as string;
const course = ref<CourseResponse | null>(null);
const currentChapterIndex = ref(0);
const loading = ref(true);
const markingComplete = ref(false);

// Track completed chapters
const completedChapters = ref<Set<string>>(new Set());

const chapters = computed(() =>
  chapterStore.chapters
    .filter((c) => c.isPublished)
    .sort((a, b) => a.orderIndex - b.orderIndex)
);

const currentChapter = computed(
  () => chapters.value[currentChapterIndex.value]
);

const courseProgress = computed(() => {
  const totalChapters = chapters.value.length;
  if (totalChapters === 0) return 0;

  return Math.round((completedChapters.value.size / totalChapters) * 100);
});

// Render markdown content
const renderedContent = computed(() => {
  if (!currentChapter.value?.contentMarkdown) return "";
  return marked(currentChapter.value.contentMarkdown);
});

// Extract YouTube video ID and create embed URL
const getYouTubeEmbedUrl = (url: string | undefined): string | null => {
  if (!url) return null;

  // Match various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }

  return null;
};

const youtubeEmbedUrl = computed(
  () => getYouTubeEmbedUrl(currentChapter.value?.videoUrl) || undefined
);

onMounted(async () => {
  loading.value = true;
  try {
    await courseStore.fetchCourseById(courseId);
    course.value = courseStore.currentCourse;

    await chapterStore.fetchChaptersByCourse(courseId);

    // Load saved progress from backend
    await loadProgress();
  } catch (error) {
    console.error("Failed to load course:", error);
    toast.add({
      title: "Error",
      description: "Failed to load course content",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
});

const loadProgress = async () => {
  try {
    const progress = await progressApi.getCourseProgress(courseId);
    if (progress) {
      // Calculate which chapters are completed based on percentage
      const numCompleted = Math.floor(
        (progress.progressPercentage / 100) * chapters.value.length
      );
      chapters.value.slice(0, numCompleted).forEach((ch) => {
        completedChapters.value.add(ch.id);
      });
    }
  } catch {
    // Not enrolled yet or no progress - that's ok
    console.log("No existing progress found");
  }
};

const selectChapter = (index: number) => {
  currentChapterIndex.value = index;
};

const markChapterComplete = async () => {
  if (!currentChapter.value) return;

  markingComplete.value = true;
  try {
    await progressApi.markChapterComplete(currentChapter.value.id);
    completedChapters.value.add(currentChapter.value.id);

    toast.add({
      title: "Progress saved!",
      description: `Chapter "${currentChapter.value.title}" completed`,
      color: "success",
    });

    // Auto advance to next chapter after a short delay
    if (currentChapterIndex.value < chapters.value.length - 1) {
      setTimeout(() => {
        selectChapter(currentChapterIndex.value + 1);
      }, 1000);
    }
  } catch (error) {
    console.error("Failed to save progress:", error);
    toast.add({
      title: "Error",
      description: "Failed to save progress. Please try again.",
      color: "error",
    });
  } finally {
    markingComplete.value = false;
  }
};

const completeCourse = () => {
  toast.add({
    title: "Congratulations! 🎉",
    description: "You have completed this course!",
    color: "success",
  });
  router.push(`/student/courses/${courseId}`);
};

const exitCourse = async () => {
  const result = await confirmDialog.open({
    title: "Exit Course",
    description: "Are you sure you want to exit? Your progress has been saved.",
    confirmLabel: "Exit",
    cancelLabel: "Stay",
  });

  if (result) {
    router.push(`/student/courses/${courseId}`);
  }
};
</script>
