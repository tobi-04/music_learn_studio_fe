<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b sticky top-0 z-10">
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
          <h2 class="text-3xl font-bold">My Progress</h2>
          <p class="text-gray-600 mt-2">Track your learning journey</p>
        </div>

        <!-- Overall Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            label="Enrolled Courses"
            :value="stats.enrolledCourses"
            icon="i-lucide-book-open"
            color="blue" />
          <StatCard
            label="Completed Chapters"
            :value="stats.completedChapters"
            icon="i-lucide-check-circle"
            color="green" />
          <StatCard
            label="Learning Hours"
            :value="stats.learningHours"
            icon="i-lucide-clock"
            color="primary" />
          <StatCard
            label="Quiz Score Avg"
            :value="`${stats.averageQuizScore}%`"
            icon="i-lucide-award"
            color="yellow" />
        </div>

        <!-- Enrolled Courses Progress -->
        <AppCard>
          <template #header>
            <h3 class="text-xl font-semibold">Course Progress</h3>
          </template>

          <div v-if="loading" class="text-center py-8">
            <AppSpinner />
          </div>

          <div
            v-else-if="enrolledCourses.length === 0"
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
              v-for="course in enrolledCourses"
              :key="course.id"
              class="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <h4 class="text-lg font-semibold mb-2">{{ course.title }}</h4>
                  <div class="flex items-center gap-4 text-sm text-gray-500">
                    <span class="flex items-center gap-1">
                      <UIcon name="i-lucide-book-marked" class="w-4 h-4" />
                      {{ course.totalChapters }} chapters
                    </span>
                    <span class="flex items-center gap-1">
                      <UIcon name="i-lucide-clock" class="w-4 h-4" />
                      {{ course.durationWeeks }} weeks
                    </span>
                    <AppBadge :color="getLevelColor(course.level)">
                      {{ course.level }}
                    </AppBadge>
                  </div>
                </div>
                <UButton
                  size="sm"
                  @click="navigateTo(`/student/courses/${course.id}/learn`)">
                  Continue
                </UButton>
              </div>

              <!-- Progress Bar -->
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Progress</span>
                  <span class="font-semibold text-primary-600"
                    >{{ course.progress }}%</span
                  >
                </div>
                <div
                  class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-primary-600 transition-all rounded-full"
                    :style="{ width: `${course.progress}%` }" />
                </div>
              </div>

              <!-- Chapter Progress Details -->
              <div class="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div class="text-gray-500">Chapters</div>
                  <div class="font-semibold">
                    {{ course.completedChapters }}/{{ course.totalChapters }}
                  </div>
                </div>
                <div>
                  <div class="text-gray-500">Quizzes</div>
                  <div class="font-semibold">
                    {{ course.completedQuizzes }}/{{ course.totalQuizzes }}
                  </div>
                </div>
                <div>
                  <div class="text-gray-500">Time Spent</div>
                  <div class="font-semibold">{{ course.timeSpentHours }}h</div>
                </div>
              </div>
            </div>
          </div>
        </AppCard>

        <!-- Recent Activity -->
        <AppCard>
          <template #header>
            <h3 class="text-xl font-semibold">Recent Activity</h3>
          </template>

          <div class="space-y-3">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50">
              <div
                class="shrink-0 w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                <UIcon :name="activity.icon" class="w-5 h-5" />
              </div>
              <div class="flex-1">
                <p class="font-medium">{{ activity.title }}</p>
                <p class="text-sm text-gray-500">{{ activity.description }}</p>
              </div>
              <div class="text-xs text-gray-400">{{ activity.timeAgo }}</div>
            </div>
          </div>
        </AppCard>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const studentName = ref("Student");
const loading = ref(false);

const stats = ref({
  enrolledCourses: 3,
  completedChapters: 12,
  learningHours: 24,
  averageQuizScore: 87,
});

// Mock data - in real app, fetch from backend
const enrolledCourses = ref([
  {
    id: "1",
    title: "Piano Fundamentals",
    level: "BEGINNER",
    totalChapters: 10,
    completedChapters: 6,
    totalQuizzes: 8,
    completedQuizzes: 5,
    durationWeeks: 8,
    progress: 60,
    timeSpentHours: 12,
  },
  {
    id: "2",
    title: "Guitar Mastery",
    level: "INTERMEDIATE",
    totalChapters: 15,
    completedChapters: 3,
    totalQuizzes: 12,
    completedQuizzes: 2,
    durationWeeks: 12,
    progress: 20,
    timeSpentHours: 8,
  },
  {
    id: "3",
    title: "Music Theory Advanced",
    level: "ADVANCED",
    totalChapters: 8,
    completedChapters: 3,
    totalQuizzes: 10,
    completedQuizzes: 3,
    durationWeeks: 6,
    progress: 37,
    timeSpentHours: 4,
  },
]);

const recentActivities = ref([
  {
    id: "1",
    icon: "i-lucide-check-circle",
    title: "Completed Chapter 6",
    description: "Piano Fundamentals - Chord Progressions",
    timeAgo: "2 hours ago",
  },
  {
    id: "2",
    icon: "i-lucide-file-text",
    title: "Quiz Score: 90%",
    description: "Piano Fundamentals - Chapter 6 Quiz",
    timeAgo: "3 hours ago",
  },
  {
    id: "3",
    icon: "i-lucide-music",
    title: "Started New Lesson",
    description: "Guitar Mastery - Barre Chords",
    timeAgo: "1 day ago",
  },
  {
    id: "4",
    icon: "i-lucide-check-circle",
    title: "Completed Chapter 3",
    description: "Music Theory Advanced - Harmonization",
    timeAgo: "2 days ago",
  },
]);

const getLevelColor = (level: string) => {
  const colors: Record<string, string> = {
    BEGINNER: "green",
    INTERMEDIATE: "blue",
    ADVANCED: "purple",
  };
  return colors[level] || "gray";
};
</script>
