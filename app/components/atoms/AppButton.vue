<template>
  <UButton
    :type="type"
    :color="color"
    :variant="variant"
    :size="size"
    :loading="loading"
    :disabled="disabled || loading"
    :block="block"
    :icon="icon"
    @click="$emit('click', $event)">
    <slot />
  </UButton>
</template>

<script setup lang="ts">
defineProps({
  type: {
    type: String,
    default: "button",
  },
  color: {
    type: String,
    default: "primary",
  },
  variant: {
    type: String,
    default: "solid",
  },
  size: {
    type: String,
    default: "lg",
  },
  loading: Boolean,
  disabled: Boolean,
  block: Boolean,
  icon: String,
});

defineEmits(["click"]);
</script>
