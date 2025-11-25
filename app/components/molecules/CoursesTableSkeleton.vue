<template>
  <div class="space-y-4">
    <!-- Skeleton for filters -->
    <div class="flex flex-wrap gap-3">
      <div class="flex-1 min-w-[200px]">
        <USkeleton class="h-10 w-full" />
      </div>
      <USkeleton class="h-10 w-40" />
      <USkeleton class="h-10 w-40" />
    </div>

    <!-- Skeleton for table -->
    <div
      class="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      <!-- Table Header -->
      <div
        class="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-1">
            <USkeleton class="h-4 w-8" />
          </div>
          <div class="col-span-2">
            <USkeleton class="h-4 w-16" />
          </div>
          <div class="col-span-4">
            <USkeleton class="h-4 w-12" />
          </div>
          <div class="col-span-2">
            <USkeleton class="h-4 w-24" />
          </div>
          <div class="col-span-2">
            <USkeleton class="h-4 w-20" />
          </div>
          <div class="col-span-1">
            <USkeleton class="h-4 w-20" />
          </div>
        </div>
      </div>

      <!-- Table Rows -->
      <div
        v-for="i in rowCount"
        :key="i"
        class="border-b border-gray-200 dark:border-gray-800 px-4 py-4">
        <div class="grid grid-cols-12 gap-4 items-center">
          <!-- STT -->
          <div class="col-span-1">
            <USkeleton class="h-4 w-4" />
          </div>
          <!-- Title -->
          <div class="col-span-2">
            <USkeleton class="h-4 w-full" />
          </div>
          <!-- Description -->
          <div class="col-span-4 space-y-2">
            <USkeleton class="h-4 w-full" />
            <USkeleton class="h-4 w-3/4" />
          </div>
          <!-- Total Chapters -->
          <div class="col-span-2">
            <USkeleton class="h-4 w-8" />
          </div>
          <!-- Status -->
          <div class="col-span-2">
            <USkeleton class="h-6 w-20 rounded-full" />
          </div>
          <!-- Actions -->
          <div class="col-span-1">
            <div class="flex items-center gap-2">
              <USkeleton class="h-8 w-8 rounded" />
              <USkeleton class="h-8 w-8 rounded" />
              <USkeleton class="h-8 w-8 rounded" />
              <USkeleton class="h-8 w-8 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Default to 5 rows
withDefaults(defineProps<{ rowCount?: number }>(), {
  rowCount: 5,
});
</script>
