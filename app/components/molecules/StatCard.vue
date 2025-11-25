<template>
  <AppCard>
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ label }}</p>
        <p class="text-3xl font-bold" :class="valueColor">
          {{ formattedValue }}
        </p>
        <p v-if="subtitle" class="text-xs text-gray-500">{{ subtitle }}</p>
      </div>
      <UIcon v-if="icon" :name="icon" class="w-10 h-10" :class="iconColor" />
    </div>
  </AppCard>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string;
  value: number | string;
  icon?: string;
  color?: "primary" | "green" | "red" | "yellow" | "blue" | "gray";
  subtitle?: string;
  format?: "number" | "percentage" | "time" | "none";
}>();

const formattedValue = computed(() => {
  const value = props.value;

  switch (props.format) {
    case "percentage":
      return typeof value === "number" ? `${value}%` : value;
    case "time":
      return typeof value === "number" ? formatTime(value) : value;
    case "number":
      return typeof value === "number" ? value.toLocaleString() : value;
    default:
      return value;
  }
});

const valueColor = computed(() => {
  switch (props.color) {
    case "primary":
      return "text-primary-600 dark:text-primary-400";
    case "green":
      return "text-green-600 dark:text-green-400";
    case "red":
      return "text-red-600 dark:text-red-400";
    case "yellow":
      return "text-yellow-600 dark:text-yellow-400";
    case "blue":
      return "text-blue-600 dark:text-blue-400";
    default:
      return "text-gray-900 dark:text-gray-100";
  }
});

const iconColor = computed(() => {
  switch (props.color) {
    case "primary":
      return "text-primary-500";
    case "green":
      return "text-green-500";
    case "red":
      return "text-red-500";
    case "yellow":
      return "text-yellow-500";
    case "blue":
      return "text-blue-500";
    default:
      return "text-gray-500";
  }
});

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};
</script>
