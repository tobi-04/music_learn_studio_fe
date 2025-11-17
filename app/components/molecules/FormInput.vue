<template>
  <div class="form-input">
    <AppLabel v-if="label" :id="id" :text="label" :required="required" />

    <AppInput
      :id="id"
      v-model="internalValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :icon="icon"
      :trailing-icon="trailingIcon"
      :color="hasError ? 'red' : 'primary'"
      @blur="handleBlur" />

    <p v-if="hasError" class="mt-1 text-sm text-red-500">
      {{ error }}
    </p>

    <p v-else-if="hint" class="mt-1 text-sm text-gray-500">
      {{ hint }}
    </p>
  </div>
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
  type: {
    type: String,
    default: "text",
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
  icon: {
    type: String,
    default: undefined,
  },
  trailingIcon: {
    type: String,
    default: undefined,
  },
});

const emit = defineEmits(["update:modelValue", "blur"]);

// Generate a stable ID using useId() to avoid hydration mismatch
const id = useId();

const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const hasError = computed(() => !!props.error);

const handleBlur = () => {
  emit("blur");
};
</script>
