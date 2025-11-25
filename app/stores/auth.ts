import { defineStore } from "pinia";
import type { User, LoginCredentials, RegisterData, AuthResponse } from "~/types/auth";

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

interface ApiErrorData {
  message?: string;
  statusCode?: number;
}

/**
 * Auth Store - Xử lý logic business và cache
 */
export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    refreshToken: null as string | null,
    isAuthenticated: false,
    loading: false,
    error: null as string | null,
    // Cache
    _cache: {
      user: null as CacheItem<User> | null,
    },
    _cacheTimeout: 5 * 60 * 1000, // 5 minutes
  }),

  getters: {
    getUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },

  actions: {
    /**
     * Kiểm tra cache còn hợp lệ không
     */
    _isCacheValid(cacheItem: CacheItem<User> | null): boolean {
      if (!cacheItem) return false;
      return Date.now() - cacheItem.timestamp < this._cacheTimeout;
    },

    /**
     * Lưu user vào cache
     */
    _setCacheUser(user: User): void {
      this._cache.user = {
        data: user,
        timestamp: Date.now(),
      };
    },

    /**
     * Xóa toàn bộ cache (dùng khi CUD)
     */
    _clearCache(): void {
      this._cache.user = null;
    },

    /**
     * Lưu auth data vào localStorage
     */
    _saveToLocalStorage(token: string, user: User, refreshToken?: string): void {
      if (import.meta.client) {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_user", JSON.stringify(user));
        if (refreshToken) {
          localStorage.setItem("auth_refresh_token", refreshToken);
        }
      }
    },

    /**
     * Xóa auth data khỏi localStorage
     */
    _clearLocalStorage(): void {
      if (import.meta.client) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_refresh_token");
      }
    },

    /**
     * Action: Đăng nhập
     * - Gọi API loginApi
     * - Lưu token, user vào state và localStorage
     * - Lưu cache user
     * - Xóa cache nếu thất bại
     */
    async login(credentials: LoginCredentials): Promise<{ success: boolean; data?: AuthResponse; error?: string }> {
      this.loading = true;
      this.error = null;

      try {
        const { loginApi } = useAuthApi();
        const response = await loginApi(credentials.usernameOrEmail, credentials.password);

        const data = response.data;

        // Cập nhật state
        this.user = data.user;
        this.token = data.token;
        this.refreshToken = null; // Backend không trả refresh token
        this.isAuthenticated = true;

        // Lưu localStorage
        this._saveToLocalStorage(data.token, data.user);

        // Cập nhật cache
        this._setCacheUser(data.user);

        return { success: true, data };
      } catch (error: unknown) {
        const apiError = error as { data?: ApiErrorData };
        this.error = apiError.data?.message || "Đăng nhập thất bại";

        // Xóa cache khi lỗi
        this._clearCache();

        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Action: Đăng ký
     * - Gọi API registerApi
     * - Lưu token, user vào state và localStorage
     * - Lưu cache user
     * - Xóa cache nếu thất bại
     */
    async register(registerData: RegisterData): Promise<{ success: boolean; data?: AuthResponse; error?: string }> {
      this.loading = true;
      this.error = null;

      try {
        const { registerApi } = useAuthApi();
        const response = await registerApi(
          registerData.name,
          registerData.username,
          registerData.email,
          registerData.password,
          registerData.avatar,
        );

        const data = response.data;

        // Cập nhật state
        this.user = data.user;
        this.token = data.token;
        this.refreshToken = null; // Backend không trả refresh token
        this.isAuthenticated = true;

        // Lưu localStorage
        this._saveToLocalStorage(data.token, data.user);

        // Cập nhật cache
        this._setCacheUser(data.user);

        return { success: true, data };
      } catch (error: unknown) {
        const apiError = error as { data?: ApiErrorData };
        this.error = apiError.data?.message || "Đăng ký thất bại";

        // Xóa cache khi lỗi
        this._clearCache();

        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Action: Lấy thông tin user
     * - Kiểm tra cache trước
     * - Nếu cache hợp lệ, dùng cache
     * - Nếu không, gọi API getCurrentUserApi
     * - Cập nhật cache sau khi lấy thành công
     */
    async fetchUser(): Promise<{
      success: boolean;
      data?: User;
      error?: string;
    }> {
      // Kiểm tra cache trước
      if (this._isCacheValid(this._cache.user)) {
        this.user = this._cache.user!.data;
        return { success: true, data: this.user };
      }

      // Không có token thì không gọi API
      if (!this.token) {
        return { success: false, error: "Không có token" };
      }

      this.loading = true;
      try {
        const { getCurrentUserApi } = useAuthApi();
        const response = await getCurrentUserApi(this.token);

        const userData = response.data;

        // Cập nhật state
        this.user = userData;

        // Cập nhật cache
        this._setCacheUser(userData);

        return { success: true, data: userData };
      } catch (error: unknown) {
        const apiError = error as { data?: ApiErrorData };
        this.error = apiError.data?.message || "Lỗi khi tải thông tin người dùng";

        // Xóa cache khi lỗi
        this._clearCache();

        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Action: Đăng xuất
     * - Xóa toàn bộ state
     * - Xóa localStorage
     * - Xóa cache (vì đây là thao tác Delete)
     */
    async logout(): Promise<void> {
      try {
        // Nếu có token, gọi API logout
        if (this.token) {
          const { logoutApi } = useAuthApi();
          await logoutApi(this.token);
        }
      } catch (error) {
        // Ignore logout API errors
        console.warn("Logout API error:", error);
      } finally {
        // Luôn clear state và localStorage
        this.user = null;
        this.token = null;
        this.refreshToken = null;
        this.isAuthenticated = false;

        // Xóa localStorage
        this._clearLocalStorage();

        // Xóa cache (CUD operation)
        this._clearCache();
      }
    },

    /**
     * Action: Refresh token
     * - Gọi API refreshTokenApi
     * - Cập nhật token mới
     * - Xóa cache (vì đây là thao tác Update)
     */
    async refreshAuthToken(): Promise<{
      success: boolean;
      data?: { token: string; refreshToken?: string };
      error?: string;
    }> {
      if (!this.refreshToken) {
        return { success: false, error: "Không có refresh token" };
      }

      try {
        const { refreshTokenApi } = useAuthApi();
        const response = await refreshTokenApi(this.refreshToken);

        const data = response.data;

        // Cập nhật token mới
        this.token = data.token;
        this.refreshToken = data.refreshToken ?? null;

        // Cập nhật localStorage
        if (import.meta.client && this.user) {
          this._saveToLocalStorage(data.token, this.user, data.refreshToken);
        }

        // Xóa cache vì đã update token (CUD operation)
        this._clearCache();

        return { success: true, data };
      } catch (error: unknown) {
        const apiError = error as { data?: ApiErrorData };
        this.error = apiError.data?.message || "Refresh token thất bại";

        // Xóa cache khi lỗi
        this._clearCache();

        // Nếu refresh token thất bại, logout
        await this.logout();

        return { success: false, error: this.error };
      }
    },

    /**
     * Action: Khởi tạo auth từ localStorage
     * - Đọc token và user từ localStorage
     * - Cập nhật state
     */
    initializeAuth(): void {
      if (import.meta.client) {
        const token = localStorage.getItem("auth_token");
        const userStr = localStorage.getItem("auth_user");
        const refreshToken = localStorage.getItem("auth_refresh_token");

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            this.token = token;
            this.user = user;
            this.refreshToken = refreshToken;
            this.isAuthenticated = true;

            // Set cache từ localStorage
            this._setCacheUser(user);
          } catch {
            // Nếu parse lỗi, clear localStorage
            this._clearLocalStorage();
          }
        }
      }
    },

    /**
     * Utility: Clear error
     */
    clearError(): void {
      this.error = null;
    },

    /**
     * Utility: Clear cache thủ công (nếu cần)
     */
    clearCache(): void {
      this._clearCache();
    },
  },
});
