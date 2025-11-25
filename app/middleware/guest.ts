export default defineNuxtRouteMiddleware((_to, _from) => {
  const authStore = useAuthStore();

  // Nếu đã đăng nhập, redirect về trang tương ứng với role
  if (authStore.isAuthenticated && authStore.user) {
    // Nếu là ADMIN, redirect về admin dashboard
    if (authStore.user.role === "ADMIN") {
      return navigateTo("/admin/dashboard");
    }
    // Nếu là USER thường, redirect về trang home
    return navigateTo("/");
  }
});
