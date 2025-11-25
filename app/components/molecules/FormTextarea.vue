<template>
  <UForm :label="label" :error="error" :required="required">
    <AppTextarea
      v-model="internalValue"
      class="w-full"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled" />
  </UForm>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string;
  modelValue?: string;
  error?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value as string),
});
</script>
