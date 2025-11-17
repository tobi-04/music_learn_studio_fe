/**
 * API Layer - Chỉ gọi API thuần túy, không xử lý logic business
 */
export const useAuthApi = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  /**
   * API: Đăng nhập
   */
  const loginApi = async (usernameOrEmail: string, password: string) => {
    const response = await $fetch(`${apiBaseUrl}/auth/login`, {
      method: "POST",
      body: {
        usernameOrEmail,
        password,
      },
    });
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
  ) => {
    const response = await $fetch(`${apiBaseUrl}/auth/register`, {
      method: "POST",
      body: {
        name,
        username,
        email,
        password,
        avatar,
      },
    });
    return response;
  };

  /**
   * API: Lấy thông tin user hiện tại
   */
  const getCurrentUserApi = async (token: string) => {
    const response = await $fetch(`${apiBaseUrl}/auth/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  };

  /**
   * API: Đăng xuất (nếu cần gọi server)
   */
  const logoutApi = async (token: string) => {
    const response = await $fetch(`${apiBaseUrl}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  };

  /**
   * API: Refresh token
   */
  const refreshTokenApi = async (refreshToken: string) => {
    const response = await $fetch(`${apiBaseUrl}/auth/refresh`, {
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
  const forgotPasswordApi = async (email: string) => {
    const response = await $fetch(`${apiBaseUrl}/auth/forgot-password`, {
      method: "POST",
      body: {
        email,
      },
    });
    return response;
  };

  /**
   * API: Đặt lại mật khẩu
   */
  const resetPasswordApi = async (token: string, newPassword: string) => {
    const response = await $fetch(`${apiBaseUrl}/auth/reset-password`, {
      method: "POST",
      body: {
        token,
        newPassword,
      },
    });
    return response;
  };

  return {
    loginApi,
    registerApi,
    getCurrentUserApi,
    logoutApi,
    refreshTokenApi,
    forgotPasswordApi,
    resetPasswordApi,
  };
};
