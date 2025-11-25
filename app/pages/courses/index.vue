<template>
  <PublicLayout>
    <div class="container mx-auto px-4 py-12">
      <div class="mb-8">
        <h1 class="text-4xl font-bold mb-4">Browse Courses</h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          Explore our collection of music courses and start your learning
          journey
        </p>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-4 mb-8">
        <div>
          <label class="block text-sm font-medium mb-2">Search</label>
          <UInput
            v-model="searchQuery"
            placeholder="Search courses..."
            icon="i-lucide-search"
            class="w-64" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Level</label>
          <USelect
            v-model="selectedLevel"
            :options="levelOptions"
            placeholder="All Levels"
            class="w-48" />
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <USkeleton v-for="i in 6" :key="i" class="h-80 rounded-lg" />
      </div>

      <!-- Course Grid -->
      <div
        v-else-if="courses.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UCard
          v-for="course in courses"
          :key="course.id"
          class="cursor-pointer hover:shadow-lg transition-shadow"
          @click="navigateTo(`/courses/${course.id}`)">
          <div
            class="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden">
            <img
              v-if="course.thumbnailUrl"
              :src="course.thumbnailUrl"
              :alt="course.title"
              class="w-full h-full object-cover" />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-4xl">
              🎵
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <UBadge
                :color="getLevelColor(course.level)"
                variant="subtle"
                class="capitalize">
                {{ course.level }}
              </UBadge>
              <div class="text-sm text-gray-500 flex items-center gap-1">
                <UIcon name="i-lucide-book-open" class="w-4 h-4" />
                <span>{{ course.totalChapters }} chapters</span>
              </div>
            </div>

            <h3 class="text-xl font-semibold line-clamp-2">
              {{ course.title }}
            </h3>

            <p
              v-if="course.description"
              class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {{ course.description }}
            </p>

            <div class="flex items-center justify-between pt-2">
              <div class="text-lg font-bold text-primary-600">
                {{
                  course.price && course.price > 0
                    ? formatCurrency(course.price)
                    : "Free"
                }}
              </div>
              <UButton
                color="primary"
                size="sm"
                trailing-icon="i-lucide-arrow-right"
                @click.stop="navigateTo(`/courses/${course.id}`)">
                View Course
              </UButton>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <UIcon
          name="i-lucide-search-x"
          class="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 class="text-xl font-semibold mb-2">No courses found</h3>
        <p class="text-gray-500">Try adjusting your filters or search query</p>
      </div>
    </div>
  </PublicLayout>
</template>

<script setup lang="ts">
import type { CourseResponse, CourseLevel } from "~/types";
import { usePublicCourseApi } from "~/composables/api/usePublicCourseApi";

const publicCourseApi = usePublicCourseApi();

const courses = ref<CourseResponse[]>([]);
const loading = ref(true);
const searchQuery = ref("");
const selectedLevel = ref<CourseLevel | "">("");

const levelOptions = [
  { label: "All Levels", value: "" },
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
];

const getLevelColor = (level: CourseLevel) => {
  const colors: Record<CourseLevel, string> = {
    beginner: "success",
    intermediate: "warning",
    advanced: "error",
  };
  return colors[level] || "neutral";
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const loadCourses = async () => {
  try {
    loading.value = true;
    const response = await publicCourseApi.getPublicCourses({
      search: searchQuery.value || undefined,
      level: selectedLevel.value || undefined,
      published: true,
    });
    courses.value = response.content;
  } catch (error) {
    console.error("Error loading courses:", error);
    courses.value = [];
  } finally {
    loading.value = false;
  }
};

// Watch filters
watch([searchQuery, selectedLevel], () => {
  loadCourses();
});

onMounted(() => {
  loadCourses();
});
</script>
