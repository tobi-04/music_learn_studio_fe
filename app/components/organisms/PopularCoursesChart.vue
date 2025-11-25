<template>
  <div class="chart-container">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import type { PopularCourseData } from "~/types";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps<{
  data: PopularCourseData[];
}>();

const chartData = computed(() => ({
  labels: props.data.map((d) => d.courseName),
  datasets: [
    {
      label: "Students Enrolled",
      data: props.data.map((d) => d.studentCount),
      backgroundColor: [
        "rgba(99, 102, 241, 0.8)",
        "rgba(34, 197, 94, 0.8)",
        "rgba(251, 146, 60, 0.8)",
        "rgba(236, 72, 153, 0.8)",
        "rgba(168, 85, 247, 0.8)",
        "rgba(14, 165, 233, 0.8)",
        "rgba(234, 179, 8, 0.8)",
        "rgba(239, 68, 68, 0.8)",
        "rgba(20, 184, 166, 0.8)",
        "rgba(156, 163, 175, 0.8)",
      ],
      borderRadius: 8,
    },
  ],
}));

const chartOptions: ChartOptions<"bar"> = {
  indexAxis: "y",
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          return `Students: ${context.parsed.x}`;
        },
      },
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        precision: 0,
      },
    },
  },
};
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 500px;
  width: 100%;
}
</style>
