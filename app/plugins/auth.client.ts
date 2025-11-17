/**
 * Plugin: Auth Initialization
 * - Khởi tạo auth state từ localStorage khi app load
 * - Chỉ chạy trên client side
 */
export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();

  // Khởi tạo auth từ localStorage
  authStore.initializeAuth();

  // Optional: Refresh user data nếu có token
  if (authStore.isAuthenticated && authStore.token) {
    // Fetch user data trong background (không blocking)
    authStore.fetchUser().catch((error) => {
      console.error("Failed to fetch user data:", error);
      // Nếu fetch user thất bại, có thể token đã hết hạn
      // Store sẽ tự động xóa cache khi có lỗi
    });
  }
});
