<!--  -->
<template>
  <div :id="chartName"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { getInstanceByDom, init } from '@vben/hooks'
import { bindResize } from './resize'

//echarts图表绘图组件

const props = defineProps({
  chartName: {
    type: String,
  },
  option: Object,
})
onMounted(() => {
  drawChart()
})

//绘图
function drawChart() {
  let chartDom = document.getElementById(props.chartName as string)
  let myChart = getInstanceByDom(chartDom!)
  if (myChart == undefined) {
    myChart = init(chartDom!)
  }
  props.option && myChart.setOption(props.option)
  myChart?.resize()
  bindResize(myChart)
}
</script>
