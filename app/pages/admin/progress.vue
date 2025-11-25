<template>
  <AdminLayout page-title="Progress Reports">
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">Báo cáo tiến độ</h1>
      </div>

      <!-- Overall Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Tổng học viên"
          :value="stats.totalStudents"
          icon="i-lucide-users"
          color="blue" />
        <StatCard
          label="Bài học hoàn thành"
          :value="stats.completedLessons"
          icon="i-lucide-check-circle"
          color="green" />
        <StatCard
          label="Giờ học trung bình"
          :value="stats.avgHours"
          icon="i-lucide-clock"
          color="primary" />
        <StatCard
          label="Điểm quiz trung bình"
          :value="`${stats.avgQuizScore}%`"
          icon="i-lucide-award"
          color="yellow" />
      </div>

      <!-- Course Progress -->
      <AppCard>
        <template #header>
          <h2 class="text-lg font-semibold">Tiến độ theo khóa học</h2>
        </template>

        <div v-if="loading" class="text-center py-8">
          <AppSpinner />
        </div>

        <div v-else-if="courseProgress.length === 0" class="text-center py-8">
          <p class="text-gray-500">Chưa có dữ liệu tiến độ</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="course in courseProgress"
            :key="course.id"
            class="border rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-semibold">{{ course.name }}</h3>
              <AppBadge color="blue">
                {{ course.enrolledStudents }} học viên
              </AppBadge>
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Tiến độ hoàn thành</span>
                <span class="font-medium">{{ course.completionRate }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-primary-600 h-2 rounded-full transition-all"
                  :style="{ width: `${course.completionRate}%` }" />
              </div>
            </div>
          </div>
        </div>
      </AppCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
interface CourseProgress {
  id: string;
  name: string;
  enrolledStudents: number;
  completionRate: number;
}

definePageMeta({
  middleware: ["auth", "admin"],
  layout: false,
});

const loading = ref(false);

const stats = ref({
  totalStudents: 0,
  completedLessons: 0,
  avgHours: 0,
  avgQuizScore: 0,
});

const courseProgress = ref<CourseProgress[]>([]);

// Load progress data on mount
onMounted(async () => {
  loading.value = true;
  try {
    // TODO: Call API to get progress data
    // const response = await useProgressApi().getOverallProgress();
    // stats.value = response.data.stats;
    // courseProgress.value = response.data.courses;
    courseProgress.value = [];
  } catch (error) {
    console.error("Error loading progress:", error);
  } finally {
    loading.value = false;
  }
});
</script>
