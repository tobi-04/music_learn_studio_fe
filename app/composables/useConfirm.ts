import ConfirmModal from "~/components/molecules/ConfirmModal.vue";
import { useModalStore } from "~/stores/modal";

export const useConfirm = () => {
  const modalStore = useModalStore();

  const confirm = (message: string, title = "Confirm"): Promise<boolean> => {
    return new Promise((resolve) => {
      modalStore.open(ConfirmModal, {
        title,
        message,
        onSuccess: () => resolve(true),
        onCancel: () => resolve(false),
        onClose: () => resolve(false),
      });
    });
  };

  const confirmDelete = (itemName: string): Promise<boolean> => {
    return confirm(
      `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
      "Delete Confirmation"
    );
  };

  return { confirm, confirmDelete };
};
