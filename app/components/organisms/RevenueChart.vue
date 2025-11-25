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
  Filler,
  type ChartOptions,
} from "chart.js";
import type { RevenueDataPoint } from "~/types";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const props = defineProps<{
  data: RevenueDataPoint[];
}>();

const chartData = computed(() => ({
  labels: props.data.map((d) => d.month),
  datasets: [
    {
      label: "Revenue (VND)",
      data: props.data.map((d) => d.amount),
      borderColor: "rgb(99, 102, 241)",
      backgroundColor: "rgba(99, 102, 241, 0.1)",
      fill: true,
      tension: 0.4,
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
          return `Revenue: ${new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(context.parsed.y)}`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => {
          return new Intl.NumberFormat("vi-VN", {
            notation: "compact",
            compactDisplay: "short",
          }).format(value as number);
        },
      },
    },
  },
};
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
}
</style>
