<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="text-center">
      <h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-4">
        🎵 MusicLearn Studio
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">
        Nền tảng học nhạc trực tuyến hàng đầu
      </p>
      <div class="flex gap-4 justify-center">
        <NuxtLink
          to="/auth/login"
          class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          Đăng nhập
        </NuxtLink>
        <NuxtLink
          to="/auth/register"
          class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          Đăng ký
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});
</script>
