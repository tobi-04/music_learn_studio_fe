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
              class="text-primary-600 font-medium">
              My Courses
            </NuxtLink>
            <NuxtLink
              to="/student/progress"
              class="text-gray-600 hover:text-primary-600">
              My Progress
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
          <h2 class="text-3xl font-bold">My Courses</h2>
          <p class="text-gray-600 mt-2">
            Your enrolled courses and learning progress
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-12">
          <UProgress animation="carousel" />
        </div>

        <!-- Empty State -->
        <div v-else-if="enrollments.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">📚</div>
          <p class="text-gray-500 text-lg mb-4">
            You haven't enrolled in any courses yet
          </p>
          <UButton color="primary" @click="navigateTo('/student/courses')">
            Browse Courses
          </UButton>
        </div>

        <!-- Enrolled Courses Grid -->
        <div v-else class="space-y-6">
          <!-- Statistics -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UCard>
              <div class="text-center">
                <div class="text-3xl font-bold text-primary-600">
                  {{ enrollments.length }}
                </div>
                <div class="text-gray-600">Enrolled Courses</div>
              </div>
            </UCard>
            <UCard>
              <div class="text-center">
                <div class="text-3xl font-bold text-green-600">
                  {{ completedCount }}
                </div>
                <div class="text-gray-600">Completed</div>
              </div>
            </UCard>
            <UCard>
              <div class="text-center">
                <div class="text-3xl font-bold text-blue-600">
                  {{ inProgressCount }}
                </div>
                <div class="text-gray-600">In Progress</div>
              </div>
            </UCard>
          </div>

          <!-- Course Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="enrollment in enrollments"
              :key="enrollment.id"
              class="border border-muted rounded-lg shadow hover:shadow-lg transition-shadow">
              <!-- Course Image -->
              <div
                class="h-48 bg-linear-to-br from-primary-400 to-primary-600 rounded-t-lg flex items-center justify-center overflow-hidden relative">
                <img
                  v-if="enrollment.course?.thumbnailUrl"
                  :src="enrollment.course.thumbnailUrl"
                  :alt="enrollment.course?.title"
                  class="w-full h-full object-cover" />
                <span v-else class="text-6xl">🎵</span>

                <!-- Completed Badge -->
                <div
                  v-if="enrollment.completedAt"
                  class="absolute top-2 right-2">
                  <UBadge color="success" size="lg">
                    <UIcon name="i-heroicons-check-circle" class="mr-1" />
                    Completed
                  </UBadge>
                </div>
              </div>

              <!-- Course Info -->
              <div class="p-6">
                <div class="flex items-start justify-between mb-3">
                  <h3 class="text-xl font-semibold flex-1">
                    {{ enrollment.course?.title || "Course" }}
                  </h3>
                  <UBadge
                    v-if="enrollment.course"
                    :color="getLevelColor(enrollment.course.level)">
                    {{ enrollment.course.level }}
                  </UBadge>
                </div>

                <p
                  v-if="enrollment.course?.description"
                  class="text-gray-600 text-sm mb-4 line-clamp-2">
                  {{ enrollment.course.description }}
                </p>

                <!-- Progress Bar -->
                <div class="mb-4">
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-600">Progress</span>
                    <span class="font-medium">{{ enrollment.progress }}%</span>
                  </div>
                  <UProgress v-model="enrollment.progress" color="primary" />
                </div>

                <!-- Enrolled Date -->
                <div class="text-sm text-gray-500 mb-4">
                  Enrolled: {{ formatDate(enrollment.enrolledAt) }}
                </div>

                <!-- Action Button -->
                <UButton
                  color="primary"
                  block
                  @click="
                    navigateTo(`/student/courses/${enrollment.courseId}`)
                  ">
                  {{
                    enrollment.completedAt
                      ? "Review Course"
                      : enrollment.progress > 0
                      ? "Continue Learning"
                      : "Start Learning"
                  }}
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useCourseStore } from "~/stores/admin/course";
import { useProgressApi } from "~/composables/useProgressApi";
import type { UserCourseProgressResponse } from "~/types/progress";
import type { CourseResponse } from "~/types";

const progressApi = useProgressApi();
const courseStore = useCourseStore();

interface EnrollmentWithCourse extends UserCourseProgressResponse {
  course?: CourseResponse;
  progress: number; // Alias for progressPercentage
}

const loading = ref(true);
const enrollments = ref<EnrollmentWithCourse[]>([]);

const completedCount = computed(
  () => enrollments.value.filter((e) => e.completedAt).length
);

const inProgressCount = computed(
  () =>
    enrollments.value.filter((e) => !e.completedAt && e.progressPercentage > 0)
      .length
);

onMounted(async () => {
  try {
    // Get progress list
    const progressList = await progressApi.getAllProgress();

    // Fetch courses to get course details
    await courseStore.fetchCourses({ page: 0, size: 100 });

    // Map progress with course details
    enrollments.value = progressList.map((p) => ({
      ...p,
      progress: p.progressPercentage,
      course: courseStore.courses.find((c) => c.id === p.courseId),
    }));
  } catch (error) {
    console.error("Failed to load enrollments:", error);
  } finally {
    loading.value = false;
  }
});

const getLevelColor = (
  level: string
): "success" | "info" | "warning" | "neutral" => {
  const colors: Record<string, "success" | "info" | "warning" | "neutral"> = {
    beginner: "success",
    intermediate: "info",
    advanced: "warning",
  };
  return colors[level.toLowerCase()] || "neutral";
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script>
