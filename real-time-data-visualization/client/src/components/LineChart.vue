<template>
  <div>
    <p>Current Percentage Limit: {{ percentageLimit }}%</p>
    <input
      v-model.number="newPercentageLimit"
      type="number"
      min="0"
      max="100"
    >
    <button
      :disabled="!isConnected"
      @click="updatePercentageLimit"
    >
      Save
    </button>

    <Line
      v-if="isChartDataValid"
      ref="lineChartRef"
      :data="chartData"
      :options="chartOptions"
    />
    <p v-else>
      Loading chart data...
    </p>

    <p>
      Last Updated: {{ lastUpdated }}
    </p>
    <p>
      WebSocket Connection: {{ isConnected ? 'Connected' : 'Disconnected' }}
    </p>
  </div>
</template>

<script>
import {
  defineComponent, ref, onMounted, onUnmounted, computed,
} from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js';
import webSocketService from '@/services/WebSocketService';
import apiClient from '@/services/apiService';

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
);

export default defineComponent({
  name: 'LineChartComponent',
  components: {
    Line,
  },
  setup() {
    // Reactive variables
    const dataPoints = ref([]);
    const percentageLimit = ref(30);
    const newPercentageLimit = ref(30);
    const lastUpdated = ref('');
    const isConnected = ref(false);

    // Define chartOptions as a ref
    const chartOptions = ref({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        title: {
          display: true,
          text: 'Real-Time Random Data',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    });

    // Generate chartData based on dataPoints
    const chartData = computed(() => ({
      labels: dataPoints.value.map((dp) => {
        const date = new Date(dp.timestamp);
        return date.toLocaleTimeString();
      }),
      datasets: [
        {
          label: 'Random Number',
          data: dataPoints.value.map((dp) => dp.value),
          borderColor: '#42b983',
          fill: false,
        },
      ],
    }));

    // Validate chartData structure
    const isChartDataValid = computed(() => (
      Array.isArray(chartData.value.labels)
      && Array.isArray(chartData.value.datasets)
      && chartData.value.datasets.length > 0
      && Array.isArray(chartData.value.datasets[0].data)
    ));

    // Add a new data point
    const addDataPoint = (dataPoint) => {
      if (dataPoint && typeof dataPoint.value === 'number' && dataPoint.timestamp) {
        dataPoints.value.push(dataPoint);
        if (dataPoints.value.length > 15) { // Maintain 15 data points
          dataPoints.value.shift();
        }
      }
    };

    // Fetch historical data
    const fetchHistoricalData = async () => {
      try {
        const response = await apiClient.get('/data-points');
        if (Array.isArray(response.data)) {
          dataPoints.value = response.data;
        } else {
          // Unexpected response format
          dataPoints.value = [];
        }
      } catch (err) {
        // Error fetching historical data
        dataPoints.value = [];
      }
    };

    // Handle incoming WebSocket messages
    const handleMessage = (message) => {
      if (!message || typeof message !== 'object') {
        // Received invalid message from WebSocket
        return;
      }

      if (message.type === 'dataPoint') {
        addDataPoint(message.data);
        lastUpdated.value = new Date().toLocaleString();
      } else if (message.type === 'percentageLimitUpdate') {
        if (typeof message.data === 'number' && message.data >= 0 && message.data <= 100) {
          percentageLimit.value = message.data;
          newPercentageLimit.value = message.data;
        }
      }
    };

    // Update the percentage limit
    const updatePercentageLimit = () => {
      if (newPercentageLimit.value >= 0 && newPercentageLimit.value <= 100) {
        // Send the update via WebSocket
        if (isConnected.value) {
          webSocketService.socket.send(JSON.stringify({ type: 'updatePercentageLimit', value: newPercentageLimit.value }));
        }
      }
    };

    // Update connection status
    const updateConnectionStatus = (status) => {
      isConnected.value = status;
    };

    // Lifecycle hooks
    onMounted(async () => {
      // Register listeners
      webSocketService.onMessage(handleMessage);
      webSocketService.onConnectionStatusChange(updateConnectionStatus);

      // Fetch historical data first
      await fetchHistoricalData();

      // Then connect to WebSocket
      webSocketService.connect();
    });

    onUnmounted(() => {
      // Remove listeners to prevent memory leaks
      webSocketService.removeMessageListener(handleMessage);
      webSocketService.removeStatusListener(updateConnectionStatus);
    });

    return {
      chartData,
      chartOptions,
      percentageLimit,
      newPercentageLimit,
      lastUpdated,
      isConnected,
      updatePercentageLimit,
      isChartDataValid,
    };
  },
});
</script>

<style scoped>
div {
  width: 100%;
  height: 400px;
  position: relative;
}

input[type="number"] {
  width: 60px;
  margin-right: 10px;
  padding: 5px;
}

button {
  padding: 5px 10px;
}

.chart-container {
  width: 100%;
  height: 400px;
  position: relative;
  margin-bottom: 20px;
}

.status p {
  margin: 5px 0;
}
</style>
