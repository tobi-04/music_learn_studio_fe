<template>
    <UForm class="space-y-6 mx-auto" @submit.prevent="handleSubmit">
        <!-- Title -->
        <FormInput
            v-model="form.title"
            label="Tiêu đề khóa học"
            placeholder="VD: Piano cơ bản cho người mới bắt đầu"
            required
            :error="errors.title"
        />

        <!-- Description -->
        <FormTextarea
            v-model="form.description"
            label="Mô tả"
            placeholder="Mô tả ngắn gọn về khóa học..."
            :rows="4"
            :error="errors.description"
        />

        <!-- Level -->
        <FormSelect v-model="form.level" label="Cấp độ" :options="levelOptions" required :error="errors.level" />

        <!-- Thumbnail -->
        <UFormGroup label="Hình ảnh đại diện" :error="errors.thumbnailUrl">
            <div class="flex items-center gap-4">
                <div
                    v-if="previewUrl"
                    class="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200"
                >
                    <img :src="previewUrl" alt="Thumbnail preview" class="w-full h-full object-cover" />
                    <button
                        type="button"
                        class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        @click="removeThumbnail"
                    >
                        <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
                    </button>
                </div>
                <div class="flex-1">
                    <UInput type="file" accept="image/*" @change="handleFileChange" />
                    <p class="text-xs text-gray-500 mt-1">
                        Định dạng hỗ trợ: JPG, PNG. Kích thước tối đa: 5MB.
                    </p>
                </div>
            </div>
        </UFormGroup>

        <!-- Price -->
        <FormInput
            v-model.number="form.price"
            label="Giá khóa học (VNĐ)"
            placeholder="0"
            type="number"
            :min="0"
            :step="1000"
            :error="errors.price"
        >
            <template #help>
                <p class="text-xs text-gray-500 mt-1">Để trống hoặc nhập 0 nếu khóa học miễn phí</p>
            </template>
        </FormInput>

        <!-- Form Actions -->
        <div class="flex justify-end gap-3 pt-4">
            <UButton type="button" variant="outline" @click="$emit('cancel')"> Hủy </UButton>
            <UButton type="submit" color="primary" :loading="loading">
                {{ isEdit ? "Cập nhật khóa học" : "Tạo khóa học" }}
            </UButton>
        </div>
    </UForm>
</template>

<script setup lang="ts">
import type { CourseResponse, CreateCourseRequest, UpdateCourseRequest } from "~/types";

const props = defineProps<{
    initialData?: CourseResponse;
    loading?: boolean;
}>();

const emit = defineEmits<{
    submit: [data: FormData];
    cancel: [];
}>();

const isEdit = computed(() => !!props.initialData);
const thumbnailFile = ref<File | null>(null);
const previewUrl = ref<string>("");

const form = reactive<CreateCourseRequest>({
    title: props.initialData?.title || "",
    description: props.initialData?.description || "",
    level: props.initialData?.level || "beginner",
    thumbnailUrl: props.initialData?.thumbnailUrl || "",
    price: props.initialData?.price || 0,
});

const errors = reactive<Record<string, string>>({
    title: "",
    description: "",
    level: "",
    thumbnailUrl: "",
    price: "",
});

const levelOptions = [
    { label: "Cơ bản", value: "beginner" },
    { label: "Trung cấp", value: "intermediate" },
    { label: "Nâng cao", value: "advanced" },
];

const handleFileChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        const file = input.files[0];

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("Kích thước file không được vượt quá 5MB");
            input.value = "";
            return;
        }

        thumbnailFile.value = file;
        previewUrl.value = URL.createObjectURL(file);
    }
};

const removeThumbnail = () => {
    thumbnailFile.value = null;
    previewUrl.value = "";
    form.thumbnailUrl = "";
};

const validateForm = (): boolean => {
    // Reset errors
    Object.keys(errors).forEach((key) => (errors[key] = ""));

    let isValid = true;

    if (!form.title || form.title.trim().length === 0) {
        errors.title = "Tiêu đề là bắt buộc";
        isValid = false;
    }

    if (!form.level) {
        errors.level = "Cấp độ là bắt buộc";
        isValid = false;
    }

    if (form.price !== undefined && form.price < 0) {
        errors.price = "Giá không được âm";
        isValid = false;
    }

    return isValid;
};

const handleSubmit = () => {
    if (!validateForm()) {
        return;
    }

    const formData = new FormData();

    // Create the JSON data object
    const courseData = {
        title: form.title,
        description: form.description,
        level: form.level,
        price: form.price,
        thumbnailUrl: form.thumbnailUrl // Keep existing URL if no new file
    };

    // Append JSON data as a Blob with application/json type
    formData.append("data", new Blob([JSON.stringify(courseData)], { type: "application/json" }));

    // Append file if selected
    if (thumbnailFile.value) {
        formData.append("thumbnail", thumbnailFile.value);
    }

    emit("submit", formData);
};

// Watch for initialData changes (for edit mode)
watch(
    () => props.initialData,
    (newData) => {
        if (newData) {
            form.title = newData.title;
            form.description = newData.description || "";
            form.level = newData.level;
            form.thumbnailUrl = newData.thumbnailUrl || "";
            form.price = newData.price || 0;

            if (newData.thumbnailUrl) {
                previewUrl.value = newData.thumbnailUrl;
            }
        }
    },
    { immediate: true },
);
</script>
