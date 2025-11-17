<template>
  <UAlert
    v-bind="$attrs"
    :title="title"
    :description="description"
    :color="color"
    :variant="variant"
    :icon="icon"
    @close="$emit('close')" />
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: undefined,
  },
  color: {
    type: String,
    default: "red",
  },
  variant: {
    type: String,
    default: "soft",
  },
  icon: {
    type: String,
    default: "i-heroicons-exclamation-triangle-20-solid",
  },
});

defineEmits(["close"]);
</script>
