/**
 * Analytics API Composable
 * Handles all analytics-related API calls
 */

import type { AnalyticsResponse, BaseResponse } from "~/types";

export const useAnalyticsApi = () => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBase || "http://localhost:6888";

  /**
   * Get analytics data
   */
  const getAnalytics = async () => {
    return await $fetch<BaseResponse<AnalyticsResponse>>(
      `${baseUrl}/api/v1/admin/analytics`,
      {
        method: "GET",
        headers: {
          "X-User-Id": "admin-123", // TODO: Get from auth store
        },
      }
    );
  };

  return {
    getAnalytics,
  };
};
