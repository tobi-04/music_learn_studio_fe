<template>
    <div class="min-h-screen flex items-center justify-center p-6">
        <div class="w-full max-w-md space-y-8">
            <!-- Logo/Brand -->
            <div class="text-center">
                <h1 class="text-4xl font-bold mb-2">🎵 MusicLearn Studio</h1>
                <p class="text-sm opacity-80">Tạo tài khoản để bắt đầu học</p>
            </div>

            <!-- Register Card -->
            <UCard>
                <template #header>
                    <div class="text-center">
                        <h2 class="text-2xl font-bold">Đăng ký tài khoản</h2>
                        <p class="mt-2 text-sm opacity-80">Miễn phí và chỉ mất vài phút</p>
                    </div>
                </template>

                <!-- Error Message -->
                <UAlert v-if="errorMessage" color="red" variant="soft" :title="errorMessage" class="mb-6" />

                <!-- Register Form -->
                <UForm :state="formData" class="flex flex-col space-y-4" @submit="handleRegister">
                    <div class="w-full">
                        <UInput
                            v-model="formData.name"
                            type="text"
                            label="Họ và tên"
                            placeholder="Nguyễn Văn A"
                            size="lg"
                            required
                            class="w-full"
                        />
                        <p v-if="errors.name" class="text-sm opacity-80 mt-1">{{ errors.name }}</p>
                    </div>

                    <div class="w-full">
                        <UInput
                            v-model="formData.username"
                            type="text"
                            label="Tên đăng nhập"
                            placeholder="nguyenvana"
                            size="lg"
                            required
                            class="w-full"
                        />
                        <p v-if="errors.username" class="text-sm opacity-80 mt-1">
                            {{ errors.username }}
                        </p>
                        <p v-else class="text-xs opacity-60 mt-1">Từ 3-50 ký tự, không khoảng trắng</p>
                    </div>

                    <div class="w-full">
                        <UInput
                            v-model="formData.email"
                            type="email"
                            label="Email"
                            placeholder="email@example.com"
                            size="lg"
                            required
                            class="w-full"
                        />
                        <p v-if="errors.email" class="text-sm opacity-80 mt-1">{{ errors.email }}</p>
                    </div>

                    <div class="w-full">
                        <UInput
                            v-model="formData.password"
                            type="password"
                            label="Mật khẩu"
                            placeholder="Nhập mật khẩu"
                            size="lg"
                            required
                            class="w-full"
                        />
                        <p v-if="errors.password" class="text-sm opacity-80 mt-1">
                            {{ errors.password }}
                        </p>
                        <p v-else class="text-xs opacity-60 mt-1">Tối thiểu 6 ký tự</p>
                    </div>

                    <div class="w-full">
                        <UInput
                            v-model="formData.confirmPassword"
                            type="password"
                            label="Xác nhận mật khẩu"
                            placeholder="Nhập lại mật khẩu"
                            size="lg"
                            required
                            class="w-full"
                        />
                        <p v-if="errors.confirmPassword" class="text-sm opacity-80 mt-1">
                            {{ errors.confirmPassword }}
                        </p>
                    </div>

                    <UCheckbox v-model="formData.agreeTerms" required>
                        <template #label>
                            <span class="text-sm">
                                Tôi đồng ý với
                                <NuxtLink to="/terms" class="font-semibold hover:underline">
                                    Điều khoản dịch vụ
                                </NuxtLink>
                                và
                                <NuxtLink to="/privacy" class="font-semibold hover:underline">
                                    Chính sách bảo mật
                                </NuxtLink>
                            </span>
                        </template>
                    </UCheckbox>

                    <UButton type="submit" color="primary" size="lg" block :loading="loading"> Đăng ký </UButton>
                </UForm>

                <template #footer>
                    <div class="text-center text-sm">
                        <p>
                            Đã có tài khoản?
                            <NuxtLink to="/auth/login" class="font-semibold hover:underline"> Đăng nhập ngay </NuxtLink>
                        </p>
                    </div>
                </template>
            </UCard>

            <!-- Footer -->
            <div class="text-center text-sm opacity-60">
                <p>&copy; 2024 MusicLearn Studio. All rights reserved.</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ["guest"],
});

const router = useRouter();
const authStore = useAuthStore();

const formData = ref({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
});

const errors = ref({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
});

const loading = ref(false);
const errorMessage = ref("");

const validateForm = () => {
    let isValid = true;
    errors.value = {
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    };

    if (!formData.value.name) {
        errors.value.name = "Họ tên là bắt buộc";
        isValid = false;
    } else if (formData.value.name.length < 2) {
        errors.value.name = "Họ tên phải có ít nhất 2 ký tự";
        isValid = false;
    }

    if (!formData.value.username) {
        errors.value.username = "Tên đăng nhập là bắt buộc";
        isValid = false;
    } else if (formData.value.username.length < 3) {
        errors.value.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
        isValid = false;
    } else if (formData.value.username.length > 50) {
        errors.value.username = "Tên đăng nhập không được vượt quá 50 ký tự";
        isValid = false;
    }

    if (!formData.value.email) {
        errors.value.email = "Email là bắt buộc";
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
        errors.value.email = "Email không hợp lệ";
        isValid = false;
    }

    if (!formData.value.password) {
        errors.value.password = "Mật khẩu là bắt buộc";
        isValid = false;
    } else if (formData.value.password.length < 6) {
        errors.value.password = "Mật khẩu phải có ít nhất 6 ký tự";
        isValid = false;
    }

    if (!formData.value.confirmPassword) {
        errors.value.confirmPassword = "Vui lòng xác nhận mật khẩu";
        isValid = false;
    } else if (formData.value.password !== formData.value.confirmPassword) {
        errors.value.confirmPassword = "Mật khẩu xác nhận không khớp";
        isValid = false;
    }

    return isValid;
};

const handleRegister = async () => {
    try {
        loading.value = true;
        errorMessage.value = "";

        if (!validateForm()) {
            return;
        }

        if (!formData.value.agreeTerms) {
            errorMessage.value = "Vui lòng đồng ý với điều khoản dịch vụ";
            return;
        }

        const result = await authStore.register({
            name: formData.value.name,
            username: formData.value.username,
            email: formData.value.email,
            password: formData.value.password,
        });

        if (result.success) {
            await router.push("/");
        } else {
            errorMessage.value = result.error || "Đăng ký thất bại. Vui lòng thử lại.";
        }
    } catch {
        errorMessage.value = "Có lỗi xảy ra. Vui lòng thử lại sau.";
    } finally {
        loading.value = false;
    }
};
</script>
