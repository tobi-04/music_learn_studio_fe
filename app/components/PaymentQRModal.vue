<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">
              {{
                isSuccess
                  ? "Thanh toán thành công!"
                  : "Quét mã QR để thanh toán"
              }}
            </h2>
            <button v-if="!isSuccess" class="close-button" @click="closeModal">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div v-if="!isSuccess" class="payment-content">
              <div v-if="qrCodeUrl" class="qr-container">
                <img :src="qrCodeUrl" alt="QR Code" class="qr-image" />
              </div>

              <div class="payment-info">
                <div class="info-item">
                  <span class="label">Số tiền:</span>
                  <span class="value">{{ formatCurrency(amount) }} VND</span>
                </div>
                <div class="info-item">
                  <span class="label">Nội dung:</span>
                  <span class="value small">{{ description }}</span>
                </div>
              </div>

              <div class="instructions">
                <p>1. Mở ứng dụng ngân hàng của bạn</p>
                <p>2. Quét mã QR phía trên</p>
                <p>3. Xác nhận thanh toán</p>
                <p class="note">
                  Hệ thống sẽ tự động kiểm tra và cập nhật trạng thái thanh toán
                </p>
              </div>

              <div v-if="isPolling" class="polling-indicator">
                <div class="spinner"></div>
                <p>Đang chờ thanh toán...</p>
              </div>
            </div>

            <div v-else class="success-content">
              <div class="success-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3>Thanh toán thành công!</h3>
              <p>Bạn đã được ghi danh vào khóa học.</p>
              <button class="success-button" @click="handleSuccessClose">
                Bắt đầu học ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";

const props = defineProps<{
  isOpen: boolean;
  qrCodeUrl: string;
  amount: number;
  description: string;
  paymentId: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "success"): void;
}>();

const { pollPaymentStatus } = usePayment();

const isPolling = ref(false);
const isSuccess = ref(false);
let pollingController: { stop: () => void } | null = null;

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN").format(amount);
};

const closeModal = () => {
  stopPolling();
  emit("close");
};

const handleSuccessClose = () => {
  stopPolling();
  emit("success");
  emit("close");
};

const stopPolling = () => {
  if (pollingController) {
    pollingController.stop();
    pollingController = null;
  }
  isPolling.value = false;
};

const startPolling = () => {
  if (!props.paymentId) return;

  isPolling.value = true;
  pollingController = pollPaymentStatus(
    props.paymentId,
    (status: string) => {
      if (status === "completed") {
        isSuccess.value = true;
        isPolling.value = false;
      } else if (status === "failed") {
        isPolling.value = false;
        // Could show error message here
      }
    },
    5000 // Poll every 5 seconds
  );
};

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue && props.paymentId) {
      isSuccess.value = false;
      startPolling();
    } else {
      stopPolling();
    }
  }
);

onUnmounted(() => {
  stopPolling();
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #6b7280;
  transition: color 0.2s;
}

.close-button:hover {
  color: #111827;
}

.modal-body {
  padding: 24px;
}

.payment-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.qr-container {
  display: flex;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
}

.qr-image {
  width: 100%;
  max-width: 280px;
  height: auto;
  border-radius: 8px;
  background: white;
  padding: 16px;
}

.payment-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.value {
  font-size: 16px;
  color: #111827;
  font-weight: 600;
}

.value.small {
  font-size: 13px;
  font-weight: 400;
  max-width: 60%;
  text-align: right;
  word-break: break-word;
}

.instructions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.instructions p {
  margin: 0;
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
}

.instructions .note {
  margin-top: 8px;
  font-size: 13px;
  color: #6b7280;
  font-style: italic;
}

.polling-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background: #eff6ff;
  border-radius: 8px;
  color: #1e40af;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid #bfdbfe;
  border-top-color: #1e40af;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px 20px;
  text-align: center;
}

.success-icon {
  color: #10b981;
  animation: scaleIn 0.3s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.success-content h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #111827;
}

.success-content p {
  margin: 0;
  font-size: 16px;
  color: #6b7280;
}

.success-button {
  margin-top: 12px;
  padding: 12px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.success-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}
</style>
