<template>
  <AdminLayout page-title="Danh sách chương">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold">{{ course?.title || "" }}</h1>
          <p class="text-gray-500">Quản lý các chương của khóa học này</p>
        </div>
        <div class="flex items-center gap-3">
          <UButton variant="outline" @click="router.back()">
            Quay lại danh sách khóa học
          </UButton>
          <UButton
            color="primary"
            icon="i-lucide-plus"
            @click="showCreateModal = true">
            Tạo chương mới
          </UButton>
        </div>
      </div>

      <!-- Chapter List -->
      <ChapterList
        :chapters="chapterStore.chapters"
        :loading="chapterStore.loading"
        @edit="handleEdit"
        @toggle-publish="handleTogglePublish"
        @delete="handleDelete" />

      <!-- Create/Edit Modal -->
      <UModal
        v-model:open="showCreateModal"
        :ui="{
          content: 'p-4',
        }">
        <template #content>
          <h3 class="text-lg font-semibold mb-4">
            {{ editingChapter ? "Chỉnh sửa chương" : "Tạo chương mới" }}
          </h3>
          <ChapterForm
            :course-id="courseId"
            :initial-data="editingChapter"
            :loading="chapterStore.loading"
            @submit="handleSubmit"
            @cancel="closeModal" />
        </template>
      </UModal>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import type { ChapterResponse } from "~/types";
import { useChapterStore } from "~/stores/admin/chapter";
import { useCourseStore } from "~/stores/admin/course";

const route = useRoute();
const router = useRouter();
const chapterStore = useChapterStore();
const courseStore = useCourseStore();
const confirmDialog = useConfirmDialog();

const courseId = route.params.id as string;
const showCreateModal = ref(false);
const editingChapter = ref<ChapterResponse | null>(null);
const course = ref(null);

onMounted(async () => {
  await Promise.all([
    courseStore.fetchCourseById(courseId),
    chapterStore.fetchChaptersByCourse(courseId),
  ]);
  course.value = courseStore.currentCourse;
});

const handleSubmit = async (data: any) => {
  if (editingChapter.value) {
    await chapterStore.updateChapter(editingChapter.value.id, data);
  } else {
    await chapterStore.createChapter(courseId, data);
  }
  closeModal();
  await chapterStore.fetchChaptersByCourse(courseId, undefined, true);
};

const handleEdit = (chapter: ChapterResponse) => {
  editingChapter.value = chapter;
  showCreateModal.value = true;
};

const handleTogglePublish = async (chapter: ChapterResponse) => {
  confirmDialog.open({
    title: chapter.isPublished ? "Hủy xuất bản chương?" : "Xuất bản chương?",
    description: `Bạn có chắc chắn muốn ${
      chapter.isPublished ? "hủy xuất bản" : "xuất bản"
    } chương "<strong>${chapter.title}</strong>" không?`,
    confirmLabel: chapter.isPublished ? "Hủy xuất bản" : "Xuất bản",
    cancelLabel: "Hủy",
    color: "primary",
    onConfirm: async () => {
      await chapterStore.togglePublishChapter(chapter.id);
      await chapterStore.fetchChaptersByCourse(courseId, undefined, true);
    },
  });
};

const handleDelete = async (chapter: ChapterResponse) => {
  confirmDialog.open({
    title: "Xóa chương?",
    description: `Bạn có chắc chắn muốn xóa chương "<strong>${chapter.title}</strong>"? Hành động này sẽ xóa tất cả nội dung liên quan và không thể hoàn tác.`,
    confirmLabel: "Xóa",
    cancelLabel: "Hủy",
    color: "error",
    onConfirm: async () => {
      await chapterStore.deleteChapter(chapter.id);
      await chapterStore.fetchChaptersByCourse(courseId, undefined, true);
    },
  });
};

const closeModal = () => {
  showCreateModal.value = false;
  editingChapter.value = null;
};
</script>
