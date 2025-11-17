<template>
  <label v-if="text" :for="id" :class="className">
    {{ text }}
    <span v-if="required" class="text-red-500">*</span>
  </label>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    default: undefined,
  },
  id: {
    type: String,
    default: undefined,
  },
  required: Boolean,
  className: {
    type: String,
    default: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
  },
});
</script>
