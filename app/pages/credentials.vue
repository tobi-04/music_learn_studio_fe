<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4">
    <AppCard class="max-w-md w-full">
      <template #header>
        <h2 class="text-2xl font-bold text-center">🔑 Thông tin đăng nhập</h2>
      </template>

      <div class="space-y-6">
        <!-- Admin Credentials -->
        <div class="p-4 bg-primary/10 border border-primary rounded-lg">
          <h3 class="font-semibold text-lg mb-3 text-primary">
            👨‍💼 Admin Account
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Email:</span>
              <code class="font-mono bg-muted px-2 py-1 rounded"
                >admin@musiclearn.com</code
              >
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Password:</span>
              <code class="font-mono bg-muted px-2 py-1 rounded">admin123</code>
            </div>
          </div>
        </div>

        <!-- Student Info -->
        <div class="p-4 bg-secondary/10 border border-border rounded-lg">
          <h3 class="font-semibold text-lg mb-3">👨‍🎓 Student Account</h3>
          <div class="space-y-2 text-sm">
            <p class="text-muted-foreground">
              Đăng ký tài khoản mới với bất kỳ email nào. Backend sẽ tự động tạo
              với role STUDENT.
            </p>
            <p class="text-xs text-muted-foreground italic">
              Lưu ý: Không thể tự tạo tài khoản Admin qua form đăng ký để đảm
              bảo bảo mật.
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <UButton block variant="outline" @click="navigateTo('/auth/login')">
            Đi tới đăng nhập
          </UButton>
          <UButton block @click="navigateTo('/auth/register')">
            Đăng ký mới
          </UButton>
        </div>

        <!-- Back to Home -->
        <div class="text-center">
          <NuxtLink
            to="/"
            class="text-sm text-muted-foreground hover:text-foreground">
            ← Về trang chủ
          </NuxtLink>
        </div>
      </div>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});
</script>
