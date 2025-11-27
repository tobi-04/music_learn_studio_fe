<template>
  <UForm :label="label" :error="error" :required="required">
    <USelect
      v-model="internalValue"
      class="w-full"
      :items="options"
      :placeholder="placeholder"
      :disabled="disabled" />
  </UForm>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string;
  modelValue?: string | number;
  options: Array<{ label: string; value: string | number }>;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string | number];
}>();

const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value as string | number),
});
</script>
