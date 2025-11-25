<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b sticky top-0 z-10">
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
            <div class="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
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
      <aside class="w-80 bg-white border-r overflow-y-auto">
        <div class="p-4 border-b">
          <h2 class="font-semibold text-lg">Course Content</h2>
        </div>

        <div class="p-4 space-y-2">
          <div
            v-for="(chapter, index) in chapters"
            :key="chapter.id"
            class="border rounded-lg overflow-hidden"
            :class="{
              'border-primary-500 bg-primary-50': currentChapterIndex === index,
            }">
            <button
              class="w-full p-3 text-left hover:bg-gray-50 transition-colors"
              @click="selectChapter(index)">
              <div class="flex items-center gap-3">
                <div
                  class="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm">
                  {{ index + 1 }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-sm truncate">
                    {{ chapter.title }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ chapter.durationMinutes }} min
                  </div>
                </div>
                <span
                  v-if="chapterProgress[chapter.id] === 100"
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
          <!-- Chapter Info -->
          <div v-if="currentChapter" class="mb-6">
            <h1 class="text-3xl font-bold mb-3">{{ currentChapter.title }}</h1>
            <p class="text-gray-600">{{ currentChapter.description }}</p>
          </div>

          <!-- Quiz Section -->
          <AppCard v-if="currentChapterQuizzes.length > 0">
            <template #header>
              <h2 class="text-xl font-semibold">Chapter Quizzes</h2>
            </template>

            <div class="space-y-3">
              <div
                v-for="quiz in currentChapterQuizzes"
                :key="quiz.id"
                class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div class="flex-1">
                  <h3 class="font-semibold">{{ quiz.title }}</h3>
                  <div class="flex gap-3 text-sm text-gray-500 mt-1">
                    <span>📝 {{ quiz.totalQuestions || 0 }} questions</span>
                    <span>⏱️ {{ quiz.timeLimitMinutes }} min</span>
                    <span>✓ {{ quiz.passingScore }}% to pass</span>
                  </div>
                </div>
                <UButton color="primary" @click="startQuiz(quiz.id)">
                  Start Quiz
                </UButton>
              </div>
            </div>
          </AppCard>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCourseStore } from "~/stores/admin/course";
import { useChapterStore } from "~/stores/admin/chapter";

import { useQuizStore } from "~/stores/admin/quiz";

const route = useRoute();
const router = useRouter();
const courseStore = useCourseStore();
const chapterStore = useChapterStore();

const quizStore = useQuizStore();

const courseId = route.params.id as string;
const course = ref(null);
const currentChapterIndex = ref(0);
const currentLessonIndex = ref(0);

// Progress tracking
const chapterProgress = ref<Record<string, number>>({});
const lessonCompleted = ref<Record<string, boolean>>({});

const chapters = computed(() =>
  chapterStore.chapters.filter((c) => c.isPublished)
);
const currentChapter = computed(
  () => chapters.value[currentChapterIndex.value]
);

const currentChapterQuizzes = computed(() =>
  quizStore.quizzes.filter((q) => q.isPublished)
);

const courseProgress = computed(() => {
  const totalChapters = chapters.value.length;
  if (totalChapters === 0) return 0;

  const completedChapters = Object.values(chapterProgress.value).filter(
    (p) => p === 100
  ).length;
  return Math.round((completedChapters / totalChapters) * 100);
});

onMounted(async () => {
  await courseStore.fetchCourseById(courseId);
  course.value = courseStore.currentCourse;

  await chapterStore.fetchChaptersByCourse(courseId);

  if (currentChapter.value) {
    await loadChapterContent(currentChapter.value.id);
  }
});

const loadChapterContent = async (chapterId: string) => {
  await quizStore.fetchQuizzesByChapter(chapterId);
};

const selectChapter = async (index: number) => {
  currentChapterIndex.value = index;
  currentLessonIndex.value = 0;

  if (currentChapter.value) {
    await loadChapterContent(currentChapter.value.id);
  }
};

const startQuiz = (quizId: string) => {
  alert(`Quiz feature coming soon! Quiz ID: ${quizId}`);
};

const { confirm } = useConfirm();

const exitCourse = async () => {
  if (
    await confirm("Are you sure you want to exit? Your progress will be saved.")
  ) {
    router.push(`/student/courses/${courseId}`);
  }
};
</script>
