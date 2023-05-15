<template>
  <div class="report-title">二、基础项目指标</div>
  <div class="flex flex-wrap w-full">
    <div class="w-full xl:w-1/2 p-4">
      <div class="chart-title">PV数据</div>
      <BaseChart
        :requestParams="requestParams"
        :requestFunc="params => getTwoWeeksSummaryReport({ ...params, board_type: 'pv' })"
        :getOptionFunc="data => getTwoWeeksOption(data, 'pv')"
        height="360px"
      />
    </div>
    <div class="w-full xl:w-1/2 p-4">
      <div class="chart-title">UV数据</div>
      <BaseChart
        :requestParams="requestParams"
        :requestFunc="params => getTwoWeeksSummaryReport({ ...params, board_type: 'uv' })"
        :getOptionFunc="data => getTwoWeeksOption(data, 'uv')"
        height="360px"
      />
    </div>
    <div class="w-full xl:w-1/2 p-4">
      <div class="chart-title">用户浏览器类型</div>
      <BaseChart
        :requestParams="requestParams"
        :requestFunc="getBrowserReport"
        :getOptionFunc="getTypeOption"
        height="360px"
      />
    </div>
    <div class="w-full xl:w-1/2 p-4">
      <div class="chart-title">用户操作系统类型</div>
      <BaseChart
        :requestParams="requestParams"
        :requestFunc="getOsReport"
        :getOptionFunc="getTypeOption"
        height="360px"
      />
    </div>
    <div class="w-full p-4">
      <div class="chart-title">用户地域分布</div>
      <BaseChart
        :requestParams="requestParams"
        :requestFunc="getRegionReport"
        :getOptionFunc="getUAMapOption"
        height="500px"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getTwoWeeksOption } from '../utils/configs'
import {
  getTwoWeeksSummaryReport,
  getRegionReport,
  getBrowserReport,
  getOsReport,
} from '@/apis/report/index'
import { getTypeOption } from '@/pages/board/component/util/pieChartConfig'
import { useReportStore } from '@/store/modules/report'
import { BaseChart } from '@vben/components'
import { getUAMapOption } from '@/pages/board/component/pv/component/uaMap/uaMapConfig'
import uaInfo from './uaInfo/index.vue'

const reportStore = useReportStore()

const requestParams = computed(() => ({
  project_id: `${reportStore.boardInfoState.id}`,
  start_time: reportStore.filterState.start_time,
  end_time: reportStore.filterState.end_time,
}))
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
