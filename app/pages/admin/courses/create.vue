<template>
  <AdminLayout page-title="Create Course">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold">Create New Course</h1>
        <p class="text-gray-500">
          Fill in the details to create a new music course
        </p>
      </div>

      <!-- Course Form -->
      <UCard>
        <CourseForm
          :loading="courseStore.loading"
          @submit="handleSubmit"
          @cancel="handleCancel" />
      </UCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import type { CreateCourseRequest, UpdateCourseRequest } from "~/types";
import { useCourseStore } from "~/stores/admin/course";

definePageMeta({
  middleware: ["admin"],
});

const courseStore = useCourseStore();
const router = useRouter();

const handleSubmit = async (
  data: CreateCourseRequest | UpdateCourseRequest
) => {
  try {
    // If this payload is an update you might call an update method instead.
    // Cast to CreateCourseRequest when calling createCourse to satisfy types.
    await courseStore.createCourse(data as CreateCourseRequest);
    // Navigate back to courses list
    router.push("/admin/courses");
  } catch (error) {
    console.error("Failed to create course:", error);
    alert("Failed to create course. Please try again.");
  }
};

const handleCancel = () => {
  router.back();
};
</script>
