import type {
  PaymentResponse,
  CreatePaymentRequest,
  PaymentStatusResponse,
} from "~/types/payment";
import type { BaseResponse } from "~/types/common";

export const usePayment = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBase || "http://localhost:6888";
  const authStore = useAuthStore();

  const createPayment = async (courseId: string): Promise<PaymentResponse> => {
    const user = authStore.user;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const response = await $fetch<BaseResponse<PaymentResponse>>(
      `${apiBaseUrl}/api/v1/student/payments/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": user.id,
        },
        body: {
          courseId,
        } as CreatePaymentRequest,
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to create payment");
    }

    return response.data;
  };

  const checkPaymentStatus = async (
    paymentId: string
  ): Promise<PaymentStatusResponse> => {
    const user = authStore.user;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const response = await $fetch<BaseResponse<PaymentStatusResponse>>(
      `${apiBaseUrl}/api/v1/student/payments/${paymentId}/status`,
      {
        method: "GET",
        headers: {
          "X-User-Id": user.id,
        },
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to check payment status");
    }

    return response.data;
  };

  const pollPaymentStatus = (
    paymentId: string,
    onStatusChange: (status: string) => void,
    intervalMs: number = 5000
  ): { stop: () => void } => {
    let intervalId: NodeJS.Timeout | null = null;
    let stopped = false;

    const poll = async () => {
      if (stopped) return;

      try {
        const statusData = await checkPaymentStatus(paymentId);
        onStatusChange(statusData.status);

        // Stop polling if payment is completed or failed
        if (
          statusData.status === "completed" ||
          statusData.status === "failed"
        ) {
          stop();
        }
      } catch (error) {
        console.error("Error polling payment status:", error);
      }
    };

    // Start polling
    intervalId = setInterval(poll, intervalMs);

    // Initial check
    poll();

    const stop = () => {
      stopped = true;
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    return { stop };
  };

  return {
    createPayment,
    checkPaymentStatus,
    pollPaymentStatus,
  };
};
