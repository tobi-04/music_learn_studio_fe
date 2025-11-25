import type { User, AuthResponse, ApiResponse } from "~/types/auth";

/**
 * API Layer - Chỉ gọi API thuần túy, không xử lý logic business
 */
export const useAuthApi = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  /**
   * API: Đăng nhập
   */
  const loginApi = async (
    usernameOrEmail: string,
    password: string
  ): Promise<ApiResponse<AuthResponse>> => {
    const response = await $fetch<ApiResponse<AuthResponse>>(
      `${apiBaseUrl}/auth/login`,
      {
        method: "POST",
        body: {
          usernameOrEmail,
          password,
        },
      }
    );
    return response;
  };

  /**
   * API: Đăng ký
   */
  const registerApi = async (
    name: string,
    username: string,
    email: string,
    password: string,
    avatar?: string
  ): Promise<ApiResponse<AuthResponse>> => {
    const response = await $fetch<ApiResponse<AuthResponse>>(
      `${apiBaseUrl}/auth/register`,
      {
        method: "POST",
        body: {
          name,
          username,
          email,
          password,
          avatar,
        },
      }
    );
    return response;
  };

  /**
   * API: Lấy thông tin user hiện tại
   */
  const getCurrentUserApi = async (
    token: string
  ): Promise<ApiResponse<User>> => {
    const response = await $fetch<ApiResponse<User>>(`${apiBaseUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  };

  /**
   * API: Đăng xuất (nếu cần gọi server)
   */
  const logoutApi = async (token: string): Promise<ApiResponse<null>> => {
    const response = await $fetch<ApiResponse<null>>(
      `${apiBaseUrl}/auth/logout`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  };

  /**
   * API: Refresh token
   */
  const refreshTokenApi = async (
    refreshToken: string
  ): Promise<ApiResponse<{ token: string; refreshToken?: string }>> => {
    const response = await $fetch<
      ApiResponse<{ token: string; refreshToken?: string }>
    >(`${apiBaseUrl}/auth/refresh`, {
      method: "POST",
      body: {
        refreshToken,
      },
    });
    return response;
  };

  /**
   * API: Quên mật khẩu
   */
  const forgotPasswordApi = async (
    email: string
  ): Promise<ApiResponse<null>> => {
    const response = await $fetch<ApiResponse<null>>(
      `${apiBaseUrl}/auth/forgot-password`,
      {
        method: "POST",
        body: {
          email,
        },
      }
    );
    return response;
  };

  /**
   * API: Đặt lại mật khẩu
   */
  const resetPasswordApi = async (
    token: string,
    newPassword: string
  ): Promise<ApiResponse<null>> => {
    const response = await $fetch<ApiResponse<null>>(
      `${apiBaseUrl}/auth/reset-password`,
      {
        method: "POST",
        body: {
          token,
          newPassword,
        },
      }
    );
    return response;
  };

  /**
   * Get authentication headers with user ID
   */
  const getAuthHeaders = (): Record<string, string> => {
    const authStore = useAuthStore();
    const headers: Record<string, string> = {};

    if (authStore.user?.id) {
      headers["X-User-Id"] = authStore.user.id;
    }

    return headers;
  };

  return {
    loginApi,
    registerApi,
    getCurrentUserApi,
    logoutApi,
    refreshTokenApi,
    forgotPasswordApi,
    resetPasswordApi,
    getAuthHeaders,
  };
};
