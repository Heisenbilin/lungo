<template>
  <div class="grid grid-cols-2 gap-3">
    <div class="chart-container-full text-center" v-if="!isSafeSDK"
      :style="{ 'background-color': isDark ? 'rgb(20,20,20)' : '' }">
      <a href="https://npm.100tal.com/#/detial?name=%40xes%2Fxes_fe_log" target="_blank" class="text-red-500">
        SDK版本更新公告：
        日志上报SDK版本低于2.1.8的应用，可能会出现接口日志上报不成功的问题，请及时升级至2.1.8及以上版本【点击查看】。
      </a>
    </div>
    <SummaryNumber />
    <SummaryChart />
    <ResultTabs />
    <DetailPieCharts />
  </div>
</template>

<script setup lang="ts">
//API异常Tab页
import { computed } from 'vue'
import { useBoardStore } from '@/store/modules/board'
import { versionStringCompare } from '@vben/utils'

import SummaryNumber from './components/summaryNumber.vue'
import SummaryChart from './components/summaryChart/summaryChart.vue'
import ResultTabs from './components/resultTable/resultTabs.vue'
import DetailPieCharts from './components/detailPieCharts.vue'
import { useAppTheme } from '@vben/hooks';
const { isDark } = useAppTheme()
const boardStore = useBoardStore()

const isSafeSDK = computed<boolean>(() =>
  Boolean(
    !boardStore.latestSDKVersionState ||
    versionStringCompare(boardStore.boardInfoState.sdk_version, '2.1.8') !== -1,
  ),
)
</script>
