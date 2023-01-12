<!--  -->
<template>
  <div :id="chartName"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import * as echarts from 'echarts';
import { bindResize } from './resize';

//echarts图表绘图组件

const props = defineProps({
  chartName: {
    type: String,
  },
  option: Object,
})
onMounted(() => {
  drawChart();
});

//绘图
function drawChart() {
  let chartDom = document.getElementById(props.chartName as string);
  let myChart = echarts.getInstanceByDom(chartDom!);
  if (myChart == undefined) {
    myChart = echarts.init(chartDom!);
  }
  props.option && myChart.setOption(props.option);
  myChart?.resize();
  bindResize(myChart);
}

</script>
