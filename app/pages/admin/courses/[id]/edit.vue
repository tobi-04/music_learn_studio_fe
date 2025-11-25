<template>
  <AdminLayout page-title="Edit Course">
    <div class="max-w-3xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold">Edit Course</h1>
          <p class="text-gray-500">Update course information</p>
        </div>
        <UButton variant="outline" @click="router.back()"> Cancel </UButton>
      </div>

      <!-- Form Card -->
      <AppCard>
        <CourseForm
          :initial-data="course"
          :loading="courseStore.loading"
          @submit="handleSubmit"
          @cancel="handleCancel" />
      </AppCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { useCourseStore } from "~/stores/admin/course";

const route = useRoute();
const router = useRouter();
const courseStore = useCourseStore();

const courseId = route.params.id as string;
const course = ref(null);

onMounted(async () => {
  course.value = await courseStore.fetchCourseById(courseId);
});

const handleSubmit = async (data: Record<string, unknown>) => {
  await courseStore.updateCourse(courseId, data);
  router.push("/admin/courses");
};

const handleCancel = () => {
  router.back();
};
</script>
