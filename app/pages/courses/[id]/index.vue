<template>
  <PublicLayout>
    <div v-if="loading" class="container mx-auto px-4 py-12">
      <USkeleton class="h-96 mb-8" />
      <USkeleton class="h-64" />
    </div>

    <div v-else-if="course" class="container mx-auto px-4 py-12">
      <!-- Hero Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <!-- Course Info -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Thumbnail -->
          <div
            class="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
            <img
              v-if="course.thumbnailUrl"
              :src="course.thumbnailUrl"
              :alt="course.title"
              class="w-full h-full object-cover" />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-6xl">
              🎵
            </div>
          </div>

          <!-- Title and Description -->
          <div>
            <div class="flex items-center gap-3 mb-4">
              <UBadge
                :color="getLevelColor(course.level)"
                variant="subtle"
                class="capitalize text-sm">
                {{ course.level }}
              </UBadge>
              <div class="text-sm text-gray-500 flex items-center gap-1">
                <UIcon name="i-lucide-book-open" class="w-4 h-4" />
                <span>{{ course.totalChapters }} chapters</span>
              </div>
            </div>

            <h1 class="text-4xl font-bold mb-4">{{ course.title }}</h1>
            <p class="text-lg text-gray-600 dark:text-gray-400">
              {{ course.description || "No description available" }}
            </p>
          </div>
        </div>

        <!-- CTA Card -->
        <div class="lg:col-span-1">
          <UCard class="sticky top-24">
            <div class="space-y-6">
              <!-- Price -->
              <div class="text-center py-4 border-b">
                <div class="text-3xl font-bold text-primary-600">
                  {{ isPaidCourse ? formatCurrency(course.price!) : "Free" }}
                </div>
                <p v-if="isPaidCourse" class="text-sm text-gray-500 mt-1">
                  One-time payment
                </p>
              </div>

              <!-- CTA Button -->
              <div>
                <ClientOnly>
                  <template v-if="!isAuthenticated">
                    <UButton block size="lg" @click="navigateTo('/auth/login')">
                      Sign in to
                      {{ isPaidCourse ? "Purchase" : "Start Learning" }}
                    </UButton>
                    <p class="text-xs text-center text-gray-500 mt-2">
                      Create a free account to access this course
                    </p>
                  </template>
                  <template v-else-if="isEnrolled">
                    <UButton
                      block
                      size="lg"
                      color="success"
                      @click="goToFirstChapter">
                      Continue Learning
                    </UButton>
                    <p
                      class="text-xs text-center text-green-600 dark:text-green-400 mt-2">
                      ✓ You're enrolled in this course
                    </p>
                  </template>
                  <template v-else>
                    <UButton
                      v-if="!isPaidCourse"
                      block
                      size="lg"
                      :loading="enrolling"
                      @click="handleEnroll">
                      Start Learning
                    </UButton>
                    <UButton
                      v-else
                      block
                      size="lg"
                      :loading="purchasing"
                      @click="handlePurchase">
                      Purchase Course
                    </UButton>
                  </template>
                </ClientOnly>
              </div>

              <!-- Course Stats -->
              <div class="space-y-3 pt-4 border-t">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400"
                    >Chapters:</span
                  >
                  <span class="font-semibold">{{ course.totalChapters }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Level:</span>
                  <span class="font-semibold capitalize">{{
                    course.level
                  }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Created:</span>
                  <span class="font-semibold">{{
                    formatDate(course.createdAt)
                  }}</span>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Chapters List -->
      <div>
        <h2 class="text-2xl font-bold mb-6">Course Content</h2>
        <div class="space-y-3">
          <UCard
            v-for="(chapter, index) in course.chapters"
            :key="chapter.id"
            class="hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4 flex-1">
                <div
                  class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-semibold text-sm">
                  {{ index + 1 }}
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold">{{ chapter.title }}</h3>
                  <p
                    v-if="chapter.description"
                    class="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                    {{ chapter.description }}
                  </p>
                </div>
              </div>

              <!-- Lock Icon for Paid Course if Not Enrolled -->
              <div class="flex items-center gap-2">
                <UIcon
                  v-if="isPaidCourse && !isEnrolled"
                  name="i-lucide-lock"
                  class="w-5 h-5 text-gray-400" />
                <UButton
                  v-else-if="isEnrolled"
                  size="sm"
                  variant="ghost"
                  @click="
                    navigateTo(
                      `/student/courses/${course.id}/chapters/${chapter.id}`
                    )
                  ">
                  View
                </UButton>
              </div>
            </div>
          </UCard>

          <!-- Empty State -->
          <div
            v-if="!course.chapters || course.chapters.length === 0"
            class="text-center py-12 border rounded-lg">
            <UIcon
              name="i-lucide-folder-open"
              class="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p class="text-gray-500">No chapters available yet</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="container mx-auto px-4 py-12 text-center">
      <UIcon
        name="i-lucide-alert-circle"
        class="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <h2 class="text-2xl font-bold mb-2">Course Not Found</h2>
      <p class="text-gray-500 mb-6">
        The course you're looking for doesn't exist or has been removed.
      </p>
      <UButton @click="navigateTo('/courses')">Browse All Courses</UButton>
    </div>
  </PublicLayout>
</template>

<script setup lang="ts">
import type { CourseWithDetailsResponse, CourseLevel } from "~/types";
import { usePublicCourseApi } from "~/composables/api/usePublicCourseApi";

const route = useRoute();
const authStore = useAuthStore();
const publicCourseApi = usePublicCourseApi();

const course = ref<CourseWithDetailsResponse | null>(null);
const loading = ref(true);
const isEnrolled = ref(false);
const enrolling = ref(false);
const purchasing = ref(false);

const isAuthenticated = computed(() => authStore.isAuthenticated);
const isPaidCourse = computed(
  () => course.value?.price && course.value.price > 0
);

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

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const loadCourse = async () => {
  try {
    loading.value = true;
    const courseId = route.params.id as string;
    const response = await publicCourseApi.getPublicCourseDetails(courseId);
    course.value = response.data;

    // Check enrollment if authenticated
    if (isAuthenticated.value && authStore.user) {
      isEnrolled.value = await publicCourseApi.checkEnrollment(
        courseId,
        authStore.user.id
      );
    }
  } catch (error) {
    console.error("Error loading course:", error);
    course.value = null;
  } finally {
    loading.value = false;
  }
};

const handleEnroll = async () => {
  if (!course.value || !authStore.user) return;

  try {
    enrolling.value = true;
    await publicCourseApi.enrollInCourse(course.value.id, authStore.user.id);
    isEnrolled.value = true;

    // Show success toast
    useToast().add({
      title: "Enrolled Successfully!",
      description: "You can now access all course content",
      color: "success",
    });

    // Navigate to first chapter
    goToFirstChapter();
  } catch (error) {
    console.error("Error enrolling:", error);
    useToast().add({
      title: "Enrollment Failed",
      description: "Please try again later",
      color: "error",
    });
  } finally {
    enrolling.value = false;
  }
};

const handlePurchase = async () => {
  // TODO: Implement payment flow
  purchasing.value = true;

  useToast().add({
    title: "Payment Coming Soon",
    description: "Payment integration will be implemented soon",
    color: "info",
  });

  setTimeout(() => {
    purchasing.value = false;
  }, 1000);
};

const goToFirstChapter = () => {
  if (
    course.value &&
    course.value.chapters &&
    course.value.chapters.length > 0
  ) {
    const firstChapter = course.value.chapters[0];
    navigateTo(
      `/student/courses/${course.value.id}/chapters/${firstChapter.id}`
    );
  }
};

onMounted(() => {
  loadCourse();
});

// Reload on auth change
watch(
  () => authStore.isAuthenticated,
  () => {
    loadCourse();
  }
);
</script>
