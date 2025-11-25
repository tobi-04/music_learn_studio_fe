/**
 * Common types for API responses
 */

export interface BaseResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  // Legacy support if needed, or remove if not used
  page?: number;
  size?: number;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: string;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: "asc" | "desc";
}
