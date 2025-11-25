<template>
  <PublicLayout>
    <div>
      <!-- Hero Section -->
      <div class="container mx-auto px-4 py-20">
        <div class="text-center max-w-4xl mx-auto">
          <!-- Hero Content -->
          <h1 class="text-5xl md:text-6xl font-bold mb-6">
            Learn Music. Create Music. Share Music.
          </h1>
          <p class="text-xl mb-8">
            Master music theory with interactive courses, compose your own
            tracks in our studio, and share with a community of music lovers.
            All in one platform.
          </p>

          <!-- CTA Buttons -->
          <div
            class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <UButton size="xl" @click="navigateTo('/auth/register')">
              Start for Free
            </UButton>
            <UButton
              size="xl"
              variant="outline"
              @click="navigateTo('/courses')">
              Browse Courses
            </UButton>
            <UButton
              size="xl"
              variant="outline"
              @click="navigateTo('/music/studio')">
              Try Studio
            </UButton>
          </div>

          <!-- Features Grid -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-24">
            <UCard
              class="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer"
              @click="navigateTo('/courses')">
              <div class="text-5xl mb-4">📚</div>
              <h3 class="text-xl font-semibold mb-3">Learn</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Interactive courses on music theory, instruments, and
                composition
              </p>
              <UButton variant="ghost" size="sm">Explore Courses →</UButton>
            </UCard>

            <UCard
              class="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer"
              @click="navigateTo('/music/studio')">
              <div class="text-5xl mb-4">🎹</div>
              <h3 class="text-xl font-semibold mb-3">Create</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Compose music with our drag-and-drop studio, no installation
                needed
              </p>
              <UButton variant="ghost" size="sm">Open Studio →</UButton>
            </UCard>

            <UCard
              class="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer"
              @click="navigateTo('/music')">
              <div class="text-5xl mb-4">🎵</div>
              <h3 class="text-xl font-semibold mb-3">Share</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Publish your compositions and discover music from others
              </p>
              <UButton variant="ghost" size="sm">Discover Music →</UButton>
            </UCard>

            <UCard
              class="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer"
              @click="navigateTo('/student/progress')">
              <div class="text-5xl mb-4">📊</div>
              <h3 class="text-xl font-semibold mb-3">Track</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Monitor your learning progress and celebrate achievements
              </p>
              <UButton variant="ghost" size="sm">View Progress →</UButton>
            </UCard>
          </div>
        </div>

        <!-- How It Works -->
        <div class="mt-32">
          <h2 class="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center">
              <div
                class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-bold text-2xl mb-4">
                1
              </div>
              <h3 class="text-xl font-semibold mb-3">Sign Up & Enroll</h3>
              <p class="text-gray-600 dark:text-gray-400">
                Create your free account and choose from hundreds of courses
              </p>
            </div>
            <div class="text-center">
              <div
                class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-bold text-2xl mb-4">
                2
              </div>
              <h3 class="text-xl font-semibold mb-3">Learn & Practice</h3>
              <p class="text-gray-600 dark:text-gray-400">
                Follow structured lessons and practice with interactive
                exercises
              </p>
            </div>
            <div class="text-center">
              <div
                class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-bold text-2xl mb-4">
                3
              </div>
              <h3 class="text-xl font-semibold mb-3">Create & Share</h3>
              <p class="text-gray-600 dark:text-gray-400">
                Compose your own music and share it with the community
              </p>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 pt-24 border-t">
          <div class="text-center">
            <div class="text-4xl font-bold mb-3 text-primary-600">10K+</div>
            <div class="text-gray-600 dark:text-gray-400">Active Students</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold mb-3 text-primary-600">500+</div>
            <div class="text-gray-600 dark:text-gray-400">Courses</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold mb-3 text-primary-600">1K+</div>
            <div class="text-gray-600 dark:text-gray-400">Compositions</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold mb-3 text-primary-600">98%</div>
            <div class="text-gray-600 dark:text-gray-400">Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  </PublicLayout>
</template>

<script setup lang="ts">
// Auto-redirect logic for authenticated users
const authStore = useAuthStore();

onMounted(() => {
  if (authStore.isAuthenticated) {
    // Optionally redirect to dashboard or stay on landing page
    // navigateTo('/student/courses');
  }
});
</script>
