export default defineNuxtRouteMiddleware(async (_to, _from) => {
  const authStore = useAuthStore();
  const { getCurrentUserApi } = useAuthApi();

  // Kiểm tra có token không
  const token = authStore.token;
  if (!token) {
    return navigateTo("/auth/login");
  }

  // Nếu đã có user trong store và đã xác thực, kiểm tra role ngay
  if (authStore.isAuthenticated && authStore.user) {
    // Kiểm tra role ADMIN
    if (authStore.user.role !== "ADMIN") {
      return navigateTo("/");
    }
    // User đã login và là ADMIN, cho phép tiếp tục
    return;
  }

  // Nếu chưa có user trong store, gọi API để lấy thông tin
  try {
    const response = await getCurrentUserApi(token);

    if (response.success && response.data) {
      // Set user vào store (cập nhật trực tiếp state)
      authStore.user = response.data;
      authStore.isAuthenticated = true;

      // Kiểm tra role ADMIN
      if (response.data.role !== "ADMIN") {
        return navigateTo("/");
      }
    } else {
      // Token không hợp lệ, đăng xuất
      authStore.logout();
      return navigateTo("/auth/login");
    }
  } catch (error) {
    console.error("Error checking admin permission:", error);
    // Lỗi khi gọi API, có thể token hết hạn
    authStore.logout();
    return navigateTo("/auth/login");
  }
});
