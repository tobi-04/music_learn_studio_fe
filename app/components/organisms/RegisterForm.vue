<template>
  <UCard>
    <template #header>
      <h2 class="text-2xl font-bold text-center">Đăng ký tài khoản</h2>
    </template>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <AppAlert
        v-if="authStore.error"
        :title="authStore.error"
        color="red"
        variant="soft"
        @close="authStore.clearError()" />

      <FormInput
        v-model="form.name"
        label="Họ và tên"
        type="text"
        placeholder="Nguyễn Văn A"
        icon="i-heroicons-user"
        required
        :error="errors.name"
        @blur="validateField('name')" />

      <FormInput
        v-model="form.username"
        label="Tên đăng nhập"
        type="text"
        placeholder="nguyenvana"
        icon="i-heroicons-at-symbol"
        required
        hint="Từ 3-50 ký tự"
        :error="errors.username"
        @blur="validateField('username')" />

      <FormInput
        v-model="form.email"
        label="Email"
        type="email"
        placeholder="email@example.com"
        icon="i-heroicons-envelope"
        required
        :error="errors.email"
        @blur="validateField('email')" />

      <PasswordInput
        v-model="form.password"
        label="Mật khẩu"
        placeholder="Nhập mật khẩu"
        required
        hint="Mật khẩu phải có ít nhất 6 ký tự"
        :error="errors.password"
        @blur="validateField('password')" />

      <PasswordInput
        v-model="form.passwordConfirmation"
        label="Xác nhận mật khẩu"
        placeholder="Nhập lại mật khẩu"
        required
        :error="errors.passwordConfirmation"
        @blur="validateField('passwordConfirmation')" />

      <UCheckbox v-model="form.agreeTerms" required>
        <template #label>
          Tôi đồng ý với
          <NuxtLink to="/terms" class="text-primary-500 hover:underline">
            Điều khoản dịch vụ
          </NuxtLink>
          và
          <NuxtLink to="/privacy" class="text-primary-500 hover:underline">
            Chính sách bảo mật
          </NuxtLink>
        </template>
      </UCheckbox>

      <AppButton type="submit" :loading="authStore.loading" block>
        Đăng ký
      </AppButton>

      <div class="text-center text-sm">
        Đã có tài khoản?
        <NuxtLink
          to="/auth/login"
          class="text-primary-500 hover:underline font-medium">
          Đăng nhập ngay
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
  name: "",
  username: "",
  email: "",
  password: "",
  passwordConfirmation: "",
  agreeTerms: false,
});

const errors = reactive({
  name: "",
  username: "",
  email: "",
  password: "",
  passwordConfirmation: "",
});

const validateField = (field: keyof typeof errors) => {
  if (field === "name") {
    if (!form.name) {
      errors.name = "Họ tên là bắt buộc";
    } else if (form.name.length < 2) {
      errors.name = "Họ tên phải có ít nhất 2 ký tự";
    } else {
      errors.name = "";
    }
  }

  if (field === "username") {
    if (!form.username) {
      errors.username = "Tên đăng nhập là bắt buộc";
    } else if (form.username.length < 3) {
      errors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
    } else if (form.username.length > 50) {
      errors.username = "Tên đăng nhập không được vượt quá 50 ký tự";
    } else {
      errors.username = "";
    }
  }

  if (field === "email") {
    if (!form.email) {
      errors.email = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Email không hợp lệ";
    } else {
      errors.email = "";
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

  if (field === "passwordConfirmation") {
    if (!form.passwordConfirmation) {
      errors.passwordConfirmation = "Vui lòng xác nhận mật khẩu";
    } else if (form.password !== form.passwordConfirmation) {
      errors.passwordConfirmation = "Mật khẩu xác nhận không khớp";
    } else {
      errors.passwordConfirmation = "";
    }
  }
};

const validateForm = () => {
  validateField("name");
  validateField("username");
  validateField("email");
  validateField("password");
  validateField("passwordConfirmation");

  return (
    !errors.name &&
    !errors.username &&
    !errors.email &&
    !errors.password &&
    !errors.passwordConfirmation &&
    form.agreeTerms
  );
};

const handleSubmit = async () => {
  if (!validateForm()) {
    if (!form.agreeTerms) {
      authStore.error = "Vui lòng đồng ý với điều khoản dịch vụ";
    }
    return;
  }

  const result = await authStore.register({
    name: form.name,
    username: form.username,
    email: form.email,
    password: form.password,
  });

  if (result.success) {
    await router.push("/dashboard");
  }
};
</script>
