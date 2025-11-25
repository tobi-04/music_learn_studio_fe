<template>
    <div class="min-h-screen flex items-center justify-center p-6">
        <div class="w-full max-w-md space-y-8">
            <!-- Logo/Brand -->
            <div class="text-center">
                <h1 class="text-4xl font-bold mb-2">🎵 MusicLearn Studio</h1>
                <p class="text-sm opacity-80">Nền tảng học nhạc trực tuyến hàng đầu</p>
            </div>

            <!-- Login Card -->
            <UCard>
                <template #header>
                    <div class="text-center">
                        <h2 class="text-2xl font-bold">Đăng nhập</h2>
                        <p class="mt-2 text-sm opacity-80">Đăng nhập để tiếp tục học tập</p>
                    </div>
                </template>

                <!-- Error Message -->
                <UAlert v-if="errorMessage" color="red" variant="soft" :title="errorMessage" class="mb-6" />

                <!-- Login Form -->
                <UForm :state="formData" class="flex flex-col space-y-5" @submit="handleLogin">
                    <UInput
                        v-model="formData.usernameOrEmail"
                        type="text"
                        label="Username hoặc Email"
                        placeholder="Nhập username hoặc email"
                        size="lg"
                        required
                        class="w-full"
                    />

                    <UInput
                        v-model="formData.password"
                        type="password"
                        label="Mật khẩu"
                        placeholder="Nhập mật khẩu"
                        size="lg"
                        required
                        class="w-full"
                    />

                    <UButton type="submit" color="primary" size="lg" block :loading="loading"> Đăng nhập </UButton>
                </UForm>

                <template #footer>
                    <div class="text-center text-sm">
                        <p>
                            Chưa có tài khoản?
                            <NuxtLink to="/auth/register" class="font-semibold hover:underline">
                                Đăng ký ngay
                            </NuxtLink>
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

const authStore = useAuthStore();

const formData = ref({
    usernameOrEmail: "",
    password: "",
});

const loading = ref<boolean>(false);
const errorMessage = ref<string>("");

const handleLogin = async () => {
    try {
        loading.value = true;
        errorMessage.value = "";

        const result = await authStore.login({
            usernameOrEmail: formData.value.usernameOrEmail,
            password: formData.value.password,
        });

        if (result.success && result.data) {
            const userRole = result.data.user?.role;

            // Sử dụng navigateTo thay vì router.push để tránh race condition
            if (userRole === "ADMIN") {
                return navigateTo("/admin/dashboard");
            } else if (userRole === "INSTRUCTOR") {
                return navigateTo("/instructor/dashboard");
            } else {
                return navigateTo("/");
            }
        } else {
            errorMessage.value = result.error || "Đăng nhập thất bại. Vui lòng thử lại.";
        }
    } catch {
        errorMessage.value = "Có lỗi xảy ra. Vui lòng thử lại sau.";
    } finally {
        loading.value = false;
    }
};
</script>
