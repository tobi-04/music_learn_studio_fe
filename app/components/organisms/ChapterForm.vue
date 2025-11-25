<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Title -->
    <FormInput
      v-model="form.title"
      label="Tiêu đề chương"
      placeholder="VD: Giới thiệu về âm giai"
      required
      :error="errors.title" />

    <!-- Description -->
    <FormTextarea
      v-model="form.description"
      label="Mô tả ngắn"
      placeholder="Mô tả ngắn gọn về nội dung chương..."
      :rows="3"
      :error="errors.description" />

    <!-- Content (Markdown Editor) -->
    <UForm label="Nội dung" required :error="errors.contentMarkdown">
      <MarkdownEditor
        v-model="form.contentMarkdown as string"
        placeholder="Viết nội dung chương ở đây... (Hỗ trợ Markdown)" />
    </UForm>

    <!-- Video URL -->
    <FormInput
      v-model="form.videoUrl"
      label="Video URL (Tùy chọn)"
      placeholder="https://youtube.com/watch?v=..."
      type="url"
      :error="errors.videoUrl" />

    <!-- Duration -->
    <FormInput
      v-model.number="form.durationMinutes"
      label="Thời lượng ước tính (phút)"
      placeholder="30"
      type="number"
      :error="errors.durationMinutes" />

    <!-- Form Actions -->
    <div class="flex justify-end gap-3 pt-4 border-t border-muted">
      <UButton type="button" variant="outline" @click="$emit('cancel')">
        Hủy
      </UButton>
      <UButton type="submit" color="primary" :loading="loading">
        {{ isEdit ? "Cập nhật chương" : "Tạo chương mới" }}
      </UButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import type {
  ChapterResponse,
  CreateChapterRequest,
  UpdateChapterRequest,
} from "~/types";

const props = defineProps<{
  courseId: string;
  initialData?: ChapterResponse;
  loading?: boolean;
}>();

const emit = defineEmits<{
  submit: [data: CreateChapterRequest | UpdateChapterRequest];
  cancel: [];
}>();

const isEdit = computed(() => !!props.initialData);

const form = reactive<CreateChapterRequest>({
  courseId: props.courseId,
  title: props.initialData?.title || "",
  description: props.initialData?.description || "",
  contentMarkdown: props.initialData?.contentMarkdown || "",
  videoUrl: props.initialData?.videoUrl || "",
  durationMinutes: props.initialData?.durationMinutes || 0,
});

const errors = reactive<Record<string, string>>({
  title: "",
  description: "",
  contentMarkdown: "",
  videoUrl: "",
  durationMinutes: "",
});

const validateForm = (): boolean => {
  // Reset errors
  Object.keys(errors).forEach((key) => (errors[key] = ""));

  let isValid = true;

  if (!form.title || form.title.trim().length === 0) {
    errors.title = "Vui lòng nhập tiêu đề";
    isValid = false;
  }

  if (!form.contentMarkdown || form.contentMarkdown.trim().length === 0) {
    errors.contentMarkdown = "Vui lòng nhập nội dung";
    isValid = false;
  }

  if (form.durationMinutes && form.durationMinutes < 0) {
    errors.durationMinutes = "Thời lượng phải là số dương";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = () => {
  if (!validateForm()) {
    return;
  }

  // Don't send courseId in update
  const submitData = isEdit.value ? { ...form, courseId: undefined } : form;

  emit("submit", submitData);
};

// Watch for initialData changes (for edit mode)
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.title = newData.title;
      form.description = newData.description || "";
      form.contentMarkdown = newData.contentMarkdown;
      form.videoUrl = newData.videoUrl || "";
      form.durationMinutes = newData.durationMinutes || 0;
    }
  },
  { immediate: true }
);
</script>
