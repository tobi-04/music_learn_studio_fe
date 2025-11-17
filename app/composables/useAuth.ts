/**
 * Composable: useAuth
 * - Wrapper cho Auth Store
 * - Cung cấp các computed properties và methods tiện lợi
 */
export const useAuth = () => {
  const authStore = useAuthStore();
  const router = useRouter();

  // Computed properties
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const currentUser = computed(() => authStore.user);
  const isLoading = computed(() => authStore.loading);
  const errorMessage = computed(() => authStore.error);

  /**
   * Đăng nhập
   */
  const login = async (usernameOrEmail: string, password: string) => {
    return await authStore.login({
      usernameOrEmail,
      password,
    });
  };

  /**
   * Đăng ký
   */
  const register = async (
    name: string,
    username: string,
    email: string,
    password: string,
    avatar?: string
  ) => {
    return await authStore.register({
      name,
      username,
      email,
      password,
      avatar,
    });
  };

  /**
   * Đăng xuất và chuyển về trang login
   */
  const logout = async () => {
    await authStore.logout();
    router.push("/auth/login");
  };

  /**
   * Refresh thông tin user
   */
  const refreshUser = async () => {
    return await authStore.fetchUser();
  };

  /**
   * Refresh token
   */
  const refreshToken = async () => {
    return await authStore.refreshAuthToken();
  };

  /**
   * Clear error
   */
  const clearError = () => {
    authStore.clearError();
  };

  /**
   * Clear cache thủ công
   */
  const clearCache = () => {
    authStore.clearCache();
  };

  return {
    // Computed
    isAuthenticated,
    currentUser,
    isLoading,
    errorMessage,

    // Methods
    login,
    register,
    logout,
    refreshUser,
    refreshToken,
    clearError,
    clearCache,
  };
};
