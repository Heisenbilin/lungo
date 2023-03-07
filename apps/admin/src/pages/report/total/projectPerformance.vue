<template>
  <h1 :style="{ 'color': !isDark ? '' : 'rgb(212, 212, 213)' }">三、项目性能指标</h1>
  <div class="w-full p-4">
    <div class="chart-title">本周页面加载均值瀑布图</div>
    <BaseChart :requestParams="requestParams" :requestFunc="PerformanceApis.getAverageData"
      :getOptionFunc="useDataToWaterfallChartOption" height="360px" />
  </div>
  <div class="w-full p-4">
    <div class="chart-title">上周页面加载均值瀑布图</div>
    <BaseChart :requestParams="lastWeekRequestParams" :requestFunc="PerformanceApis.getAverageData"
      :getOptionFunc="useDataToWaterfallChartOption" height="360px" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDataToWaterfallChartOption } from '@vben/hooks';
import * as PerformanceApis from '@/apis/board/performance';
import BaseChart from '@vben/components/src/chart/baseChart.vue';
// import moment from 'moment'
import dayjs from 'dayjs'
import { useReportStore } from '@/store/modules/report';
import { useAppTheme } from '@vben/hooks'
const { isDark } = useAppTheme()
const reportStore = useReportStore()
const requestParams = computed(() => ({
  project_id: `${reportStore.boardInfoState.id}`,
  start_time: reportStore.filterState.start_time,
  end_time: reportStore.filterState.end_time,
}));

const lastWeekRequestParams = computed(() => ({
  project_id: `${reportStore.boardInfoState.id}`,
  start_time: dayjs(reportStore.filterState.start_time).subtract(1, 'w').format('YYYY-MM-DD'),
  end_time: reportStore.filterState.start_time,
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
