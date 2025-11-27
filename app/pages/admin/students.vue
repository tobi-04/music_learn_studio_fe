<template>
  <AdminLayout page-title="Students">
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">Quản lý học viên</h1>
      </div>

      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">Danh sách học viên</h2>
        </template>

        <div v-if="loading" class="text-center py-8">
          <AppSpinner />
        </div>

        <div v-else-if="students.length === 0" class="text-center py-8">
          <p class="text-gray-500">Chưa có học viên nào</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4">Tên</th>
                <th class="text-left py-3 px-4">Email</th>
                <th class="text-left py-3 px-4">Ngày đăng ký</th>
                <th class="text-left py-3 px-4">Khóa học</th>
                <th class="text-left py-3 px-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="student in students"
                :key="student.id"
                class="border-b hover:bg-gray-50">
                <td class="py-3 px-4">{{ student.name }}</td>
                <td class="py-3 px-4">{{ student.email }}</td>
                <td class="py-3 px-4">
                  {{ formatDate(student.createdAt) }}
                </td>
                <td class="py-3 px-4">{{ student.enrolledCourses || 0 }}</td>
                <td class="py-3 px-4">
                  <UBadge
                    :color="student.isLocked ? 'red' : 'green'"
                    variant="soft">
                    {{ student.isLocked ? "Khóa" : "Hoạt động" }}
                  </UBadge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </UCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
interface Student {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  enrolledCourses?: number;
  isLocked: boolean;
}

definePageMeta({
  middleware: ["auth", "admin"],
  layout: false,
});

const loading = ref(false);
const students = ref<Student[]>([]);

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

// Load students on mount
onMounted(async () => {
  loading.value = true;
  try {
    // TODO: Call API to get students
    // const response = await useAuthApi().getAllUsers();
    // students.value = response.data;
    students.value = [];
  } catch (error) {
    console.error("Error loading students:", error);
  } finally {
    loading.value = false;
  }
});
</script>
