export interface Payment {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  qrCodeUrl: string;
  transactionId: string;
  paymentDate?: string;
  description?: string;
}

export interface PaymentResponse {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  currency: string;
  status: string;
  qrCodeUrl: string;
  transactionId: string;
  paymentDate?: string;
  description?: string;
}

export interface CreatePaymentRequest {
  courseId: string;
}

export interface PaymentStatusResponse {
  paymentId: string;
  status: string;
  amount: number;
  courseId: string;
}
