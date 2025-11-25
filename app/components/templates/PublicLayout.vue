<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header
      class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div class="container mx-auto px-4 py-4">
        <nav class="flex items-center justify-between">
          <NuxtLink to="/" class="flex items-center gap-2">
            <span class="text-2xl font-bold text-primary-600"
              >🎵 MusicLearn Studio</span
            >
          </NuxtLink>

          <div class="flex items-center gap-4">
            <NuxtLink
              to="/features"
              class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >Features</NuxtLink
            >
            <NuxtLink
              to="/courses"
              class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >Courses</NuxtLink
            >
            <NuxtLink
              to="/music"
              class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >Music</NuxtLink
            >
            <NuxtLink
              to="/about"
              class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >About</NuxtLink
            >
            <ClientOnly>
              <template v-if="isAuthenticated">
                <NuxtLink
                  to="/student/courses"
                  class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >My Courses</NuxtLink
                >
                <UButton variant="ghost" @click="handleLogout">Logout</UButton>
              </template>
              <template v-else>
                <UButton variant="ghost" @click="navigateTo('/auth/login')"
                  >Sign In</UButton
                >
                <UButton @click="navigateTo('/auth/register')"
                  >Get Started</UButton
                >
              </template>
            </ClientOnly>
          </div>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer
      class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="font-semibold mb-4">MusicLearn Studio</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Master music theory and practice with world-class instructors.
            </p>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Courses</h4>
            <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <NuxtLink
                  to="/courses?level=beginner"
                  class="hover:text-primary-600"
                  >Beginner</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/courses?level=intermediate"
                  class="hover:text-primary-600"
                  >Intermediate</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/courses?level=advanced"
                  class="hover:text-primary-600"
                  >Advanced</NuxtLink
                >
              </li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Platform</h4>
            <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <NuxtLink to="/features" class="hover:text-primary-600"
                  >Features</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/about" class="hover:text-primary-600"
                  >About Us</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/music" class="hover:text-primary-600"
                  >Music Gallery</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/music/studio" class="hover:text-primary-600"
                  >Music Studio</NuxtLink
                >
              </li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Legal</h4>
            <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <NuxtLink to="/terms" class="hover:text-primary-600"
                  >Terms of Service</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/privacy" class="hover:text-primary-600"
                  >Privacy Policy</NuxtLink
                >
              </li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Support</h4>
            <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <NuxtLink to="/credentials" class="hover:text-primary-600"
                  >🔑 Credentials</NuxtLink
                >
              </li>
            </ul>
          </div>
        </div>
        <div
          class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            © 2024 MusicLearn Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);

const handleLogout = async () => {
  await authStore.logout();
  navigateTo("/");
};
</script>
