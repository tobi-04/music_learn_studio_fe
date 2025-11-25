<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b sticky top-0 z-10">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-primary-600">MusicLearn Studio</h1>
          <div class="flex items-center gap-4">
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
            <AppAvatar :name="studentName" size="md" />
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <div class="space-y-6">
        <!-- Page Title -->
        <div>
          <h2 class="text-3xl font-bold">Browse Courses</h2>
          <p class="text-gray-600 mt-2">Discover and enroll in music courses</p>
        </div>

        <!-- Filters -->
        <AppCard>
          <div class="flex gap-4">
            <AppSelect
              v-model="filters.level"
              :options="levelOptions"
              placeholder="All Levels"
              class="w-48" />
            <AppInput
              v-model="filters.search"
              placeholder="Search courses..."
              icon="i-heroicons-magnifying-glass"
              class="flex-1" />
          </div>
        </AppCard>

        <!-- Loading State -->
        <div v-if="courseStore.loading" class="flex justify-center py-12">
          <AppSpinner size="lg" />
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredCourses.length === 0" class="text-center py-12">
          <p class="text-gray-500 text-lg">No courses found</p>
        </div>

        <!-- Course Grid -->
        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="course in filteredCourses"
            :key="course.id"
            class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
            @click="navigateTo(`/student/courses/${course.id}`)">
            <!-- Course Image Placeholder -->
            <div
              class="h-48 bg-gradient-to-br from-primary-400 to-primary-600 rounded-t-lg flex items-center justify-center">
              <span class="text-6xl">🎵</span>
            </div>

            <!-- Course Info -->
            <div class="p-6">
              <div class="flex items-start justify-between mb-3">
                <h3 class="text-xl font-semibold flex-1">{{ course.title }}</h3>
                <AppBadge :color="getLevelColor(course.level)">
                  {{ course.level }}
                </AppBadge>
              </div>

              <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                {{ course.description }}
              </p>

              <div class="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span class="flex items-center gap-1">
                  <span>📖</span>
                  {{ course.totalChapters || 0 }} chapters
                </span>
                <span class="flex items-center gap-1">
                  <span>⏱️</span>
                  {{ course.durationWeeks }} weeks
                </span>
              </div>

              <!-- Enrollment Status -->
              <div
                v-if="isEnrolled(course.id)"
                class="flex items-center justify-between">
                <AppBadge color="green">Enrolled</AppBadge>
                <UButton size="sm" @click.stop="continueLearning(course.id)">
                  Continue Learning
                </UButton>
              </div>
              <UButton
                v-else
                color="primary"
                block
                @click.stop="enrollCourse(course.id)">
                Enroll Now
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useCourseStore } from "~/stores/admin/course";
import type { CourseResponse } from "~/types";

const courseStore = useCourseStore();

const studentName = ref("Student");
const filters = ref({
  level: "",
  search: "",
});

const levelOptions = [
  { label: "All Levels", value: "" },
  { label: "Beginner", value: "BEGINNER" },
  { label: "Intermediate", value: "INTERMEDIATE" },
  { label: "Advanced", value: "ADVANCED" },
];

// Mock enrolled courses - in real app, fetch from backend
const enrolledCourseIds = ref<string[]>([]);

const filteredCourses = computed(() => {
  let courses = courseStore.courses.filter((c) => c.isPublished);

  if (filters.value.level) {
    courses = courses.filter((c) => c.level === filters.value.level);
  }

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    courses = courses.filter(
      (c) =>
        c.title.toLowerCase().includes(search) ||
        c.description.toLowerCase().includes(search)
    );
  }

  return courses;
});

onMounted(async () => {
  await courseStore.fetchCourses({ page: 0, size: 100 });
});

const getLevelColor = (level: string) => {
  const colors: Record<string, string> = {
    BEGINNER: "green",
    INTERMEDIATE: "blue",
    ADVANCED: "purple",
  };
  return colors[level] || "gray";
};

const isEnrolled = (courseId: string) => {
  return enrolledCourseIds.value.includes(courseId);
};

const enrollCourse = async (courseId: string) => {
  // In real app, call enrollment API
  enrolledCourseIds.value.push(courseId);
  alert("Successfully enrolled in course!");
};

const continueLearning = (courseId: string) => {
  navigateTo(`/student/courses/${courseId}/learn`);
};
</script>
