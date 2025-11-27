<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="flex">
      <!-- Sidebar -->
      <aside
        class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen sticky top-0">
        <div class="p-4">
          <h2 class="text-xl font-bold text-primary-600">MusicLearn Studio</h2>
          <p class="text-xs text-gray-500">Admin Panel</p>
        </div>

        <nav class="px-2 space-y-1">
          <!-- Dashboard -->
          <NuxtLink
            to="/admin/dashboard"
            class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            active-class="bg-primary-50 dark:bg-primary-900 text-primary-600">
            <UIcon name="i-lucide-layout-dashboard" class="w-5 h-5" />
            <span>Dashboard</span>
          </NuxtLink>

          <!-- Courses -->
          <NuxtLink
            to="/admin/courses"
            class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            active-class="bg-primary-50 dark:bg-primary-900 text-primary-600">
            <UIcon name="i-lucide-book-open" class="w-5 h-5" />
            <span>Courses</span>
          </NuxtLink>

          <!-- Analytics -->
          <NuxtLink
            to="/admin/analytics"
            class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            active-class="bg-primary-50 dark:bg-primary-900 text-primary-600">
            <UIcon name="i-lucide-bar-chart-3" class="w-5 h-5" />
            <span>Analytics</span>
          </NuxtLink>
        </nav>

        <div
          class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <ClientOnly>
            <div class="flex items-center gap-3">
              <UAvatar
                :src="user?.avatar || ''"
                :alt="user?.name || 'Admin'"
                size="sm" />
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium truncate">
                  {{ user?.name || "Admin User" }}
                </div>
                <div class="text-xs text-gray-500 truncate">
                  {{ user?.email || "admin@example.com" }}
                </div>
              </div>
            </div>
            <template #fallback>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                <div class="flex-1 min-w-0">
                  <div class="h-4 bg-gray-200 rounded animate-pulse mb-1" />
                  <div class="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                </div>
              </div>
            </template>
          </ClientOnly>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1">
        <!-- Header -->
        <header
          class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div class="px-6 py-4 flex items-center justify-between">
            <!-- Breadcrumbs -->
            <nav class="flex items-center gap-2 text-sm">
              <NuxtLink to="/admin" class="text-gray-500 hover:text-gray-700">
                Home
              </NuxtLink>
              <span class="text-gray-400">/</span>
              <span class="text-gray-900 dark:text-gray-100 font-medium">
                {{ pageTitle }}
              </span>
            </nav>

            <!-- Actions -->
            <div class="flex items-center gap-3">
              <UButton variant="ghost" icon="i-lucide-bell" />
              <UButton variant="ghost" icon="i-lucide-settings" />
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <div class="p-6">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();

defineProps<{
  pageTitle?: string;
}>();

const user = computed(() => authStore.user);
</script>

<style scoped>
.min-w-0 {
  min-width: 0;
}
</style>
