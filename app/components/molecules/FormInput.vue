<template>
  <UForm :label="label" :error="error" :required="required">
    <UInput
      v-model="internalValue"
      class="w-full"
      :placeholder="placeholder"
      :type="type"
      :disabled="disabled" />
  </UForm>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string;
  modelValue?: string | number;
  error?: string;
  placeholder?: string;
  type?: string;
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
