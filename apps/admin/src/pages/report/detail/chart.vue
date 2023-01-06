<template>
  <div :id="chartName"></div>
</template>

<script>
import { onMounted } from 'vue';
import * as echarts from 'echarts';
import { bindResize } from '/@/components/coreBoard/charts/mixins/resize';

//echarts图表绘图组件
export default {
  name: 'Chart',
  props: {
    chartName: {
      type: String,
    },
    option: {
      type: Object,
    },
  },
  setup(props) {
    onMounted(() => {
      drawChart();
    });

    //绘图
    function drawChart() {
      let chartDom = document.getElementById(props.chartName);
      let myChart = echarts.getInstanceByDom(chartDom);
      if (myChart == undefined) {
        myChart = echarts.init(chartDom);
      }
      props.option && myChart.setOption(props.option);
      myChart?.resize();
      bindResize(myChart);
    }

    return {};
  },
};
</script>
