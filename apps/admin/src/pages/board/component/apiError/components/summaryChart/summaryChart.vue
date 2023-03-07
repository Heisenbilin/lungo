<template>
  <div class="chart-container-full" :style="{ 'background-color': isDark ? 'rgb(20,20,20)' : '' }">
    <a-tabs v-model:activeKey="activeKey" class="box-border w-full">
      <template #rightExtra>
        <a-tag color="blue" class="!mt-2 filter-tag"> 单击筛选：时间范围</a-tag>
      </template>
      <a-tab-pane key="1" tab="异常量与异常率">
        <BaseChart :requestParams="requestParams1" :requestFunc="getChartSummaryData"
          :getOptionFunc="getAmountChartOption" :zrFuncs="{ click: addTimeFilter }" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="成功耗时">
        <BaseChart :requestParams="requestParams2" :requestFunc="getChartSummaryData"
          :getOptionFunc="getTimeConsumingChartOption" :zrFuncs="{ click: addTimeFilter }" />
      </a-tab-pane>
      <a-tab-pane key="3" tab="失败耗时">
        <BaseChart :requestParams="requestParams3" :requestFunc="getChartSummaryData"
          :getOptionFunc="getTimeConsumingChartOption" :zrFuncs="{ click: addTimeFilter }" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
//api异常数据汇总图表Tab框
import { ref, computed } from 'vue'
import { getChartSummaryData } from '@/apis/board/apiError'
import { useBoardStore } from '@/store/modules/board'
import { addTimeFilter } from '@/hooks/board/useDate'
import { getApiAmountChartOption, getTimeConsumingChartOption } from './summaryChartConfig'
import { BaseChart } from '@vben/components'
import { useAppTheme } from '@vben/hooks';
const { isDark } = useAppTheme()

const boardStore = useBoardStore()

//请求参数
const params = computed(() => ({
  project_id: `${boardStore.boardInfoState.id}`, //项目id
  start_time: boardStore.filterState.start_time, //开始时间
  end_time: boardStore.filterState.end_time, //结束时间
  dimension: boardStore.filterState.dimension, //维度
  url: boardStore.filterState.url, //路由筛选
  browser: boardStore.filterState.browser, //浏览器筛选
  device: boardStore.filterState.device, //设备筛选
  province: boardStore.filterState.province, //地区筛选
  network: boardStore.filterState.network, //网络类型筛选
  client: boardStore.filterState.client, //客户端筛选
  os: boardStore.filterState.os, //操作系统筛选
  api_status: boardStore.filterState.api_status, //api状态码筛选
  api_range: boardStore.filterState.api_range, //api耗时筛选
}))

const activeKey = ref('1')

// 成功率请求参数
const requestParams1 = computed(() => ({ ...params.value, summary_type: 'apiAmount' }))

// 成功请求耗时参数
const requestParams2 = computed(() => ({ ...params.value, summary_type: 'successTimeConsuming' }))

// 异常请求耗时参数
const requestParams3 = computed(() => ({ ...params.value, summary_type: 'errorTimeConsuming' }))

const getAmountChartOption = data => getApiAmountChartOption(data, boardStore.getTimeFormatStr)
</script>
