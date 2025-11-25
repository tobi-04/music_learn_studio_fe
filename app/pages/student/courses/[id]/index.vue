<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b sticky top-0 z-10">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <UButton
              variant="ghost"
              icon="i-heroicons-arrow-left"
              @click="router.back()">
              Back
            </UButton>
            <h1 class="text-2xl font-bold text-primary-600">
              MusicLearn Studio
            </h1>
          </div>
          <AppAvatar :name="studentName" size="md" />
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="courseStore.loading" class="flex justify-center py-12">
      <AppSpinner size="lg" />
    </div>

    <!-- Course Content -->
    <main v-else-if="course" class="container mx-auto px-4 py-8">
      <div class="space-y-6">
        <!-- Course Header -->
        <div class="bg-white rounded-lg shadow-lg p-8">
          <div class="flex items-start justify-between mb-6">
            <div class="flex-1">
              <h1 class="text-4xl font-bold mb-3">{{ course.title }}</h1>
              <p class="text-gray-600 text-lg">{{ course.description }}</p>
            </div>
            <AppBadge :color="getLevelColor(course.level)" size="lg">
              {{ course.level }}
            </AppBadge>
          </div>

          <div class="grid grid-cols-3 gap-6 mb-6">
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600">
                {{ course.totalChapters || 0 }}
              </div>
              <div class="text-gray-500 text-sm">Chapters</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600">
                {{ course.durationWeeks }}
              </div>
              <div class="text-gray-500 text-sm">Weeks</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600">
                {{ enrollmentProgress }}%
              </div>
              <div class="text-gray-500 text-sm">Progress</div>
            </div>
          </div>

          <UButton
            v-if="!isEnrolled"
            color="primary"
            size="lg"
            block
            @click="handleEnroll">
            Enroll in This Course
          </UButton>
          <UButton
            v-else
            color="primary"
            size="lg"
            block
            @click="startLearning">
            Start Learning
          </UButton>
        </div>

        <!-- Course Curriculum -->
        <AppCard>
          <template #header>
            <h2 class="text-2xl font-semibold">Course Curriculum</h2>
          </template>

          <div v-if="chapterStore.loading" class="text-center py-8">
            <AppSpinner />
          </div>

          <div
            v-else-if="chapters.length === 0"
            class="text-center py-8 text-gray-500">
            No chapters available yet
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="(chapter, index) in chapters"
              :key="chapter.id"
              class="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div class="flex items-start gap-4">
                <!-- Chapter Number -->
                <div
                  class="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-lg">
                  {{ index + 1 }}
                </div>

                <!-- Chapter Info -->
                <div class="flex-1">
                  <h3 class="text-lg font-semibold mb-2">
                    {{ chapter.title }}
                  </h3>
                  <p class="text-gray-600 text-sm mb-3">
                    {{ chapter.description }}
                  </p>

                  <div class="flex items-center gap-4 text-sm text-gray-500">
                    <span class="flex items-center gap-1">
                      <span>⏱️</span>
                      {{ chapter.durationMinutes }} min
                    </span>
                  </div>
                </div>

                <!-- Lock Icon for Unenrolled -->
                <div v-if="!isEnrolled" class="flex-shrink-0 text-gray-400">
                  <span class="text-2xl">🔒</span>
                </div>
              </div>
            </div>
          </div>
        </AppCard>
      </div>
    </main>

    <!-- Not Found -->
    <div v-else class="text-center py-12">
      <p class="text-gray-500 text-lg">Course not found</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCourseStore } from "~/stores/admin/course";
import { useChapterStore } from "~/stores/admin/chapter";

const route = useRoute();
const router = useRouter();
const courseStore = useCourseStore();
const chapterStore = useChapterStore();

const courseId = route.params.id as string;
const studentName = ref("Student");
const course = ref(null);
const isEnrolled = ref(false);
const enrollmentProgress = ref(0);

const chapters = computed(() =>
  chapterStore.chapters.filter((c) => c.isPublished)
);

onMounted(async () => {
  await Promise.all([
    courseStore.fetchCourseById(courseId),
    chapterStore.fetchChaptersByCourse(courseId),
  ]);
  course.value = courseStore.currentCourse;
});

const getLevelColor = (level: string) => {
  const colors: Record<string, string> = {
    BEGINNER: "green",
    INTERMEDIATE: "blue",
    ADVANCED: "purple",
  };
  return colors[level] || "gray";
};

const handleEnroll = () => {
  // In real app, call enrollment API
  isEnrolled.value = true;
  alert("Successfully enrolled in course!");
};

const startLearning = () => {
  navigateTo(`/student/courses/${courseId}/learn`);
};
</script>
