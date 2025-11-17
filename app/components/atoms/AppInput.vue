<template>
  <UInput
    v-model="internalValue"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    :size="size"
    :color="color"
    :variant="variant"
    :icon="icon"
    :trailing-icon="trailingIcon"
    class="w-full"
    @blur="$emit('blur')"
    @focus="$emit('focus')" />
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: undefined,
  },
  disabled: Boolean,
  size: {
    type: String,
    default: "lg",
  },
  color: {
    type: String,
    default: "primary",
  },
  variant: {
    type: String,
    default: "outline",
  },
  icon: {
    type: String,
    default: undefined,
  },
  trailingIcon: {
    type: String,
    default: undefined,
  },
});

const emit = defineEmits(["update:modelValue", "blur", "focus"]);

const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>
