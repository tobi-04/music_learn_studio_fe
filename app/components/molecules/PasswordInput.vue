<template>
  <FormInput
    v-model="internalValue"
    :label="label"
    :type="showPassword ? 'text' : 'password'"
    :placeholder="placeholder"
    :disabled="disabled"
    :required="required"
    :error="error"
    :hint="hint"
    icon="i-heroicons-lock-closed"
    @blur="$emit('blur')">
    <template #trailing>
      <UButton
        :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
        color="gray"
        variant="ghost"
        size="xs"
        @click="togglePassword" />
    </template>
  </FormInput>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: undefined,
  },
  placeholder: {
    type: String,
    default: undefined,
  },
  disabled: Boolean,
  required: Boolean,
  error: {
    type: String,
    default: undefined,
  },
  hint: {
    type: String,
    default: undefined,
  },
});

const emit = defineEmits(["update:modelValue", "blur"]);

const showPassword = ref(false);

const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
</script>
