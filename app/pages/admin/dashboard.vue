<template>
  <AdminLayout page-title="Dashboard">
    <div class="space-y-6">
      <h1 class="text-2xl font-bold">Welcome to MusicLearn Studio</h1>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          label="Total Courses"
          :value="stats.totalCourses"
          icon="i-lucide-book-open"
          color="blue" />
        <StatCard
          label="Total Chapters"
          :value="stats.totalChapters"
          icon="i-lucide-book-marked"
          color="green" />
        <StatCard
          label="Quizzes"
          :value="stats.totalQuizzes"
          icon="i-lucide-file-text"
          color="yellow" />
      </div>

      <!-- Quick Actions -->
      <AppCard>
        <template #header>
          <h2 class="text-lg font-semibold">Quick Actions</h2>
        </template>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <UButton
            color="primary"
            block
            icon="i-lucide-plus"
            @click="navigateTo('/admin/courses/create')">
            New Course
          </UButton>
          <UButton
            block
            icon="i-lucide-graduation-cap"
            @click="navigateTo('/admin/courses')">
            Manage Courses
          </UButton>
          <UButton
            block
            icon="i-lucide-users"
            @click="navigateTo('/admin/students')">
            View Students
          </UButton>
          <UButton
            block
            icon="i-lucide-bar-chart"
            @click="navigateTo('/admin/progress')">
            Progress Reports
          </UButton>
        </div>
      </AppCard>

      <!-- Recent Courses -->
      <AppCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">Recent Courses</h2>
            <NuxtLink
              to="/admin/courses"
              class="text-sm text-primary-600 hover:underline">
              View All
            </NuxtLink>
          </div>
        </template>

        <div
          v-if="courseStore.loading"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CourseCardSkeleton v-for="i in 3" :key="i" />
        </div>
        <div
          v-else-if="recentCourses.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CourseCard
            v-for="course in recentCourses"
            :key="course.id"
            :course="course"
            @click="handleCourseClick(course)" />
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          No courses yet. Create your first course!
        </div>
      </AppCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import type { CourseResponse } from "~/types";
import { useCourseStore } from "~/stores/admin/course";

definePageMeta({
  middleware: ["admin"],
});

const courseStore = useCourseStore();

const stats = ref({
  totalCourses: 0,
  totalChapters: 0,
  totalQuizzes: 0,
});

const recentCourses = computed(() => {
  return courseStore.courses.slice(0, 6);
});

const handleCourseClick = (course: CourseResponse) => {
  try {
    if (course && course.id) {
      navigateTo(`/admin/courses/${course.id}/chapters`);
    }
  } catch (error) {
    console.error("Error navigating to course:", error);
  }
};

onMounted(async () => {
  try {
    await courseStore.fetchCourses({ page: 0, size: 6 });

    // Calculate stats from courses
    stats.value.totalCourses = courseStore.courses.length;
    stats.value.totalChapters = courseStore.courses.reduce(
      (sum, c) => sum + (c.totalChapters || 0),
      0
    );
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  }
});
</script>
