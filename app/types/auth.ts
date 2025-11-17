export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  isLocked: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
