<template>
  <UModal v-model="store.isOpen">
    <component
      :is="store.component"
      v-bind="store.props"
      @close="store.close" />
  </UModal>
</template>

<script setup lang="ts">
import { useModalStore } from "~/stores/modal";

const store = useModalStore();

watch(
  () => store.isOpen,
  (newValue) => {
    if (!newValue) {
      // Modal closed (e.g. by clicking outside)
      if (store.props.onClose) {
        store.props.onClose();
      }
      // Ensure cleanup happens
      setTimeout(() => {
        store.close();
      }, 200);
    }
  }
);
</script>
