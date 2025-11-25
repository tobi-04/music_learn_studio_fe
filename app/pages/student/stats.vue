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
              to="/student/progress"
              class="text-gray-600 hover:text-primary-600">
              My Progress
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
          <h2 class="text-3xl font-bold">My Statistics</h2>
          <p class="text-gray-600 mt-2">
            Detailed insights into your learning progress
          </p>
        </div>

        <!-- Time Period Filter -->
        <div class="flex justify-end">
          <AppSelect
            v-model="selectedPeriod"
            :options="periodOptions"
            class="w-48" />
        </div>

        <!-- Overall Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AppCard class="text-center">
            <div class="text-4xl font-bold text-blue-600 mb-2">
              {{ stats.totalLessons }}
            </div>
            <div class="text-gray-600">Lessons Completed</div>
            <div class="text-sm text-green-600 mt-1">
              +{{ stats.lessonsThisWeek }} this week
            </div>
          </AppCard>

          <AppCard class="text-center">
            <div class="text-4xl font-bold text-green-600 mb-2">
              {{ stats.totalHours }}
            </div>
            <div class="text-gray-600">Learning Hours</div>
            <div class="text-sm text-green-600 mt-1">
              +{{ stats.hoursThisWeek }}h this week
            </div>
          </AppCard>

          <AppCard class="text-center">
            <div class="text-4xl font-bold text-primary-600 mb-2">
              {{ stats.quizzesTaken }}
            </div>
            <div class="text-gray-600">Quizzes Taken</div>
            <div class="text-sm text-gray-500 mt-1">
              {{ stats.averageScore }}% avg score
            </div>
          </AppCard>

          <AppCard class="text-center">
            <div class="text-4xl font-bold text-yellow-600 mb-2">
              {{ stats.currentStreak }}
            </div>
            <div class="text-gray-600">Day Streak</div>
            <div class="text-sm text-gray-500 mt-1">
              Best: {{ stats.bestStreak }} days
            </div>
          </AppCard>
        </div>

        <!-- Learning Activity Chart -->
        <AppCard>
          <template #header>
            <h3 class="text-xl font-semibold">Learning Activity</h3>
          </template>

          <div class="space-y-4">
            <div
              v-for="day in activityData"
              :key="day.date"
              class="flex items-center gap-4">
              <div class="w-24 text-sm text-gray-600">{{ day.date }}</div>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <div
                    class="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-primary-600 transition-all"
                      :style="{
                        width: `${(day.minutes / maxMinutes) * 100}%`,
                      }" />
                  </div>
                  <div class="w-20 text-sm font-medium text-right">
                    {{ day.minutes }} min
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AppCard>

        <!-- Quiz Performance -->
        <AppCard>
          <template #header>
            <h3 class="text-xl font-semibold">Quiz Performance</h3>
          </template>

          <div class="space-y-4">
            <div
              v-for="quiz in quizPerformance"
              :key="quiz.id"
              class="flex items-center justify-between p-4 border rounded-lg">
              <div class="flex-1">
                <h4 class="font-semibold">{{ quiz.courseName }}</h4>
                <p class="text-sm text-gray-500">{{ quiz.quizName }}</p>
              </div>

              <div class="flex items-center gap-6">
                <div class="text-center">
                  <div
                    class="text-2xl font-bold"
                    :class="getScoreColor(quiz.score)">
                    {{ quiz.score }}%
                  </div>
                  <div class="text-xs text-gray-500">Score</div>
                </div>

                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-700">
                    {{ quiz.attempts }}
                  </div>
                  <div class="text-xs text-gray-500">Attempts</div>
                </div>

                <div class="text-center">
                  <AppBadge :color="quiz.passed ? 'green' : 'red'">
                    {{ quiz.passed ? "Passed" : "Failed" }}
                  </AppBadge>
                </div>
              </div>
            </div>
          </div>
        </AppCard>

        <!-- Skills Progress -->
        <AppCard>
          <template #header>
            <h3 class="text-xl font-semibold">Skills Progress</h3>
          </template>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="skill in skillsProgress"
              :key="skill.name"
              class="space-y-2">
              <div class="flex justify-between">
                <span class="font-medium">{{ skill.name }}</span>
                <span class="text-sm text-gray-600">{{ skill.level }}</span>
              </div>
              <div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all"
                  :class="skill.color"
                  :style="{ width: `${skill.progress}%` }" />
              </div>
              <div class="text-xs text-gray-500">
                {{ skill.progress }}% complete
              </div>
            </div>
          </div>
        </AppCard>

        <!-- Achievements -->
        <AppCard>
          <template #header>
            <h3 class="text-xl font-semibold">Achievements</h3>
          </template>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              v-for="achievement in achievements"
              :key="achievement.id"
              class="text-center p-4 border rounded-lg"
              :class="
                achievement.unlocked
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-gray-50 opacity-50'
              ">
              <div class="flex justify-center mb-2">
                <UIcon :name="achievement.icon" class="w-10 h-10" />
              </div>
              <div class="font-semibold text-sm">{{ achievement.name }}</div>
              <div class="text-xs text-gray-500 mt-1">
                {{ achievement.description }}
              </div>
            </div>
          </div>
        </AppCard>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const studentName = ref("Student");
const selectedPeriod = ref("last-7-days");

const periodOptions = [
  { label: "Last 7 Days", value: "last-7-days" },
  { label: "Last 30 Days", value: "last-30-days" },
  { label: "Last 3 Months", value: "last-3-months" },
  { label: "All Time", value: "all-time" },
];

const stats = ref({
  totalLessons: 42,
  lessonsThisWeek: 8,
  totalHours: 24,
  hoursThisWeek: 5,
  quizzesTaken: 18,
  averageScore: 87,
  currentStreak: 7,
  bestStreak: 14,
});

const activityData = ref([
  { date: "Mon", minutes: 45 },
  { date: "Tue", minutes: 60 },
  { date: "Wed", minutes: 30 },
  { date: "Thu", minutes: 75 },
  { date: "Fri", minutes: 50 },
  { date: "Sat", minutes: 90 },
  { date: "Sun", minutes: 40 },
]);

const maxMinutes = computed(() =>
  Math.max(...activityData.value.map((d) => d.minutes))
);

const quizPerformance = ref([
  {
    id: "1",
    courseName: "Piano Fundamentals",
    quizName: "Chapter 6 Quiz",
    score: 90,
    attempts: 1,
    passed: true,
  },
  {
    id: "2",
    courseName: "Piano Fundamentals",
    quizName: "Chapter 5 Quiz",
    score: 85,
    attempts: 2,
    passed: true,
  },
  {
    id: "3",
    courseName: "Guitar Mastery",
    quizName: "Chapter 3 Quiz",
    score: 70,
    attempts: 1,
    passed: false,
  },
  {
    id: "4",
    courseName: "Music Theory Advanced",
    quizName: "Chapter 3 Quiz",
    score: 95,
    attempts: 1,
    passed: true,
  },
]);

const skillsProgress = ref([
  {
    name: "Piano Technique",
    level: "Intermediate",
    progress: 65,
    color: "bg-blue-600",
  },
  {
    name: "Music Theory",
    level: "Advanced",
    progress: 80,
    color: "bg-purple-600",
  },
  {
    name: "Rhythm & Timing",
    level: "Intermediate",
    progress: 70,
    color: "bg-green-600",
  },
  {
    name: "Sight Reading",
    level: "Beginner",
    progress: 40,
    color: "bg-yellow-600",
  },
]);

const achievements = ref([
  {
    id: "1",
    icon: "🎯",
    name: "First Steps",
    description: "Complete 1st lesson",
    unlocked: true,
  },
  {
    id: "2",
    icon: "🔥",
    name: "Week Streak",
    description: "7 days in a row",
    unlocked: true,
  },
  {
    id: "3",
    icon: "i-lucide-star",
    name: "Perfect Score",
    description: "100% on a quiz",
    unlocked: true,
  },
  {
    id: "4",
    icon: "i-lucide-book-open",
    name: "Bookworm",
    description: "Complete 10 chapters",
    unlocked: false,
  },
  {
    id: "5",
    icon: "i-lucide-trophy",
    name: "Champion",
    description: "Pass all quizzes",
    unlocked: false,
  },
  {
    id: "6",
    icon: "i-lucide-zap",
    name: "Speed Learner",
    description: "Complete in half time",
    unlocked: false,
  },
]);

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-green-600";
  if (score >= 70) return "text-yellow-600";
  return "text-red-600";
};
</script>
