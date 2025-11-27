<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="border-muted border-b sticky top-0 z-10 bg-muted">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-primary-600">MusicLearn Studio</h1>
          <div class="flex items-center gap-4">
            <NuxtLink
              to="/student/courses"
              class="text-gray-600 hover:text-primary-600">
              Browse Courses
            </NuxtLink>
            <NuxtLink
              to="/student/courses/my-courses"
              class="text-gray-600 hover:text-primary-600">
              My Courses
            </NuxtLink>
            <NuxtLink
              to="/student/progress"
              class="text-gray-600 hover:text-primary-600">
              My Progress
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <div class="space-y-6">
        <!-- Page Title -->
        <div>
          <h2 class="text-3xl font-bold">My Statistics</h2>
          <p class="text-gray-600 mt-2">
            Detailed insights into your learning progress
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-12">
          <UProgress animation="carousel" />
        </div>

        <template v-else>
          <!-- Overall Stats Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <UCard class="text-center">
              <div class="text-4xl font-bold text-blue-600 mb-2">
                {{ stats.totalCoursesEnrolled }}
              </div>
              <div class="text-gray-600">Courses Enrolled</div>
            </UCard>

            <UCard class="text-center">
              <div class="text-4xl font-bold text-green-600 mb-2">
                {{ stats.completedCourses }}
              </div>
              <div class="text-gray-600">Courses Completed</div>
            </UCard>

            <UCard class="text-center">
              <div class="text-4xl font-bold text-primary-600 mb-2">
                {{ stats.totalChaptersCompleted }}
              </div>
              <div class="text-gray-600">Chapters Completed</div>
            </UCard>

            <UCard class="text-center">
              <div class="text-4xl font-bold text-yellow-600 mb-2">
                {{ stats.completionRate }}%
              </div>
              <div class="text-gray-600">Completion Rate</div>
            </UCard>
          </div>

          <!-- Learning Time -->
          <UCard>
            <template #header>
              <h3 class="text-xl font-semibold">Learning Summary</h3>
            </template>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center p-4 bg-muted rounded-lg">
                <div class="text-3xl font-bold text-primary-600 mb-2">
                  {{ formatTime(stats.totalTimeSpentMinutes) }}
                </div>
                <div class="text-gray-600">Total Learning Time</div>
              </div>

              <div class="text-center p-4 bg-muted rounded-lg">
                <div class="text-3xl font-bold text-blue-600 mb-2">
                  {{ stats.inProgressCourses }}
                </div>
                <div class="text-gray-600">Courses In Progress</div>
              </div>

              <div class="text-center p-4 bg-muted rounded-lg">
                <div class="text-3xl font-bold text-green-600 mb-2">
                  {{ averageProgressPerCourse }}%
                </div>
                <div class="text-gray-600">Avg Progress per Course</div>
              </div>
            </div>
          </UCard>

          <!-- Course Progress Details -->
          <UCard>
            <template #header>
              <h3 class="text-xl font-semibold">Course Details</h3>
            </template>

            <div
              v-if="courseProgress.length === 0"
              class="text-center py-8 text-gray-500">
              <p>No courses to display.</p>
              <UButton
                color="primary"
                class="mt-4"
                @click="navigateTo('/student/courses')">
                Start Learning
              </UButton>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="course in courseProgress"
                :key="course.id"
                class="flex items-center justify-between p-4 border border-muted rounded-lg">
                <div class="flex-1">
                  <h4 class="font-semibold">{{ course.courseTitle }}</h4>
                  <p class="text-sm text-gray-500">
                    {{ course.completedChapters }}/{{ course.totalChapters }}
                    chapters
                  </p>
                </div>

                <div class="flex items-center gap-6">
                  <div class="text-center">
                    <div
                      class="text-2xl font-bold"
                      :class="getProgressColor(course.progressPercentage)">
                      {{ Math.round(course.progressPercentage) }}%
                    </div>
                    <div class="text-xs text-gray-500">Progress</div>
                  </div>

                  <div class="text-center">
                    <UBadge :color="course.completedAt ? 'success' : 'info'">
                      {{ course.completedAt ? "Completed" : "In Progress" }}
                    </UBadge>
                  </div>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Empty State for New Users -->
          <UCard v-if="stats.totalCoursesEnrolled === 0">
            <div class="text-center py-8">
              <div class="text-6xl mb-4">📚</div>
              <h3 class="text-xl font-semibold mb-2">
                Start Your Learning Journey
              </h3>
              <p class="text-gray-600 mb-4">
                Enroll in courses to start tracking your progress and
                statistics.
              </p>
              <UButton color="primary" @click="navigateTo('/student/courses')">
                Browse Courses
              </UButton>
            </div>
          </UCard>
        </template>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useProgressApi } from "~/composables/useProgressApi";
import type {
  UserCourseProgressResponse,
  StudentStatsResponse,
} from "~/types/progress";

const progressApi = useProgressApi();

const loading = ref(true);
const courseProgress = ref<UserCourseProgressResponse[]>([]);
const stats = ref<StudentStatsResponse>({
  totalCoursesEnrolled: 0,
  completedCourses: 0,
  inProgressCourses: 0,
  totalChaptersCompleted: 0,
  totalTimeSpentMinutes: 0,
  completionRate: 0,
});

const averageProgressPerCourse = computed(() => {
  if (courseProgress.value.length === 0) return 0;
  const total = courseProgress.value.reduce(
    (sum, c) => sum + c.progressPercentage,
    0
  );
  return Math.round(total / courseProgress.value.length);
});

onMounted(async () => {
  await loadData();
});

const loadData = async () => {
  loading.value = true;
  try {
    const [progressData, statsData] = await Promise.all([
      progressApi.getAllProgress(),
      progressApi.getStudentStats(),
    ]);
    courseProgress.value = progressData;
    stats.value = statsData;
  } catch (error) {
    console.error("Failed to load stats:", error);
  } finally {
    loading.value = false;
  }
};

const formatTime = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

const getProgressColor = (progress: number): string => {
  if (progress >= 80) return "text-green-600";
  if (progress >= 50) return "text-blue-600";
  if (progress >= 25) return "text-yellow-600";
  return "text-gray-600";
};
</script>
