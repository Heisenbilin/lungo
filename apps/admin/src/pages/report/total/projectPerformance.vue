<template>
  <h1>三、项目性能指标</h1>
  <div class="w-full p-4">
    <div class="chart-title">本周页面加载均值瀑布图</div>
    <BaseChart
      :requestParams="requestParams"
      :requestFunc="PerformanceApis.getAverageData"
      :getOptionFunc="handleDataToWaterfallChartOption"
      height="360px"
    />
  </div>
  <div class="w-full p-4">
    <div class="chart-title">上周页面加载均值瀑布图</div>
    <BaseChart
      :requestParams="lastWeekRequestParams"
      :requestFunc="PerformanceApis.getAverageData"
      :getOptionFunc="handleDataToWaterfallChartOption"
      height="360px"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
// @ts-ignore
import { handleDataToWaterfallChartOption } from '@/pages/component/performanceBoard/component/waterfallChart/chartConfig';

import * as PerformanceApis  from '@/apis/board/performance';
import BaseChart from '@vben/components/src/chart/baseChart.vue';
import moment from 'moment'
import { useReportStore } from '@/store/modules/report';
const reportStore = useReportStore()
const requestParams = computed(() => ({
  project_id: `${reportStore.getBoardInfoState.id}`,
  start_time: reportStore.getFilterState.start_time,
  end_time: reportStore.getFilterState.end_time,
}));

const lastWeekRequestParams = computed(() => ({
  project_id: `${reportStore.getBoardInfoState.id}`,
  start_time: moment(reportStore.getFilterState.start_time).subtract(1, 'w').format('YYYY-MM-DD'),
  end_time: reportStore.getFilterState.start_time,
}));
</script>

<style lang="scss" scoped>
h1 {
  font-size: 24px;
}

h2 {
  font-size: 18px;
  margin-left: 10px;
  padding-left: 9px;
  border-left: 4px #3161ca solid;
  display: inline;
}
</style>
