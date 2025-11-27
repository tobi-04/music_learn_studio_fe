<template>
  <AdminLayout page-title="Course Details">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold">{{ course?.title }}</h1>
          <p class="text-gray-500">{{ course?.description }}</p>
        </div>
        <div class="flex items-center gap-3">
          <UButton variant="outline" @click="router.push('/admin/courses')">
            Back to Courses
          </UButton>
          <UButton
            color="primary"
            @click="router.push(`/admin/courses/${courseId}/edit`)">
            Edit Course
          </UButton>
        </div>
      </div>

      <!-- Course Info Card -->
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">Course Information</h2>
        </template>

        <div class="grid grid-cols-2 gap-6">
          <div>
            <label class="text-sm text-gray-500">Level</label>
            <p class="font-medium">{{ course?.level }}</p>
          </div>
          <div>
            <label class="text-sm text-gray-500">Duration</label>
            <p class="font-medium">{{ course?.durationWeeks }} weeks</p>
          </div>
          <div>
            <label class="text-sm text-gray-500">Status</label>
            <UBadge :color="course?.isPublished ? 'green' : 'gray'">
              {{ course?.isPublished ? "Published" : "Draft" }}
            </UBadge>
          </div>
          <div>
            <label class="text-sm text-gray-500">Total Chapters</label>
            <p class="font-medium">{{ course?.totalChapters || 0 }}</p>
          </div>
        </div>
      </UCard>

      <!-- Chapters Card -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">Chapters</h2>
            <UButton
              size="sm"
              @click="router.push(`/admin/courses/${courseId}/chapters`)">
              Manage Chapters
            </UButton>
          </div>
        </template>

        <div v-if="chapterStore.loading" class="text-center py-8">
          <AppSpinner />
        </div>

        <div
          v-else-if="chapterStore.chapters.length === 0"
          class="text-center py-8 text-gray-500">
          No chapters yet. Click "Manage Chapters" to add some.
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="(chapter, index) in chapterStore.chapters"
            :key="chapter.id"
            class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
            <div class="flex items-center gap-4 flex-1">
              <!-- YouTube Video Preview -->
              <div
                v-if="getYouTubeVideoId(chapter.videoUrl)"
                class="flex-shrink-0">
                <iframe
                  :src="`https://www.youtube.com/embed/${getYouTubeVideoId(
                    chapter.videoUrl
                  )}`"
                  class="w-40 h-[90px] rounded border border-gray-200"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  loading="lazy" />
              </div>

              <div class="text-xl font-bold text-gray-400">{{ index + 1 }}</div>
              <div class="flex-1">
                <h3 class="font-semibold">{{ chapter.title }}</h3>
                <div class="flex gap-4 text-xs text-gray-500 mt-1">
                  <span class="flex items-center gap-1">
                    <UIcon name="i-lucide-clock" class="w-3 h-3" />
                    {{ chapter.durationMinutes }} min
                  </span>
                </div>
              </div>
            </div>
            <UBadge :color="chapter.isPublished ? 'green' : 'gray'">
              {{ chapter.isPublished ? "Published" : "Draft" }}
            </UBadge>
          </div>
        </div>
      </UCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { useCourseStore } from "~/stores/admin/course";
import { useChapterStore } from "~/stores/admin/chapter";

const route = useRoute();
const router = useRouter();
const courseStore = useCourseStore();
const chapterStore = useChapterStore();

const courseId = route.params.id as string;
const course = ref(null);

onMounted(async () => {
  await Promise.all([
    courseStore.fetchCourseById(courseId),
    chapterStore.fetchChaptersByCourse(courseId),
  ]);
  course.value = courseStore.currentCourse;
});

/**
 * Extract YouTube video ID from various YouTube URL formats
 * Supports: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
 */
const getYouTubeVideoId = (url?: string): string | null => {
  if (!url) return null;

  try {
    // Match various YouTube URL patterns
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/, // youtube.com/watch?v=ID
      /(?:youtu\.be\/)([a-zA-Z0-9_-]+)/, // youtu.be/ID
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/, // youtube.com/embed/ID
      /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]+)/, // youtube.com/v/ID
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
  } catch (error) {
    console.error("Error parsing YouTube URL:", error);
  }

  return null;
};
</script>
