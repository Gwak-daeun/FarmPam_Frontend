<template>
  <div class="chart">
    <!-- <div v-for="(item, index) in items" :key="index"> -->
      <Line :data="chartData" :options="options" />
    <!-- </div> -->
  </div>
</template>
  
  <script>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "vue-chartjs";
import * as chartConfig from "./chartConfig.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default {
  name: "App",
  components: {
    Line,
  },
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {

    return {
      chartConfig,
      // data: chartConfig.data, // 데이터 설정
      options: chartConfig.options, // 옵션 설정
      items: ["사과", "배", "참외", "딸기"],
      // chartData: {
      //   labels: [],
      //   datasets: [
      //     {
      //       borderWidth: 1,
      //       label: "품목명", //변수
      //       backgroundColor: "rgb(255,255,255, 0)",
      //       pointBackgroundColor: "#64CCA2",
      //       fill: true, // 채우기
      //       tension: 0.1,
      //       borderColor: "#64CCA2",
      //       pointBorderColor: "#64CCA2",
      //       pointBorderWidth: 1,
      //       data: [45, 50, 60, 50, 45, 80, 50, 40, 68, 70], //변수
      //     },
      //   ],
      // },
    };

   
  },
};
</script>
  
  <style scoped>
.chart {
}
</style>