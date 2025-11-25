<template>
  <div class="chart-container">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import type { StudentGrowthData } from "~/types";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps<{
  data: StudentGrowthData[];
}>();

const chartData = computed(() => ({
  labels: props.data.map((d) => d.month),
  datasets: [
    {
      label: "Total Students",
      data: props.data.map((d) => d.count),
      borderColor: "rgb(34, 197, 94)",
      backgroundColor: "rgba(34, 197, 94, 0.1)",
      tension: 0.4,
      pointBackgroundColor: "rgb(34, 197, 94)",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 4,
    },
  ],
}));

const chartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "top",
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          return `Students: ${context.parsed.y}`;
        },
      },
    },
  },
  scales: {
    y: {
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
  height: 350px;
  width: 100%;
}
</style>
