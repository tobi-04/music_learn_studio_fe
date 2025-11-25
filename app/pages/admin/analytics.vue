<template>
  <AdminLayout page-title="Analytics">
    <div class="space-y-6">
      <h1 class="text-2xl font-bold">Analytics Dashboard</h1>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <USkeleton v-for="i in 4" :key="i" class="h-32" />
        </div>
        <USkeleton class="h-96" />
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <USkeleton class="h-96" />
          <USkeleton class="h-80" />
        </div>
      </div>

      <!-- Content -->
      <div v-else-if="analytics" class="space-y-6">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Total Revenue -->
          <UCard>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Total Revenue
                </p>
                <p class="text-2xl font-bold mt-1">
                  {{ formatCurrency(analytics.stats.totalRevenue) }}
                </p>
              </div>
              <div
                class="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <UIcon
                  name="i-lucide-dollar-sign"
                  class="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </UCard>

          <!-- Total Students -->
          <UCard>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Total Students
                </p>
                <p class="text-2xl font-bold mt-1">
                  {{ analytics.stats.totalStudents.toLocaleString() }}
                </p>
              </div>
              <div
                class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <UIcon
                  name="i-lucide-users"
                  class="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </UCard>

          <!-- Total Courses -->
          <UCard>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Total Courses
                </p>
                <p class="text-2xl font-bold mt-1">
                  {{ analytics.stats.totalCourses }}
                </p>
              </div>
              <div
                class="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <UIcon
                  name="i-lucide-book-open"
                  class="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </UCard>

          <!-- Active Enrollments -->
          <UCard>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Active Enrollments
                </p>
                <p class="text-2xl font-bold mt-1">
                  {{ analytics.stats.activeEnrollments }}
                </p>
              </div>
              <div
                class="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <UIcon
                  name="i-lucide-graduation-cap"
                  class="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </UCard>
        </div>

        <!-- Revenue Chart -->
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">Revenue Over Time</h2>
          </template>
          <RevenueChart :data="analytics.revenueOverTime" />
        </UCard>

        <!-- Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Popular Courses -->
          <UCard>
            <template #header>
              <h2 class="text-lg font-semibold">Most Popular Courses</h2>
            </template>
            <PopularCoursesChart :data="analytics.popularCourses" />
          </UCard>

          <!-- Student Growth -->
          <UCard>
            <template #header>
              <h2 class="text-lg font-semibold">Student Growth</h2>
            </template>
            <StudentGrowthChart :data="analytics.studentGrowth" />
          </UCard>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-12">
        <UIcon
          name="i-lucide-alert-circle"
          class="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p class="text-gray-500">Failed to load analytics data</p>
        <UButton class="mt-4" @click="loadAnalytics">Retry</UButton>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import type { AnalyticsResponse } from "~/types";
import { useAnalyticsApi } from "~/composables/api/useAnalyticsApi";

definePageMeta({
  middleware: ["admin"],
});

const analyticsApi = useAnalyticsApi();
const analytics = ref<AnalyticsResponse | null>(null);
const loading = ref(true);

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const loadAnalytics = async () => {
  try {
    loading.value = true;
    const response = await analyticsApi.getAnalytics();
    analytics.value = response.data;
  } catch (error) {
    console.error("Error loading analytics:", error);
    analytics.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadAnalytics();
});
</script>
