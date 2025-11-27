<template>
  <UCard
    class="course-card hover:shadow-lg transition-shadow cursor-pointer"
    @click="onClick">
    <!-- Thumbnail -->
    <div
      class="aspect-video bg-gradient-to-br from-primary-400 to-primary-600 rounded-t-lg overflow-hidden">
      <img
        v-if="course.thumbnailUrl"
        :src="course.thumbnailUrl"
        :alt="course.title"
        class="w-full h-full object-cover" />
      <div
        v-else
        class="w-full h-full flex items-center justify-center text-white">
        <Music :size="48" />
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 space-y-3">
      <!-- Title -->
      <h3 class="text-lg font-semibold line-clamp-2">{{ course.title }}</h3>

      <!-- Level Badge -->
      <div class="flex items-center gap-2">
        <UBadge :color="levelColor" variant="soft">
          {{ levelLabel }}
        </UBadge>
        <UBadge v-if="course.isPublished" color="green" variant="soft">
          Published
        </UBadge>
        <UBadge v-else color="gray" variant="soft"> Draft </UBadge>
      </div>

      <!-- Stats -->
      <div
        class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        <div class="flex items-center gap-1">
          <BookOpen :size="16" />
          <span>{{ course.totalChapters || 0 }} chapters</span>
        </div>
        <div v-if="course.createdAt" class="flex items-center gap-1">
          <Calendar :size="16" />
          <span>{{ formatDate(course.createdAt) }}</span>
        </div>
      </div>

      <!-- Description -->
      <p
        v-if="course.description"
        class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
        {{ course.description }}
      </p>

      <!-- Price -->
      <div
        class="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
        <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
          >Giá:</span
        >
        <UBadge
          v-if="!course.price || course.price === 0"
          color="green"
          variant="soft">
          Miễn phí
        </UBadge>
        <span
          v-else
          class="text-lg font-bold text-primary-600 dark:text-primary-400">
          {{ formatPrice(course.price) }}
        </span>
      </div>
    </div>

    <!-- Actions (if provided) -->
    <template v-if="$slots.actions" #footer>
      <slot name="actions" />
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { BookOpen, Calendar, Music } from "lucide-vue-next";
import type { CourseResponse } from "~/types";

const props = defineProps<{
  course: CourseResponse;
}>();

const emit = defineEmits<{
  click: [course: CourseResponse];
}>();

const levelColor = computed(() => {
  switch (props.course.level) {
    case "beginner":
      return "green";
    case "intermediate":
      return "yellow";
    case "advanced":
      return "red";
    default:
      return "gray";
  }
});

const levelLabel = computed(() => {
  return (
    props.course.level?.charAt(0).toUpperCase() +
      props.course.level?.slice(1) || "Unknown"
  );
});

const onClick = () => {
  emit("click", props.course);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};
</script>
