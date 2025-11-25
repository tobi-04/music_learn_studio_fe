<template>
  <UCard>
    <template #header>
      <h2 class="text-2xl font-bold text-center">Đăng nhập</h2>
    </template>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <AppAlert
        v-if="authStore.error"
        :title="authStore.error"
        color="red"
        variant="soft"
        @close="authStore.clearError()" />

      <FormInput
        v-model="form.usernameOrEmail"
        label="Email hoặc Tên đăng nhập"
        type="text"
        placeholder="Nhập email hoặc tên đăng nhập"
        icon="i-heroicons-envelope"
        required
        :error="errors.usernameOrEmail"
        @blur="validateField('usernameOrEmail')" />

      <PasswordInput
        v-model="form.password"
        label="Mật khẩu"
        placeholder="Nhập mật khẩu"
        required
        :error="errors.password"
        @blur="validateField('password')" />

      <div class="flex items-center justify-between">
        <UCheckbox v-model="form.remember" label="Ghi nhớ đăng nhập" />

        <NuxtLink
          to="/auth/forgot-password"
          class="text-sm text-primary-500 hover:underline">
          Quên mật khẩu?
        </NuxtLink>
      </div>

      <UButton type="submit" :loading="authStore.loading" block>
        Đăng nhập
      </UButton>

      <div class="text-center text-sm">
        Chưa có tài khoản?
        <NuxtLink
          to="/auth/register"
          class="text-primary-500 hover:underline font-medium">
          Đăng ký ngay
        </NuxtLink>
      </div>
    </form>
  </UCard>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
  usernameOrEmail: "",
  password: "",
  remember: false,
});

const errors = reactive({
  usernameOrEmail: "",
  password: "",
});

const validateField = (field: "usernameOrEmail" | "password") => {
  if (field === "usernameOrEmail") {
    if (!form.usernameOrEmail) {
      errors.usernameOrEmail = "Email hoặc tên đăng nhập là bắt buộc";
    } else {
      errors.usernameOrEmail = "";
    }
  }

  if (field === "password") {
    if (!form.password) {
      errors.password = "Mật khẩu là bắt buộc";
    } else if (form.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    } else {
      errors.password = "";
    }
  }
};

const validateForm = () => {
  validateField("usernameOrEmail");
  validateField("password");
  return !errors.usernameOrEmail && !errors.password;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  const result = await authStore.login({
    usernameOrEmail: form.usernameOrEmail,
    password: form.password,
  });

  if (result.success) {
    await router.push("/dashboard");
  }
};
</script>
