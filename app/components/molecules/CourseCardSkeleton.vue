<template>
  <AppCard class="course-card-skeleton">
    <!-- Thumbnail Skeleton -->
    <div class="aspect-video rounded-t-lg overflow-hidden">
      <USkeleton class="w-full h-full" />
    </div>

    <!-- Content -->
    <div class="p-4 space-y-3">
      <!-- Title Skeleton -->
      <div class="space-y-2">
        <USkeleton class="h-5 w-3/4" />
        <USkeleton class="h-5 w-1/2" />
      </div>

      <!-- Badges Skeleton -->
      <div class="flex items-center gap-2">
        <USkeleton class="h-6 w-20 rounded-full" />
        <USkeleton class="h-6 w-20 rounded-full" />
      </div>

      <!-- Stats Skeleton -->
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1">
          <USkeleton class="h-4 w-4 rounded" />
          <USkeleton class="h-4 w-20" />
        </div>
        <div class="flex items-center gap-1">
          <USkeleton class="h-4 w-4 rounded" />
          <USkeleton class="h-4 w-24" />
        </div>
      </div>

      <!-- Description Skeleton -->
      <div class="space-y-2">
        <USkeleton class="h-4 w-full" />
        <USkeleton class="h-4 w-5/6" />
      </div>

      <!-- Price Skeleton -->
      <div
        class="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
        <USkeleton class="h-4 w-12" />
        <USkeleton class="h-6 w-24 rounded-full" />
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
// No props needed for skeleton
</script>
