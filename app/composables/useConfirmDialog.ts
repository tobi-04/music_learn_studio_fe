import ConfirmDialog from "~/components/core/ConfirmDialog.vue";
import type { ConfirmDialogProps } from "~/components/core/ConfirmDialog.vue";

export type { ConfirmDialogProps };

export default function useConfirmDialog() {
  const overlay = useOverlay();
  const modal = overlay.create(ConfirmDialog);

  function close() {
    return modal.close();
  }

  function open(config: ConfirmDialogProps) {
    return modal.open(config);
  }

  function patch(config: ConfirmDialogProps) {
    return modal.patch(config);
  }

  return {
    close,
    open,
    patch,
  };
}
