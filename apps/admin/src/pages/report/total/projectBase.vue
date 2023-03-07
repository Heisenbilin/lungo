<template>
  <h1 :style="{ 'color': !isDark ? '' : 'rgb(212, 212, 213)' }">二、基础项目指标</h1>
  <div class="flex flex-wrap w-full">
    <div class="w-full xl:w-1/2 p-4">
      <div class="chart-title">PV数据</div>
      <BaseChart
        :requestParams="requestParams"
        :requestFunc="getPVTwoWeeksData"
        :getOptionFunc="getPVTwoWeeksOption"
        height="360px"
      />
    </div>
    <div class="w-full xl:w-1/2 p-4">
      <div class="chart-title">UV数据</div>
      <BaseChart
        :requestParams="requestParams"
        :requestFunc="getUVTwoWeeksData"
        :getOptionFunc="getUVTwoWeeksOption"
        height="360px"
      />
    </div>
    <div class="w-full xl:w-1/2 p-4">
      <div class="chart-title">用户浏览器类型</div>
      <uaInfo type="browser" boardType="report" />
    </div>
    <div class="w-full xl:w-1/2 p-4">
      <div class="chart-title">用户操作系统类型</div>
      <uaInfo type="os" boardType="report" />
    </div>
    <div class="w-full p-4">
      <div class="chart-title">用户地域分布</div>
      <BaseChart
        :requestParams="requestParams"
        :requestFunc="PVApis.getRegionData"
        :getOptionFunc="getUAMapOption"
        height="500px"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getTwoWeeksSummary } from '@/apis/report/apis'
import { getTwoWeeksOption } from './utils/configs'
import * as PVApis from '@/apis/board/pv'
import { useReportStore } from '@/store/modules/report'
// import { getUAMapOption } from '';
// import { reportStore } from '/@/store/modules/board';
import uaInfo from './components/uaInfo.vue'
// import BaseChart from '@/components/coreBoard/baseChart.vue';
import BaseChart from '@vben/components/src/chart/baseChart.vue'
import { getUAMapOption } from '@/pages/board/component/pv/component/uaMap/uaMapConfig'
import { useAppTheme } from '@vben/hooks'
const { isDark } = useAppTheme()

const reportStore = useReportStore()

const requestParams = computed(() => ({
  project_id: `${reportStore.boardInfoState.id}`,
  start_time: reportStore.filterState.start_time,
  end_time: reportStore.filterState.end_time,
}))
//PV
const getPVTwoWeeksData = params => getTwoWeeksSummary({ ...params, board_type: 'pv' })
const getPVTwoWeeksOption = data => getTwoWeeksOption(data, 'pv')

//UV
const getUVTwoWeeksData = params => getTwoWeeksSummary({ ...params, board_type: 'uv' })
const getUVTwoWeeksOption = data => getTwoWeeksOption(data, 'uv')
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
