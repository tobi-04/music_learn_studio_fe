<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <h1 class="text-3xl font-bold mb-6">Chính sách bảo mật</h1>

    <div class="prose dark:prose-invert">
      <p class="text-gray-600 dark:text-gray-400">
        Nội dung chính sách bảo mật sẽ được cập nhật sau.
      </p>
    </div>

    <div class="mt-8">
      <NuxtLink to="/" class="text-primary-600 hover:underline">
        ← Quay lại trang chủ
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});
</script>
