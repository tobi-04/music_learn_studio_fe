<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="border-muted border-b sticky top-0 z-10">
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
              to="/student/stats"
              class="text-gray-600 hover:text-primary-600">
              Statistics
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
          <h2 class="text-3xl font-bold">My Progress</h2>
          <p class="text-gray-600 mt-2">Track your learning journey</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-12">
          <UProgress animation="carousel" />
        </div>

        <template v-else>
          <!-- Overall Stats -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <UCard>
              <div class="text-center">
                <div class="text-3xl font-bold text-blue-600">
                  {{ stats.totalCoursesEnrolled }}
                </div>
                <div class="text-gray-600 text-sm mt-1">Enrolled Courses</div>
              </div>
            </UCard>
            <UCard>
              <div class="text-center">
                <div class="text-3xl font-bold text-green-600">
                  {{ stats.completedCourses }}
                </div>
                <div class="text-gray-600 text-sm mt-1">Completed Courses</div>
              </div>
            </UCard>
            <UCard>
              <div class="text-center">
                <div class="text-3xl font-bold text-primary-600">
                  {{ stats.totalChaptersCompleted }}
                </div>
                <div class="text-gray-600 text-sm mt-1">Chapters Completed</div>
              </div>
            </UCard>
            <UCard>
              <div class="text-center">
                <div class="text-3xl font-bold text-yellow-600">
                  {{ formatTime(stats.totalTimeSpentMinutes) }}
                </div>
                <div class="text-gray-600 text-sm mt-1">Learning Time</div>
              </div>
            </UCard>
          </div>

          <!-- Enrolled Courses Progress -->
          <UCard>
            <template #header>
              <h3 class="text-xl font-semibold">Course Progress</h3>
            </template>

            <div
              v-if="courseProgress.length === 0"
              class="text-center py-8 text-gray-500">
              <p>You haven't enrolled in any courses yet.</p>
              <UButton
                color="primary"
                class="mt-4"
                @click="navigateTo('/student/courses')">
                Browse Courses
              </UButton>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="course in courseProgress"
                :key="course.id"
                class="border rounded-lg p-6 hover:shadow-md transition-shadow border-muted">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h4 class="text-lg font-semibold mb-2">
                      {{ course.courseTitle }}
                    </h4>
                    <div class="flex items-center gap-4 text-sm text-gray-500">
                      <span class="flex items-center gap-1">
                        <UIcon name="i-heroicons-book-open" class="w-4 h-4" />
                        {{ course.completedChapters }}/{{
                          course.totalChapters
                        }}
                        chapters
                      </span>
                      <span v-if="course.completedAt" class="text-green-600">
                        ✓ Completed
                      </span>
                    </div>
                  </div>
                  <UButton
                    size="sm"
                    @click="
                      navigateTo(`/student/courses/${course.courseId}/learn`)
                    ">
                    {{ course.completedAt ? "Review" : "Continue" }}
                  </UButton>
                </div>

                <!-- Progress Bar -->
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Progress</span>
                    <span class="font-semibold text-primary-600">
                      {{ Math.round(course.progressPercentage) }}%
                    </span>
                  </div>
                  <UProgress
                    v-model="course.progressPercentage"
                    color="primary" />
                </div>

                <!-- Additional Info -->
                <div class="mt-4 flex gap-4 text-sm text-gray-500">
                  <span> Enrolled: {{ formatDate(course.enrolledAt) }} </span>
                  <span v-if="course.lastAccessedAt">
                    Last accessed: {{ formatDate(course.lastAccessedAt) }}
                  </span>
                </div>
              </div>
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
    console.error("Failed to load progress data:", error);
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

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script>
