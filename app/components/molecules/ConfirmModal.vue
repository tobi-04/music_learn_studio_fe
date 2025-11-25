<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3
          class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
          {{ title }}
        </h3>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class="-my-1"
          @click="handleCancel" />
      </div>
    </template>

    <p class="text-sm text-gray-500 dark:text-gray-400">
      {{ message }}
    </p>

    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton color="neutral" variant="ghost" @click="handleCancel">
          Cancel
        </UButton>
        <UButton :color="confirmColor" @click="handleConfirm">
          {{ confirmText }}
        </UButton>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  message: string;
  confirmText?: string;
  confirmColor?:
    | "primary"
    | "error"
    | "secondary"
    | "success"
    | "info"
    | "warning"
    | "neutral";
  onSuccess?: () => void;
  onCancel?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Confirm",
  confirmText: "Confirm",
  confirmColor: "primary",
});

const emit = defineEmits<{
  close: [];
}>();

const handleConfirm = () => {
  if (props.onSuccess) props.onSuccess();
  emit("close");
};

const handleCancel = () => {
  if (props.onCancel) props.onCancel();
  emit("close");
};
</script>
