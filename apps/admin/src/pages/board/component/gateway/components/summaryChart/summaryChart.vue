<template>
  <div class="chart-container-full">
    <a-tabs v-model:activeKey="activeKey" class="box-border w-full">
      <a-tab-pane key="1" tab="请求成功率">
        <BaseChart
          :requestParams="requestParams1"
          :requestFunc="getChartSummary"
          :getOptionFunc="getAmountChartOption"
        />
      </a-tab-pane>
      <a-tab-pane key="2" tab="请求耗时">
        <BaseChart
          :requestParams="requestParams2"
          :requestFunc="getChartSummary"
          :getOptionFunc="getTimeConsumingChartOption"
        />
      </a-tab-pane>
      <a-tab-pane key="3" tab="upstream请求成功率">
        <BaseChart
          :requestParams="requestParams3"
          :requestFunc="getChartSummary"
          :getOptionFunc="getAmountChartOption"
        />
      </a-tab-pane>
      <a-tab-pane key="4" tab="upstream请求耗时">
        <BaseChart
          :requestParams="requestParams4"
          :requestFunc="getChartSummary"
          :getOptionFunc="getTimeConsumingChartOption"
        />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
//api异常数据汇总图表Tab框
import { ref, computed } from 'vue'
import { getChartSummary } from '@/apis/board/gateway'
import { useBoardStore } from '@/store/modules/board'
import { getApiAmountChartOption, getTimeConsumingChartOption } from './summaryChartConfig'
import { BaseChart } from '@vben/components'


const boardStore = useBoardStore()

const activeKey = ref('1')

const params = computed(() => ({
  project_id: boardStore.boardInfoState.id,
  start_time: boardStore.filterState.start_time,
  end_time: boardStore.filterState.end_time,
  summary_dimension: boardStore.filterState.dimension,
}))

const requestParams1 = computed(() => ({ ...params.value, summary_type: 'statusAmount' }))

const requestParams2 = computed(() => ({ ...params.value, summary_type: 'statusTimeConsuming' }))

const requestParams3 = computed(() => ({ ...params.value, summary_type: 'upstreamStatusAmount' }))

const requestParams4 = computed(() => ({
  ...params.value,
  summary_type: 'upstreamStatusTimeConsuming',
}))

const getAmountChartOption = data => getApiAmountChartOption(data, boardStore.getTimeFormatStr)
</script>
