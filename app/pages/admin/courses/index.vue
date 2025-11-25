<template>
  <AdminLayout page-title="Courses">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold">Courses</h1>
          <p class="text-gray-500">Manage your music courses</p>
        </div>
        <UButton
          color="primary"
          icon="i-lucide-plus"
          @click="navigateTo('/admin/courses/create')">
          Create Course
        </UButton>
      </div>

      <!-- Course Table -->
      <CourseTable
        :courses="courseStore.courses"
        :loading="courseStore.loading"
        :pagination="courseStore.pagination"
        @filter-change="handleFilterChange"
        @edit="handleEdit"
        @view-chapters="handleViewChapters"
        @toggle-publish="handleTogglePublish"
        @delete="handleDelete" />
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import type { CourseResponse, CourseLevel } from "~/types";
import { useCourseStore } from "~/stores/admin/course";

definePageMeta({
  middleware: ["admin"],
});

const courseStore = useCourseStore();
const confirmDialog = useConfirmDialog();

// Fetch courses on mount
onMounted(async () => {
  try {
    await courseStore.fetchCourses();
  } catch (error) {
    console.error("Error loading courses:", error);
  }
});

const handleFilterChange = async (filters: {
  page?: number;
  search?: string;
  level?: string;
  published?: boolean;
}) => {
  try {
    await courseStore.fetchCourses({
      page: filters.page,
      size: 10,
      search: filters.search,
      level: filters.level as CourseLevel | undefined,
      published: filters.published,
    });
  } catch (error) {
    console.error("Error filtering courses:", error);
  }
};

const handleEdit = (course: CourseResponse) => {
  navigateTo(`/admin/courses/${course.id}/edit`);
};

const handleViewChapters = (course: CourseResponse) => {
  navigateTo(`/admin/courses/${course.id}/chapters`);
};

const handleTogglePublish = async (course: CourseResponse) => {
  confirmDialog.open({
    title: course.isPublished ? "Ẩn khóa học?" : "Công khai khóa học?",
    description: `Bạn có chắc chắn muốn ${
      course.isPublished ? "ẩn" : "công khai"
    } khóa học "<strong>${course.title}</strong>"?`,
    confirmLabel: course.isPublished ? "Ẩn" : "Công khai",
    cancelLabel: "Hủy",
    color: "primary",
    onConfirm: async () => {
      try {
        await courseStore.togglePublish(course.id);
        // Refresh list
        await courseStore.fetchCourses(undefined, true);
      } catch (error) {
        console.error("Error toggling course publish status:", error);
      }
    },
  });
};

const handleDelete = async (course: CourseResponse) => {
  confirmDialog.open({
    title: "Xóa khóa học?",
    description: `Bạn có chắc chắn muốn xóa khóa học "<strong>${course.title}</strong>"? Hành động này không thể hoàn tác.`,
    confirmLabel: "Xóa",
    cancelLabel: "Hủy",
    color: "error",
    onConfirm: async () => {
      try {
        await courseStore.deleteCourse(course.id);
        // Refresh list
        await courseStore.fetchCourses(undefined, true);
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    },
  });
};
</script>
