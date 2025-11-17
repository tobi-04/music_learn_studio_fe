<template>
  <AuthLayout>
    <UCard>
      <template #header>
        <h2 class="text-2xl font-bold text-center">Quên mật khẩu</h2>
      </template>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <AppAlert
          v-if="successMessage"
          :title="successMessage"
          color="green"
          variant="soft"
          @close="successMessage = ''" />

        <AppAlert
          v-if="errorMessage"
          :title="errorMessage"
          color="red"
          variant="soft"
          @close="errorMessage = ''" />

        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.
        </p>

        <FormInput
          v-model="email"
          label="Email"
          type="email"
          placeholder="Nhập email của bạn"
          icon="i-heroicons-envelope"
          required
          :error="emailError" />

        <AppButton type="submit" :loading="loading" block>
          Gửi hướng dẫn
        </AppButton>

        <div class="text-center text-sm">
          <NuxtLink to="/auth/login" class="text-primary-500 hover:underline">
            ← Quay lại đăng nhập
          </NuxtLink>
        </div>
      </form>
    </UCard>
  </AuthLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

const email = ref("");
const emailError = ref("");
const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const handleSubmit = async () => {
  emailError.value = "";
  errorMessage.value = "";
  successMessage.value = "";

  if (!email.value) {
    emailError.value = "Email là bắt buộc";
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    emailError.value = "Email không hợp lệ";
    return;
  }

  loading.value = true;

  try {
    // TODO: Implement forgot password API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    successMessage.value =
      "Đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn";
    email.value = "";
  } catch (error: any) {
    errorMessage.value = error.message || "Có lỗi xảy ra";
  } finally {
    loading.value = false;
  }
};
</script>
