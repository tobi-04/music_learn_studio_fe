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
                <th class="text-left py-3 px-4">Thao tác</th>
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
                    :color="student.isLocked ? 'error' : 'success'"
                    variant="soft">
                    {{ student.isLocked ? "Khóa" : "Hoạt động" }}
                  </UBadge>
                </td>
                <td class="py-3 px-4">
                  <UButton
                    color="error"
                    variant="soft"
                    size="sm"
                    :loading="deletingId === student.id"
                    @click="confirmDelete(student)">
                    Xóa
                  </UButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </UCard>
    </div>

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="showDeleteModal">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-red-600">Xác nhận xóa</h3>
          </template>
          <p>
            Bạn có chắc chắn muốn xóa học viên
            <strong>{{ studentToDelete?.name }}</strong> ({{
              studentToDelete?.email
            }})?
          </p>
          <p class="text-sm text-gray-500 mt-2">
            Hành động này không thể hoàn tác.
          </p>
          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton variant="ghost" @click="showDeleteModal = false">
                Hủy
              </UButton>
              <UButton
                color="error"
                :loading="deletingId !== null"
                @click="handleDelete">
                Xóa
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
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
const { getAllStudents, deleteStudent } = useProgressApi();

const showDeleteModal = ref(false);
const studentToDelete = ref<Student | null>(null);
const deletingId = ref<string | null>(null);

const toast = useToast();

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

const confirmDelete = (student: Student) => {
  studentToDelete.value = student;
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  if (!studentToDelete.value) return;

  deletingId.value = studentToDelete.value.id;
  try {
    await deleteStudent(studentToDelete.value.id);
    students.value = students.value.filter(
      (s) => s.id !== studentToDelete.value!.id
    );
    toast.add({
      title: "Thành công",
      description: "Đã xóa học viên thành công",
      color: "success",
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    toast.add({
      title: "Lỗi",
      description: "Không thể xóa học viên",
      color: "error",
    });
  } finally {
    deletingId.value = null;
    showDeleteModal.value = false;
    studentToDelete.value = null;
  }
};

// Load students on mount
onMounted(async () => {
  loading.value = true;
  try {
    const data = await getAllStudents();
    students.value = data;
  } catch (error) {
    console.error("Error loading students:", error);
  } finally {
    loading.value = false;
  }
});
</script>
