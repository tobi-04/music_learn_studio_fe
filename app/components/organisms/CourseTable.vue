<template>
  <div class="course-table space-y-4">
    <!-- Filters -->
    <div class="flex flex-wrap gap-3">
      <div class="flex-1 min-w-[200px]">
        <AppInput
          v-model="searchQuery"
          placeholder="Search courses..."
          icon="i-heroicons-magnifying-glass" />
      </div>

      <USelect
        v-model="selectedLevel"
        :items="levelOptions"
        placeholder="All Levels"
        class="w-40" />

      <USelect
        v-model="selectedPublished"
        :items="publishedOptions"
        placeholder="All Status"
        class="w-40" />
    </div>

    <!-- Table or Skeleton -->
    <CoursesTableSkeleton v-if="loading" :row-count="10" />
    <UTable
      v-else
      :data="courses"
      :columns="columns"
      :empty-state="{
        icon: 'i-lucide-graduation-cap',
        label: 'No courses found',
      }" />

    <!-- Pagination -->
    <div
      v-if="pagination && pagination.totalPages > 1"
      class="flex justify-center">
      <UPagination
        v-model="currentPage"
        :total="pagination.totalElements"
        :page-count="pagination.pageSize"
        show-first
        show-last />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CourseResponse } from "~/types";
import type { TableColumn } from "@nuxt/ui";

interface Pagination {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

defineProps<{
  courses: CourseResponse[];
  loading?: boolean;
  pagination?: Pagination | null;
}>();

const emit = defineEmits<{
  "filter-change": [
    filters: {
      search?: string;
      level?: string;
      published?: boolean;
      page?: number;
    }
  ];
  edit: [course: CourseResponse];
  "view-chapters": [course: CourseResponse];
  "toggle-publish": [course: CourseResponse];
  delete: [course: CourseResponse];
}>();

const searchQuery = ref("");
const selectedLevel = ref<string | null>(null); // Initialize with null
const selectedPublished = ref<string | null>(null); // Initialize with null
const currentPage = ref(1);
const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");

const levelOptions = [
  { label: "All Levels", value: null }, // Change value to null
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
];

const publishedOptions = [
  { label: "All Status", value: null }, // Change value to null
  { label: "Published", value: "true" },
  { label: "Draft", value: "false" },
];

const getLevelColor = (level: string) => {
  switch (level) {
    case "beginner":
      return "success";
    case "intermediate":
      return "warning";
    case "advanced":
      return "error";
    default:
      return "secondary";
  }
};

const columns: TableColumn<CourseResponse>[] = [
  {
    accessorKey: "id",
    header: "STT",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "title",
    header: "Tiêu đề",
    meta: {
      class: {
        td: "max-w-[100px] overflow-hidden text-ellipsis",
      },
    },
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    meta: {
      class: {
        td: "max-w-[200px] overflow-hidden line-clamp-2",
      },
    },
  },
  {
    accessorKey: "totalChapters",
    header: "Tổng số bài học",
    cell: ({ row }) => row.original.totalChapters,
  },
  {
    accessorKey: "isPublished",
    header: "Trạng thái",
    cell: ({ row }) => {
      return h(
        UBadge,
        {
          class: "capitalize",
          variant: "soft",
          color: row.original.isPublished ? "success" : "warning",
        },
        () => (row.original.isPublished ? "Công khai" : "Bản nháp")
      );
    },
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => {
      return h("div", { class: "flex items-center gap-2" }, [
        h(
          UButton,
          {
            size: "xs",
            variant: "ghost",
            icon: "i-heroicons-pencil",
            title: "Edit Course",
            onClick: () => emit("edit", row.original),
          },
          () => []
        ),
        h(
          UButton,
          {
            size: "xs",
            variant: "ghost",
            icon: "i-heroicons-book-open",
            title: "View Chapters",
            onClick: () => emit("view-chapters", row.original),
          },
          () => []
        ),
        h(
          UButton,
          {
            size: "xs",
            variant: "ghost",
            icon: row.original.isPublished
              ? "i-heroicons-eye-slash"
              : "i-heroicons-eye",
            title: row.original.isPublished ? "Unpublish" : "Publish",
            onClick: () => emit("toggle-publish", row.original),
          },
          () => []
        ),
        h(
          UButton,
          {
            size: "xs",
            variant: "ghost",
            color: "red",
            icon: "i-heroicons-trash",
            title: "Delete Course",
            onClick: () => emit("delete", row.original),
          },
          () => []
        ),
      ]);
    },
  },
];

const getLevelLabel = (level: string) => {
  return level?.charAt(0).toUpperCase() + level?.slice(1) || "Unknown";
};

// Watch filters and emit changes
watch([searchQuery, selectedLevel, selectedPublished, currentPage], () => {
  emit("filter-change", {
    search: searchQuery.value || undefined,
    level: selectedLevel.value || undefined, // null will become undefined
    published:
      selectedPublished.value !== null
        ? selectedPublished.value === "true"
        : undefined, // Handle null for published
    page: currentPage.value - 1, // Convert to 0-based
  });
});
</script>
