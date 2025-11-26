<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="border-b sticky top-0 z-10 border-muted">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-primary-600">MusicLearn Studio</h1>
          <div class="flex items-center gap-4">
            <NuxtLink
              to="/student/courses"
              class="text-primary-600 font-medium">
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
          <h2 class="text-3xl font-bold">Browse Courses</h2>
          <p class="text-gray-600 mt-2">Discover and enroll in music courses</p>
        </div>

        <!-- Filters -->
        <UCard>
          <div class="flex gap-4">
            <USelect
              v-model="filters.level"
              :items="levelOptions"
              placeholder="All Levels"
              class="w-48" />
            <UInput
              v-model="filters.search"
              placeholder="Search courses..."
              icon="i-heroicons-magnifying-glass"
              class="flex-1" />
          </div>
        </UCard>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-12">
          <UProgress animation="carousel" />
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
            class="rounded-lg shadow hover:shadow-lg transition-shadow border border-muted">
            <!-- Course Image -->
            <div
              class="h-48 bg-linear-to-br from-primary-400 to-primary-600 rounded-t-lg flex items-center justify-center overflow-hidden">
              <img
                v-if="course.thumbnailUrl"
                :src="course.thumbnailUrl"
                :alt="course.title"
                class="w-full h-full object-cover" />
              <span v-else class="text-6xl">🎵</span>
            </div>

            <!-- Course Info -->
            <div class="p-6">
              <div class="flex items-start justify-between mb-3">
                <h3 class="text-xl font-semibold flex-1">{{ course.title }}</h3>
                <UBadge :color="getLevelColor(course.level)">
                  {{ course.level }}
                </UBadge>
              </div>

              <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                {{ course.description }}
              </p>

              <div class="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span class="flex items-center gap-1">
                  <span>📖</span>
                  {{ course.totalChapters || 0 }} chapters
                </span>
              </div>

              <!-- Price Display -->
              <div class="mb-4">
                <span
                  v-if="!course.price || course.price === 0"
                  class="text-green-600 font-bold text-lg">
                  Free
                </span>
                <span v-else class="text-primary-600 font-bold text-lg">
                  {{ formatPrice(course.price) }}
                </span>
              </div>

              <!-- Enrollment Status -->
              <div
                v-if="enrolledCourseIds.includes(course.id)"
                class="flex items-center justify-between">
                <UBadge color="success">Enrolled</UBadge>
                <UButton size="sm" @click="continueLearning(course.id)">
                  Continue Learning
                </UButton>
              </div>
              <div v-else>
                <!-- Free Course: Enroll directly -->
                <UButton
                  v-if="!course.price || course.price === 0"
                  color="primary"
                  block
                  :loading="enrollingCourseId === course.id"
                  @click="handleEnroll(course)">
                  Start Learning
                </UButton>
                <!-- Paid Course: Go to checkout -->
                <UButton
                  v-else
                  color="primary"
                  block
                  @click="handlePurchase(course)">
                  Purchase Course
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Purchase Modal -->
    <UModal v-model:open="showPurchaseModal">
      <template #header>
        <h3 class="text-lg font-semibold">Purchase Course</h3>
      </template>
      <template #body>
        <div v-if="selectedCourse" class="space-y-4 p-4">
          <div class="text-center">
            <h4 class="text-xl font-bold">{{ selectedCourse.title }}</h4>
            <p class="text-gray-600 mt-2">{{ selectedCourse.description }}</p>
          </div>

          <div class="border-t pt-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Price:</span>
              <span class="text-2xl font-bold text-primary-600">
                {{ formatPrice(selectedCourse.price || 0) }}
              </span>
            </div>
          </div>

          <div class="bg-yellow-50 p-4 rounded-lg">
            <p class="text-yellow-800 text-sm">
              <strong>Note:</strong> Payment integration coming soon. For demo
              purposes, clicking "Confirm Purchase" will enroll you immediately.
            </p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex gap-3 justify-end">
          <UButton
            color="neutral"
            variant="outline"
            @click="showPurchaseModal = false">
            Cancel
          </UButton>
          <UButton
            color="primary"
            :loading="enrollingCourseId === selectedCourse?.id"
            @click="confirmPurchase">
            Confirm Purchase
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useCourseStore } from "~/stores/admin/course";
import { useProgressApi } from "~/composables/useProgressApi";
import type { CourseResponse } from "~/types";

const courseStore = useCourseStore();
const progressApi = useProgressApi();
const toast = useToast();

const loading = ref(false);
const enrollingCourseId = ref<string | null>(null);
const enrolledCourseIds = ref<string[]>([]);
const showPurchaseModal = ref(false);
const selectedCourse = ref<CourseResponse | null>(null);

const filters = ref({
  level: "",
  search: "",
});

const levelOptions = [
  { label: "All Levels", value: "ALL" },
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
];

const filteredCourses = computed(() => {
  let courses = courseStore.courses.filter((c) => c.isPublished);

  if (filters.value.level && filters.value.level !== "ALL") {
    courses = courses.filter((c) => c.level === filters.value.level);
  }

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    courses = courses.filter(
      (c) =>
        c.title.toLowerCase().includes(search) ||
        (c.description && c.description.toLowerCase().includes(search))
    );
  }

  return courses;
});

onMounted(async () => {
  loading.value = true;
  try {
    await courseStore.fetchCourses({ page: 0, size: 100 });

    // Fetch enrolled courses from progress API
    const progressList = await progressApi.getAllProgress();
    enrolledCourseIds.value = progressList.map((p) => p.courseId);
  } catch (error) {
    console.error("Failed to load courses:", error);
  } finally {
    loading.value = false;
  }
});

const getLevelColor = (level: string) => {
  const colors: Record<string, "success" | "info" | "warning" | "neutral"> = {
    beginner: "success",
    intermediate: "info",
    advanced: "warning",
  };
  return colors[level.toLowerCase()] || "neutral";
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const handleEnroll = async (course: CourseResponse) => {
  // For free courses, enroll directly
  enrollingCourseId.value = course.id;
  try {
    await progressApi.enrollCourse(course.id);
    enrolledCourseIds.value.push(course.id);
    toast.add({
      title: "Enrolled successfully!",
      description: `You are now enrolled in "${course.title}"`,
      color: "success",
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to enroll";
    toast.add({
      title: "Enrollment failed",
      description: errorMessage,
      color: "error",
    });
  } finally {
    enrollingCourseId.value = null;
  }
};

const handlePurchase = (course: CourseResponse) => {
  selectedCourse.value = course;
  showPurchaseModal.value = true;
};

const confirmPurchase = async () => {
  if (!selectedCourse.value) return;

  // For demo: enroll directly after "purchase"
  enrollingCourseId.value = selectedCourse.value.id;
  try {
    await progressApi.enrollCourse(selectedCourse.value.id);
    enrolledCourseIds.value.push(selectedCourse.value.id);
    toast.add({
      title: "Purchase successful!",
      description: `You are now enrolled in "${selectedCourse.value.title}"`,
      color: "success",
    });
    showPurchaseModal.value = false;
    selectedCourse.value = null;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to process purchase";
    toast.add({
      title: "Purchase failed",
      description: errorMessage,
      color: "error",
    });
  } finally {
    enrollingCourseId.value = null;
  }
};

const continueLearning = (courseId: string) => {
  navigateTo(`/student/courses/${courseId}`);
};
</script>
